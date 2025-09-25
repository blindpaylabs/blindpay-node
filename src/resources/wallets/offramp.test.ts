import { afterEach, describe, expect, it } from "vitest";
import { Blindpay } from "../../client";

describe("Offramp wallets", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new Blindpay("test-key");

    describe("List offramp wallets", () => {
        it("should list offramp wallets", async () => {
            const mockedOfframpWallets = [
                {
                    id: "ow_000000000000",
                    external_id: "your_external_id",
                    instance_id: "in_000000000000",
                    receiver_id: "re_000000000000",
                    bank_account_id: "ba_000000000000",
                    network: "tron",
                    address: "TALJN9zTTEL9TVBb4WuTt6wLvPqJZr3hvb",
                    created_at: "2021-01-01T00:00:00Z",
                    updated_at: "2021-01-01T00:00:00Z",
                },
            ];

            fetchMock.mockResponseOnce(JSON.stringify(mockedOfframpWallets), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.offramp.list({
                instanceId: "in_000000000000",
                receiverId: "re_000000000000",
                bankAccountId: "ba_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedOfframpWallets);
        });
    });

    describe("Create offramp wallet", () => {
        it("should create an offramp wallet", async () => {
            const mockedOfframpWallet = {
                id: "ow_000000000000",
                external_id: "your_external_id",
                network: "tron",
                address: "TALJN9zTTEL9TVBb4WuTt6wLvPqJZr3hvb",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedOfframpWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.offramp.create({
                instanceId: "in_000000000000",
                external_id: "your_external_id",
                network: "tron",
                receiverId: "re_000000000000",
                bankAccountId: "ba_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedOfframpWallet);
        });
    });

    describe("Get offramp wallet", () => {
        it("should get an offramp wallet", async () => {
            const mockedOfframpWallet = {
                id: "ow_000000000000",
                external_id: "your_external_id",
                instance_id: "in_000000000000",
                receiver_id: "re_000000000000",
                bank_account_id: "ba_000000000000",
                network: "tron",
                address: "TALJN9zTTEL9TVBb4WuTt6wLvPqJZr3hvb",
                created_at: "2021-01-01T00:00:00Z",
                updated_at: "2021-01-01T00:00:00Z",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedOfframpWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.offramp.get({
                instanceId: "in_000000000000",
                id: "ow_000000000000",
                bankAccountId: "ba_000000000000",
                receiverId: "re_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedOfframpWallet);
        });
    });
});
