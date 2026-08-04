import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { reconcile } from "./reconcile";
import { clearSourceCache } from "./sdk-scan";
import type { Spec } from "./spec";
import type { SpecMap, UnmodeledFile } from "./types";

let dir: string | null = null;

function makeRepo(files: Record<string, string>): string {
    dir = mkdtempSync(join(tmpdir(), "api-sync-reconcile-"));
    for (const [rel, content] of Object.entries(files)) {
        writeFileSync(join(dir, rel), content);
    }
    return dir;
}

afterEach(() => {
    clearSourceCache();
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = null;
});

function emptyUnmodeled(): UnmodeledFile {
    return { properties: [], knownDivergences: [] };
}

describe("enum reconciliation", () => {
    it("classifies a missing enum member as applicable when no divergence covers it", () => {
        const repo = makeRepo({
            "types.ts": 'export type BankingPartner = "jpmorgan" | "citi";\n',
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    VirtualAccountOut: {
                        type: "object",
                        properties: {
                            banking_partner: {
                                type: "string",
                                enum: ["jpmorgan", "citi", "portage"],
                            },
                        },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [
                {
                    spec: { schema: "VirtualAccountOut", property: "banking_partner" },
                    sdk: [{ file: "types.ts", symbol: "BankingPartner" }],
                },
            ],
            types: [],
            ignore: { schemas: [] },
        };
        const { applicable, needsHuman } = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(needsHuman).toEqual([]);
        expect(applicable).toEqual([
            {
                kind: "enum-insert",
                schema: "VirtualAccountOut",
                property: "banking_partner",
                member: "portage",
                site: { file: "types.ts", symbol: "BankingPartner" },
            },
        ]);
    });

    it("records a known enum divergence instead of applying it", () => {
        const repo = makeRepo({ "types.ts": 'export type KycStatus = "approved" | "rejected";\n' });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    CustomerOut: {
                        type: "object",
                        properties: {
                            kyc_status: {
                                type: "string",
                                enum: ["approved", "rejected", "approved_rfi"],
                            },
                        },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [
                {
                    spec: { schema: "CustomerOut", property: "kyc_status" },
                    sdk: [{ file: "types.ts", symbol: "KycStatus" }],
                },
            ],
            types: [],
            ignore: { schemas: [] },
        };
        const unmodeled: UnmodeledFile = {
            properties: [],
            knownDivergences: [
                {
                    kind: "enum",
                    schema: "CustomerOut",
                    enumProperty: "kyc_status",
                    member: "approved_rfi",
                    reason: "RFI not implemented",
                    owner: "eric@blindpay.com",
                },
            ],
        };
        const { applicable, needsHuman, divergencesHit } = reconcile(spec, map, unmodeled, repo);
        expect(needsHuman).toEqual([]);
        expect(applicable).toEqual([]);
        expect(divergencesHit.length).toBe(1);
        expect(divergencesHit[0]).toContain("approved_rfi");
    });
});

describe("field-insertion (property reconciliation)", () => {
    it("classifies a missing optional property as applicable, inferring the TS type from the spec node", () => {
        const repo = makeRepo({
            "quotes.ts": [
                "export type CreateQuoteInput = {",
                "    bank_account_id: string;",
                "};",
                "",
            ].join("\n"),
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    QuoteIn: {
                        type: "object",
                        properties: {
                            bank_account_id: { type: "string" },
                            refund_wallet_address: { type: ["string", "null"] },
                        },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [],
            types: [
                {
                    spec: { schema: "QuoteIn" },
                    sdk: [{ file: "quotes.ts", symbol: "CreateQuoteInput" }],
                },
            ],
            ignore: { schemas: [] },
        };
        const { applicable, needsHuman } = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(needsHuman).toEqual([]);
        expect(applicable).toEqual([
            {
                kind: "field-insert",
                schema: "QuoteIn",
                property: undefined,
                field: "refund_wallet_address",
                tsType: "string | null",
                site: { file: "quotes.ts", symbol: "CreateQuoteInput" },
            },
        ]);
    });

    it("honors unmodeled.json: a recorded gap is a known divergence, not applicable", () => {
        const repo = makeRepo({
            "payouts.ts": ["export type Payout = {", "    id: string;", "};", ""].join("\n"),
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    PayoutOut: {
                        type: "object",
                        properties: { id: { type: "string" }, partner_fee: { type: "integer" } },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [],
            types: [
                { spec: { schema: "PayoutOut" }, sdk: [{ file: "payouts.ts", symbol: "Payout" }] },
            ],
            ignore: { schemas: [] },
        };
        const unmodeled: UnmodeledFile = {
            properties: [
                {
                    kind: "property",
                    schema: "PayoutOut",
                    field: "partner_fee",
                    reason: "not modeled yet",
                    owner: "eric@blindpay.com",
                },
            ],
            knownDivergences: [],
        };
        const { applicable, needsHuman, divergencesHit } = reconcile(spec, map, unmodeled, repo);
        expect(needsHuman).toEqual([]);
        expect(applicable).toEqual([]);
        expect(divergencesHit.some((d) => d.includes("partner_fee"))).toBe(true);
    });

    it("needs-human when a missing property's every mapped site is a bare scalar alias (`= string`) it will not edit", () => {
        // Mirrors CreatePayinIn -> CreateEvmPayinInput in the real codebase: `export type
        // CreateEvmPayinInput = string;` is a bare alias for the one property's value, not an
        // object literal, so there is no key to mechanically insert a second field into.
        const repo = makeRepo({
            "payins.ts": ["export type CreateEvmPayinInput = string;", ""].join("\n"),
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    CreatePayinIn: {
                        type: "object",
                        properties: { payin_quote_id: { type: "string" } },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [],
            types: [
                {
                    spec: { schema: "CreatePayinIn" },
                    sdk: [{ file: "payins.ts", symbol: "CreateEvmPayinInput" }],
                },
            ],
            ignore: { schemas: [] },
        };
        const { needsHuman } = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(needsHuman.length).toBe(1);
        expect(needsHuman[0]).toContain("payin_quote_id");
        expect(needsHuman[0]).toContain("derived type expression");
    });

    it("resolves Pick<Other, ...> & {...} keys normally (not opaque) when Other is a real object type", () => {
        // Mirrors CreatePayinOut -> CreateEvmPayinResponse: a Pick<> plus an inline literal is
        // not a bare alias, so genuinely-missing fields are ordinary "missing", not blocked.
        const repo = makeRepo({
            "payins.ts": [
                "export type Payin = {",
                "    id: string;",
                "    status: string;",
                "};",
                "",
                'export type CreateEvmPayinResponse = Pick<Payin, "id" | "status"> & {',
                "    extra?: string;",
                "};",
                "",
            ].join("\n"),
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    CreatePayinOut: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            status: { type: "string" },
                            billing_fee_amount: { type: "number" },
                        },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [],
            types: [
                {
                    spec: { schema: "CreatePayinOut" },
                    sdk: [{ file: "payins.ts", symbol: "CreateEvmPayinResponse" }],
                },
            ],
            ignore: { schemas: [] },
        };
        const unmodeled: UnmodeledFile = {
            properties: [
                {
                    kind: "property",
                    schema: "CreatePayinOut",
                    field: "billing_fee_amount",
                    reason: "not modeled",
                    owner: "eric@blindpay.com",
                },
            ],
            knownDivergences: [],
        };
        const { needsHuman, applicable, divergencesHit } = reconcile(spec, map, unmodeled, repo);
        expect(needsHuman).toEqual([]);
        expect(applicable).toEqual([]);
        expect(divergencesHit.some((d) => d.includes("billing_fee_amount"))).toBe(true);
    });
});

describe("needs-human classifications", () => {
    it("a mapped schema locator that no longer resolves in the delivered spec", () => {
        const repo = makeRepo({ "x.ts": "export type X = { a: string };\n" });
        const spec: Spec = { paths: {}, components: { schemas: {} } };
        const map: SpecMap = {
            enums: [],
            types: [{ spec: { schema: "GoneSchema" }, sdk: [{ file: "x.ts", symbol: "X" }] }],
            ignore: { schemas: [] },
        };
        const { needsHuman } = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(needsHuman.length).toBe(1);
        expect(needsHuman[0]).toContain("GoneSchema");
        expect(needsHuman[0]).toContain("no longer resolves");
    });

    it("a mapped SDK symbol that is not found (anchor drift)", () => {
        const repo = makeRepo({ "x.ts": "export type X = { a: string };\n" });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: { S: { type: "object", properties: { a: { type: "string" } } } },
            },
        };
        const map: SpecMap = {
            enums: [],
            types: [
                { spec: { schema: "S" }, sdk: [{ file: "x.ts", symbol: "RenamedSomewhereElse" }] },
            ],
            ignore: { schemas: [] },
        };
        const { needsHuman } = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(needsHuman.length).toBe(1);
        expect(needsHuman[0]).toContain("RenamedSomewhereElse");
        expect(needsHuman[0]).toContain("not found");
    });

    it("a type-kind mismatch on a modeled property, not covered by a divergence", () => {
        const repo = makeRepo({
            "payins.ts": [
                "export type Payin = {",
                "    billing_fee_amount?: string | null;",
                "};",
                "",
            ].join("\n"),
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    PayinOut: {
                        type: "object",
                        properties: { billing_fee_amount: { type: ["number", "null"] } },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [],
            types: [
                { spec: { schema: "PayinOut" }, sdk: [{ file: "payins.ts", symbol: "Payin" }] },
            ],
            ignore: { schemas: [] },
        };
        const { needsHuman } = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(needsHuman.length).toBe(1);
        expect(needsHuman[0]).toContain("billing_fee_amount");
        expect(needsHuman[0]).toContain('spec is "number", SDK declares "string"');
    });

    it("records a type-mismatch known divergence instead of failing", () => {
        const repo = makeRepo({
            "payins.ts": [
                "export type Payin = {",
                "    billing_fee_amount?: string | null;",
                "};",
                "",
            ].join("\n"),
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    PayinOut: {
                        type: "object",
                        properties: { billing_fee_amount: { type: ["number", "null"] } },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [],
            types: [
                { spec: { schema: "PayinOut" }, sdk: [{ file: "payins.ts", symbol: "Payin" }] },
            ],
            ignore: { schemas: [] },
        };
        const unmodeled: UnmodeledFile = {
            properties: [],
            knownDivergences: [
                {
                    kind: "type-mismatch",
                    schema: "PayinOut",
                    field: "billing_fee_amount",
                    reason: "pre-existing bug",
                    owner: "eric@blindpay.com",
                },
            ],
        };
        const { needsHuman, divergencesHit } = reconcile(spec, map, unmodeled, repo);
        expect(needsHuman).toEqual([]);
        expect(divergencesHit.some((d) => d.includes("billing_fee_amount"))).toBe(true);
    });
});

describe("idempotency", () => {
    it("reconciling twice after applying leaves nothing applicable", () => {
        const repo = makeRepo({
            "types.ts": 'export type BankingPartner = "jpmorgan" | "citi" | "portage";\n',
        });
        const spec: Spec = {
            paths: {},
            components: {
                schemas: {
                    VirtualAccountOut: {
                        type: "object",
                        properties: {
                            banking_partner: {
                                type: "string",
                                enum: ["jpmorgan", "citi", "portage"],
                            },
                        },
                    },
                },
            },
        };
        const map: SpecMap = {
            enums: [
                {
                    spec: { schema: "VirtualAccountOut", property: "banking_partner" },
                    sdk: [{ file: "types.ts", symbol: "BankingPartner" }],
                },
            ],
            types: [],
            ignore: { schemas: [] },
        };
        const first = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(first.applicable).toEqual([]);
        const second = reconcile(spec, map, emptyUnmodeled(), repo);
        expect(second.applicable).toEqual([]);
    });
});
