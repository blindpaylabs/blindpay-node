import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateBlockchainWalletResponse,
    GetBlockchainWalletResponse,
    ListBlockchainWalletsResponse,
} from "./blockchain";

describe("Blockchain wallets", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("Get blockchain wallet message", () => {
        it("should get blockchain wallet message", async () => {
            const mockedMessage = { message: "random" };

            fetchMock.mockResponseOnce(JSON.stringify(mockedMessage), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } =
                await blindpay.wallets.blockchain.getWalletMessage("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedMessage);
        });
    });

    describe("List blockchain wallets", () => {
        it("should list blockchain wallets", async () => {
            const mockedWallets: ListBlockchainWalletsResponse = [
                {
                    id: "bw_000000000000",
                    name: "Wallet Display Name",
                    network: "polygon",
                    address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                    signature_tx_hash: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                    is_account_abstraction: false,
                    receiver_id: "re_000000000000",
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallets), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.list("re_000000000000");

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallets);
        });
    });

    describe("Create blockchain wallet", () => {
        it("should create a blockchain wallet", async () => {
            const mockedWallet: CreateBlockchainWalletResponse = {
                id: "bw_000000000000",
                name: "Wallet Display Name",
                network: "polygon",
                address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                signature_tx_hash: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                is_account_abstraction: false,
                receiver_id: "re_000000000000",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.create({
                receiver_id: "re_000000000000",
                name: "Wallet Display Name",
                network: "polygon",
                address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
        });
    });

    describe("Get blockchain wallet", () => {
        it("should get a blockchain wallet", async () => {
            const mockedWallet: GetBlockchainWalletResponse = {
                id: "bw_000000000000",
                name: "Wallet Display Name",
                network: "polygon",
                address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                signature_tx_hash: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                is_account_abstraction: false,
                receiver_id: "re_000000000000",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.get({
                receiver_id: "re_000000000000",
                id: "bw_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
        });
    });

    describe("Delete blockchain wallet", () => {
        it("should delete a blockchain wallet", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ data: null }), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.delete({
                receiver_id: "re_000000000000",
                id: "bw_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual({ data: null });
        });
    });
});
