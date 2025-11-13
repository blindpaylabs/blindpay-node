import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type {
    CreateAssetTrustlineResponse,
    CreateBlockchainWalletResponse,
    GetBlockchainWalletResponse,
    ListBlockchainWalletsResponse,
    MintUsdbSolanaResponse,
    PrepareSolanaDelegationTransactionResponse,
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

    describe("Create blockchain wallet with address", () => {
        it("should create a blockchain wallet with address (account abstraction)", async () => {
            const mockedWallet: CreateBlockchainWalletResponse = {
                id: "bw_000000000000",
                name: "Wallet Display Name",
                network: "polygon",
                address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
                signature_tx_hash: undefined,
                is_account_abstraction: true,
                receiver_id: "re_000000000000",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.createWithAddress({
                receiver_id: "re_000000000000",
                name: "Wallet Display Name",
                network: "polygon",
                address: "0xDD6a3aD0949396e57C7738ba8FC1A46A5a1C372C",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedWallet);
        });
    });

    describe("Create blockchain wallet with hash", () => {
        it("should create a blockchain wallet with hash (without account abstraction)", async () => {
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

            const { data, error } = await blindpay.wallets.blockchain.createWithHash({
                receiver_id: "re_000000000000",
                name: "Wallet Display Name",
                network: "polygon",
                signature_tx_hash: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
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

    describe("Create asset trustline", () => {
        it("should create asset trustline", async () => {
            const mockedResponse: CreateAssetTrustlineResponse = {
                xdr: "AAAAAgAAAABqVFqpZzXx+KxRjXXFGO3sKwHCEYdHsWxDRrJTLGPDowAAAGQABVECAAAAAQAAAAEAAAAAAAAAAAAAAABmWFbUAAAAAAAAAAEAAAAAAAAABgAAAAFVU0RCAAAAAABbjPEfrLNLCLjNQyaWWgTeFn4tnbFnNd9FTJ3HgkLUCwAAAAAAAAAAAAAAAAAAAAE=",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.createAssetTrustline(
                "GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B"
            );

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
        });
    });

    describe("Mint USDB Stellar", () => {
        it("should mint usdb on stellar", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({}), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.mintUsdbStellar({
                address: "GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B",
                amount: "1000000",
                signedXdr:
                    "AAAAAgAAAABqVFqpZzXx+KxRjXXFGO3sKwHCEYdHsWxDRrJTLGPDowAAAGQABVECAAAAAQAAAAEAAAAAAAAAAAAAAABmWFbUAAAAAAAAAAEAAAAAAAAABgAAAAFVU0RCAAAAAABbjPEfrLNLCLjNQyaWWgTeFn4tnbFnNd9FTJ3HgkLUCwAAAAAAAAAAAAAAAAAAAAE=",
            });

            expect(error).toBeNull();
            expect(data).toBeDefined();
        });
    });

    describe("Mint USDB Solana", () => {
        it("should mint usdb on solana", async () => {
            const mockedResponse: MintUsdbSolanaResponse = {
                success: true,
                signature:
                    "4wceVEQeJG4vpS4k2o1dHU5cFWeWTQU8iaCEpRaV5KkqSxPfbdAc8hzXa7nNYG6rvqgAmDkzBycbcXkKKAeK8Jtu",
                error: "",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.blockchain.mintUsdbSolana({
                address: "7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5",
                amount: "1000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
        });
    });

    describe("Prepare Solana delegation transaction", () => {
        it("should prepare a solana delegation transaction", async () => {
            const mockedResponse: PrepareSolanaDelegationTransactionResponse = {
                success: true,
                transaction:
                    "AAGBf4K95Gp5i6f0BAEYAgABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIw==",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedResponse), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } =
                await blindpay.wallets.blockchain.prepareSolanaDelegationTransaction({
                    token_address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                    amount: "1000000",
                    owner_address: "7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5",
                });

            expect(error).toBeNull();
            expect(data).toEqual(mockedResponse);
        });
    });
});
