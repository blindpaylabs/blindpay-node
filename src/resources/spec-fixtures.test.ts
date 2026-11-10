import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { BlindpayApiResponse } from "../../types";
import { BlindPay } from "../client";

/**
 * Round-trips the shared spec-shaped fixtures (test/fixtures/spec, generated from the public
 * spec) through SDK methods: every variant must come back as `data`, untouched, with no `error`.
 * TypeScript types aren't validated at runtime, so this proves the transport decodes each
 * shape the API can send (envelope and bare array, nullable and absent fields, unknown enums).
 */

const FIXTURES = join(__dirname, "../../test/fixtures/spec");

type FixtureIndex = { operations: Record<string, string> };
type ResponseFixture = {
    responses: Record<string, { variants?: Record<string, unknown>; empty_body?: boolean }>;
};

function readJson<T>(relativePath: string): T {
    return JSON.parse(readFileSync(join(FIXTURES, relativePath), "utf8")) as T;
}

const index = readJson<FixtureIndex>("index.json");

function variantsFor(operation: string): [string, unknown][] {
    const file = index.operations[operation];
    if (!file) throw new Error(`no fixture for ${operation}`);
    const ok = readJson<ResponseFixture>(file).responses["200"];
    return Object.entries(ok?.variants ?? {});
}

type OperationCase = {
    operation: string;
    call: (blindpay: BlindPay) => Promise<BlindpayApiResponse<unknown>>;
};

const CUSTOMER = "cu_000000000000";

const operations: OperationCase[] = [
    {
        operation: "GET /v1/instances/{instance_id}/payouts",
        call: (b) => b.payouts.list({ limit: "10" }),
    },
    {
        operation: "GET /v1/instances/{instance_id}/payins",
        call: (b) => b.payins.list({ limit: "10" }),
    },
    {
        operation: "GET /v1/instances/{instance_id}/customers",
        call: (b) => b.customers.list({ limit: "10" }),
    },
    {
        operation: "GET /v1/instances/{instance_id}/payables",
        call: (b) => b.payables.list({ limit: "10" }),
    },
    {
        operation: "GET /v1/instances/{instance_id}/transfers",
        call: (b) => b.transfers.list({ limit: "10" }),
    },
    {
        operation: "GET /v1/instances/{instance_id}/customers/{customer_id}/bank-accounts",
        call: (b) => b.customers.bankAccounts.list({ customer_id: CUSTOMER }),
    },
    {
        operation: "GET /v1/instances/{instance_id}/customers/{customer_id}/wallets/{id}/deposits",
        call: (b) =>
            b.wallets.custodial.getDeposits({
                customer_id: CUSTOMER,
                id: "wa_000000000000",
                limit: "10",
            }),
    },
    {
        operation: "POST /v1/upload",
        call: (b) => b.upload.upload({ file: new Blob(["%PDF"]), bucket: "documents" }),
    },
    {
        operation: "POST /v1/upload/analyze",
        call: (b) => b.upload.analyze({ file: new Blob(["%PDF"]), type: "invoice" }),
    },
];

describe("Spec fixtures", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe.each(operations)("$operation", ({ operation, call }) => {
        const variants = variantsFor(operation);

        it("has fixture variants", () => {
            expect(variants.length).toBeGreaterThan(0);
        });

        it.each(variants)("decodes the %s variant", async (_name, body) => {
            fetchMock.mockResponseOnce(JSON.stringify(body), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await call(blindpay);

            expect(error).toBeNull();
            expect(data).toEqual(body);
        });
    });
});
