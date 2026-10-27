import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { classifySdkType, compareTypeSignatures, specTypeSignature } from "./type-check";

// classifySdkType resolves named unions (bare references and Extract/Exclude bases) by reading
// files on disk, so these tests use a small throwaway repo directory rather than mocking fs.
let dir: string | null = null;

function makeRepo(files: Record<string, string>): string {
    dir = mkdtempSync(join(tmpdir(), "api-sync-type-check-"));
    for (const [rel, content] of Object.entries(files)) {
        writeFileSync(join(dir, rel), content);
    }
    return dir;
}

afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = null;
});

describe("string to integer (base-kind mismatch)", () => {
    it("flags a field whose spec type changed from string to integer", () => {
        const spec = specTypeSignature({ type: "integer" });
        const sdk = classifySdkType("string", "/unused", "unused.ts");
        const problems = compareTypeSignatures(spec, sdk, { skipEnumValues: false });
        expect(problems).toEqual([
            'declared type changed: spec is "number", SDK declares "string"',
        ]);
    });
});

describe("nullable to non-nullable / non-nullable to nullable", () => {
    it("flags when spec allows null but the SDK type has no | null", () => {
        const spec = specTypeSignature({ type: ["string", "null"] });
        const sdk = classifySdkType("string", "/unused", "unused.ts");
        const problems = compareTypeSignatures(spec, sdk, { skipEnumValues: false });
        expect(problems).toEqual(['spec allows null but the SDK type has no "| null"']);
    });

    it("accepts a nullable spec field whose SDK type carries | null", () => {
        const spec = specTypeSignature({ type: ["string", "null"] });
        const sdk = classifySdkType("string | null", "/unused", "unused.ts");
        const problems = compareTypeSignatures(spec, sdk, { skipEnumValues: false });
        expect(problems).toEqual([]);
    });
});

describe("nullability expressed through a reference or a composition", () => {
    const spec = {
        paths: {},
        components: {
            schemas: {
                PayableParty: { type: ["object", "null"], properties: {} },
                FeeOptions: { type: "object", properties: {} },
            },
        },
    };
    const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

    it("reads it from the referenced schema", () => {
        expect(specTypeSignature(ref("PayableParty"), spec).nullable).toBe(true);
        expect(specTypeSignature(ref("FeeOptions"), spec).nullable).toBe(false);
    });

    it("reads it from an anyOf/oneOf null branch", () => {
        const node = { anyOf: [{ type: "string", format: "date-time" }, { type: "null" }] };
        expect(specTypeSignature(node, spec).nullable).toBe(true);
        expect(
            specTypeSignature({ oneOf: [ref("FeeOptions"), { type: "null" }] }, spec).nullable
        ).toBe(true);
    });

    it("stops at a reference cycle instead of recursing forever", () => {
        const cyclic = {
            paths: {},
            components: {
                schemas: { A: { anyOf: [{ $ref: "#/components/schemas/A" }, { type: "null" }] } },
            },
        };
        expect(specTypeSignature(ref("A"), cyclic).nullable).toBe(true);
    });

    it("reads it from an allOf that wraps a reference in a nullable object", () => {
        const node = { allOf: [ref("FeeOptions"), { type: ["object", "null"] }] };
        expect(specTypeSignature(node, spec).nullable).toBe(true);
    });

    it("flags the SDK type that drops it", () => {
        const sdk = classifySdkType("PayableParty", "/unused", "unused.ts");
        const problems = compareTypeSignatures(specTypeSignature(ref("PayableParty"), spec), sdk, {
            skipEnumValues: false,
        });
        expect(problems).toContain('spec allows null but the SDK type has no "| null"');
    });
});

describe("enum-typed property degrading to a bare string", () => {
    it("flags when spec constrains the field but the SDK declares a bare string", () => {
        const spec = specTypeSignature({
            type: "string",
            enum: ["clabe", "debitcard", "phonenum"],
        });
        const sdk = classifySdkType("string", "/unused", "unused.ts");
        const problems = compareTypeSignatures(spec, sdk, { skipEnumValues: false });
        expect(problems).toEqual([
            "spec constrains this field to a fixed set of values, but the SDK declares it as a bare string (enum constraint dropped)",
        ]);
    });
});

describe("Extract-narrowed union", () => {
    it("resolves the narrowed member set and reports only genuinely missing values", () => {
        const repo = makeRepo({
            "types.ts": 'export type Currency = "USD" | "BRL" | "EUR" | "USDC";\n',
        });
        const spec = specTypeSignature({ type: "string", enum: ["USD", "BRL", "EUR"] });
        const sdk = classifySdkType('Extract<Currency, "USD" | "BRL">', repo, "types.ts");
        const problems = compareTypeSignatures(spec, sdk, { skipEnumValues: false });
        expect(problems).toEqual([
            "spec enum value(s) [EUR] not present in the SDK's type (Extract<Currency, ...>)",
        ]);
    });

    it("treats an Exclude-narrowed union as compatible when the exclusion already matches spec", () => {
        const repo = makeRepo({
            "types.ts": 'export type Currency = "USD" | "BRL" | "USDC" | "USDT" | "USDB";\n',
        });
        const spec = specTypeSignature({ type: "string", enum: ["USD", "BRL"] });
        const sdk = classifySdkType(
            'Exclude<Currency, "USDC" | "USDT" | "USDB">',
            repo,
            "types.ts"
        );
        const problems = compareTypeSignatures(spec, sdk, { skipEnumValues: false });
        expect(problems).toEqual([]);
    });
});

describe("a deliberately compatible case", () => {
    it("does not flag a spec integer modeled as a TS number", () => {
        const spec = specTypeSignature({ type: "integer" });
        const sdk = classifySdkType("number", "/unused", "unused.ts");
        expect(compareTypeSignatures(spec, sdk, { skipEnumValues: false })).toEqual([]);
    });

    it("does not flag a nullable spec string modeled with both `?` and `| null`", () => {
        const spec = specTypeSignature({ type: ["string", "null"] });
        const sdk = classifySdkType("string | null", "/unused", "unused.ts");
        expect(compareTypeSignatures(spec, sdk, { skipEnumValues: false })).toEqual([]);
    });
});
