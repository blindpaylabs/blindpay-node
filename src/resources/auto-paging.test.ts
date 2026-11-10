import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../client";
import { BlindPayError } from "../internal/blindpay-error";

/**
 * Auto-pagers (sdk-parity C5, D4). Pages are hand-written: the shared `.b0` fixtures carry a
 * synthetic, constant `next_page` with `has_more: true`, so following them would never end.
 */

const BASE = "https://api.blindpay.com/v1/instances/in_000000000000";
const CUSTOMER = "cu_000000000000";
const WALLET = "wa_000000000000";

type Pager = {
    name: string;
    path: string;
    iterate: (blindpay: BlindPay, params?: Record<string, string>) => AsyncIterable<unknown>;
};

const pagers: Pager[] = [
    {
        name: "payouts.listAutoPaging",
        path: "/payouts",
        iterate: (b, params) => b.payouts.listAutoPaging(params),
    },
    {
        name: "payins.listAutoPaging",
        path: "/payins",
        iterate: (b, params) => b.payins.listAutoPaging(params),
    },
    {
        name: "customers.listAutoPaging",
        path: "/customers",
        iterate: (b, params) => b.customers.listAutoPaging(params),
    },
    {
        name: "payables.listAutoPaging",
        path: "/payables",
        iterate: (b, params) => b.payables.listAutoPaging(params),
    },
    {
        name: "transfers.listAutoPaging",
        path: "/transfers",
        iterate: (b, params) => b.transfers.listAutoPaging(params),
    },
    {
        name: "wallets.custodial.getDepositsAutoPaging",
        path: `/customers/${CUSTOMER}/wallets/${WALLET}/deposits`,
        iterate: (b, params) =>
            b.wallets.custodial.getDepositsAutoPaging({
                customer_id: CUSTOMER,
                id: WALLET,
                ...params,
            }),
    },
];

const page = (ids: string[], next: string | null) => ({
    data: ids.map((id) => ({ id })),
    pagination: { has_more: next !== null, next_page: next, prev_page: null },
});

function mockPages(...bodies: unknown[]) {
    for (const body of bodies) {
        fetchMock.mockResponseOnce(JSON.stringify(body), {
            headers: { "Content-Type": "application/json" },
        });
    }
}

const requestedUrls = () => fetchMock.mock.calls.map(([url]) => String(url));

async function collect(items: AsyncIterable<unknown>): Promise<unknown[]> {
    const out: unknown[] = [];
    for await (const item of items) out.push(item);
    return out;
}

describe.each(pagers)("$name", ({ path, iterate }) => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({
        apiKey: "test-key",
        instanceId: "in_000000000000",
        maxRetries: 0,
    });

    it("follows next_page as starting_after until has_more is false, sending limit=100", async () => {
        mockPages(page(["a", "b"], "b"), page(["c"], "c"), page(["d"], null));

        const items = await collect(iterate(blindpay));

        expect(items).toEqual([{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }]);
        expect(requestedUrls()).toEqual([
            `${BASE}${path}?limit=100`,
            `${BASE}${path}?limit=100&starting_after=b`,
            `${BASE}${path}?limit=100&starting_after=c`,
        ]);
    });

    it("keeps the caller's filters, limit and starting cursor", async () => {
        mockPages(page(["x"], null));

        await collect(iterate(blindpay, { status: "completed", limit: "10", starting_after: "w" }));

        expect(requestedUrls()).toEqual([
            `${BASE}${path}?status=completed&limit=10&starting_after=w`,
        ]);
    });

    it("yields a bare-array response once and stops", async () => {
        mockPages([{ id: "a" }, { id: "b" }]);

        expect(await collect(iterate(blindpay))).toEqual([{ id: "a" }, { id: "b" }]);
        expect(requestedUrls()).toHaveLength(1);
    });

    it("throws a BlindPayError carrying the error of a failed page", async () => {
        mockPages(page(["a"], "a"));
        fetchMock.mockResponseOnce(
            JSON.stringify({ success: false, code: "INTERNAL_ERROR", message: "boom" }),
            { status: 500 }
        );

        const seen: unknown[] = [];
        const run = async () => {
            for await (const item of iterate(blindpay)) seen.push(item);
        };

        const thrown = await run().catch((e: unknown) => e);
        expect(thrown).toBeInstanceOf(BlindPayError);
        expect((thrown as BlindPayError).error).toMatchObject({
            status: 500,
            code: "INTERNAL_ERROR",
        });
        expect(seen).toEqual([{ id: "a" }]);
    });

    it("rejects ending_before without sending a request", async () => {
        await expect(collect(iterate(blindpay, { ending_before: "z" }))).rejects.toThrow(
            "forward only"
        );
        expect(requestedUrls()).toHaveLength(0);
    });

    it("throws instead of looping when next_page doesn't advance", async () => {
        mockPages(page(["a"], "a"), page(["a"], "a"));

        await expect(collect(iterate(blindpay))).rejects.toThrow("did not advance");
        expect(requestedUrls()).toHaveLength(2);
    });
});
