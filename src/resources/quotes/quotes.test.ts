import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { CreateQuoteResponse, GetFxRateResponse } from "./index";

describe("Quotes", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Create quote", () => {
        it("should create a quote", async () => {
            const mockedQuote: CreateQuoteResponse = {
                id: "qu_000000000000",
                expires_at: 1712958191,
                commercial_quotation: 495,
                blindpay_quotation: 485,
                receiver_amount: 5240,
                sender_amount: 1010,
                partner_fee_amount: 150,
                flat_fee: 50,
                contract: {
                    abi: [{}],
                    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
                    functionName: "approve",
                    blindpayContractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
                    amount: "1000000000000000000",
                    network: {
                        name: "Ethereum",
                        chainId: 1,
                    },
                },
                receiver_local_amount: 1000,
                description: "Memo code or description, only works with USD and BRL",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedQuote), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.quotes.create({
                bank_account_id: "ba_000000000000",
                currency_type: "sender",
                network: "sepolia",
                request_amount: 1000,
                token: "USDC",
                cover_fees: true,
                description: "Memo code or description, only works with USD and BRL",
                partner_fee_id: "pf_000000000000",
                transaction_document_file: null,
                transaction_document_id: null,
                transaction_document_type: "invoice",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedQuote);
        });
    });

    describe("Get FX rate", () => {
        it("should get FX rate", async () => {
            const mockedFxRate: GetFxRateResponse = {
                commercial_quotation: 495,
                blindpay_quotation: 485,
                result_amount: 1,
                instance_flat_fee: 50,
                instance_percentage_fee: 0,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedFxRate), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.quotes.getFxRate({
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
