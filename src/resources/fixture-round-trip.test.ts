import { afterEach, describe, expect, it } from "vitest";
import { BlindPay } from "../client";
import { readFixture, responseVariants } from "../internal/test-fixtures";
import { OPERATIONS } from "../internal/test-operations";

/**
 * The op-coverage test (sdk-parity A8): every SDK operation of the spec, through the method that
 * implements it. Each call must hit the operation's method and path, and every shared
 * spec-shaped fixture variant (test/fixtures/spec) served as its response must come back as
 * `data`, unchanged, with `error: null`: envelope and bare array, required-only, nullable and
 * unknown-enum shapes alike.
 *
 * This is a transport round-trip, not a type check (TypeScript types aren't checked at runtime);
 * fixture-types.test.ts assigns the same variants to each method's declared response type.
 */

const operationsInFixtures = Object.keys(
    readFixture<{ operations: Record<string, string> }>("index.json").operations
);

/** `/v1/instances/{instance_id}/x/{id}` -> a regex matching the request's pathname. */
function pathPattern(operation: string): RegExp {
    const path = operation.split(" ")[1].replace(/\{[^}]+\}/g, "[^/?]+");
    return new RegExp(`^${path}$`);
}

describe("SDK operation coverage", () => {
    it("has a method for every operation in the spec fixtures, and nothing else", () => {
        const covered = new Set(OPERATIONS.map((o) => o.operation));
        expect(operationsInFixtures.filter((op) => !covered.has(op))).toEqual([]);
        expect([...covered].filter((op) => !operationsInFixtures.includes(op))).toEqual([]);
        expect(covered.size).toBe(94);
    });
});

describe("Spec fixture round-trip", () => {
    afterEach(() => fetchMock.resetMocks());

    const blindpay = new BlindPay({ apiKey: "test_key", instanceId: "in_000000000000" });

    describe.each(OPERATIONS)("$operation via $method", ({ operation, call }) => {
        const variants = responseVariants(operation);
        const [verb] = operation.split(" ");

        it("sends the operation's method and path", async () => {
            fetchMock.mockResponseOnce(JSON.stringify({}), {
                headers: { "Content-Type": "application/json" },
            });
            await call(blindpay);
            expect(fetchMock.mock.calls).toHaveLength(1);
            const [url, init] = fetchMock.mock.calls[0];
            expect(init?.method).toBe(verb);
            expect(new URL(String(url)).pathname).toMatch(pathPattern(operation));
        });

        it.runIf(variants.length > 0).each(variants)(
            "returns the %s variant unchanged as data",
            async (_name, body) => {
                fetchMock.mockResponseOnce(JSON.stringify(body), {
                    headers: { "Content-Type": "application/json" },
                });

                const { data, error } = await call(blindpay);

                expect(error).toBeNull();
                expect(data).toEqual(body);
            }
        );
    });
});
