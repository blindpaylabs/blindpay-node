import { afterEach, describe, expect, it } from "vitest";
import type { SuccessResponse } from "../../../types";
import { BlindPay } from "../../client";
import type { CreatePartnerFeeResponse, GetPartnerFeeResponse, ListPartnerFeesResponse } from ".";

describe("Partner fees", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

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
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedList), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.list();

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
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockPartnerFee), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.create({
                name: "Display Name",
                payout_percentage_fee: 0,
                payout_flat_fee: 0,
                payin_percentage_fee: 0,
                payin_flat_fee: 0,
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
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedFee), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.get("fe_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedFee);
        });
    });

    describe("Delete partner fee", () => {
        it("should delete a partner fee", async () => {
            const mockedResponse: SuccessResponse = { success: true };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.partnerFees.delete("fe_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
        });
    });
});
