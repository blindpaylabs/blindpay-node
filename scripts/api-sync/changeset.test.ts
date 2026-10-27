import { describe, expect, it } from "vitest";
import { changesetFileName, classifyBump, renderChangeset } from "./changeset";

describe("classifyBump", () => {
    it("is minor when any enum member was inserted", () => {
        expect(classifyBump(true, false, false)).toBe("minor");
        expect(classifyBump(true, true, false)).toBe("minor");
    });

    it("is patch when only field additions were inserted", () => {
        expect(classifyBump(false, true, false)).toBe("patch");
    });

    it("is none when nothing was applied", () => {
        expect(classifyBump(false, false, false)).toBe("none");
    });
});

describe("changesetFileName", () => {
    it("derives a stable name from the spec sha256", () => {
        const sha = "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90";
        expect(changesetFileName(sha)).toBe("api-sync-a1b2c3d4e5f6.md");
        expect(changesetFileName(sha)).toBe(changesetFileName(sha));
    });

    it("throws on a value that is not a sha256 hex digest", () => {
        expect(() => changesetFileName("not-a-sha")).toThrow();
    });
});

describe("renderChangeset", () => {
    it("renders the package bump and every applied change", () => {
        expect(
            renderChangeset("@blindpay/node", "minor", [
                'add enum member "GBP" to types/index.d.ts:Currency (PayinOut.currency)',
                'add field "foo?: string" to types/index.d.ts:Payin (PayinOut)',
            ])
        ).toBe(
            [
                "---",
                '"@blindpay/node": minor',
                "---",
                "",
                "Sync SDK with API changes:",
                "",
                '- add enum member "GBP" to types/index.d.ts:Currency (PayinOut.currency)',
                '- add field "foo?: string" to types/index.d.ts:Payin (PayinOut)',
                "",
            ].join("\n")
        );
    });

    it("renders a patch bump", () => {
        expect(renderChangeset("@blindpay/node", "patch", ["x"])).toContain(
            '"@blindpay/node": patch'
        );
    });
});
