import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    GetInstanceBusinessDetailsResponse,
    GetInstanceBusinessProfileResponse,
    GetInstanceOwnershipDocumentsResponse,
} from "./onboarding";

describe("Instance onboarding", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Get business details", () => {
        it("should get the instance business details", async () => {
            const mockedBusinessDetails: GetInstanceBusinessDetailsResponse = {
                legal_name: "My Company",
                tax_id: "000.000.000-00",
                formation_date: "2020-04-23T00:00:00Z",
                trading_names: ["My Company Trading"],
                address_line_1: "123 Main St",
                address_line_2: null,
                city: "New York",
                state_province_region: "NY",
                postal_code: "10001",
                country: "US",
                entity_type: "corporation",
                state_of_incorporation: "DE",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedBusinessDetails), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.onboarding.getBusinessDetails();

            expect(error).toBeNull();
            expect(data).toEqual(mockedBusinessDetails);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/onboarding/business_details"
            );
            expect(init?.method).toBe("GET");
        });
    });

    describe("Get business profile", () => {
        it("should get the instance business profile", async () => {
            const mockedBusinessProfile: GetInstanceBusinessProfileResponse = {
                scenario: "custodial",
                scenario_description: null,
                has_kyc_screening: true,
                is_regulated: false,
                business_industry: "wallet",
                website: "https://example.com",
                top_volume_by_country: ["US", "BR"],
                estimated_volume_per_month: "up_to_1000",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedBusinessProfile), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.onboarding.getBusinessProfile();

            expect(error).toBeNull();
            expect(data).toEqual(mockedBusinessProfile);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/onboarding/business_profile"
            );
            expect(init?.method).toBe("GET");
        });
    });

    describe("Get ownership documents", () => {
        it("should get the instance ownership documents", async () => {
            const mockedOwnershipDocuments: GetInstanceOwnershipDocumentsResponse = {
                incorporation_doc_file: "https://example.com/incorporation.pdf",
                proof_of_ownership_doc_file: "https://example.com/ownership.pdf",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/address.pdf",
                owners: [
                    {
                        id: "ub_000000000000",
                        instance_id: "in_000000000000",
                        role: "beneficial_owner",
                        first_name: "John",
                        last_name: "Doe",
                        ownership_percentage: 50,
                        date_of_birth: "1990-01-01T00:00:00Z",
                        tax_id: "123456789",
                        address_line_1: "123 Main St",
                        address_line_2: null,
                        city: "New York",
                        state_province_region: "NY",
                        country: "US",
                        postal_code: "10001",
                        id_doc_country: "US",
                        id_doc_type: "PASSPORT",
                        id_doc_front_file: "https://example.com/front.png",
                        id_doc_back_file: null,
                        proof_of_address_doc_type: "BANK_STATEMENT",
                        proof_of_address_doc_file: "https://example.com/owner-address.pdf",
                    },
                ],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedOwnershipDocuments), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.instances.onboarding.getOwnershipDocuments();

            expect(error).toBeNull();
            expect(data).toEqual(mockedOwnershipDocuments);
            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/onboarding/ownership_documents"
            );
            expect(init?.method).toBe("GET");
        });
    });
});
