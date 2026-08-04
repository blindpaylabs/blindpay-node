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
    it("flags when spec allows null but the SDK type has no | null (nullability checked)", () => {
        const spec = specTypeSignature({ type: ["string", "null"] });
        const sdk = classifySdkType("string", "/unused", "unused.ts");
        const problems = compareTypeSignatures(spec, sdk, {
            skipEnumValues: false,
            skipNullability: false,
        });
        expect(problems).toEqual(['spec allows null but the SDK type has no "| null"']);
    });

    it("does not flag nullability when the blocking pass explicitly skips it (this repo's own house style)", () => {
        const spec = specTypeSignature({ type: ["string", "null"] });
        const sdk = classifySdkType("string", "/unused", "unused.ts");
        const problems = compareTypeSignatures(spec, sdk, {
            skipEnumValues: false,
            skipNullability: true,
        });
        expect(problems).toEqual([]);
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
