import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { GetCustomerRfiResponse, GetInstanceRfiResponse, SubmitRfiResponse } from ".";

describe("RFI", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    const request = [
        {
            title: "Source of funds",
            description: "Tell us where the funds come from.",
            supporting_document: "https://example.com/guide.pdf",
            fields: [
                {
                    key: "source_of_funds",
                    label: "Source of funds",
                    required: true,
                    items: [{ label: "Salary", value: "salary" }],
                },
                {
                    key: "bank_statement",
                    label: "Bank statement",
                    required: true,
                    multiple: true,
                    aiprise_document_type: "BANK_STATEMENT_DOCUMENT" as const,
                },
            ],
        },
    ];

    describe("Instance RFI", () => {
        it("should get the open instance RFI", async () => {
            const mockedRfi: GetInstanceRfiResponse = {
                id: "rf_000000000000",
                instance_id: "in_000000000000",
                status: "pending",
                request,
                response: {},
                expires_at: "2025-01-01T00:00:00Z",
                submitted_at: null,
                created_at: "2025-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedRfi), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.rfi.get();

            expect(error).toBeNull();
            expect(data).toEqual(mockedRfi);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/instances/in_000000000000/rfi");
            expect(init?.method).toBe("GET");
        });

        it("should return null when the instance has no open RFI", async () => {
            fetchMock.mockResponseOnce("null", {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.rfi.get();

            expect(error).toBeNull();
            expect(data).toBeNull();
        });

        it("should submit an instance RFI response", async () => {
            const mockedResponse: SubmitRfiResponse = { success: true };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.rfi.submit({
                response: {
                    source_of_funds: "salary",
                    bank_statement: ["https://example.com/statement.pdf"],
                },
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe("https://api.blindpay.com/v1/instances/in_000000000000/rfi");
            expect(init?.method).toBe("POST");
            expect(JSON.parse(init?.body as string)).toEqual({
                source_of_funds: "salary",
                bank_statement: ["https://example.com/statement.pdf"],
            });
        });
    });

    describe("Customer RFI", () => {
        it("should get the open customer RFI", async () => {
            const mockedRfi: GetCustomerRfiResponse = {
                id: "rf_000000000000",
                customer_id: "cu_000000000000",
                instance_id: "in_000000000000",
                status: "pending",
                request,
                response: {},
                expires_at: "2025-01-01T00:00:00Z",
                submitted_at: null,
                created_at: "2025-01-01T00:00:00Z",
                customer_type: "individual",
                customer_aiprise_session_id: null,
                customer_aiprise_user_profile_id: null,
                customer_kyc_status: "compliance_request",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedRfi), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.customers.rfi.get("cu_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedRfi);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/customers/cu_000000000000/rfi"
            );
            expect(init?.method).toBe("GET");
        });

        it("should submit a customer RFI response", async () => {
            const mockedResponse: SubmitRfiResponse = {
                success: false,
                reason: "no_pending_rfi",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.customers.rfi.submit({
                customer_id: "cu_000000000000",
                response: { source_of_funds: "salary" },
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/customers/cu_000000000000/rfi"
            );
            expect(init?.method).toBe("POST");
            expect(JSON.parse(init?.body as string)).toEqual({ source_of_funds: "salary" });
        });
    });
});
