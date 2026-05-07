import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { GetFeesResponse } from ".";

const mockFeeOptions = {
    payin_flat: 0,
    payin_percentage: 0,
    payout_flat: 100,
    payout_percentage: 0,
};

describe("Fees", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Get fees", () => {
        it("should get instance fees", async () => {
            const mockedFees: GetFeesResponse = {
                id: "fe_000000000000",
                instance_id: "in_000000000000",
                ach: mockFeeOptions,
                domestic_wire: mockFeeOptions,
                rtp: mockFeeOptions,
                international_swift: mockFeeOptions,
                pix: mockFeeOptions,
                pix_safe: mockFeeOptions,
                ach_colombia: mockFeeOptions,
                transfers_3: mockFeeOptions,
                spei: mockFeeOptions,
                tron: mockFeeOptions,
                ethereum: mockFeeOptions,
                polygon: mockFeeOptions,
                base: mockFeeOptions,
                arbitrum: mockFeeOptions,
                stellar: mockFeeOptions,
                solana: mockFeeOptions,
                ted: mockFeeOptions,
                created_at: "2025-01-01T00:00:00Z",
                updated_at: "2025-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedFees), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.fees.get();

            expect(error).toBeNull();
            expect(data).toEqual(mockedFees);
        });
    });
});
