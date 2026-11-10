import { Webhook } from "svix";
import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "./client";

describe("BlindPay client", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    it("handles successful empty JSON responses", async () => {
        fetchMock.mockResponseOnce("", { status: 200 });

        const { data, error } = await blindpay.instances.webhookEndpoints.delete("wh_000000000000");

        expect(error).toBeNull();
        expect(data).toBeNull();
    });

    it("surfaces the API error envelope's code, description, errors and trace_id", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({
                success: false,
                code: "PAYOUTS_INSUFFICIENT_BALANCE",
                message: "not_enough_balance",
                description: "There is not enough balance to complete this payout.",
                errors: ["Bad Request"],
                trace_id: "0af7651916cd43dd8448eb211c80319c",
            }),
            { status: 400 }
        );

        const { data, error } = await blindpay.payouts.get("pa_000000000000");

        expect(data).toBeNull();
        expect(error).toStrictEqual({
            code: "PAYOUTS_INSUFFICIENT_BALANCE",
            message: "not_enough_balance",
            description: "There is not enough balance to complete this payout.",
            errors: ["Bad Request"],
            trace_id: "0af7651916cd43dd8448eb211c80319c",
            status: 400,
            type: "api_error",
            retryable: false,
        });
    });

    // No retries here: these GETs would otherwise be resent on the 5xx.
    const noRetries = new BlindPay({
        apiKey: "test-key",
        instanceId: "in_000000000000",
        maxRetries: 0,
    });

    it("keeps only the envelope's documented fields, and only when they're well typed", async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify({ message: 42, code: "X", errors: ["a", 1], debug: { sql: "..." } }),
            { status: 500 }
        );

        const { error } = await noRetries.payouts.get("pa_000000000000");

        expect(error).toStrictEqual({
            message: "Unknown error",
            code: "X",
            status: 500,
            type: "api_error",
            retryable: true,
        });
    });

    it("keeps only a message when the error body is not an object", async () => {
        fetchMock.mockResponseOnce(JSON.stringify("Bad Gateway"), { status: 502 });

        const { error } = await noRetries.payouts.get("pa_000000000000");

        expect(error).toStrictEqual({
            message: "Unknown error",
            status: 502,
            type: "api_error",
            retryable: true,
        });
    });
});

describe("verifyWebhookSignature", () => {
    const secret = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";
    const payload = JSON.stringify({ type: "payout.complete", data: { id: "po_000000000000" } });
    const id = "msg_000000000000";
    const timestamp = new Date();

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });
    const sign = (body: string) => new Webhook(secret).sign(id, timestamp, body);
    const headers = (signature: string) => ({
        id,
        timestamp: Math.floor(timestamp.getTime() / 1000).toString(),
        signature,
    });

    it("accepts a signature produced for the same payload", () => {
        expect(
            blindpay.verifyWebhookSignature({ secret, headers: headers(sign(payload)), payload })
        ).toBe(true);
    });

    it("rejects a signature produced for a different payload", () => {
        expect(
            blindpay.verifyWebhookSignature({
                secret,
                headers: headers(sign(payload)),
                payload: `${payload} `,
            })
        ).toBe(false);
    });

    it("rejects a signature made with a different secret", () => {
        const other = new Webhook("whsec_TWFjaGluZUxlYXJuaW5nUm9ja3NOb3RSZWFsbHk=").sign(
            id,
            timestamp,
            payload
        );

        expect(blindpay.verifyWebhookSignature({ secret, headers: headers(other), payload })).toBe(
            false
        );
    });

    it("rejects a timestamp outside the tolerated window", () => {
        const stale = new Date(timestamp.getTime() - 60 * 60 * 1000);
        const signature = new Webhook(secret).sign(id, stale, payload);

        expect(
            blindpay.verifyWebhookSignature({
                secret,
                headers: {
                    id,
                    timestamp: Math.floor(stale.getTime() / 1000).toString(),
                    signature,
                },
                payload,
            })
        ).toBe(false);
    });
});

describe("Idempotency-Key", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });
    const sentKey = () => new Headers(fetchMock.mock.calls[0][1]?.headers).get("Idempotency-Key");
    const payout = { quote_id: "qu_000000000000", sender_wallet_address: "0x000000000000" };

    it("is sent as a header when a mutation is given one", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ id: "pa_000000000000" }));

        await blindpay.payouts.createEvm(payout, {
            idempotencyKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        });

        expect(sentKey()).toBe("a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    });

    it("is sent on a DELETE too", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

        await blindpay.customers.delete("cu_000000000000", { idempotencyKey: "retry-1" });

        expect(sentKey()).toBe("retry-1");
    });

    it("rejects an empty key without sending anything (the API would silently ignore it)", async () => {
        const { data, error } = await blindpay.payouts.createEvm(payout, { idempotencyKey: "" });

        expect(fetchMock.mock.calls).toHaveLength(0);
        expect(data).toBeNull();
        expect(error).toMatchObject({ type: "invalid_request", status: 0, retryable: false });
    });

    it("rejects a key longer than 255 characters without sending anything", async () => {
        const { error } = await blindpay.payouts.createEvm(payout, {
            idempotencyKey: "k".repeat(256),
        });

        expect(fetchMock.mock.calls).toHaveLength(0);
        expect(error?.type).toBe("invalid_request");
    });

    it("accepts a 255-character key", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ id: "pa_000000000000" }));

        await blindpay.payouts.createEvm(payout, { idempotencyKey: "k".repeat(255) });

        expect(sentKey()).toBe("k".repeat(255));
    });

    it("is generated (a UUIDv4) when the call has none and retries are on", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ id: "pa_000000000000" }));

        await blindpay.payouts.createEvm(payout);

        expect(sentKey()).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        );
    });

    it("is generated on a body-less DELETE too", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

        await blindpay.customers.delete("cu_000000000000");

        expect(sentKey()).toMatch(/^[0-9a-f-]{36}$/);
    });

    it("is not sent when the call has none and retries are off", async () => {
        const noRetries = new BlindPay({
            apiKey: "test-key",
            instanceId: "in_000000000000",
            maxRetries: 0,
        });
        fetchMock.mockResponseOnce(JSON.stringify({ id: "pa_000000000000" }));

        await noRetries.payouts.createEvm(payout);

        expect(sentKey()).toBeNull();
    });

    it("is never sent on a GET", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ id: "pa_000000000000" }));

        await blindpay.payouts.get("pa_000000000000");

        expect(sentKey()).toBeNull();
    });
});
