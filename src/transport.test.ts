import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BlindpayApiResponse } from "../types";
import { BlindPay, type BlindPayOptions } from "./client";
import { errorFixtures } from "./internal/test-fixtures";

/**
 * The transport contract (sdk-parity C1-C4, retry table Appendix A2), driven through real
 * resource methods with an injected `fetch` and a fake clock: no test sleeps for real.
 */

type Step = Response | Error | "hang";
type Call = { url: string; init: RequestInit };

function fakeFetch(...steps: Step[]) {
    const calls: Call[] = [];
    const fn = async (input: string | URL | Request, init: RequestInit = {}) => {
        calls.push({ url: String(input), init });
        const step = steps.shift();
        if (step === undefined) throw new Error("unexpected extra request");
        if (step === "hang") {
            return new Promise<Response>((_, reject) => {
                init.signal?.addEventListener("abort", () =>
                    reject(new DOMException("This operation was aborted", "AbortError"))
                );
            });
        }
        if (step instanceof Error) throw step;
        return step;
    };
    return { fetch: fn as typeof fetch, calls };
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", ...headers },
    });

const header = (call: Call, name: string) => new Headers(call.init.headers).get(name);

/** A response whose status line arrives but whose body stream then fails. */
const brokenBody = (status: number) =>
    new Response(
        new ReadableStream({
            start(controller) {
                controller.error(new Error("socket reset while reading the body"));
            },
        }),
        { status }
    );

function client(fetchFn: typeof fetch, options: Partial<BlindPayOptions> = {}) {
    return new BlindPay({
        apiKey: "test-key",
        instanceId: "in_000000000000",
        fetch: fetchFn,
        ...options,
    });
}

/** Runs `call` to completion on the fake clock. */
async function settle<T>(call: Promise<T>): Promise<T> {
    await vi.runAllTimersAsync();
    return call;
}

const payout = { quote_id: "qu_000000000000", sender_wallet_address: "0x000000000000" };
const getPayout = (b: BlindPay) => b.payouts.get("pa_000000000000");
const createPayout = (b: BlindPay) => b.payouts.createEvm(payout);

beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe("client configuration (C1)", () => {
    it("sends to baseUrl + /v1, ignoring a trailing slash, through the injected fetch", async () => {
        const { fetch, calls } = fakeFetch(json({ id: "pa_000000000000" }));

        await getPayout(client(fetch, { baseUrl: "http://localhost:4010/" }));

        expect(calls[0].url).toBe(
            "http://localhost:4010/v1/instances/in_000000000000/payouts/pa_000000000000"
        );
    });

    it("defaults to https://api.blindpay.com/v1", async () => {
        const { fetch, calls } = fakeFetch(json({}));

        await getPayout(client(fetch));

        expect(calls[0].url).toBe(
            "https://api.blindpay.com/v1/instances/in_000000000000/payouts/pa_000000000000"
        );
    });

    it("sends auth, User-Agent and Accept, and Content-Type only with a body", async () => {
        const { fetch, calls } = fakeFetch(json({}), json({}), json({}));
        const blindpay = client(fetch);

        await getPayout(blindpay);
        await createPayout(blindpay);
        await blindpay.customers.delete("cu_000000000000");

        const [get, post, del] = calls;
        expect(header(get, "Authorization")).toBe("Bearer test-key");
        expect(header(get, "User-Agent")).toMatch(/^blindpay-node\/\d+\.\d+\.\d+/);
        expect(header(get, "Accept")).toBe("application/json");
        expect(header(get, "Content-Type")).toBeNull();
        expect(header(post, "Content-Type")).toBe("application/json");
        expect(header(del, "Content-Type")).toBeNull();
        expect(del.init.body).toBeUndefined();
    });

    it("merges per-call headers but never lets them replace Authorization", async () => {
        const { fetch, calls } = fakeFetch(json({}));

        await client(fetch).payouts.createEvm(payout, {
            headers: { "X-Trace": "abc", Authorization: "Bearer other" },
        });

        expect(header(calls[0], "X-Trace")).toBe("abc");
        expect(header(calls[0], "Authorization")).toBe("Bearer test-key");
    });

    it("ignores Authorization, User-Agent, Accept and Content-Type in per-call headers, in any casing", async () => {
        const { fetch, calls } = fakeFetch(json({}));

        await client(fetch).payouts.createEvm(payout, {
            headers: {
                authorization: "Bearer other",
                "user-agent": "spoof",
                ACCEPT: "text/html",
                "content-type": "text/plain",
            },
        });

        const sent = new Headers(calls[0].init.headers);
        expect(sent.get("Authorization")).toBe("Bearer test-key");
        expect(sent.get("User-Agent")).toMatch(/^blindpay-node\//);
        expect(sent.get("Accept")).toBe("application/json");
        expect(sent.get("Content-Type")).toBe("application/json");
    });

    it.each(["idempotency-key", "Idempotency-Key", "IDEMPOTENCY-KEY"])(
        "rejects an %s header without sending: the key goes in options.idempotencyKey",
        async (name) => {
            const { fetch, calls } = fakeFetch();

            const { error } = await client(fetch).payouts.createEvm(payout, {
                headers: { [name]: "key-1" },
            });

            expect(calls).toHaveLength(0);
            expect(error).toMatchObject({ type: "invalid_request", status: 0, retryable: false });
        }
    );

    it.each([" ", "   ", " key-1", "key-1\n"])(
        "rejects the idempotency key %j (blank or padded) without sending",
        async (idempotencyKey) => {
            const { fetch, calls } = fakeFetch();

            const { error } = await client(fetch).payouts.createEvm(payout, { idempotencyKey });

            expect(calls).toHaveLength(0);
            expect(error).toMatchObject({ type: "invalid_request", status: 0 });
        }
    );

    it("applies per-call options on GETs too", async () => {
        const { fetch, calls } = fakeFetch(json([]), "hang");
        const blindpay = client(fetch, { maxRetries: 0 });

        await blindpay.payouts.list({ limit: "10" }, { headers: { "X-Trace": "list" } });
        const slow = blindpay.instances.get({ timeoutMs: 2_000 });
        await vi.advanceTimersByTimeAsync(2_000);

        expect(header(calls[0], "X-Trace")).toBe("list");
        expect((await slow).error?.type).toBe("timeout_error");
    });

    it("rejects invalid options at construction", () => {
        const { fetch } = fakeFetch();
        expect(() => client(fetch, { maxRetries: -1 })).toThrow("maxRetries");
        expect(() => client(fetch, { maxRetries: 1.5 })).toThrow("maxRetries");
        expect(() => client(fetch, { timeoutMs: 0 })).toThrow("timeoutMs");
    });

    it("times an attempt out after timeoutMs (60 s by default)", async () => {
        const { fetch, calls } = fakeFetch("hang");
        const call = getPayout(client(fetch, { maxRetries: 0 }));

        await vi.advanceTimersByTimeAsync(59_999);
        expect(calls).toHaveLength(1);
        await vi.advanceTimersByTimeAsync(1);

        const { error } = await call;
        expect(error).toMatchObject({ type: "timeout_error", status: 0, retryable: true });
        expect(error?.message).toContain("60000 ms");
    });

    it("lets a call override timeoutMs", async () => {
        const { fetch } = fakeFetch("hang");
        const call = client(fetch, { maxRetries: 0 }).payouts.createEvm(payout, {
            timeoutMs: 1_000,
        });

        await vi.advanceTimersByTimeAsync(1_000);

        expect((await call).error?.type).toBe("timeout_error");
    });

    it("stops when the caller's signal aborts, without retrying", async () => {
        const { fetch, calls } = fakeFetch("hang");
        const controller = new AbortController();
        const call = client(fetch).payouts.createEvm(payout, { signal: controller.signal });

        controller.abort();
        const { error } = await settle(call);

        expect(calls).toHaveLength(1);
        expect(error).toMatchObject({ type: "aborted", status: 0, retryable: false });
    });

    it("doesn't send anything when the signal is already aborted", async () => {
        const { fetch, calls } = fakeFetch();
        const controller = new AbortController();
        controller.abort();

        const { error } = await client(fetch).payouts.createEvm(payout, {
            signal: controller.signal,
        });

        expect(calls).toHaveLength(0);
        expect(error?.type).toBe("aborted");
    });
});

describe("errors (C4)", () => {
    it("carries status, request_id (X-Request-Id), the envelope and the idempotency key", async () => {
        const { fetch } = fakeFetch(
            json(
                {
                    success: false,
                    code: "QUOTES_ALREADY_USED",
                    message: "quote_already_used",
                    errors: [],
                    trace_id: "0af7651916cd43dd8448eb211c80319c",
                },
                400,
                { "X-Request-Id": "req_000000000000" }
            )
        );

        const { data, error } = await client(fetch).payouts.createEvm(payout, {
            idempotencyKey: "key-1",
        });

        expect(data).toBeNull();
        expect(error).toStrictEqual({
            code: "QUOTES_ALREADY_USED",
            message: "quote_already_used",
            errors: [],
            trace_id: "0af7651916cd43dd8448eb211c80319c",
            status: 400,
            request_id: "req_000000000000",
            type: "api_error",
            retryable: false,
            idempotency_key: "key-1",
        });
    });

    it("turns a network failure into status 0 / connection_error", async () => {
        const { fetch } = fakeFetch(new TypeError("fetch failed"));

        const { error } = await client(fetch, { maxRetries: 0 }).payouts.get("pa_000000000000");

        expect(error).toStrictEqual({
            message: "fetch failed",
            status: 0,
            type: "connection_error",
            retryable: true,
        });
    });

    it("handles a 2xx with an empty body as success with no data", async () => {
        const { fetch } = fakeFetch(new Response(null, { status: 204 }));

        const result = await client(fetch).customers.delete("cu_000000000000");

        expect(result).toStrictEqual({ data: null, error: null });
    });

    describe.each(errorFixtures())("%s", (_name, fixture) => {
        const response = () =>
            fixture.status === 204
                ? new Response(null, { status: 204 })
                : new Response(fixture.raw_body ?? JSON.stringify(fixture.body), {
                      status: fixture.status,
                      statusText: fixture.status === 502 ? "Bad Gateway" : "",
                      headers: fixture.headers,
                  });

        it("comes back as documented on a mutation, never as an exception", async () => {
            const { fetch, calls } = fakeFetch(response(), json({ id: "pa_000000000000" }));

            const { data, error } = await settle(client(fetch).payouts.createEvm(payout));

            if (fixture.status === 204) {
                expect(error).toBeNull();
                expect(data).toBeNull();
                return;
            }
            const resent = fixture.status === 429 || fixture.status === 409;
            expect(calls).toHaveLength(resent ? 2 : 1);
            if (resent) {
                expect(error).toBeNull();
                return;
            }
            expect(data).toBeNull();
            expect(error?.status).toBe(fixture.status);
            expect(error?.message).toBe(
                fixture.body ? fixture.body.message : "HTTP 502 Bad Gateway"
            );
            if (fixture.body?.code) expect(error?.code).toBe(fixture.body.code);
            if (!fixture.body?.trace_id) expect(error).not.toHaveProperty("trace_id");
            // A 5xx on a mutation is the caller's call: retryable, with the key to resend.
            expect(error?.retryable).toBe(fixture.status >= 500);
            expect(error?.idempotency_key).toBe(header(calls[0], "Idempotency-Key"));
        });
    });
});

describe("retries (C3, Appendix A2)", () => {
    describe("GET", () => {
        it.each([408, 429, 500, 502, 503, 504])(
            "is retried on %i, then succeeds",
            async (status) => {
                const { fetch, calls } = fakeFetch(
                    json({}, status),
                    json({ id: "pa_000000000000" })
                );

                const { data, error } = await settle(getPayout(client(fetch)));

                expect(calls).toHaveLength(2);
                expect(error).toBeNull();
                expect(data).toEqual({ id: "pa_000000000000" });
            }
        );

        it("is retried on a connection error and a timeout, without an Idempotency-Key", async () => {
            const { fetch, calls } = fakeFetch(
                new TypeError("fetch failed"),
                "hang",
                json({ id: "pa_000000000000" })
            );

            const { error } = await settle(getPayout(client(fetch)));

            expect(error).toBeNull();
            expect(calls).toHaveLength(3);
            for (const call of calls) expect(header(call, "Idempotency-Key")).toBeNull();
        });

        it("is retried on a 503 whose body fails to read, by its status", async () => {
            const { fetch, calls } = fakeFetch(brokenBody(503), json({ id: "pa_000000000000" }));

            const { data, error } = await settle(getPayout(client(fetch)));

            expect(calls).toHaveLength(2);
            expect(error).toBeNull();
            expect(data).toEqual({ id: "pa_000000000000" });
        });

        it("is retried on a non-JSON 502", async () => {
            const html = new Response("<html>502</html>", {
                status: 502,
                statusText: "Bad Gateway",
            });
            const { fetch, calls } = fakeFetch(html, json({}));

            await settle(getPayout(client(fetch)));

            expect(calls).toHaveLength(2);
        });

        it("gives up after maxRetries + 1 attempts with a retryable error", async () => {
            const { fetch, calls } = fakeFetch(json({}, 503), json({}, 503), json({}, 503));

            const { error } = await settle(getPayout(client(fetch)));

            expect(calls).toHaveLength(3);
            expect(error).toMatchObject({ status: 503, retryable: true, type: "api_error" });
        });

        it("isn't retried on a 5xx whose code the spec calls terminal", async () => {
            const { fetch, calls } = fakeFetch(
                json(
                    { success: false, code: "PAYINS_CARD_PAYMENT_PENDING", message: "pending" },
                    502
                )
            );

            const { error } = await settle(getPayout(client(fetch)));

            expect(calls).toHaveLength(1);
            expect(error?.retryable).toBe(false);
        });

        it.each([400, 401, 404, 409, 422, 501])("isn't retried on %i", async (status) => {
            const { fetch, calls } = fakeFetch(json({ message: "nope" }, status));

            const { error } = await settle(getPayout(client(fetch)));

            expect(calls).toHaveLength(1);
            expect(error?.retryable).toBe(false);
        });
    });

    describe("mutation", () => {
        it.each([500, 502, 503, 504])(
            "is never retried on %i: one request, a retryable error carrying the key",
            async (status) => {
                const { fetch, calls } = fakeFetch(json({ message: "boom" }, status));

                const { error } = await settle(createPayout(client(fetch)));

                expect(calls).toHaveLength(1);
                const key = header(calls[0], "Idempotency-Key");
                expect(key).toMatch(/^[0-9a-f-]{36}$/);
                expect(error).toMatchObject({ status, retryable: true, idempotency_key: key });
            }
        );

        it("is never retried on a 5xx whose body fails to read: it is judged by its status", async () => {
            const { fetch, calls } = fakeFetch(brokenBody(503));

            const { error } = await settle(createPayout(client(fetch)));

            expect(calls).toHaveLength(1);
            expect(error).toMatchObject({
                status: 503,
                type: "api_error",
                retryable: true,
                idempotency_key: header(calls[0], "Idempotency-Key"),
            });
            expect(error?.message).toContain("could not be read");
        });

        it("is not resent after a 2xx whose body fails to read: the call happened", async () => {
            const { fetch, calls } = fakeFetch(brokenBody(200));

            const { data, error } = await settle(createPayout(client(fetch)));

            expect(calls).toHaveLength(1);
            expect(data).toBeNull();
            expect(error).toMatchObject({ status: 200, type: "invalid_response", retryable: true });
        });

        it("is retried after a timeout and reuses the same generated key", async () => {
            const { fetch, calls } = fakeFetch("hang", json({ id: "pa_000000000000" }));

            const { data } = await settle(createPayout(client(fetch)));

            expect(data).toEqual({ id: "pa_000000000000" });
            expect(calls).toHaveLength(2);
            expect(header(calls[1], "Idempotency-Key")).toBe(header(calls[0], "Idempotency-Key"));
            expect(calls[1].init.body).toBe(calls[0].init.body);
        });

        it("is retried after a connection error with the caller's key", async () => {
            const { fetch, calls } = fakeFetch(new TypeError("fetch failed"), json({}));

            await settle(client(fetch).payouts.createEvm(payout, { idempotencyKey: "mine" }));

            expect(calls.map((c) => header(c, "Idempotency-Key"))).toEqual(["mine", "mine"]);
        });

        it("waits exactly Retry-After on a 429, with the same key", async () => {
            const { fetch, calls } = fakeFetch(
                json({ code: "AUTH_RATE_LIMITED", message: "rate_limited" }, 429, {
                    "Retry-After": "2",
                }),
                json({ id: "pa_000000000000" })
            );
            const call = createPayout(client(fetch));

            await vi.advanceTimersByTimeAsync(1_999);
            expect(calls).toHaveLength(1);
            await vi.advanceTimersByTimeAsync(1);
            expect(calls).toHaveLength(2);

            expect((await call).error).toBeNull();
            expect(header(calls[1], "Idempotency-Key")).toBe(header(calls[0], "Idempotency-Key"));
        });

        it("is retried on 409 idempotency_key_in_flight", async () => {
            const { fetch, calls } = fakeFetch(
                json({ success: false, message: "idempotency_key_in_flight" }, 409, {
                    "Retry-After": "1",
                }),
                json({ id: "pa_000000000000" })
            );

            const { error } = await settle(createPayout(client(fetch)));

            expect(error).toBeNull();
            expect(calls).toHaveLength(2);
        });

        it("falls back to backoff when Retry-After is over 60 s (409 in flight, 120 s)", async () => {
            vi.spyOn(Math, "random").mockReturnValue(0.999);
            const { fetch, calls } = fakeFetch(
                json({ success: false, message: "idempotency_key_in_flight" }, 409, {
                    "Retry-After": "120",
                }),
                json({})
            );
            const call = createPayout(client(fetch));

            // attempt 0 backoff: min(8 s, 0.5 s) * jitter <= 500 ms, far below 120 s
            await vi.advanceTimersByTimeAsync(500);
            expect(calls).toHaveLength(2);
            await call;
        });

        it("uses backoff when Retry-After isn't an integer number of seconds", async () => {
            const { fetch, calls } = fakeFetch(
                json({ message: "rate_limited" }, 429, { "Retry-After": "1.5" }),
                json({})
            );
            const call = createPayout(client(fetch));

            // First backoff: 0.5 s times a jitter in [0.5, 1.0], so between 250 and 500 ms.
            await vi.advanceTimersByTimeAsync(249);
            expect(calls).toHaveLength(1);
            await vi.advanceTimersByTimeAsync(251);
            expect(calls).toHaveLength(2);
            await call;
        });

        it("isn't retried on a 409 that isn't idempotency_key_in_flight", async () => {
            const { fetch, calls } = fakeFetch(
                json({ code: "WALLETS_SELF_CUSTODY_ALREADY_SET", message: "already_set" }, 409)
            );

            const { error } = await settle(createPayout(client(fetch)));

            expect(calls).toHaveLength(1);
            expect(error?.retryable).toBe(false);
        });

        it.each([400, 408, 422])("isn't retried on %i", async (status) => {
            const { fetch, calls } = fakeFetch(json({ message: "nope" }, status));

            const { error } = await settle(createPayout(client(fetch)));

            expect(calls).toHaveLength(1);
            expect(error?.retryable).toBe(false);
        });

        it.each([
            [
                "a 429",
                json({ code: "AUTH_RATE_LIMITED", message: "rate_limited" }, 429, {
                    "Retry-After": "30",
                }),
            ],
            [
                "an in-flight 409",
                json({ message: "idempotency_key_in_flight" }, 409, { "Retry-After": "30" }),
            ],
        ])(
            "stops the wait after %s when the caller aborts, keeping the API's error and the key",
            async (_label, response) => {
                const { fetch, calls } = fakeFetch(response);
                const controller = new AbortController();
                const call = client(fetch).payouts.createEvm(payout, {
                    signal: controller.signal,
                    idempotencyKey: "key-1",
                });

                await vi.advanceTimersByTimeAsync(1_000);
                controller.abort();
                const { error } = await call;

                expect(calls).toHaveLength(1);
                expect(error).toMatchObject({
                    status: response.status,
                    type: "api_error",
                    retryable: true,
                    idempotency_key: "key-1",
                });
                expect(vi.getTimerCount()).toBe(0);
            }
        );

        it("without a key (retries off), a 5xx is not retryable: A2 row 3 comes first", async () => {
            const { fetch, calls } = fakeFetch(json({ message: "boom" }, 503));

            const { error } = await client(fetch, { maxRetries: 0 }).payouts.createEvm(payout);

            expect(calls).toHaveLength(1);
            expect(header(calls[0], "Idempotency-Key")).toBeNull();
            expect(error).toMatchObject({ status: 503, retryable: false });
            expect(error?.idempotency_key).toBeUndefined();
        });

        it("isn't retried, nor retryable, on a 408 (A2 row 10)", async () => {
            const { fetch, calls } = fakeFetch(json({ message: "timeout" }, 408));

            const { error } = await settle(createPayout(client(fetch)));

            expect(calls).toHaveLength(1);
            expect(error).toMatchObject({ status: 408, retryable: false });
        });

        it("keeps the status and the key when a 2xx body isn't JSON", async () => {
            const { fetch, calls } = fakeFetch(new Response("<html>ok</html>", { status: 201 }));

            const { data, error } = await settle(createPayout(client(fetch)));

            expect(data).toBeNull();
            expect(error).toMatchObject({
                status: 201,
                type: "invalid_response",
                idempotency_key: header(calls[0], "Idempotency-Key"),
            });
        });

        it.each([0, -1, Number.NaN])(
            "rejects a per-call timeoutMs of %s without sending",
            async (timeoutMs) => {
                const { fetch, calls } = fakeFetch();

                const { error } = await client(fetch).payouts.get("pa_000000000000", { timeoutMs });

                expect(calls).toHaveLength(0);
                expect(error).toMatchObject({ type: "invalid_request", status: 0 });
            }
        );
    });

    describe("maxRetries: 0", () => {
        it("sends each call once and generates no key", async () => {
            const { fetch, calls } = fakeFetch(new TypeError("fetch failed"), json({}, 503));
            const blindpay = client(fetch, { maxRetries: 0 });

            const post = await settle(createPayout(blindpay));
            const get = await settle(getPayout(blindpay));

            expect(calls).toHaveLength(2);
            expect(header(calls[0], "Idempotency-Key")).toBeNull();
            // A mutation without a key can't be resent safely after no response.
            expect(post.error?.retryable).toBe(false);
            expect(get.error?.retryable).toBe(true);
        });
    });

    describe("multipart upload", () => {
        const file = new Blob(["%PDF"], { type: "application/pdf" });
        const upload = (b: BlindPay, options?: { idempotencyKey: string }) =>
            b.upload.upload({ file, bucket: "documents" }, options);

        it("isn't retried, and never sends an Idempotency-Key", async () => {
            const { fetch, calls } = fakeFetch(new TypeError("fetch failed"), json({}, 503));
            const blindpay = client(fetch);

            const first = await settle(upload(blindpay, { idempotencyKey: "ignored" }));
            const second = await settle(upload(blindpay));

            expect(calls).toHaveLength(2);
            for (const call of calls) expect(header(call, "Idempotency-Key")).toBeNull();
            expect(first.error?.type).toBe("connection_error");
            expect(second.error?.status).toBe(503);
        });

        it("goes through baseUrl, the injected fetch and timeoutMs like any call", async () => {
            const { fetch, calls } = fakeFetch("hang");
            const call: Promise<BlindpayApiResponse<unknown>> = upload(
                client(fetch, { baseUrl: "http://localhost:4010", timeoutMs: 5_000 })
            );

            await vi.advanceTimersByTimeAsync(5_000);

            expect(calls[0].url).toBe(
                "http://localhost:4010/v1/upload?instance_id=in_000000000000"
            );
            expect(calls[0].init.body).toBeInstanceOf(FormData);
            expect(header(calls[0], "Content-Type")).toBeNull();
            expect((await call).error?.type).toBe("timeout_error");
        });
    });
});
