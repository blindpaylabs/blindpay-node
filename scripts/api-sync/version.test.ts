import { describe, expect, it } from "vitest";
import {
    bumpSemver,
    classifyBump,
    patchPackageJsonVersion,
    readPackageJsonVersion,
} from "./version";

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

describe("bumpSemver", () => {
    it("bumps minor and resets patch to 0", () => {
        expect(bumpSemver("5.0.1", "minor")).toBe("5.1.0");
    });

    it("bumps patch only", () => {
        expect(bumpSemver("5.0.1", "patch")).toBe("5.0.2");
    });

    it("leaves the version unchanged for none", () => {
        expect(bumpSemver("5.0.1", "none")).toBe("5.0.1");
    });

    it("throws on an unparseable version", () => {
        expect(() => bumpSemver("5.0", "minor")).toThrow();
    });
});

describe("patchPackageJsonVersion", () => {
    it("replaces only the version field, byte-for-byte elsewhere", () => {
        const raw =
            '{\n    "name": "@blindpay/node",\n    "version": "5.0.1",\n    "other": true\n}\n';
        const patched = patchPackageJsonVersion(raw, "5.1.0");
        expect(patched).toBe(
            '{\n    "name": "@blindpay/node",\n    "version": "5.1.0",\n    "other": true\n}\n'
        );
    });

    it("round-trips through readPackageJsonVersion", () => {
        const raw = '{"version": "1.2.3"}';
        expect(readPackageJsonVersion(raw)).toBe("1.2.3");
        expect(readPackageJsonVersion(patchPackageJsonVersion(raw, "1.3.0"))).toBe("1.3.0");
    });
});
