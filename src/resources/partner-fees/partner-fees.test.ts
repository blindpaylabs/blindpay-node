import { afterEach, describe, expect, it } from "vitest";
import { Blindpay } from "../../client";
import type { CreatePartnerFeeResponse, GetPartnerFeeResponse, ListPartnerFeesResponse } from ".";

describe("Partner fees", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new Blindpay("test-key");

    describe("List partner fees", () => {
        it("should list partner fees", async () => {
            const mockedList: ListPartnerFeesResponse = [
                {
                    id: "fe_000000000000",
                    instance_id: "in_000000000000",
                    name: "Display Name",
                    payout_percentage_fee: 0,
                    payout_flat_fee: 0,
                    payin_percentage_fee: 0,
                    payin_flat_fee: 0,
                    evm_wallet_address: "0x1234567890123456789012345678901234567890",
                    stellar_wallet_address:
                        "GAB22222222222222222222222222222222222222222222222222222222222222",
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedList), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.list({
                instanceId: "in_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedList);
        });
    });

    describe("Create partner fee", () => {
        it("should create a partner fee", async () => {
            const mockPartnerFee: CreatePartnerFeeResponse = {
                id: "fe_000000000000",
                instance_id: "in_000000000000",
                name: "Display Name",
                payout_percentage_fee: 0,
                payout_flat_fee: 0,
                payin_percentage_fee: 0,
                payin_flat_fee: 0,
                evm_wallet_address: "0x1234567890123456789012345678901234567890",
                stellar_wallet_address:
                    "GAB22222222222222222222222222222222222222222222222222222222222222",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockPartnerFee), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.create({
                instanceId: "in_000000000000",
                name: "Display Name",
                payout_percentage_fee: 0,
                payout_flat_fee: 0,
                payin_percentage_fee: 0,
                payin_flat_fee: 0,
                evm_wallet_address: "0x1234567890123456789012345678901234567890",
                stellar_wallet_address:
                    "GAB22222222222222222222222222222222222222222222222222222222222222",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockPartnerFee);
        });
    });

    describe("Get partner fee", () => {
        it("should get a partner fee", async () => {
            const mockedFee: GetPartnerFeeResponse = {
                id: "fe_000000000000",
                instance_id: "in_000000000000",
                name: "Display Name",
                payout_percentage_fee: 0,
                payout_flat_fee: 0,
                payin_percentage_fee: 0,
                payin_flat_fee: 0,
                evm_wallet_address: "0x1234567890123456789012345678901234567890",
                stellar_wallet_address:
                    "GAB22222222222222222222222222222222222222222222222222222222222222",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedFee), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.get({
                instanceId: "in_000000000000",
                id: "fe_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedFee);
        });
    });

    describe("Delete partner fee", () => {
        it("should delete a partner fee", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.delete({
                instanceId: "in_000000000000",
                id: "fe_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });
});
