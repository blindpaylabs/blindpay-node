import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadSpec, operationKeys, reachableSchemas, type Spec, sdkSurface } from "./spec";

let dir: string | null = null;

afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = null;
});

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const json = (name: string) => ({ content: { "application/json": { schema: ref(name) } } });

function fixture(): Spec {
    return {
        paths: {
            "/v1/instances/{instance_id}/wallets/{id}/deposits": {
                get: { "x-sdk": true, responses: { "200": json("DepositsOut") } },
            },
            "/v1/instances/{instance_id}/wallets/{id}/yield": {
                get: { "x-sdk": false, responses: { "200": json("YieldOut") } },
            },
            "/v1/instances/{instance_id}/wallets": {
                get: { responses: { "200": json("WalletOut") } },
                post: { "x-sdk": false, requestBody: json("SimulateIn") },
            },
        },
        components: {
            schemas: {
                DepositsOut: { type: "object" },
                YieldOut: { type: "object", properties: { fee: ref("YieldFee") } },
                YieldFee: { type: "object" },
                WalletOut: { type: "object" },
                SimulateIn: { type: "object" },
            },
        },
    };
}

describe("sdkSurface", () => {
    it("drops operations blindpay-v2 marks `x-sdk: false`, keeping flagged-true and unflagged ones", () => {
        expect([...operationKeys(sdkSurface(fixture()))].sort()).toEqual([
            "get /v1/instances/{instance_id}/wallets",
            "get /v1/instances/{instance_id}/wallets/{id}/deposits",
        ]);
    });

    it("leaves schemas reachable only through excluded operations unreachable", () => {
        expect([...reachableSchemas(sdkSurface(fixture()))].sort()).toEqual([
            "DepositsOut",
            "WalletOut",
        ]);
    });

    it("is what loadSpec returns, and never mutates its input", () => {
        const input = fixture();
        sdkSurface(input);
        expect(operationKeys(input).size).toBe(4);

        dir = mkdtempSync(join(tmpdir(), "api-sync-spec-"));
        const path = join(dir, "spec.json");
        writeFileSync(path, JSON.stringify(input));
        expect(operationKeys(loadSpec(path)).size).toBe(2);
    });
});
