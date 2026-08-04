import { describe, expect, it } from "vitest";
import { insertEnumMember, insertOptionalField } from "./apply";

describe("insertEnumMember", () => {
    it("inserts into a single-line union", () => {
        const src = 'export type BankingPartner = "jpmorgan" | "citi" | "hsbc" | "cfsb";\n';
        const result = insertEnumMember(src, "BankingPartner", "portage");
        expect(result).toBe(
            'export type BankingPartner = "jpmorgan" | "citi" | "hsbc" | "cfsb" | "portage";\n'
        );
    });

    it("inserts into a one-member-per-line union, keeping the final `;` on the true last member", () => {
        const src = [
            "export type WebhookEvents =",
            '    | "payout.new"',
            '    | "payout.update";',
            "",
        ].join("\n");
        const result = insertEnumMember(src, "WebhookEvents", "payout.complete");
        expect(result).toBe(
            [
                "export type WebhookEvents =",
                '    | "payout.new"',
                '    | "payout.complete"',
                '    | "payout.update";',
                "",
            ].join("\n")
        );
    });

    it("is idempotent: applying the same member twice makes no second change", () => {
        const src = 'export type BankingPartner = "jpmorgan" | "citi";\n';
        const once = insertEnumMember(src, "BankingPartner", "portage");
        const twice = insertEnumMember(once, "BankingPartner", "portage");
        expect(twice).toBe(once);
    });

    it("never touches a same-named union declared in an unrelated later symbol", () => {
        const src = [
            'export type BankingPartner = "jpmorgan" | "citi";',
            "",
            'export type OtherPartner = "jpmorgan" | "citi";',
            "",
        ].join("\n");
        const result = insertEnumMember(src, "BankingPartner", "portage");
        expect(result).toContain('export type BankingPartner = "jpmorgan" | "citi" | "portage";');
        expect(result).toContain('export type OtherPartner = "jpmorgan" | "citi";');
        expect(result).not.toContain('OtherPartner = "jpmorgan" | "citi" | "portage"');
    });
});

describe("insertOptionalField", () => {
    it("appends a new optional field before the closing brace, matching sibling indentation", () => {
        const src = [
            "export type CreateQuoteInput = {",
            "    bank_account_id: string;",
            "    description?: string | null;",
            "    partner_fee_id?: string | null;",
            "};",
            "",
        ].join("\n");
        const result = insertOptionalField(
            src,
            "CreateQuoteInput",
            "refund_wallet_address",
            "string | null"
        );
        expect(result).toBe(
            [
                "export type CreateQuoteInput = {",
                "    bank_account_id: string;",
                "    description?: string | null;",
                "    partner_fee_id?: string | null;",
                "    refund_wallet_address?: string | null;",
                "};",
                "",
            ].join("\n")
        );
    });

    it("matches deeper sibling indentation, not a hardcoded 4 spaces", () => {
        const src = [
            "export type Foo = {",
            "        a: string;",
            "        b?: number;",
            "    };",
            "",
        ].join("\n");
        const result = insertOptionalField(src, "Foo", "c", "boolean");
        const lines = result.split("\n");
        const newLine = lines.find((l) => l.includes("c?:"));
        expect(newLine).toBe("        c?: boolean;");
    });

    it("is idempotent: applying the same field twice makes no second change", () => {
        const src = ["export type Foo = {", "    a: string;", "};", ""].join("\n");
        const once = insertOptionalField(src, "Foo", "b", "string | null");
        const twice = insertOptionalField(once, "Foo", "b", "string | null");
        expect(twice).toBe(once);
    });

    it("handles a nested inline sub-object field without disturbing it", () => {
        const src = [
            "export type PayoutTrackingLiquidity = {",
            "    step: TrackingStatus",
            "    provider_transaction_id?: string | null",
            "    estimated_time_of_arrival?: EstimatedTimeOfArrival | null;",
            "};",
            "",
        ].join("\n");
        const result = insertOptionalField(
            src,
            "PayoutTrackingLiquidity",
            "provider_status",
            "string | null"
        );
        expect(result).toContain(
            "estimated_time_of_arrival?: EstimatedTimeOfArrival | null;\n    provider_status?: string | null;\n};"
        );
    });

    it("never reformats untouched lines (surgical insertion only)", () => {
        const src = ["export type Foo = {", "    a:    string;", "    b?: number;", "};", ""].join(
            "\n"
        );
        const result = insertOptionalField(src, "Foo", "c", "boolean");
        expect(result).toContain("a:    string;");
    });
});
