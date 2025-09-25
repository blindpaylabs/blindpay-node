import { afterEach, describe, expect, it } from "vitest";
import { Blindpay } from "../../client";
import type { CreateVirtualAccountResponse, GetVirtualAccountResponse } from "./index";

describe("Virtual accounts", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new Blindpay("test-key");

    describe("Update virtual account", () => {
        it("should update a virtual account", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.update({
                instanceId: "in_000000000000",
                receiverId: "re_000000000000",
                blockchain_wallet_id: "bw_000000000000",
                token: "USDC",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });

    describe("Create virtual account", () => {
        it("should create a virtual account", async () => {
            const mockedVirtualAccount: CreateVirtualAccountResponse = {
                id: "va_000000000000",
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
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedVirtualAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.create({
                instanceId: "in_000000000000",
                receiverId: "re_000000000000",
                blockchain_wallet_id: "bw_000000000000",
                token: "USDC",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedVirtualAccount);
        });
    });

    describe("Get virtual account", () => {
        it("should get a virtual account", async () => {
            const mockedVirtualAccount: GetVirtualAccountResponse = {
                id: "va_000000000000",
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
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedVirtualAccount), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.virtualAccounts.get({
                instanceId: "in_000000000000",
                receiverId: "re_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedVirtualAccount);
        });
    });
});
