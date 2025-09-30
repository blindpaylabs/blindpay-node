import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateAchResponse,
    CreateArgentinaTransfersResponse,
    CreateColombiaAchResponse,
    CreateInternationalSwiftResponse,
    CreatePixResponse,
    CreateRtpResponse,
    CreateSpeiResponse,
    CreateWireResponse,
    GetBankAccountResponse,
    ListBankAccountsResponse,
} from ".";

describe("Bank accounts", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Create pix bank account", () => {
        it("should create a pix bank account", async () => {
            const mockedPixAccount: CreatePixResponse = {
                id: "ba_000000000000",
                type: "pix",
                name: "PIX Account",
                pix_key: "14947677768",
                created_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPixAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createPix({
                receiver_id: "re_000000000000",
                name: "PIX Account",
                pix_key: "14947677768",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedPixAccount);
        });
    });

    describe("Create argentina transfers bank account", () => {
        it("should create an argentina transfers bank account", async () => {
            const mockedArgentinaTransfersAccount: CreateArgentinaTransfersResponse = {
                id: "ba_000000000000",
                type: "transfers_bitso",
                name: "Argentina Transfers Account",
                beneficiary_name: "Individual full name or business name",
                transfers_type: "CVU",
                transfers_account: "BM123123123123",
                created_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedArgentinaTransfersAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createArgentinaTransfers({
                receiver_id: "re_000000000000",
                name: "Argentina Transfers Account",
                beneficiary_name: "Individual full name or business name",
                transfers_type: "CVU",
                transfers_account: "BM123123123123",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedArgentinaTransfersAccount);
        });
    });

    describe("Create spei bank account", () => {
        it("should create a spei bank account", async () => {
            const mockedSpeiAccount: CreateSpeiResponse = {
                id: "ba_000000000000",
                type: "spei_bitso",
                name: "SPEI Account",
                beneficiary_name: "Individual full name or business name",
                spei_protocol: "clabe",
                spei_institution_code: "40002",
                spei_clabe: "5482347403740546",
                created_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedSpeiAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createSpei({
                receiver_id: "re_000000000000",
                name: "SPEI Account",
                beneficiary_name: "Individual full name or business name",
                spei_protocol: "clabe",
                spei_institution_code: "40002",
                spei_clabe: "5482347403740546",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedSpeiAccount);
        });
    });

    describe("Create colombia ach bank account", () => {
        it("should create a colombia ach bank account", async () => {
            const mockedColombiaAchAccount: CreateColombiaAchResponse = {
                id: "ba_000000000000",
                type: "ach_cop_bitso",
                name: "Colombia ACH Account",
                account_type: "checking",
                ach_cop_beneficiary_first_name: "Fernando",
                ach_cop_beneficiary_last_name: "Guzman Alarcón",
                ach_cop_document_id: "1661105408",
                ach_cop_document_type: "CC",
                ach_cop_email: "fernando.guzman@gmail.com",
                ach_cop_bank_code: "051",
                ach_cop_bank_account: "12345678",
                created_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedColombiaAchAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createColombiaAch({
                receiver_id: "re_000000000000",
                name: "Colombia ACH Account",
                account_type: "checking",
                ach_cop_beneficiary_first_name: "Fernando",
                ach_cop_beneficiary_last_name: "Guzman Alarcón",
                ach_cop_document_id: "1661105408",
                ach_cop_document_type: "CC",
                ach_cop_email: "fernando.guzman@gmail.com",
                ach_cop_bank_code: "051",
                ach_cop_bank_account: "12345678",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedColombiaAchAccount);
        });
    });

    describe("Create ach bank account", () => {
        it("should create an ach bank account", async () => {
            const mockedAchAccount: CreateAchResponse = {
                id: "ba_000000000000",
                type: "ach",
                name: "ACH Account",
                beneficiary_name: "Individual full name or business name",
                routing_number: "012345678",
                account_number: "1001001234",
                account_type: "checking",
                account_class: "individual",
                address_line_1: null,
                address_line_2: null,
                city: null,
                state_province_region: null,
                country: null,
                postal_code: null,
                ach_cop_beneficiary_first_name: null,
                ach_cop_beneficiary_last_name: null,
                ach_cop_document_id: null,
                ach_cop_document_type: null,
                ach_cop_email: null,
                ach_cop_bank_code: null,
                ach_cop_bank_account: null,
                created_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedAchAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createAch({
                receiver_id: "re_000000000000",
                name: "ACH Account",
                account_class: "individual",
                account_number: "1001001234",
                account_type: "checking",
                beneficiary_name: "Individual full name or business name",
                routing_number: "012345678",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedAchAccount);
        });
    });

    describe("Create wire bank account", () => {
        it("should create a wire bank account", async () => {
            const mockedWireAccount: CreateWireResponse = {
                id: "ba_000000000000",
                type: "wire",
                name: "Wire Account",
                beneficiary_name: "Individual full name or business name",
                routing_number: "012345678",
                account_number: "1001001234",
                address_line_1: "Address line 1",
                address_line_2: "Address line 2",
                city: "City",
                state_province_region: "State/Province/Region",
                country: "US",
                postal_code: "Postal code",
                created_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWireAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createWire({
                receiver_id: "re_000000000000",
                name: "Wire Account",
                account_number: "1001001234",
                beneficiary_name: "Individual full name or business name",
                routing_number: "012345678",
                address_line_1: "Address line 1",
                address_line_2: "Address line 2",
                city: "City",
                state_province_region: "State/Province/Region",
                country: "US",
                postal_code: "Postal code",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWireAccount);
        });
    });

    describe("Create international swift bank account", () => {
        it("should create an international swift bank account", async () => {
            const mockedInternationalSwiftAccount: CreateInternationalSwiftResponse = {
                id: "ba_000000000000",
                type: "international_swift",
                name: "International Swift Account",
                beneficiary_name: null,
                address_line_1: null,
                address_line_2: null,
                city: null,
                state_province_region: null,
                country: null,
                postal_code: null,
                swift_code_bic: "123456789",
                swift_account_holder_name: "John Doe",
                swift_account_number_iban: "123456789",
                swift_beneficiary_address_line_1:
                    "123 Main Street, Suite 100, Downtown District, City Center CP 12345",
                swift_beneficiary_address_line_2: null,
                swift_beneficiary_country: "MX",
                swift_beneficiary_city: "City",
                swift_beneficiary_state_province_region: "District",
                swift_beneficiary_postal_code: "11530",
                swift_bank_name: "Banco Regional SA",
                swift_bank_address_line_1:
                    "123 Main Street, Suite 100, Downtown District, City Center CP 12345",
                swift_bank_address_line_2: null,
                swift_bank_country: "MX",
                swift_bank_city: "City",
                swift_bank_state_province_region: "District",
                swift_bank_postal_code: "11530",
                swift_intermediary_bank_swift_code_bic: null,
                swift_intermediary_bank_account_number_iban: null,
                swift_intermediary_bank_name: null,
                swift_intermediary_bank_country: null,
                created_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedInternationalSwiftAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createInternationalSwift({
                receiver_id: "re_000000000000",
                name: "International Swift Account",
                swift_account_holder_name: "John Doe",
                swift_account_number_iban: "123456789",
                swift_bank_address_line_1:
                    "123 Main Street, Suite 100, Downtown District, City Center CP 12345",
                swift_bank_city: "City",
                swift_bank_country: "MX",
                swift_bank_name: "Banco Regional SA",
                swift_bank_postal_code: "11530",
                swift_bank_state_province_region: "District",
                swift_beneficiary_address_line_1:
                    "123 Main Street, Suite 100, Downtown District, City Center CP 12345",
                swift_beneficiary_city: "City",
                swift_beneficiary_country: "MX",
                swift_beneficiary_postal_code: "11530",
                swift_beneficiary_state_province_region: "District",
                swift_code_bic: "123456789",
                swift_intermediary_bank_account_number_iban: null,
                swift_intermediary_bank_country: null,
                swift_intermediary_bank_name: null,
                swift_intermediary_bank_swift_code_bic: null,
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedInternationalSwiftAccount);
        });
    });

    describe("Create RTP bank account", () => {
        it("should create an RTP bank account", async () => {
            const mockedRtpAccount: CreateRtpResponse = {
                id: "ba_JW5ZtlKMlgS1",
                type: "rtp",
                name: "John Doe RTP",
                beneficiary_name: "John Doe",
                routing_number: "121000358",
                account_number: "325203027578",
                address_line_1: "Street of the fools",
                address_line_2: null,
                city: "Fools City",
                state_province_region: "FL",
                country: "US",
                postal_code: "22599",
                created_at: "2025-09-30T04:23:30.823Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedRtpAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.createRtp({
                receiver_id: "re_000000000000",
                name: "John Doe RTP",
                beneficiary_name: "John Doe",
                routing_number: "121000358",
                account_number: "325203027578",
                address_line_1: "Street of the fools",
                city: "Fools City",
                state_province_region: "FL",
                country: "US",
                postal_code: "22599",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedRtpAccount);
        });
    });

    describe("Get bank account", () => {
        it("should get a bank account", async () => {
            const mockedBankAccount: GetBankAccountResponse = {
                id: "ba_000000000000",
                receiver_id: "rcv_123",
                account_holder_name: "Individual full name or business name",
                account_number: "1001001234",
                routing_number: "012345678",
                account_type: "checking",
                bank_name: "Bank Name",
                swift_code: "123456789",
                iban: null,
                is_primary: false,
                created_at: "2021-01-01T00:00:00Z",
                updated_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedBankAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.get({
                receiver_id: "re_000000000000",
                id: "ba_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedBankAccount);
        });
    });

    describe("List bank accounts", () => {
        it("should list bank accounts", async () => {
            const mockedBankAccounts: ListBankAccountsResponse = {
                data: [
                    {
                        id: "ba_000000000000",
                        type: "wire",
                        name: "Bank Account Name",
                        pix_key: "14947677768",
                        beneficiary_name: "Individual full name or business name",
                        routing_number: "012345678",
                        account_number: "1001001234",
                        account_type: "checking",
                        account_class: "individual",
                        address_line_1: "Address line 1",
                        address_line_2: "Address line 2",
                        city: "City",
                        state_province_region: "State/Province/Region",
                        country: "US",
                        postal_code: "Postal code",
                        spei_protocol: "clabe",
                        spei_institution_code: "40002",
                        spei_clabe: "5482347403740546",
                        transfers_type: "CVU",
                        transfers_account: "BM123123123123",
                        ach_cop_beneficiary_first_name: "Fernando",
                        ach_cop_beneficiary_last_name: "Guzman Alarcón",
                        ach_cop_document_id: "1661105408",
                        ach_cop_document_type: "CC",
                        ach_cop_email: "fernando.guzman@gmail.com",
                        ach_cop_bank_code: "051",
                        ach_cop_bank_account: "12345678",
                        swift_code_bic: "123456789",
                        swift_account_holder_name: "John Doe",
                        swift_account_number_iban: "123456789",
                        swift_beneficiary_address_line_1:
                            "123 Main Street, Suite 100, Downtown District, City Center CP 12345",
                        swift_beneficiary_address_line_2:
                            "456 Oak Avenue, Building 7, Financial District, Business Center CP 54321",
                        swift_beneficiary_country: "MX",
                        swift_beneficiary_city: "City",
                        swift_beneficiary_state_province_region: "District",
                        swift_beneficiary_postal_code: "11530",
                        swift_bank_name: "Banco Regional SA",
                        swift_bank_address_line_1:
                            "123 Main Street, Suite 100, Downtown District, City Center CP 12345",
                        swift_bank_address_line_2:
                            "456 Oak Avenue, Building 7, Financial District, Business Center CP 54321",
                        swift_bank_country: "MX",
                        swift_bank_city: "City",
                        swift_bank_state_province_region: "District",
                        swift_bank_postal_code: "11530",
                        swift_intermediary_bank_swift_code_bic: "AEIBARB1",
                        swift_intermediary_bank_account_number_iban: "123456789",
                        swift_intermediary_bank_name: "Banco Regional SA",
                        swift_intermediary_bank_country: "US",
                        tron_wallet_hash: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
                        offramp_wallets: [
                            {
                                address: "TALJN9zTTEL9TVBb4WuTt6wLvPqJZr3hvb",
                                id: "ow_000000000000",
                                network: "tron",
                                external_id: "your_external_id",
                            },
                        ],
                        created_at: "2021-01-01T00:00:00Z",
                    },
                ],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedBankAccounts), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.list("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedBankAccounts);
        });
    });

    describe("Delete bank account", () => {
        it("should delete a bank account", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.receivers.bankAccounts.delete({
                receiver_id: "re_000000000000",
                id: "ba_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });
});
