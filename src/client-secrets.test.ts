import { inspect } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "./client";

const API_KEY = "test_key_SECRET_0000";

/** Every way a client or a result could end up in a log line. */
function renderings(value: unknown): string[] {
    return [
        inspect(value, { depth: null, showHidden: true, getters: true }),
        JSON.stringify(value) ?? "",
        String(value),
    ];
}

describe("API key redaction (sdk-parity C13)", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({
        apiKey: API_KEY,
        instanceId: "in_000000000000",
        maxRetries: 0,
    });

    it("never shows the key when the client or a resource is logged or serialised", () => {
        for (const value of [blindpay, blindpay.payouts, blindpay.wallets, blindpay.upload]) {
            for (const text of renderings(value)) {
                expect(text).not.toContain(API_KEY);
                expect(text).not.toContain("Bearer");
            }
        }
        expect(JSON.parse(JSON.stringify(blindpay))).toMatchObject({
            instanceId: "in_000000000000",
            apiKey: "[redacted]",
        });
    });

    it("still sends the key, only on the wire", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        await blindpay.payouts.get("po_000000000000");
        const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
        expect(headers.get("Authorization")).toBe(`Bearer ${API_KEY}`);
    });

    it("never puts the key or the request body in an error", async () => {
        const body = { tax_id: "123-45-6789" };
        fetchMock.mockResponseOnce(JSON.stringify({ success: false, message: "bad" }), {
            status: 400,
        });
        const apiError = await blindpay.customers.update({ customer_id: "re_1", ...body } as never);
        fetchMock.mockRejectOnce(new Error("socket hang up"));
        const networkError = await blindpay.customers.update({
            customer_id: "re_1",
            ...body,
        } as never);

        for (const result of [apiError, networkError]) {
            expect(result.error).not.toBeNull();
            for (const text of renderings(result)) {
                expect(text).not.toContain(API_KEY);
                expect(text).not.toContain("Bearer");
                expect(text).not.toContain(body.tax_id);
            }
        }
    });
});
