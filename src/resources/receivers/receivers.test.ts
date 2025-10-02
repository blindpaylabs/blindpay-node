import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateBusinessWithStandardKYBResponse,
    CreateIndividualWithEnhancedKYCResponse,
    CreateIndividualWithStandardKYCResponse,
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
                    id: "re_Euw7HN4OdxPn",
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
                    email: "bernardo@gmail.com",
                    tax_id: "12345678900",
                    address_line_1: "Av. Paulista, 1000",
                    address_line_2: "Apto 101",
                    city: "São Paulo",
                    state_province_region: "SP",
                    country: "BR",
                    postal_code: "01310-100",
                    ip_address: "127.0.0.1",
                    image_url: "https://example.com/image.png",
                    phone_number: "+5511987654321",
                    proof_of_address_doc_type: "UTILITY_BILL",
                    proof_of_address_doc_file: "https://example.com/image.png",
                    first_name: "Bernardo",
                    last_name: "Simonassi",
                    date_of_birth: "1998-02-02T00:00:00.000Z",
                    id_doc_country: "BR",
                    id_doc_type: "PASSPORT",
                    id_doc_front_file: "https://example.com/image.png",
                    id_doc_back_file: "https://example.com/image.png",
                    aiprise_validation_key: "",
                    instance_id: "in_000000000000",
                    tos_id: "to_3ZZhllJkvo5Z",
                    created_at: "2021-01-01T00:00:00.000Z",
                    updated_at: "2021-01-01T00:00:00.000Z",
                    limit: {
                        per_transaction: 100000,
                        daily: 200000,
                        monthly: 1000000,
                    },
                },
                {
                    id: "re_YuaMcI2B8zbQ",
                    type: "individual",
                    kyc_type: "enhanced",
                    kyc_status: "approved",
                    kyc_warnings: null,
                    email: "alice.johnson@example.com",
                    tax_id: "98765432100",
                    address_line_1: "123 Main St",
                    address_line_2: null,
                    city: "New York",
                    state_province_region: "NY",
                    country: "US",
                    postal_code: "10001",
                    ip_address: "192.168.1.1",
                    image_url: null,
                    phone_number: "+15555555555",
                    proof_of_address_doc_type: "BANK_STATEMENT",
                    proof_of_address_doc_file: "https://example.com/image.png",
                    first_name: "Alice",
                    last_name: "Johnson",
                    date_of_birth: "1990-05-10T00:00:00.000Z",
                    id_doc_country: "US",
                    id_doc_type: "PASSPORT",
                    id_doc_front_file: "https://example.com/image.png",
                    id_doc_back_file: null,
                    aiprise_validation_key: "enhanced-key",
                    instance_id: "in_000000000001",
                    source_of_funds_doc_type: "salary",
                    source_of_funds_doc_file: "https://example.com/image.png",
                    individual_holding_doc_front_file: "https://example.com/image.png",
                    purpose_of_transactions: "investment_purposes",
                    purpose_of_transactions_explanation: "Investing in stocks",
                    tos_id: "to_nppX66ntvtHs",
                    created_at: "2022-02-02T00:00:00.000Z",
                    updated_at: "2022-02-02T00:00:00.000Z",
                    limit: {
                        per_transaction: 50000,
                        daily: 100000,
                        monthly: 500000,
                    },
                },
                {
                    id: "re_IOxAUL24LG7P",
                    type: "business",
                    kyc_type: "standard",
                    kyc_status: "pending",
                    kyc_warnings: null,
                    email: "business@example.com",
                    tax_id: "20096178000195",
                    address_line_1: "1 King St W",
                    address_line_2: "Suite 100",
                    city: "Toronto",
                    state_province_region: "ON",
                    country: "CA",
                    postal_code: "M5H 1A1",
                    ip_address: null,
                    image_url: null,
                    phone_number: "+14165555555",
                    proof_of_address_doc_type: "UTILITY_BILL",
                    proof_of_address_doc_file: "https://example.com/image.png",
                    legal_name: "Business Corp",
                    alternate_name: "BizCo",
                    formation_date: "2010-01-01T00:00:00.000Z",
                    website: "https://businesscorp.com",
                    owners: [
                        {
                            role: "beneficial_owner",
                            first_name: "Carlos",
                            last_name: "Silva",
                            date_of_birth: "1995-05-15T00:00:00.000Z",
                            tax_id: "12345678901",
                            address_line_1: "Rua Augusta, 1500",
                            address_line_2: null,
                            city: "São Paulo",
                            state_province_region: "SP",
                            country: "BR",
                            postal_code: "01304-001",
                            id_doc_country: "BR",
                            id_doc_type: "PASSPORT",
                            id_doc_front_file: "https://example.com/image.png",
                            id_doc_back_file: "https://example.com/image.png",
                            proof_of_address_doc_type: "UTILITY_BILL",
                            proof_of_address_doc_file: "https://example.com/image.png",
                            id: "ub_000000000000",
                            instance_id: "in_000000000000",
                            receiver_id: "re_IOxAUL24LG7P",
                        },
                    ],
                    incorporation_doc_file: "https://example.com/image.png",
                    proof_of_ownership_doc_file: "https://example.com/image.png",
                    external_id: null,
                    instance_id: "in_000000000002",
                    tos_id: "to_nppX66ntvtHs",
                    aiprise_validation_key: "",
                    created_at: "2015-03-15T00:00:00.000Z",
                    updated_at: "2015-03-15T00:00:00.000Z",
                    limit: {
                        per_transaction: 200000,
                        daily: 400000,
                        monthly: 2000000,
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
        it("should create an individual receiver with standard KYC", async () => {
            const mockedReceiver: CreateIndividualWithStandardKYCResponse = {
                id: "re_Euw7HN4OdxPn",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedReceiver), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.createIndividualWithStandardKYC({
                email: "bernardo.simonassi@gmail.com",
                tax_id: "12345678900",
                address_line_1: "Av. Paulista, 1000",
                address_line_2: "Apto 101",
                city: "São Paulo",
                state_province_region: "SP",
                country: "BR",
                postal_code: "01310-100",
                first_name: "Bernardo",
                last_name: "Simonassi",
                date_of_birth: "1998-02-02T00:00:00.000Z",
                id_doc_country: "BR",
                id_doc_type: "PASSPORT",
                id_doc_front_file: "https://example.com/image.png",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                tos_id: "to_tPiz4bM2nh5K",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ id: "re_Euw7HN4OdxPn" });
        });

        it("should create an individual receiver with enhanced KYC", async () => {
            const mockedReceiver: CreateIndividualWithEnhancedKYCResponse = {
                id: "re_YuaMcI2B8zbQ",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedReceiver), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.createIndividualWithEnhancedKYC({
                email: "bernardo.simonassi@gmail.com",
                tax_id: "12345678900",
                address_line_1: "Av. Paulista, 1000",
                address_line_2: "Apto 101",
                city: "São Paulo",
                state_province_region: "SP",
                country: "BR",
                postal_code: "01310-100",
                first_name: "Bernardo",
                last_name: "Simonassi",
                date_of_birth: "1998-02-02T00:00:00.000Z",
                id_doc_country: "BR",
                id_doc_type: "PASSPORT",
                id_doc_front_file: "https://example.com/image.png",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                individual_holding_doc_front_file: "https://example.com/image.png",
                purpose_of_transactions: "personal_or_living_expenses",
                source_of_funds_doc_type: "savings",
                source_of_funds_doc_file: "https://example.com/image.png",
                tos_id: "to_3ZZhllJkvo5Z",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ id: "re_YuaMcI2B8zbQ" });
        });

        it("should create a business receiver with standard KYB", async () => {
            const mockedReceiver: CreateBusinessWithStandardKYBResponse = {
                id: "re_IOxAUL24LG7P",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedReceiver), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.createBusinessWithStandardKYB({
                email: "contato@empresa.com.br",
                tax_id: "20096178000195",
                address_line_1: "Av. Brigadeiro Faria Lima, 400",
                address_line_2: "Sala 1201",
                city: "São Paulo",
                state_province_region: "SP",
                country: "BR",
                postal_code: "04538-132",
                legal_name: "Empresa Exemplo Ltda",
                alternate_name: "Exemplo",
                formation_date: "2010-05-20T00:00:00.000Z",
                incorporation_doc_file: "https://example.com/image.png",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                proof_of_ownership_doc_file: "https://example.com/image.png",
                tos_id: "to_nppX66ntvtHs",
                website: "https://site.com/",
                owners: [
                    {
                        role: "beneficial_owner",
                        first_name: "Carlos",
                        last_name: "Silva",
                        date_of_birth: "1995-05-15T00:00:00.000Z",
                        tax_id: "12345678901",
                        address_line_1: "Rua Augusta, 1500",
                        address_line_2: null,
                        city: "São Paulo",
                        state_province_region: "SP",
                        country: "BR",
                        postal_code: "01304-001",
                        id_doc_country: "BR",
                        id_doc_type: "PASSPORT",
                        id_doc_front_file: "https://example.com/image.png",
                        id_doc_back_file: "https://example.com/image.png",
                        proof_of_address_doc_type: "UTILITY_BILL",
                        proof_of_address_doc_file: "https://example.com/image.png",
                        id: "ub_000000000000",
                        instance_id: "in_000000000000",
                        receiver_id: "re_IOxAUL24LG7P",
                    },
                ],
            });

            expect(error).toBeNull();
            expect(data).toEqual({ id: "re_IOxAUL24LG7P" });
        });
    });

    describe("Get receiver", () => {
        it("should get a receiver", async () => {
            const mockedReceiver: GetReceiverResponse = {
                id: "re_YuaMcI2B8zbQ",
                type: "individual",
                kyc_type: "enhanced",
                kyc_status: "verifying",
                kyc_warnings: [
                    {
                        code: null,
                        message: null,
                        resolution_status: null,
                        warning_id: null,
                    },
                ],
                email: "bernardo.simonassi@gmail.com",
                tax_id: "12345678900",
                address_line_1: "Av. Paulista, 1000",
                address_line_2: "Apto 101",
                city: "São Paulo",
                state_province_region: "SP",
                country: "BR",
                postal_code: "01310-100",
                ip_address: "127.0.0.1",
                image_url: "https://example.com/image.png",
                phone_number: "+5511987654321",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                first_name: "Bernardo",
                last_name: "Simonassi",
                date_of_birth: "1998-02-02T00:00:00.000Z",
                id_doc_country: "BR",
                id_doc_type: "PASSPORT",
                id_doc_front_file: "https://example.com/image.png",
                id_doc_back_file: "https://example.com/image.png",
                aiprise_validation_key: "",
                source_of_funds_doc_type: "savings",
                source_of_funds_doc_file: "https://example.com/image.png",
                individual_holding_doc_front_file: "https://example.com/image.png",
                purpose_of_transactions: "personal_or_living_expenses",
                purpose_of_transactions_explanation:
                    "I am receiving salary payments from my employer",
                instance_id: "in_000000000000",
                tos_id: "to_3ZZhllJkvo5Z",
                created_at: "2021-01-01T00:00:00.000Z",
                updated_at: "2021-01-01T00:00:00.000Z",
                limit: {
                    per_transaction: 100000,
                    daily: 200000,
                    monthly: 1000000,
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedReceiver), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.get("re_YuaMcI2B8zbQ");

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
                receiver_id: "re_YuaMcI2B8zbQ",
                email: "bernardo.simonassi@gmail.com",
                tax_id: "12345678900",
                address_line_1: "Av. Paulista, 1000",
                address_line_2: "Apto 101",
                city: "São Paulo",
                state_province_region: "SP",
                country: "BR",
                postal_code: "01310-100",
                ip_address: "127.0.0.1",
                image_url: "https://example.com/image.png",
                phone_number: "+5511987654321",
                proof_of_address_doc_type: "UTILITY_BILL",
                proof_of_address_doc_file: "https://example.com/image.png",
                first_name: "Bernardo",
                last_name: "Simonassi",
                date_of_birth: "1998-02-02T00:00:00.000Z",
                id_doc_country: "BR",
                id_doc_type: "PASSPORT",
                id_doc_front_file: "https://example.com/image.png",
                id_doc_back_file: "https://example.com/image.png",
                alternate_name: "Exemplo",
                formation_date: "2010-05-20T00:00:00.000Z",
                website: "https://site.com",
                owners: [
                    {
                        id: "ub_000000000000",
                        first_name: "Carlos",
                        last_name: "Silva",
                        role: "beneficial_owner",
                        date_of_birth: "1995-05-15T00:00:00.000Z",
                        tax_id: "12345678901",
                        address_line_1: "Rua Augusta, 1500",
                        address_line_2: null,
                        city: "São Paulo",
                        state_province_region: "SP",
                        country: "BR",
                        postal_code: "01304-001",
                        id_doc_country: "BR",
                        id_doc_type: "PASSPORT",
                        id_doc_front_file: "https://example.com/image.png",
                        id_doc_back_file: "https://example.com/image.png",
                    },
                ],
                incorporation_doc_file: "https://example.com/image.png",
                proof_of_ownership_doc_file: "https://example.com/image.png",
                source_of_funds_doc_type: "savings",
                source_of_funds_doc_file: "https://example.com/image.png",
                individual_holding_doc_front_file: "https://example.com/image.png",
                purpose_of_transactions: "personal_or_living_expenses",
                purpose_of_transactions_explanation:
                    "I am receiving salary payments from my employer",
                external_id: "some-external-id",
                tos_id: "to_3ZZhllJkvo5Z",
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

            const { data, error } = await blindpay.receivers.delete("re_YuaMcI2B8zbQ");

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

            const { data, error } = await blindpay.receivers.getLimits("re_YuaMcI2B8zbQ");
            expect(error).toBeNull();
            expect(data).toEqual(mockedReceiverLimits);
        });
    });
});
