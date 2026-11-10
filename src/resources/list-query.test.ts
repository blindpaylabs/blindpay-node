import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../client";

const BASE = "https://api.blindpay.com/v1/instances/in_000000000000";

type ListCase = {
    name: string;
    path: string;
    /** Calls the method with every filter absent except `limit`. */
    withAbsentFilters: (blindpay: BlindPay) => Promise<unknown>;
    /** Calls the method with nothing but its required path ids. */
    withNoFilters: (blindpay: BlindPay) => Promise<unknown>;
};

const cases: ListCase[] = [
    {
        name: "payouts.list",
        path: "/payouts",
        withAbsentFilters: (b) =>
            b.payouts.list({
                limit: "10",
                status: undefined,
                customer_id: undefined,
                starting_after: undefined,
            }),
        withNoFilters: (b) => b.payouts.list({}),
    },
    {
        name: "payins.list",
        path: "/payins",
        withAbsentFilters: (b) =>
            b.payins.list({
                limit: "10",
                status: undefined,
                payment_method: undefined,
                ending_before: undefined,
            }),
        withNoFilters: (b) => b.payins.list({}),
    },
    {
        name: "customers.list",
        path: "/customers",
        withAbsentFilters: (b) =>
            b.customers.list({ limit: "10", status: undefined, country: undefined }),
        withNoFilters: (b) => b.customers.list({}),
    },
    {
        name: "payables.list",
        path: "/payables",
        withAbsentFilters: (b) =>
            b.payables.list({ limit: "10", status: undefined, type: undefined }),
        withNoFilters: (b) => b.payables.list({}),
    },
    {
        name: "transfers.list",
        path: "/transfers",
        withAbsentFilters: (b) =>
            b.transfers.list({ limit: "10", wallet_id: undefined, network: undefined }),
        withNoFilters: (b) => b.transfers.list({}),
    },
    {
        name: "customers.bankAccounts.list",
        path: "/customers/cu_000000000000/bank-accounts",
        withAbsentFilters: (b) =>
            // bank accounts take no `limit`; `name` stands in as the one present filter
            b.customers.bankAccounts.list({
                customer_id: "cu_000000000000",
                name: "10",
                status: undefined,
                type: undefined,
            }),
        withNoFilters: (b) => b.customers.bankAccounts.list({ customer_id: "cu_000000000000" }),
    },
    {
        name: "wallets.custodial.getDeposits",
        path: "/customers/cu_000000000000/wallets/wa_000000000000/deposits",
        withAbsentFilters: (b) =>
            b.wallets.custodial.getDeposits({
                customer_id: "cu_000000000000",
                id: "wa_000000000000",
                limit: "10",
                token: undefined,
                status: undefined,
            }),
        withNoFilters: (b) =>
            b.wallets.custodial.getDeposits({
                customer_id: "cu_000000000000",
                id: "wa_000000000000",
            }),
    },
];

describe("List query strings", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    function requestedUrl(): string {
        expect(fetchMock.mock.calls).toHaveLength(1);
        return String(fetchMock.mock.calls[0][0]);
    }

    describe.each(cases)("$name", ({ path, withAbsentFilters, withNoFilters }) => {
        it("sends only the params that are set, never `undefined`", async () => {
            fetchMock.mockResponseOnce("[]");

            await withAbsentFilters(blindpay);

            const presentParam = path.endsWith("/bank-accounts") ? "name=10" : "limit=10";
            expect(requestedUrl()).toBe(`${BASE}${path}?${presentParam}`);
        });

        it("sends no query string at all when no filter is set", async () => {
            fetchMock.mockResponseOnce("[]");

            await withNoFilters(blindpay);

            expect(requestedUrl()).toBe(`${BASE}${path}`);
        });
    });
});
