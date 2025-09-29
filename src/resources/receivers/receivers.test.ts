import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateReceiverResponse,
    GetReceiverLimitsResponse,
    GetReceiverResponse,
    ListReceiversResponse,
} from ".";

describe("Receivers", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("List receivers", () => {
        it("should list receivers", async () => {
            const mockedReceivers: ListReceiversResponse = [
                {
                    id: "re_000000000000",
                    type: "individual",
                    kyc_type: "standard",
                    kyc_status: "verifying",
                    kyc_warnings: [
                        {
                            code: null,
                            message: null,
                            resolution_status: null,
                            warning_id: null,
                        },
                    ],
                    email: "email@example.com",
                    tax_id: "536804398",
                    address_line_1: "738 Plain St",
                    address_line_2: "Building 22",
                    city: "Marshfield",
                    state_province_region: "MA",
                    country: "US",
                    postal_code: "02050",
                    ip_address: "127.0.0.1",
                    image_url: "https://example.com/image.png",
                    phone_number: "+1234567890",
                    proof_of_address_doc_type: "UTILITY_BILL",
                    proof_of_address_doc_file: "https://example.com/image.png",
                    first_name: "John",
                    last_name: "Doe",
                    date_of_birth: "1998-01-01T00:00:00Z",
                    id_doc_country: "BR",
                    id_doc_type: "PASSPORT",
                    id_doc_front_file: "https://example.com/image.png",
                    id_doc_back_file: "https://example.com/image.png",
                    legal_name: "Company Name Inc.",
                    alternate_name: "Company Name Inc.",
                    formation_date: "1998-01-01T00:00:00Z",
                    website: "https://example.com",
                    owners: [
                        {
                            id: "ub_000000000000",
                            first_name: "John",
                            last_name: "Doe",
                            address_line_1: "738 Plain St",
                            address_line_2: "Building 22",
                            city: "Marshfield",
                            state_province_region: "MA",
                            country: "US",
                            postal_code: "02050",
                            id_doc_country: "BR",
                            id_doc_type: "PASSPORT",
                            id_doc_front_file: "https://example.com/image.png",
                            id_doc_back_file: "https://example.com/image.png",
                        },
                    ],
                    incorporation_doc_file: "https://example.com/image.png",
                    proof_of_ownership_doc_file: "https://example.com/image.png",
                    source_of_funds_doc_type: "business_income",
                    source_of_funds_doc_file: "https://example.com/image.png",
                    individual_holding_doc_front_file: "https://example.com/image.png",
                    purpose_of_transactions: "business_transactions",
                    purpose_of_transactions_explanation:
                        "I am a business owner and I want to receive payments from my customers",
                    external_id: "your_company_external_id",
                    instance_id: "in_000000000000",
                    tos_id: "to_000000000000",
                    aiprise_validation_key: "",
                    created_at: "2021-01-01T00:00:00Z",
                    updated_at: "2021-01-01T00:00:00Z",
                    limit: {
                        per_transaction: 100000,
                        daily: 200000,
                        monthly: 1000000,
                    },
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedReceivers), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedReceivers);
        });
    });

    describe("Create receiver", () => {
        const mockedReceiver: CreateReceiverResponse = {
            id: "re_000000000000",
        };

        it("should create a receiver", async () => {
            fetchMock.mockResponseOnce(JSON.stringify(mockedReceiver), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.create({
                type: "individual",
                kyc_type: "standard",
                email: "email@example.com",
                tax_id: "536804398",
                address_line_1: "738 Plain St",
                address_line_2: "Building 22",
                city: "Marshfield",
                state_province_region: "MA",
                country: "US",
                postal_code: "02050",
                ip_address: "127.0.0.1",
                image_url: "https://example.com/image.png",
                phone_number: "+1234567890",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                first_name: "John",
                last_name: "Doe",
                date_of_birth: "1998-01-01T00:00:00Z",
                id_doc_country: "BR",
                id_doc_type: "PASSPORT",
                id_doc_front_file: "https://example.com/image.png",
                id_doc_back_file: "https://example.com/image.png",
                legal_name: "Company Name Inc.",
                alternate_name: "Company Name Inc.",
                formation_date: "1998-01-01T00:00:00Z",
                website: "https://example.com",
                owners: [
                    {
                        first_name: "John",
                        last_name: "Doe",
                        role: "beneficial_owner",
                        date_of_birth: "1998-01-01T00:00:00Z",
                        tax_id: "536804398",
                        address_line_1: "738 Plain St",
                        address_line_2: "Building 22",
                        city: "Marshfield",
                        state_province_region: "MA",
                        country: "US",
                        postal_code: "02050",
                        id_doc_country: "BR",
                        id_doc_type: "PASSPORT",
                        id_doc_front_file: "https://example.com/image.png",
                        id_doc_back_file: "https://example.com/image.png",
                        proof_of_address_doc_file: "https://example.com/image.png",
                        proof_of_address_doc_type: "UTILITY_BILL",
                    },
                ],
                incorporation_doc_file: "https://example.com/image.png",
                proof_of_ownership_doc_file: "https://example.com/image.png",
                source_of_funds_doc_type: "business_income",
                source_of_funds_doc_file: "https://example.com/image.png",
                individual_holding_doc_front_file: "https://example.com/image.png",
                purpose_of_transactions: "business_transactions",
                purpose_of_transactions_explanation:
                    "I am a business owner and I want to receive payments from my customers",
                external_id: "your_company_external_id",
                tos_id: "to_000000000000",
            });
            expect(error).toBeNull();
            expect(data).toEqual({ id: "re_000000000000" });
        });
    });

    describe("Get receiver", () => {
        it("should get a receiver", async () => {
            const mockedReceiver: GetReceiverResponse = {
                id: "re_000000000000",
                type: "individual",
                kyc_type: "standard",
                kyc_status: "verifying",
                kyc_warnings: [
                    {
                        code: null,
                        message: null,
                        resolution_status: null,
                        warning_id: null,
                    },
                ],
                email: "email@example.com",
                tax_id: "536804398",
                address_line_1: "738 Plain St",
                address_line_2: "Building 22",
                city: "Marshfield",
                state_province_region: "MA",
                country: "US",
                postal_code: "02050",
                ip_address: "127.0.0.1",
                image_url: "https://example.com/image.png",
                phone_number: "+1234567890",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                first_name: "John",
                last_name: "Doe",
                date_of_birth: "1998-01-01T00:00:00Z",
                id_doc_country: "BR",
                id_doc_type: "PASSPORT",
                id_doc_front_file: "https://example.com/image.png",
                id_doc_back_file: "https://example.com/image.png",
                legal_name: "Company Name Inc.",
                alternate_name: "Company Name Inc.",
                formation_date: "1998-01-01T00:00:00Z",
                website: "https://example.com",
                owners: [
                    {
                        id: "ub_000000000000",
                        first_name: "John",
                        last_name: "Doe",
                        address_line_1: "738 Plain St",
                        address_line_2: "Building 22",
                        city: "Marshfield",
                        state_province_region: "MA",
                        country: "US",
                        postal_code: "02050",
                        id_doc_country: "BR",
                        id_doc_type: "PASSPORT",
                        id_doc_front_file: "https://example.com/image.png",
                        id_doc_back_file: "https://example.com/image.png",
                    },
                ],
                incorporation_doc_file: "https://example.com/image.png",
                proof_of_ownership_doc_file: "https://example.com/image.png",
                source_of_funds_doc_type: "business_income",
                source_of_funds_doc_file: "https://example.com/image.png",
                individual_holding_doc_front_file: "https://example.com/image.png",
                purpose_of_transactions: "business_transactions",
                purpose_of_transactions_explanation:
                    "I am a business owner and I want to receive payments from my customers",
                external_id: "your_company_external_id",
                instance_id: "in_000000000000",
                tos_id: "to_000000000000",
                aiprise_validation_key: "",
                created_at: "2021-01-01T00:00:00Z",
                updated_at: "2021-01-01T00:00:00Z",
                limit: {
                    per_transaction: 100000,
                    daily: 200000,
                    monthly: 1000000,
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedReceiver), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.get("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedReceiver);
        });
    });

    describe("Update receiver", () => {
        it("should update a receiver", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.update({
                receiver_id: "re_000000000000",
                email: "email@example.com",
                tax_id: "536804398",
                address_line_1: "738 Plain St",
                address_line_2: "Building 22",
                city: "Marshfield",
                state_province_region: "MA",
                country: "US",
                postal_code: "02050",
                ip_address: "127.0.0.1",
                image_url: "https://example.com/image.png",
                phone_number: "+1234567890",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                first_name: "John",
                last_name: "Doe",
                date_of_birth: "1998-01-01T00:00:00Z",
                id_doc_country: "BR",
                id_doc_type: "PASSPORT",
                id_doc_front_file: "https://example.com/image.png",
                id_doc_back_file: "https://example.com/image.png",
                legal_name: "Company Name Inc.",
                alternate_name: "Company Name Inc.",
                formation_date: "1998-01-01T00:00:00Z",
                website: "https://example.com",
                owners: [
                    {
                        id: "ub_000000000000",
                        first_name: "John",
                        last_name: "Doe",
                        role: "beneficial_owner",
                        date_of_birth: "1998-01-01T00:00:00Z",
                        tax_id: "536804398",
                        address_line_1: "738 Plain St",
                        address_line_2: "Building 22",
                        city: "Marshfield",
                        state_province_region: "MA",
                        country: "US",
                        postal_code: "02050",
                        id_doc_country: "BR",
                        id_doc_type: "PASSPORT",
                        id_doc_front_file: "https://example.com/image.png",
                        id_doc_back_file: "https://example.com/image.png",
                    },
                ],
                incorporation_doc_file: "https://example.com/image.png",
                proof_of_ownership_doc_file: "https://example.com/image.png",
                source_of_funds_doc_type: "business_income",
                source_of_funds_doc_file: "https://example.com/image.png",
                individual_holding_doc_front_file: "https://example.com/image.png",
                purpose_of_transactions: "business_transactions",
                purpose_of_transactions_explanation:
                    "I am a business owner and I want to receive payments from my customers",
                external_id: "your_company_external_id",
                tos_id: "to_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });

    describe("Delete receiver", () => {
        it("should delete a receiver", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.delete("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });

    describe("Get receiver limits", () => {
        it("should get receiver limits", async () => {
            const mockedReceiverLimits: GetReceiverLimitsResponse = {
                limits: {
                    payin: {
                        daily: 10000,
                        monthly: 50000,
                    },
                    payout: {
                        daily: 20000,
                        monthly: 100000,
                    },
                },
            };
            fetchMock.mockResponseOnce(JSON.stringify(mockedReceiverLimits), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.getLimits("re_000000000000");
            expect(error).toBeNull();
            expect(data).toEqual(mockedReceiverLimits);
        });
    });
});
