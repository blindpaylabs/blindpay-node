import { afterEach, describe, expect, it } from "vitest";
import type { BlindpayApiResponse } from "../../types";
import { BlindPay } from "../client";

const BASE = "https://api.blindpay.com/v1/instances/in_000000000000";

type ListCase = {
    name: string;
    path: string;
    /** Calls the method with one filter set and the others explicitly `undefined`. */
    withAbsentFilters: (blindpay: BlindPay) => Promise<BlindpayApiResponse<unknown>>;
    /** The query string `withAbsentFilters` must send: the set filter only. */
    expectedQuery: string;
    /** Calls the method with nothing but its required path ids. */
    withNoFilters: (blindpay: BlindPay) => Promise<BlindpayApiResponse<unknown>>;
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
        expectedQuery: "?limit=10",
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
        expectedQuery: "?limit=10",
        withNoFilters: (b) => b.payins.list({}),
    },
    {
        name: "customers.list",
        path: "/customers",
        withAbsentFilters: (b) =>
            b.customers.list({ limit: "10", status: undefined, country: undefined }),
        expectedQuery: "?limit=10",
        withNoFilters: (b) => b.customers.list({}),
    },
    {
        name: "payables.list",
        path: "/payables",
        withAbsentFilters: (b) =>
            b.payables.list({ limit: "10", status: undefined, type: undefined }),
        expectedQuery: "?limit=10",
        withNoFilters: (b) => b.payables.list({}),
    },
    {
        name: "transfers.list",
        path: "/transfers",
        withAbsentFilters: (b) =>
            b.transfers.list({ limit: "10", wallet_id: undefined, network: undefined }),
        expectedQuery: "?limit=10",
        withNoFilters: (b) => b.transfers.list({}),
    },
    {
        name: "customers.bankAccounts.list",
        path: "/customers/cu_000000000000/bank-accounts",
        withAbsentFilters: (b) =>
            b.customers.bankAccounts.list({
                customer_id: "cu_000000000000",
                name: "Main account",
                status: undefined,
                type: undefined,
            }),
        expectedQuery: "?name=Main+account",
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
        expectedQuery: "?limit=10",
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

    describe.each(cases)("$name", ({ path, withAbsentFilters, expectedQuery, withNoFilters }) => {
        it("sends only the params that are set, never `undefined`", async () => {
            fetchMock.mockResponseOnce(JSON.stringify([]), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await withAbsentFilters(blindpay);

            expect(error).toBeNull();
            expect(data).toEqual([]);
            expect(requestedUrl()).toBe(`${BASE}${path}${expectedQuery}`);
        });

        it("sends no query string at all when no filter is set", async () => {
            fetchMock.mockResponseOnce(JSON.stringify([]), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await withNoFilters(blindpay);

            expect(error).toBeNull();
            expect(data).toEqual([]);
            expect(requestedUrl()).toBe(`${BASE}${path}`);
        });
    });
});

describe("limit as a number", () => {
    afterEach(() => fetchMock.resetMocks());

    it("is sent as the same decimal string (sdk-parity D6)", async () => {
        const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });
        fetchMock.mockResponseOnce(JSON.stringify([]));
        await blindpay.payouts.list({ limit: 50 });
        fetchMock.mockResponseOnce(JSON.stringify({ data: [], pagination: { has_more: false } }));
        await blindpay.wallets.custodial.getDeposits({ customer_id: "re_1", id: "wa_1", limit: 5 });
        expect(fetchMock.mock.calls.map(([url]) => new URL(String(url)).search)).toEqual([
            "?limit=50",
            "?limit=5",
        ]);
    });
});
