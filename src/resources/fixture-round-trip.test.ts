import { afterEach, describe, expect, it } from "vitest";
import type { BlindpayApiResponse } from "../../types";
import { BlindPay } from "../client";
import { responseVariants } from "../internal/test-fixtures";

/**
 * Transport round-trip, NOT a type check: each shared spec-shaped fixture variant
 * (test/fixtures/spec) is served as the response and must come back as `data`, byte-for-byte
 * equal, with `error: null`. That proves the transport handles every shape the API can send
 * (envelope and bare array, empty and nullable fields), but `toEqual` can't fail on a field the
 * SDK *types* get wrong, because TypeScript types aren't checked at runtime.
 *
 * TODO(M3, sdk-parity C8): add a generated `.ts` type test, run by `check-types`, that assigns
 * every op's `required_only` and `nullables_null` variants to its SDK response type with
 * `satisfies` (skipping `unknown_enum`: runtime strings are open, TS unions are closed).
 */

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

describe("Spec fixture transport round-trip", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test-key", instanceId: "in_000000000000" });

    describe.each(operations)("$operation", ({ operation, call }) => {
        const variants = responseVariants(operation);

        it("has fixture variants", () => {
            expect(variants.length).toBeGreaterThan(0);
        });

        it.each(variants)("returns the %s variant unchanged as data", async (_name, body) => {
            fetchMock.mockResponseOnce(JSON.stringify(body), {
                headers: { "Content-Type": "application/json" },
            });

            const { data, error } = await call(blindpay);

            expect(error).toBeNull();
            expect(data).toEqual(body);
        });
    });
});
