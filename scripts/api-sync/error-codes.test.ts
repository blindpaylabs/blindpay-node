import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
    diffCatalogue,
    ERROR_CODES_FILE,
    parseErrorCodes,
    renderErrorCodes,
    renderedCodes,
} from "./error-codes";
import { loadSpec } from "./spec";

const REPO_ROOT = resolve(__dirname, "../..");
const snapshot = loadSpec(resolve(REPO_ROOT, ".api-sync/spec-snapshot.json"));

function specWithErrorsTag(description: string) {
    return { tags: [{ name: "Instances" }, { name: "Errors", description }] };
}

const TABLE = [
    "### Error codes",
    "",
    "| Code | Status | Retry | Description |",
    "| --- | --- | --- | --- |",
    "| `QUOTES_EXPIRED` | 400 | actionable | This quote has expired. |",
    "| `AUTH_FORBIDDEN` | 403 | terminal | You do not have permission. |",
].join("\n");

describe("parseErrorCodes", () => {
    it("reads every row of the committed snapshot's Errors tag", () => {
        const rows = parseErrorCodes(snapshot);
        expect(rows.length).toBeGreaterThan(0);
        expect(rows.find((r) => r.code === "TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM")).toEqual({
            code: "TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM",
            status: 400,
            retry: "actionable",
            description:
                "Swaps between different tokens require at least 100 USDC, measured on the USDC side. Increase the amount and try again.",
        });
        expect(rows.map((r) => r.code)).toEqual([...rows.map((r) => r.code)].sort());
    });

    it("finds the tag by name and sorts the rows by code", () => {
        expect(parseErrorCodes(specWithErrorsTag(TABLE))).toEqual([
            {
                code: "AUTH_FORBIDDEN",
                status: 403,
                retry: "terminal",
                description: "You do not have permission.",
            },
            {
                code: "QUOTES_EXPIRED",
                status: 400,
                retry: "actionable",
                description: "This quote has expired.",
            },
        ]);
    });

    it("fails instead of returning an empty catalogue", () => {
        expect(() => parseErrorCodes({ tags: [{ name: "Instances" }] })).toThrow(/no "Errors" tag/);
        expect(() => parseErrorCodes(specWithErrorsTag("## Error responses\n\nNo table."))).toThrow(
            /lists no error codes/
        );
    });

    it("fails on a row it can't read, an unknown retry class or a duplicate code", () => {
        expect(() =>
            parseErrorCodes(specWithErrorsTag("| `BROKEN` | 4xx | terminal | x |"))
        ).toThrow(/unparseable/);
        expect(() =>
            parseErrorCodes(specWithErrorsTag("| `NEW_CLASS` | 400 | sometimes | x |"))
        ).toThrow(/unknown retry class "sometimes"/);
        expect(() =>
            parseErrorCodes(
                specWithErrorsTag(`${TABLE}\n| \`QUOTES_EXPIRED\` | 400 | actionable | again |`)
            )
        ).toThrow(/appears twice/);
    });
});

describe("renderErrorCodes", () => {
    it("is what's committed in src/error-codes.ts for the committed snapshot", () => {
        const committed = readFileSync(resolve(REPO_ROOT, ERROR_CODES_FILE), "utf8");
        expect(renderErrorCodes(parseErrorCodes(snapshot))).toBe(committed);
    });

    it("keeps a description from closing its doc comment", () => {
        const source = renderErrorCodes(
            parseErrorCodes(specWithErrorsTag("| `ODD` | 400 | terminal | Ends */ early |"))
        );
        expect(source).toContain("/** 400, terminal: Ends * / early */");
    });
});

describe("diffCatalogue", () => {
    const render = (table: string) => renderErrorCodes(parseErrorCodes(specWithErrorsTag(table)));

    it("names added, removed and changed codes", () => {
        const before = render(TABLE);
        const after = render(
            [
                "| `QUOTES_EXPIRED` | 410 | actionable | This quote has expired. |",
                "| `TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM` | 400 | actionable | Min 100 USDC. |",
            ].join("\n")
        );
        expect(renderedCodes(before).size).toBe(2);
        expect(diffCatalogue(before, after)).toEqual({
            added: ["TRANSFERS_SWAP_AMOUNT_BELOW_MINIMUM"],
            removed: ["AUTH_FORBIDDEN"],
            changed: ["QUOTES_EXPIRED"],
        });
    });

    it("treats a missing file as every code added", () => {
        expect(diffCatalogue("", render(TABLE)).added).toEqual([
            "AUTH_FORBIDDEN",
            "QUOTES_EXPIRED",
        ]);
    });
});
