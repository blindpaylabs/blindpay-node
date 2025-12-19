import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateVirtualAccountResponse,
    GetVirtualAccountResponse,
    ListVirtualAccountsResponse,
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
                receiver_id: "re_000000000000",
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
                receiver_id: "re_000000000000",
                banking_partner: "jpmorgan",
                blockchain_wallet_id: "bw_000000000000",
                token: "USDC",
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
                receiver_id: "re_000000000000",
                id: "va_000000000000",
                blockchain_wallet_id: "bw_000000000001",
                token: "USDT",
            });

            expect(error).toBeNull();
            expect(data).toEqual(null);
        });
    });
});
