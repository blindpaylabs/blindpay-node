import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateCustodialWalletResponse,
    CustodialWallet,
    GetCustodialWalletBalanceResponse,
    GetCustodialWalletResponse,
    ListCustodialWalletsResponse,
} from "./custodial";

const mockWallet: CustodialWallet = {
    id: "wa_000000000000",
    name: "Main Wallet",
    external_id: null,
    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
    network: "polygon",
    created_at: "2025-01-01T00:00:00Z",
};

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
                receiver_id: "re_000000000000",
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
                receiver_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
        });
    });

    describe("Get custodial wallet balance", () => {
        it("should get wallet balance", async () => {
            const mockedBalance: GetCustodialWalletBalanceResponse = {
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
                receiver_id: "re_000000000000",
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
                receiver_id: "re_000000000000",
                id: "wa_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ success: true });
        });
    });
});
