import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../client";

const API = "https://api.blindpay.com/v1";

/** The URL of the single request `call` made. */
async function urlOf(call: () => Promise<unknown>): Promise<string> {
    fetchMock.mockResponseOnce(JSON.stringify({}), {
        headers: { "Content-Type": "application/json" },
    });
    await call();
    expect(fetchMock.mock.calls).toHaveLength(1);
    return String(fetchMock.mock.calls[0][0]);
}

describe("path segments", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test_key", instanceId: "in_000000000000" });

    it("percent-encodes a caller-supplied id, so a slash can't change the route", async () => {
        expect(await urlOf(() => blindpay.payouts.get("a/b"))).toBe(
            `${API}/instances/in_000000000000/payouts/a%2Fb`
        );
    });

    it("encodes every id in a nested path", async () => {
        expect(
            await urlOf(() =>
                blindpay.customers.bankAccounts.get({ customer_id: "re 1", id: "ba?x" })
            )
        ).toBe(`${API}/instances/in_000000000000/customers/re%201/bank-accounts/ba%3Fx`);
    });

    it("encodes ids outside an instance too (track routes, SWIFT lookup)", async () => {
        expect(await urlOf(() => blindpay.payins.getTrack("pi/../x"))).toBe(
            `${API}/e/payins/pi%2F..%2Fx`
        );
        fetchMock.resetMocks();
        expect(await urlOf(() => blindpay.available.getSwiftCodeBankDetails("AB#C"))).toBe(
            `${API}/available/swift/AB%23C`
        );
    });

    it("encodes the configured instance id once, in paths and in upload's query", async () => {
        const odd = new BlindPay({ apiKey: "test_key", instanceId: "in/0" });
        expect(await urlOf(() => odd.payouts.get("po_000000000000"))).toBe(
            `${API}/instances/in%2F0/payouts/po_000000000000`
        );
        fetchMock.resetMocks();
        expect(
            await urlOf(() => odd.upload.presign({ file_url: "https://example.com/f.pdf" }))
        ).toBe(`${API}/presign?instance_id=in%2F0`);
    });
});
