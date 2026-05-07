import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateTransferQuoteResponse,
    CreateTransferResponse,
    GetTransferResponse,
    GetTransferTrackResponse,
    ListTransfersResponse,
    Transfer,
} from ".";

const mockTrackingStep = {
    step: "processing" as const,
    transaction_hash: null,
    gas_fee: null,
    completed_at: null,
    error_message: null,
};

const mockTrackingMonitoring = {
    step: "processing" as const,
    blockchain_screening: null,
    risk_score: null,
    completed_at: null,
};

const mockTransfer: Transfer = {
    id: "tr_000000000000",
    status: "processing",
    transfer_quote_id: "tq_000000000000",
    instance_id: "in_000000000000",
    tracking_transaction_monitoring: mockTrackingMonitoring,
    tracking_paymaster: mockTrackingStep,
    tracking_bridge_swap: mockTrackingStep,
    tracking_complete: mockTrackingStep,
    tracking_partner_fee: mockTrackingStep,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    wallet_id: "wa_000000000000",
    sender_token: "USDC",
    sender_amount: 10000,
    receiver_amount: 9950,
    receiver_network: "polygon",
    receiver_token: "USDC",
    receiver_wallet_address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
    partner_fee_amount: null,
    receiver_id: "re_000000000000",
    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
    network: "polygon",
};

describe("Transfers", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Create transfer quote", () => {
        it("should create a transfer quote", async () => {
            const mockedQuote: CreateTransferQuoteResponse = {
                id: "tq_000000000000",
                expires_at: 1700000000,
                commercial_quotation: 100,
                blindpay_quotation: 100,
                receiver_amount: 9950,
                sender_amount: 10000,
                partner_fee_amount: null,
                flat_fee: 50,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedQuote), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.transfers.quotes.create({
                wallet_id: "wa_000000000000",
                sender_token: "USDC",
                receiver_wallet_address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                receiver_token: "USDC",
                receiver_network: "polygon",
                request_amount: 10000,
                cover_fees: true,
                amount_reference: "sender",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedQuote);
        });
    });

    describe("Create transfer", () => {
        it("should create a transfer", async () => {
            const mockedTransfer: CreateTransferResponse = {
                id: "tr_000000000000",
                status: "processing",
                tracking_bridge_swap: mockTrackingStep,
                tracking_complete: mockTrackingStep,
                tracking_paymaster: mockTrackingStep,
                tracking_transaction_monitoring: mockTrackingMonitoring,
                tracking_partner_fee: mockTrackingStep,
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedTransfer), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.transfers.create({
                transfer_quote_id: "tq_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedTransfer);
        });
    });

    describe("List transfers", () => {
        it("should list transfers", async () => {
            const mockedTransfers: ListTransfersResponse = {
                data: [mockTransfer],
                pagination: {
                    has_more: false,
                    next_page: "",
                    prev_page: "",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedTransfers), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.transfers.list();

            expect(error).toBeNull();
            expect(data).toEqual(mockedTransfers);
        });
    });

    describe("Get transfer", () => {
        it("should get a transfer", async () => {
            const mockedTransfer: GetTransferResponse = mockTransfer;

            fetchMock.mockResponseOnce(JSON.stringify(mockedTransfer), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.transfers.get("tr_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedTransfer);
        });
    });

    describe("Get transfer track", () => {
        it("should get transfer tracking information", async () => {
            const mockedTrack: GetTransferTrackResponse = mockTransfer;

            fetchMock.mockResponseOnce(JSON.stringify(mockedTrack), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.transfers.getTrack("tr_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedTrack);
        });
    });
});
