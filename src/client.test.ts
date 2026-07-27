import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "./client";

describe("BlindPay client", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    it("handles successful empty JSON responses", async () => {
        fetchMock.mockResponseOnce("", { status: 200 });

        const { data, error } = await blindpay.instances.apiKeys.delete("ak_000000000000");

        expect(error).toBeNull();
        expect(data).toBeNull();
    });
});
