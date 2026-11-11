import { randomInt, randomUUID } from "node:crypto";
import type { BlindpayApiResponse, ErrorResponse, ErrorType, RequestOptions } from "../../types";
import { toErrorResponse } from "./error-response";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type TransportConfig = {
    /** Origin without the `/v1` prefix, e.g. `https://api.blindpay.com`. */
    baseUrl: string;
    apiKey: string;
    userAgent: string;
    timeoutMs: number;
    maxRetries: number;
    fetch: typeof fetch;
};

export type RequestSpec = {
    method: HttpMethod;
    /** Path after `/v1`, query string included. */
    path: string;
    json?: Record<string, unknown>;
    form?: FormData;
    options?: RequestOptions;
};

const MAX_IDEMPOTENCY_KEY_LENGTH = 255;
const MAX_RETRY_AFTER_SECONDS = 60;
/** 5xx codes the spec's error table classifies `terminal`: never retried. */
const TERMINAL_5XX_CODES = new Set(["PAYINS_CARD_PAYMENT_PENDING"]);
const RETRYABLE_GET_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

/**
 * What one attempt produced: an HTTP response (body already read, or `bodyError` when reading
 * it failed after the status line arrived) or no response at all.
 */
type Attempt =
    | { kind: "response"; response: Response; text: string; bodyError?: string }
    | { kind: "failure"; type: "connection_error" | "timeout_error" | "aborted"; message: string };

const ABORTED_MESSAGE = "The request was aborted";

/** Headers the SDK owns: per-call `options.headers` can't set them, in any casing. */
const RESERVED_HEADERS = new Set(["authorization", "user-agent", "accept", "content-type"]);

type Decision = {
    /** Safe to send the same request again (same bytes, same Idempotency-Key). */
    retryable: boolean;
    /** The SDK resends it on its own (v3 C3: never a mutation that got a 5xx). */
    autoRetry: boolean;
    /** Wait before the next attempt, when the server said how long (Retry-After <= 60 s). */
    retryAfterMs?: number;
};

/**
 * Sends one API call through the retry loop (sdk-parity Appendix A2) and returns the SDK's
 * `{ data, error }` result. It never throws: network failures, timeouts, aborts, non-JSON
 * bodies and rejected options all come back as `error`.
 */
export async function send<T>(
    config: TransportConfig,
    spec: RequestSpec
): Promise<BlindpayApiResponse<T>> {
    const { method, path, json, form, options = {} } = spec;
    const isMutation = method !== "GET";
    const isMultipart = form !== undefined;

    if (options.timeoutMs !== undefined && !(options.timeoutMs > 0)) {
        return invalidRequest("timeoutMs must be a positive number of milliseconds");
    }
    const callerHeaders = Object.entries(options.headers ?? {});
    if (callerHeaders.some(([name]) => name.toLowerCase() === "idempotency-key")) {
        return invalidRequest(
            "Pass the idempotency key as options.idempotencyKey, not as a header, so it is validated and reused on retries"
        );
    }

    let idempotencyKey: string | undefined;
    if (isMutation && !isMultipart) {
        idempotencyKey = options.idempotencyKey;
        if (idempotencyKey !== undefined && !isValidIdempotencyKey(idempotencyKey)) {
            return invalidRequest(
                `idempotencyKey must be 1 to ${MAX_IDEMPOTENCY_KEY_LENGTH} characters with no leading or trailing whitespace; the API ignores an empty key and rejects a longer one`
            );
        }
        // Generated before the first attempt: that attempt may already have executed.
        if (idempotencyKey === undefined && config.maxRetries > 0) idempotencyKey = randomUUID();
    }

    const headers: Record<string, string> = {
        ...Object.fromEntries(
            callerHeaders.filter(([name]) => !RESERVED_HEADERS.has(name.toLowerCase()))
        ),
        Accept: "application/json",
        "User-Agent": config.userAgent,
        Authorization: `Bearer ${config.apiKey}`,
    };
    if (json !== undefined) headers["Content-Type"] = "application/json";
    if (idempotencyKey !== undefined) headers["Idempotency-Key"] = idempotencyKey;

    // Serialised once: every attempt resends identical bytes (the API hashes the raw body).
    const body = json !== undefined ? JSON.stringify(json) : form;
    const url = `${config.baseUrl}/v1${path}`;
    const timeoutMs = options.timeoutMs ?? config.timeoutMs;

    for (let attempt = 0; ; attempt++) {
        const result = await sendOnce(
            config.fetch,
            url,
            { method, headers, body },
            timeoutMs,
            options.signal
        );

        if (result.kind === "response" && result.response.ok && !result.bodyError) {
            return toSuccess<T>(result, idempotencyKey);
        }

        const error: ErrorResponse & { type: ErrorType } =
            result.kind === "response"
                ? toApiError(result)
                : { message: result.message, type: result.type, status: 0 };
        const decision = decide({
            method,
            isMultipart,
            hasKey: idempotencyKey !== undefined,
            attempt: result,
            code: error.code,
            message: error.message,
        });

        if (decision.autoRetry && attempt < config.maxRetries) {
            const delayMs = decision.retryAfterMs ?? backoffMs(attempt);
            if (await sleep(delayMs, options.signal)) continue;
            // Cancelled while waiting: return what the API last said, with the key to resume.
            return failure({
                ...(result.kind === "response" ? error : abortedError()),
                retryable: decision.retryable,
                idempotency_key: idempotencyKey,
            });
        }

        return failure({
            ...error,
            retryable: decision.retryable,
            idempotency_key: idempotencyKey,
        });
    }
}

/** One attempt with its own timeout, which also covers reading the body. */
async function sendOnce(
    fetchFn: typeof fetch,
    url: string,
    init: { method: HttpMethod; headers: Record<string, string>; body?: string | FormData },
    timeoutMs: number,
    callerSignal?: AbortSignal
): Promise<Attempt> {
    if (callerSignal?.aborted) return abortedAttempt();
    // Node 18 has no AbortSignal.any, so the caller's signal is forwarded by hand.
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, timeoutMs);
    const onCallerAbort = () => controller.abort();
    callerSignal?.addEventListener("abort", onCallerAbort);
    try {
        let response: Response;
        try {
            response = await fetchFn(url, { ...init, signal: controller.signal });
        } catch (error) {
            if (callerSignal?.aborted) return abortedAttempt();
            if (timedOut) {
                return {
                    kind: "failure",
                    type: "timeout_error",
                    message: `The request timed out after ${timeoutMs} ms`,
                };
            }
            return { kind: "failure", type: "connection_error", message: messageOf(error) };
        }
        // The status line has arrived: from here on the attempt is judged by its status (A2),
        // even when reading the body fails, so a 5xx mutation is never resent.
        try {
            return { kind: "response", response, text: await response.text() };
        } catch (error) {
            if (callerSignal?.aborted) return abortedAttempt();
            const bodyError = timedOut
                ? `reading the body timed out after ${timeoutMs} ms`
                : messageOf(error);
            return { kind: "response", response, text: "", bodyError };
        }
    } finally {
        clearTimeout(timer);
        callerSignal?.removeEventListener("abort", onCallerAbort);
    }
}

function abortedAttempt(): Attempt {
    return { kind: "failure", type: "aborted", message: ABORTED_MESSAGE };
}

function abortedError(): ErrorResponse & { type: ErrorType } {
    return { message: ABORTED_MESSAGE, type: "aborted", status: 0 };
}

function invalidRequest(message: string): { data: null; error: ErrorResponse } {
    return failure({ message, type: "invalid_request", status: 0, retryable: false });
}

/** 1 to 255 characters and no surrounding whitespace (a padded key would be a different key). */
function isValidIdempotencyKey(key: string): boolean {
    return key !== "" && key === key.trim() && key.length <= MAX_IDEMPOTENCY_KEY_LENGTH;
}

/**
 * Appendix A2, top to bottom. `retryable` is what the error reports to the caller;
 * `autoRetry` is whether the loop resends on its own. Both come from here so they can't drift.
 */
function decide(ctx: {
    method: HttpMethod;
    isMultipart: boolean;
    hasKey: boolean;
    attempt: Attempt;
    code?: string;
    message: string;
}): Decision {
    const { method, isMultipart, hasKey, attempt } = ctx;
    const isGet = method === "GET";
    // A mutation is only safe to resend under an Idempotency-Key (multipart never has one).
    const resendable = isGet || (hasKey && !isMultipart);
    const no: Decision = { retryable: false, autoRetry: false };

    if (attempt.kind === "failure" && attempt.type === "aborted") return no; // A2 row 1
    // Rows 2-3, before any status rule: a multipart or unkeyed mutation is never safe to resend.
    if (!resendable) return no;

    if (attempt.kind === "failure") return { retryable: true, autoRetry: true };

    const { status } = attempt.response;
    // A 2xx whose body couldn't be read: the call happened. Not resent automatically; the
    // caller may resend (a keyed mutation replays the stored response).
    if (attempt.response.ok) return { retryable: true, autoRetry: false };
    const retryAfterMs = parseRetryAfter(attempt.response.headers.get("Retry-After"));

    if (status === 409 && ctx.message === "idempotency_key_in_flight") {
        return { retryable: true, autoRetry: true, retryAfterMs };
    }
    // Produced before the idempotency middleware, so the handler never ran.
    if (status === 429) {
        return { retryable: true, autoRetry: true, retryAfterMs };
    }
    if (status >= 500) {
        if (ctx.code && TERMINAL_5XX_CODES.has(ctx.code)) return no;
        if (!isGet) {
            // The API releases the key on a 5xx, so a resend re-executes the handler: the caller
            // checks state first and then resends deliberately with the same key.
            return { retryable: true, autoRetry: false };
        }
    }
    if (isGet && RETRYABLE_GET_STATUSES.has(status)) {
        return { retryable: true, autoRetry: true, retryAfterMs };
    }
    return no;
}

/** Integer seconds only, and only up to 60 s; anything else falls back to backoff. */
function parseRetryAfter(value: string | null): number | undefined {
    if (value === null || !/^\d+$/.test(value.trim())) return undefined;
    const seconds = Number(value.trim());
    return seconds <= MAX_RETRY_AFTER_SECONDS ? seconds * 1000 : undefined;
}

/** `min(8 s, 0.5 s * 2^attempt)` with jitter in [0.5, 1.0]. */
function backoffMs(attempt: number): number {
    // Jitter from node:crypto rather than Math.random().
    return Math.min(8000, 500 * 2 ** attempt) * (randomInt(500, 1001) / 1000);
}

/** Resolves `true` after `ms`, or `false` as soon as `signal` aborts (the timer is cleared). */
function sleep(ms: number, signal?: AbortSignal): Promise<boolean> {
    if (signal?.aborted) return Promise.resolve(false);
    return new Promise((resolve) => {
        const onAbort = () => {
            clearTimeout(timer);
            resolve(false);
        };
        const timer = setTimeout(() => {
            signal?.removeEventListener("abort", onAbort);
            resolve(true);
        }, ms);
        signal?.addEventListener("abort", onAbort, { once: true });
    });
}

function toSuccess<T>(
    result: Extract<Attempt, { kind: "response" }>,
    idempotencyKey: string | undefined
): BlindpayApiResponse<T> {
    if (!result.text) return { data: null as T, error: null };
    try {
        return { data: JSON.parse(result.text) as T, error: null };
    } catch {
        return failure({
            ...responseMeta(result.response),
            message: `HTTP ${result.response.status}: the response body is not valid JSON`,
            type: "invalid_response",
            retryable: false,
            idempotency_key: idempotencyKey,
        });
    }
}

/** A non-2xx response: the API's error envelope when the body is JSON, else the status line. */
function toApiError(
    result: Extract<Attempt, { kind: "response" }>
): ErrorResponse & { type: ErrorType } {
    const { response, text, bodyError } = result;
    if (bodyError) {
        return {
            message: `${statusLine(response)} (the response body could not be read: ${bodyError})`,
            ...responseMeta(response),
            type: response.ok ? "invalid_response" : "api_error",
        };
    }
    let parsed: unknown = null;
    let isJson = true;
    if (text) {
        try {
            parsed = JSON.parse(text);
        } catch {
            isJson = false;
        }
    }
    const envelope = isJson ? toErrorResponse(parsed) : { message: statusLine(response) };
    return { ...envelope, ...responseMeta(response), type: "api_error" };
}

function responseMeta(response: Response): Pick<ErrorResponse, "status" | "request_id"> {
    const requestId = response.headers.get("X-Request-Id");
    return requestId
        ? { status: response.status, request_id: requestId }
        : { status: response.status };
}

function statusLine(response: Response): string {
    return response.statusText
        ? `HTTP ${response.status} ${response.statusText}`
        : `HTTP ${response.status}`;
}

/** Builds the `{ data: null, error }` result, leaving out fields that are `undefined`. */
function failure(fields: ErrorResponse & { type: ErrorType }): {
    data: null;
    error: ErrorResponse;
} {
    const error = Object.fromEntries(
        Object.entries(fields).filter(([, value]) => value !== undefined)
    ) as ErrorResponse;
    return { data: null, error };
}

function messageOf(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (error && typeof error === "object" && "message" in error) {
        const { message } = error as { message: unknown };
        if (typeof message === "string") return message;
    }
    return "Unknown error";
}
