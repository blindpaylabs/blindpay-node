import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../../client";
import type { OfframpWallet } from "./offramp";

describe("Offramp wallets", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe("List offramp wallets", () => {
        it("should list offramp wallets", async () => {
            const mockedOfframpWallets: OfframpWallet[] = [
                {
                    id: "ow_000000000000",
                    external_id: "your_external_id",
                    instance_id: "in_000000000000",
                    customer_id: "re_000000000000",
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
                customer_id: "re_000000000000",
                bank_account_id: "ba_000000000000",
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
                external_id: "your_external_id",
                network: "tron",
                customer_id: "re_000000000000",
                bank_account_id: "ba_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedOfframpWallet);
        });
    });

    describe("Create solana offramp wallet", () => {
        it("should create a solana offramp wallet", async () => {
            const mockedOfframpWallet = {
                id: "ow_000000000001",
                network: "solana",
                address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
                circle_wallet_id: "01234567-abcd-efgh-ijkl-012345678901",
            };

            fetchMock.mockResponseOnce(JSON.stringify(mockedOfframpWallet), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await blindpay.wallets.offramp.create({
                network: "solana",
                customer_id: "re_000000000000",
                bank_account_id: "ba_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedOfframpWallet);
        });
    });

    describe("Get offramp wallet", () => {
        it("should get an offramp wallet", async () => {
            const mockedOfframpWallet: OfframpWallet = {
                id: "ow_000000000000",
                external_id: "your_external_id",
                instance_id: "in_000000000000",
                customer_id: "re_000000000000",
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
                id: "ow_000000000000",
                bank_account_id: "ba_000000000000",
                customer_id: "re_000000000000",
            });

            expect(error).toBeNull();
            expect(data).toEqual(mockedOfframpWallet);
        });
    });

    describe("Update offramp wallet", () => {
        const ids = {
            customer_id: "re_000000000000",
            bank_account_id: "ba_000000000000",
            id: "ow_000000000000",
        };

        async function sentRequest(
            input: Parameters<typeof blindpay.wallets.offramp.update>[0]
        ): Promise<{ method: string; url: string; body: unknown }> {
            fetchMock.mockResponseOnce(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" },
            });
            const { data, error } = await blindpay.wallets.offramp.update(input);
            expect(error).toBeNull();
            expect(data).toEqual({ success: true });
            expect(fetchMock.mock.calls).toHaveLength(1);
            const [url, init] = fetchMock.mock.calls[0];
            return {
                method: String(init?.method),
                url: String(url),
                body: JSON.parse(String(init?.body)),
            };
        }

        it("PUTs to the wallet's path and sends a partner fee id as-is", async () => {
            const sent = await sentRequest({ ...ids, partner_fee_id: "pf_000000000000" });
            expect(sent.method).toBe("PUT");
            expect(sent.url).toBe(
                "https://api.blindpay.com/v1/instances/in_000000000000/customers/re_000000000000/bank-accounts/ba_000000000000/offramp-wallets/ow_000000000000"
            );
            expect(sent.body).toEqual({ partner_fee_id: "pf_000000000000" });
        });

        it("sends an explicit null, which removes the partner fee", async () => {
            const sent = await sentRequest({ ...ids, partner_fee_id: null });
            expect(sent.body).toEqual({ partner_fee_id: null });
        });

        it("omits partner_fee_id when it isn't set, which leaves it unchanged", async () => {
            const sent = await sentRequest(ids);
            expect(sent.body).toEqual({});
        });
    });
});
