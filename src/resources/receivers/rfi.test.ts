import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { GetRfiResponse, SubmitRfiResponse } from "./rfi";

describe("RFI", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Get RFI", () => {
        it("should get RFI for receiver", async () => {
            const mockedRfi: GetRfiResponse = {
                id: "rfi_000000000000",
                receiver_id: "re_000000000000",
                instance_id: "in_000000000000",
                status: "pending",
                request: [
                    {
                        id: "section_1",
                        title: "Additional Information",
                        description: "Please provide additional information",
                        required: true,
                        type: "text",
                        options: null,
                    },
                ],
                response: {},
                expires_at: "2025-01-01T00:00:00Z",
                submitted_at: null,
                created_at: "2025-01-01T00:00:00Z",
                receiver_type: "individual",
                receiver_aiprise_session_id: null,
                receiver_kyc_status: "pending_review",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedRfi), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.rfi.get("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedRfi);
        });
    });

    describe("Submit RFI", () => {
        it("should submit RFI response", async () => {
            const mockedResponse: SubmitRfiResponse = {
                success: true,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.rfi.submit({
                receiver_id: "re_000000000000",
                response: {
                    section_1: "Additional information provided",
                },
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
        });
    });
});
