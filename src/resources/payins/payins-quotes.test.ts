import { afterEach, describe, expect, it } from "vitest";
import { Blindpay } from "../../client";
import type { CreatePayinQuoteResponse, GetPayinFxRateResponse } from "./quotes";

describe("Payin quotes", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new Blindpay("test-key");

    describe("Create payin quote", () => {
        it("should create a payin quote", async () => {
            const mockedPayinQuote: CreatePayinQuoteResponse = {
                id: "qu_000000000000",
                expires_at: 1712958191,
                commercial_quotation: 495,
                blindpay_quotation: 505,
                receiver_amount: 1010,
                sender_amount: 5240,
                partner_fee_amount: 150,
                flat_fee: 50,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedPayinQuote), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payins.quotes.create({
                instanceId: "in_000000000000",
                blockchain_wallet_id: "bw_000000000000",
                currency_type: "sender",
                cover_fees: true,
                request_amount: 1000,
                payment_method: "pix",
                token: "USDC",
                partner_fee_id: "pf_000000000000",
                payer_rules: {
                    pix_allowed_tax_ids: ["149.476.037-68"],
                },
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedPayinQuote);
        });
    });

    describe("Get FX rate", () => {
        it("should get the FX rate", async () => {
            const mockedFxRate: GetPayinFxRateResponse = {
                commercial_quotation: 495,
                blindpay_quotation: 505,
                result_amount: 1,
                instance_flat_fee: 50,
                instance_percentage_fee: 0,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedFxRate), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.payins.quotes.getFxRate({
                instanceId: "in_000000000000",
                currency_type: "sender",
                from: "USD",
                to: "BRL",
                request_amount: 1000,
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedFxRate);
        });
    });
});
