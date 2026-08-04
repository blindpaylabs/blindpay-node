import { describe, expect, it } from "vitest";
import {
    extractEnumMembers,
    extractTopLevelFields,
    extractTopLevelKeys,
    findDeclarationSpan,
} from "./sdk-scan";

describe("findDeclarationSpan", () => {
    it("scopes the search to one declaration, stopping before the next top-level export", () => {
        const src = [
            "export type A = { x: string };",
            "",
            "export type B = { y: string };",
            "",
        ].join("\n");
        const span = findDeclarationSpan(src, "A");
        expect(span.text).toContain("A = { x: string }");
        expect(span.text).not.toContain("B = { y: string }");
    });

    it("throws when the symbol is not found", () => {
        expect(() => findDeclarationSpan("export type A = {};", "Missing")).toThrow();
    });
});

describe("extractTopLevelFields", () => {
    it("does not let a nested inline sub-object's own fields leak into the parent's key set", () => {
        const decl = [
            "export type VirtualAccount = {",
            "    id: string;",
            "    blockchain_wallet: { network: Network; address: string } | null;",
            "    token: StablecoinToken;",
            "};",
        ].join("\n");
        const fields = extractTopLevelFields(decl);
        expect([...fields.keys()]).toEqual(["id", "blockchain_wallet", "token"]);
        expect(fields.get("blockchain_wallet")?.typeExpr).toBe(
            "{ network: Network; address: string } | null"
        );
    });

    it("handles a multi-line nested sub-object whose inner fields use semicolons", () => {
        const decl = [
            "export type PayinTrackingTransaction = {",
            "    step: TrackingStatus",
            "    pse_instruction?: {",
            "      payment_link: string;",
            "      fid: string;",
            "      bank_code?: string | null;",
            "    } | null",
            "    transfers_instruction?: {",
            "      account: string;",
            "      tax_id?: string | null;",
            "    } | null",
            "  };",
        ].join("\n");
        const fields = extractTopLevelFields(decl);
        expect([...fields.keys()]).toEqual(["step", "pse_instruction", "transfers_instruction"]);
        expect(fields.get("pse_instruction")?.typeExpr).toContain("payment_link: string");
        expect(fields.get("pse_instruction")?.typeExpr).toContain("} | null");
        expect(fields.get("transfers_instruction")?.typeExpr).toContain("account: string");
    });

    it("terminates a field at a newline when there is no trailing semicolon (ASI-like object-type members)", () => {
        const decl = [
            "export type X = {",
            "    step: TrackingStatus",
            "    provider_name?: string | null",
            "};",
        ].join("\n");
        const fields = extractTopLevelFields(decl);
        expect(fields.get("step")?.typeExpr).toBe("TrackingStatus");
        expect(fields.get("provider_name")?.typeExpr).toBe("string | null");
    });

    it("keeps consuming a dangling union across lines", () => {
        const decl = [
            "export type X = {",
            "    status?:",
            '        | "failed"',
            '        | "completed";',
            "};",
        ].join("\n");
        const fields = extractTopLevelFields(decl);
        expect(fields.get("status")?.typeExpr.replace(/\s+/g, " ")).toContain('"failed"');
        expect(fields.get("status")?.typeExpr.replace(/\s+/g, " ")).toContain('"completed"');
    });
});

describe("extractTopLevelKeys", () => {
    it("resolves Pick<Other, ...> keys via the lookup callback, spanning multiple lines with a leading pipe", () => {
        const decl = [
            "export type CreateEvmPayinResponse = Pick<",
            "    Payin,",
            '    | "id"',
            '    | "status"',
            "> & {",
            "    customer_id?: string | null;",
            "};",
        ].join("\n");
        const lookup = (symbol: string) =>
            symbol === "Payin" ? new Set(["id", "status", "pix_code"]) : null;
        const keys = extractTopLevelKeys(decl, lookup);
        expect(keys.has("id")).toBe(true);
        expect(keys.has("status")).toBe(true);
        expect(keys.has("pix_code")).toBe(false);
        expect(keys.has("customer_id")).toBe(true);
    });
});

describe("extractEnumMembers", () => {
    it("extracts a double-quoted union", () => {
        const decl = 'export type X = "a" | "b" | "c";';
        expect(extractEnumMembers(decl)).toEqual(new Set(["a", "b", "c"]));
    });

    it("extracts a single-quoted union (this codebase mixes styles)", () => {
        const decl = "export type EstimatedTimeOfArrival = '5_min' | '30_min' | '2_hours';";
        expect(extractEnumMembers(decl)).toEqual(new Set(["5_min", "30_min", "2_hours"]));
    });

    it("returns null for an object-literal (not a string union)", () => {
        const decl = "export type X = { a: string };";
        expect(extractEnumMembers(decl)).toBeNull();
    });
});
