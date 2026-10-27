import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateVirtualAccountResponse,
    GetVirtualAccountResponse,
    ListVirtualAccountsResponse,
    SimulateBrebDepositResponse,
    SimulateSpeiDepositResponse,
} from "./index";

describe("Virtual accounts", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("List virtual accounts", () => {
        it("should list virtual accounts", async () => {
            const mockedVirtualAccounts: ListVirtualAccountsResponse = [
                {
                    id: "va_000000000000",
                    banking_partner: "jpmorgan",
                    kyc_status: "approved",
                    us: {
                        ach: {
                            routing_number: "123456789",
                            account_number: "123456789",
                        },
                        wire: {
                            routing_number: "123456789",
                            account_number: "123456789",
                        },
                        rtp: {
                            routing_number: "123456789",
                            account_number: "123456789",
                        },
                        swift_bic_code: "CHASUS33",
                        account_type: "Business checking",
                        beneficiary: {
                            name: "Receiver Name",
                            address_line_1: "8 The Green, #19364",
                            address_line_2: "Dover, DE 19901",
                        },
                        receiving_bank: {
                            name: "JPMorgan Chase",
                            address_line_1: "270 Park Ave",
                            address_line_2: "New York, NY, 10017-2070",
                        },
                    },
                    token: "USDC",
                    blockchain_wallet_id: "bw_000000000000",
                    blockchain_wallet: {
                        network: "base",
                        address: "0x1234567890123456789012345678901234567890",
                    },
                },
                {
                    id: "va_000000000001",
                    banking_partner: "citi",
                    kyc_status: "approved",
                    us: {
                        ach: {
                            routing_number: "123456789",
                            account_number: "123456789",
                        },
                        wire: {
                            routing_number: "123456789",
                            account_number: "123456789",
                        },
                        rtp: {
                            routing_number: "123456789",
                            account_number: "123456789",
                        },
                        swift_bic_code: "CHASUS33",
                        account_type: "Business checking",
                        beneficiary: {
                            name: "Receiver Name",
                            address_line_1: "8 The Green, #19364",
                            address_line_2: "Dover, DE 19901",
                        },
                        receiving_bank: {
                            name: "JPMorgan Chase",
                            address_line_1: "270 Park Ave",
                            address_line_2: "New York, NY, 10017-2070",
                        },
                    },
                    token: "USDC",
                    blockchain_wallet_id: "bw_000000000000",
                    blockchain_wallet: null,
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedVirtualAccounts), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.list("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedVirtualAccounts);
        });
    });

    describe("Get virtual account", () => {
        it("should get a virtual account by id", async () => {
            const mockedVirtualAccount: GetVirtualAccountResponse = {
                id: "va_000000000000",
                banking_partner: "jpmorgan",
                kyc_status: "approved",
                us: {
                    ach: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    wire: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    rtp: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    swift_bic_code: "CHASUS33",
                    account_type: "Business checking",
                    beneficiary: {
                        name: "Receiver Name",
                        address_line_1: "8 The Green, #19364",
                        address_line_2: "Dover, DE 19901",
                    },
                    receiving_bank: {
                        name: "JPMorgan Chase",
                        address_line_1: "270 Park Ave",
                        address_line_2: "New York, NY, 10017-2070",
                    },
                },
                token: "USDC",
                blockchain_wallet_id: "bw_000000000000",
                blockchain_wallet: {
                    network: "base",
                    address: "0x1234567890123456789012345678901234567890",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedVirtualAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.get({
                customer_id: "re_000000000000",
                id: "va_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedVirtualAccount);
        });
    });

    describe("Create virtual account", () => {
        it("should create a virtual account", async () => {
            const mockedVirtualAccount: CreateVirtualAccountResponse = {
                id: "va_000000000000",
                banking_partner: "jpmorgan",
                kyc_status: "approved",
                us: {
                    ach: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    wire: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    rtp: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    swift_bic_code: "CHASUS33",
                    account_type: "Business checking",
                    beneficiary: {
                        name: "Receiver Name",
                        address_line_1: "8 The Green, #19364",
                        address_line_2: "Dover, DE 19901",
                    },
                    receiving_bank: {
                        name: "JPMorgan Chase",
                        address_line_1: "270 Park Ave",
                        address_line_2: "New York, NY, 10017-2070",
                    },
                },
                token: "USDC",
                blockchain_wallet_id: "bw_000000000000",
                blockchain_wallet: {
                    network: "base",
                    address: "0x1234567890123456789012345678901234567890",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedVirtualAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.create({
                customer_id: "re_000000000000",
                banking_partner: "jpmorgan",
                blockchain_wallet_id: "bw_000000000000",
                token: "USDC",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedVirtualAccount);
        });
    });

    describe("Create virtual account with cfsb banking partner", () => {
        it("should create a virtual account with cfsb and sole proprietor docs", async () => {
            const mockedVirtualAccount: CreateVirtualAccountResponse = {
                id: "va_000000000002",
                banking_partner: "cfsb",
                kyc_status: "verifying",
                us: {
                    ach: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    wire: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    rtp: {
                        routing_number: "123456789",
                        account_number: "123456789",
                    },
                    swift_bic_code: "TCCLGB3L",
                    swift_account_number: "GB50TCCL04140449730892",
                    account_type: "Business checking",
                    beneficiary: {
                        name: "Receiver Name",
                        address_line_1: "8 The Green, #19364",
                        address_line_2: "Dover, DE 19901",
                    },
                    receiving_bank: {
                        name: "CFSB",
                        address_line_1: "100 Main St",
                        address_line_2: "Suite 200",
                    },
                    swift_receiving_bank: {
                        name: "CFSB International",
                        address_line_1: "100 Main St",
                        address_line_2: null,
                    },
                },
                token: "USDC",
                blockchain_wallet_id: "bw_000000000000",
                blockchain_wallet: {
                    network: "base",
                    address: "0x1234567890123456789012345678901234567890",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedVirtualAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.create({
                customer_id: "re_000000000000",
                banking_partner: "cfsb",
                blockchain_wallet_id: "bw_000000000000",
                token: "USDC",
                sole_proprietor_doc_type: "master_service_agreement",
                sole_proprietor_doc_file: "https://example.com/document.pdf",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedVirtualAccount);
        });
    });

    describe("Update virtual account", () => {
        it("should update a virtual account", async () => {
            fetchMock.mockResponseOnce(JSON.stringify(null), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.update({
                customer_id: "re_000000000000",
                id: "va_000000000000",
                blockchain_wallet_id: "bw_000000000001",
                token: "USDT",
            });

            expect(error).toBeNull();
            expect(data).toEqual(null);
        });
    });

    describe("Simulate SPEI deposit", () => {
        it("should simulate a SPEI deposit", async () => {
            const mockedResponse: SimulateSpeiDepositResponse = { success: true };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.simulateSpeiDeposit({
                customer_id: "re_000000000000",
                id: "va_000000000000",
                amount: 1000000,
                sender_name: "Juan Perez",
                sender_clabe: "012180001234567890",
                sender_rfc_curp: "PEPJ800101ABC",
                deposit_id: null,
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toContain(
                "/instances/in_000000000000/customers/re_000000000000/virtual-accounts/va_000000000000/simulate-spei-deposit"
            );
            expect(init?.method).toBe("POST");
            expect(JSON.parse(init?.body as string)).toEqual({
                amount: 1000000,
                sender_name: "Juan Perez",
                sender_clabe: "012180001234567890",
                sender_rfc_curp: "PEPJ800101ABC",
                deposit_id: null,
            });
        });
    });

    describe("Simulate Bre-B deposit", () => {
        it("should simulate a Bre-B deposit", async () => {
            const mockedResponse: SimulateBrebDepositResponse = { success: true };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.simulateBrebDeposit({
                customer_id: "re_000000000000",
                id: "va_000000000000",
                amount: 5000000,
                sender_name: "Maria Gomez",
                sender_document_type: "CC",
                sender_document_id: "1234567890",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);

            const [url, init] = fetchMock.mock.calls[0];
            expect(url).toContain(
                "/instances/in_000000000000/customers/re_000000000000/virtual-accounts/va_000000000000/simulate-breb-deposit"
            );
            expect(init?.method).toBe("POST");
            expect(JSON.parse(init?.body as string)).toEqual({
                amount: 5000000,
                sender_name: "Maria Gomez",
                sender_document_type: "CC",
                sender_document_id: "1234567890",
            });
        });
    });
});
