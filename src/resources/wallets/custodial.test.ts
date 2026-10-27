import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateCustodialWalletResponse,
    CustodialWallet,
    DisableCustodialWalletYieldResponse,
    EnableCustodialWalletYieldResponse,
    GetCustodialWalletBalanceResponse,
    GetCustodialWalletDepositsResponse,
    GetCustodialWalletResponse,
    GetCustodialWalletYieldHistoryResponse,
    GetCustodialWalletYieldResponse,
    GetCustodialWalletYieldTransactionsResponse,
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
                },
                USDT: {
                    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                    id: "tok_000000000002",
                    symbol: "USDT",
                    amount: 5000,
                },
                USDB: {
                    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                    id: "tok_000000000003",
                    symbol: "USDB",
                    amount: 0,
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

    describe("Get custodial wallet yield", () => {
        it("should get wallet yield", async () => {
            const mockedYield: GetCustodialWalletYieldResponse = {
                status: "enabled",
                as_of: "2026-09-01T12:00:00Z",
                fee_bps: 1500,
                positions: [
                    {
                        token: "USDC",
                        vault: {
                            address: "0xC768c589647798a6EE01A91FdE98EF2ed046DBD6",
                            apy: 0.0342,
                        },
                        apy: null,
                        gross_amount: 1000.42,
                        fee_accrued: 1.7,
                        earning_amount: 998.72,
                        max_withdrawable: 998.72,
                        total_deposited: 950,
                        total_withdrawn: 0,
                        lifetime_earned_amount: 48.72,
                    },
                ],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedYield), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.getYield({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedYield);
            expect(fetchMock.mock.calls[0][0]).toBe(`${walletPath}/yield`);
            expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
        });
    });

    describe("Get custodial wallet yield history", () => {
        it("should get wallet yield history", async () => {
            const mockedHistory: GetCustodialWalletYieldHistoryResponse = {
                data: [
                    {
                        date: "2026-09-01",
                        token: "USDC",
                        earning_amount: 998.72,
                        earned_day: 0.09,
                        apy: 0.0291,
                    },
                ],
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedHistory), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.getYieldHistory({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
                token: "USDC",
                from: "2026-09-01",
                to: "2026-09-30",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedHistory);
            expect(fetchMock.mock.calls[0][0]).toBe(
                `${walletPath}/yield/history?token=USDC&from=2026-09-01&to=2026-09-30`
            );
            expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
        });
    });

    describe("Get custodial wallet yield transactions", () => {
        it("should list wallet yield transactions", async () => {
            const mockedTransactions: GetCustodialWalletYieldTransactionsResponse = {
                data: [
                    {
                        id: "yt_000000000000",
                        token: "USDC",
                        type: "redeem",
                        trigger: "payout",
                        reference: { type: "payout", id: "po_000000000000" },
                        status: "confirmed",
                        amount: 5000,
                        transaction_hash: null,
                        created_at: "2026-09-01T10:02:00Z",
                    },
                    {
                        id: "yt_000000000001",
                        token: "USDT",
                        type: "deposit",
                        trigger: "sweep",
                        reference: null,
                        status: "pending",
                        amount: 100,
                        transaction_hash: "0xabc",
                        created_at: "2026-09-01T10:02:00Z",
                    },
                ],
                pagination: {
                    has_more: true,
                    next_page: "yt_000000000002",
                    prev_page: "",
                },
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedTransactions), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.getYieldTransactions({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
                limit: "50",
                offset: "0",
                token: "USDC",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedTransactions);
            expect(fetchMock.mock.calls[0][0]).toBe(
                `${walletPath}/yield/transactions?limit=50&offset=0&token=USDC`
            );
            expect(fetchMock.mock.calls[0][1]?.method).toBe("GET");
        });
    });

    describe("Enable custodial wallet yield", () => {
        it("should enable yield on a wallet", async () => {
            const mockedWallet: EnableCustodialWalletYieldResponse = {
                ...mockWallet,
                yield_status: "enabled",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.enableYield({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
            expect(fetchMock.mock.calls[0][0]).toBe(`${walletPath}/yield/enable`);
            expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
            expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({});
        });
    });

    describe("Disable custodial wallet yield", () => {
        it("should disable yield on a wallet", async () => {
            const mockedWallet: DisableCustodialWalletYieldResponse = {
                ...mockWallet,
                yield_status: "disabling",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.custodial.disableYield({
                customer_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
            expect(fetchMock.mock.calls[0][0]).toBe(`${walletPath}/yield/disable`);
            expect(fetchMock.mock.calls[0][1]?.method).toBe("POST");
            expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({});
        });
    });
});
