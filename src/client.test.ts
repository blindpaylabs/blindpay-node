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
