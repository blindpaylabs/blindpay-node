import { timingSafeEqual } from "node:crypto";
import { Webhook } from "svix";
import { BlindPayError } from "./internal/blindpay-error";
import { WEBHOOK_EVENT_NAMES } from "./internal/webhook-event-names";
import type { WebhookEvent } from "./resources/webhooks/events";

/**
 * The webhook request's headers: a Fetch `Headers` or a plain object such as Express's
 * `req.headers`. Looked up case-insensitively; `svix-*` and `webhook-*` names both work.
 */
export type WebhookHeaders = Headers | Record<string, string | string[] | undefined>;

declare const unknownWebhookEventName: unique symbol;

/** An event name this SDK version doesn't know yet (any string outside `WebhookEvents`). */
export type UnknownWebhookEventName = string & { readonly [unknownWebhookEventName]: true };

/**
 * A verified event this SDK version doesn't know yet (newer than the SDK). Check for it with
 * `isUnknownWebhookEvent` before a `switch` on `webhook_event`, which then narrows each known
 * event to its own payload type.
 */
export type UnknownWebhookEvent = {
    webhook_event: UnknownWebhookEventName;
    /** The whole verified payload, as received. */
    raw: Record<string, unknown>;
};

const KNOWN_EVENTS: ReadonlySet<string> = new Set(WEBHOOK_EVENT_NAMES);

const DEFAULT_TOLERANCE_SECONDS = 300;

/** A fixed time to check `svix-timestamp` against: a `Date`, or Unix time in **seconds**. */
export type WebhookClock = number | Date;

export type WebhookVerifyOptions = {
    /** How far `svix-timestamp` may be from now, in seconds, either way. Defaults to 300 (5 minutes). */
    tolerance?: number;
    /**
     * The time to check `svix-timestamp` against, for tests and replays: a `Date`, or Unix time
     * in **seconds** (the unit of `svix-timestamp`, not `Date.now()` milliseconds). Defaults to
     * the current time.
     */
    now?: WebhookClock;
};

/**
 * Checks a BlindPay webhook's Svix signature and timestamp (within `options.tolerance` seconds,
 * 5 minutes by default). Needs no API key or client. Never throws.
 *
 * @param payload The raw request body, exactly as received: a string, or the bytes (a `Buffer`
 *   from `express.raw()` is fine); re-serialised JSON has different bytes and fails.
 * @param headers The request headers (`svix-id`, `svix-timestamp`, `svix-signature`).
 * @param secret The endpoint secret (`whsec_...`) from `instances.webhookEndpoints.getSecret`.
 *   Never log it.
 * @returns `true` when the signature matches and the timestamp is within tolerance.
 */
export function verifyWebhook(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string,
    options?: WebhookVerifyOptions
): boolean {
    try {
        verifySignature(payload, headers, secret, options);
        return true;
    } catch {
        return false;
    }
}

/**
 * Verifies a webhook like `verifyWebhook` and returns its payload, typed by `webhook_event`.
 * An event this SDK version doesn't know comes back as an `UnknownWebhookEvent` instead of an
 * error. Deduplicate on the `svix-id` header: a webhook can be delivered more than once.
 *
 * @throws {BlindPayError} When the signature or timestamp doesn't verify
 */
export function constructWebhookEvent(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string,
    options?: WebhookVerifyOptions
): WebhookEvent | UnknownWebhookEvent {
    const body = verifyOrThrow(payload, headers, secret, options);
    if (
        isRecord(body) &&
        typeof body.webhook_event === "string" &&
        KNOWN_EVENTS.has(body.webhook_event)
    ) {
        return body as WebhookEvent;
    }
    const name = isRecord(body) && typeof body.webhook_event === "string" ? body.webhook_event : "";
    return {
        webhook_event: name as UnknownWebhookEventName,
        raw: isRecord(body) ? body : { value: body },
    };
}

/** `true` for an event this SDK version doesn't know (see `UnknownWebhookEvent`). */
export function isUnknownWebhookEvent(
    event: WebhookEvent | UnknownWebhookEvent
): event is UnknownWebhookEvent {
    return !KNOWN_EVENTS.has(event.webhook_event);
}

/** Verifies and returns the parsed payload, or throws a `BlindPayError`. */
export function verifyOrThrow(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string,
    options?: WebhookVerifyOptions
): unknown {
    try {
        return verifySignature(payload, headers, secret, options);
    } catch (error) {
        throw new BlindPayError(
            `Webhook verification failed: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Svix verification (sdk-parity A4) with a configurable tolerance: svix's own `verify` fixes it
 * at 5 minutes, so this checks the headers and timestamp itself and uses svix's `sign` for the
 * HMAC, comparing each `v1,` signature in constant time. Returns the parsed body or throws.
 */
function verifySignature(
    payload: string | Uint8Array,
    headers: WebhookHeaders,
    secret: string,
    options: WebhookVerifyOptions = {}
): unknown {
    const tolerance = options.tolerance ?? DEFAULT_TOLERANCE_SECONDS;
    const h = toHeaderRecord(headers);
    const id = h["svix-id"] ?? h["webhook-id"];
    const timestamp = h["svix-timestamp"] ?? h["webhook-timestamp"];
    const signatures = h["svix-signature"] ?? h["webhook-signature"];
    if (!id || !timestamp || !signatures) throw new Error("Missing required headers");
    if (!/^\d+$/.test(timestamp)) throw new Error("Invalid timestamp");
    const seconds = Number(timestamp);
    if (Math.abs(nowSeconds(options.now) - seconds) > tolerance) {
        throw new Error("Message timestamp is outside the tolerance");
    }
    // svix takes a string or a Buffer; a Buffer view over the same bytes avoids a copy.
    const body =
        typeof payload === "string"
            ? payload
            : Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength);
    const expected = Buffer.from(
        new Webhook(secret).sign(id, new Date(seconds * 1000), body).split(",")[1] ?? ""
    );
    const matches = signatures.split(" ").some((entry) => {
        const comma = entry.indexOf(",");
        if (comma < 0 || entry.slice(0, comma) !== "v1") return false;
        const candidate = Buffer.from(entry.slice(comma + 1));
        return candidate.length === expected.length && timingSafeEqual(candidate, expected);
    });
    if (!matches) throw new Error("No matching signature found");
    return JSON.parse(body.toString());
}

/** `now` as whole Unix seconds; the current time when it is absent. */
function nowSeconds(now: WebhookClock | undefined): number {
    if (now === undefined) return Math.floor(Date.now() / 1000);
    const seconds = now instanceof Date ? now.getTime() / 1000 : now;
    if (!Number.isFinite(seconds)) throw new Error("Invalid now");
    return Math.floor(seconds);
}

function toHeaderRecord(headers: WebhookHeaders): Record<string, string> {
    const record: Record<string, string> = {};
    if (headers instanceof Headers) {
        headers.forEach((value, key) => {
            record[key.toLowerCase()] = value;
        });
        return record;
    }
    for (const [key, value] of Object.entries(headers)) {
        if (value === undefined) continue;
        record[key.toLowerCase()] = Array.isArray(value) ? value.join(" ") : value;
    }
    return record;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
