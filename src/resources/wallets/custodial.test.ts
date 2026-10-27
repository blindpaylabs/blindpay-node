import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateCustodialWalletResponse,
    CustodialWallet,
    GetCustodialWalletBalanceResponse,
    GetCustodialWalletDepositsResponse,
    GetCustodialWalletResponse,
    ListCustodialWalletsResponse,
} from "./custodial";

const mockWallet: CustodialWallet = {
    id: "wa_000000000000",
    name: "Main Wallet",
    external_id: null,
    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
    network: "polygon",
    yield_status: "disabled",
    created_at: "2025-01-01T00:00:00Z",
};

const walletPath =
    "https://api.blindpay.com/v1/instances/in_000000000000/customers/re_000000000000/wallets/wa_000000000000";

describe("Custodial Wallets", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Create custodial wallet", () => {
        it("should create a custodial wallet", async () => {
            const mockedWallet: CreateCustodialWalletResponse = mockWallet;

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.create({
                customer_id: "re_000000000000",
                name: "Main Wallet",
                network: "polygon",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
        });
    });

    describe("List custodial wallets", () => {
        it("should list custodial wallets", async () => {
            const mockedWallets: ListCustodialWalletsResponse = [mockWallet];

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallets), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.list("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallets);
        });
    });

    describe("Get custodial wallet", () => {
        it("should get a custodial wallet", async () => {
            const mockedWallet: GetCustodialWalletResponse = mockWallet;

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.get({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
        });
    });

    describe("Get custodial wallet balance", () => {
        it("should get wallet balance", async () => {
            const mockedBalance: GetCustodialWalletBalanceResponse = {
                USDC: {
                    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                    id: "tok_000000000001",
                    symbol: "USDC",
                    amount: 10000,
                    earning_amount: 0,
                    total_amount: 10000,
                },
                USDT: {
                    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                    id: "tok_000000000002",
                    symbol: "USDT",
                    amount: 5000,
                    earning_amount: 0,
                    total_amount: 5000,
                },
                USDB: {
                    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                    id: "tok_000000000003",
                    symbol: "USDB",
                    amount: 0,
                    earning_amount: 0,
                    total_amount: 0,
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedBalance), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.getBalance({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedBalance);
        });
    });

    describe("Delete custodial wallet", () => {
        it("should delete a custodial wallet", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.delete({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ success: true });
        });
    });

    describe("Get custodial wallet deposits", () => {
        it("should list wallet deposits with filters", async () => {
            const mockedDeposits: GetCustodialWalletDepositsResponse = {
                data: [
                    {
                        id: "wd_000000000000",
                        wallet_id: "wa_000000000000",
                        network: "tempo",
                        token: "EURC",
                        amount: 150000,
                        token_amount: "1500.000123",
                        status: "on_hold",
                        transaction_hash: "0x8f3e1b",
                        sender_address: null,
                        created_at: "2026-10-15T10:02:00Z",
                    },
                ],
                pagination: {
                    has_more: false,
                    next_page: "",
                    prev_page: "",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedDeposits), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.getDeposits({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
                limit: "10",
                token: "EURC",
                status: "on_hold",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedDeposits);
            expect(fetchMock.mock.calls[0][0]).toBe(
                `${walletPath}/deposits?limit=10&token=EURC&status=on_hold`
            );
            expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
        });

        it("should list wallet deposits without filters", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ data: [], pagination: { has_more: false } }),
                { headers: { "Content-Type": "application/json" } }
            );

            const { error } = await blindpay.wallets.custodial.getDeposits({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(fetchMock.mock.calls[0][0]).toBe(`${walletPath}/deposits`);
        });
    });
});
