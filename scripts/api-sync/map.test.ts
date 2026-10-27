import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { findUnmappedEnumProperties } from "./enum-coverage";
import {
    isKnownEnumDivergence,
    isUnmodeledProperty,
    loadSpecMap,
    loadUnmodeled,
    withPendingMapEntries,
} from "./map";
import { findUnmappedNestedShapes } from "./nested-coverage";
import { findDeclarationSpan, readSource } from "./sdk-scan";
import {
    loadSpec,
    reachableSchemas,
    resolveEnumMembers,
    resolveProperties,
    type Spec,
} from "./spec";
import { isPathLocator, type SpecMap } from "./types";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const map = loadSpecMap(resolve(REPO_ROOT, ".api-sync/spec-map.json"));
const unmodeled = loadUnmodeled(resolve(REPO_ROOT, ".api-sync/unmodeled.json"));
const spec: Spec = loadSpec(resolve(REPO_ROOT, ".api-sync/spec-snapshot.json"));

describe("spec-map.json validity", () => {
    it("every enums[] locator resolves against the committed spec snapshot", () => {
        for (const entry of map.enums) {
            expect(
                () => resolveEnumMembers(spec, entry.spec),
                JSON.stringify(entry.spec)
            ).not.toThrow();
        }
    });

    it("every types[] locator resolves against the committed spec snapshot", () => {
        for (const entry of map.types) {
            expect(
                () => resolveProperties(spec, entry.spec),
                JSON.stringify(entry.spec)
            ).not.toThrow();
        }
    });

    it("every sdk site's file exists and declares the named symbol", () => {
        for (const entry of [...map.enums, ...map.types]) {
            for (const site of entry.sdk) {
                const content = readSource(REPO_ROOT, site.file);
                expect(
                    () => findDeclarationSpan(content, site.symbol),
                    `${site.file}:${site.symbol} (mapped from ${JSON.stringify(entry.spec)})`
                ).not.toThrow();
            }
        }
    });

    it("every ignore.schemas name exists in the spec's components.schemas", () => {
        for (const entry of map.ignore.schemas) {
            expect(spec.components.schemas[entry.name], entry.name).toBeDefined();
        }
    });

    it("every reachable schema is either mapped or explicitly ignored", () => {
        const reachable = reachableSchemas(spec);
        const mappedNames = new Set(
            [...map.enums, ...map.types]
                .filter((e) => !isPathLocator(e.spec))
                .map((e) => (e.spec as { schema: string }).schema)
        );
        const ignoredNames = new Set(map.ignore.schemas.map((e) => e.name));
        const uncovered = [...reachable].filter((n) => !mappedNames.has(n) && !ignoredNames.has(n));
        expect(uncovered).toEqual([]);
    });

    it("every enum-constrained property resolves to a mapped enum symbol, the ordinary field-type audit, or a recorded omission", () => {
        const gaps = findUnmappedEnumProperties(spec, map, unmodeled);
        expect(gaps).toEqual([]);
    });

    it("every inline nested object/array-item shape has a recorded omission (the map format has no nested entries yet)", () => {
        const gaps = findUnmappedNestedShapes(spec, map, unmodeled);
        expect(gaps).toEqual([]);
    });
});

describe("unmodeled.json validity", () => {
    it("every property entry resolves as a real, currently-genuine gap helper", () => {
        for (const entry of unmodeled.properties) {
            expect(isUnmodeledProperty(unmodeled, entry.schema, entry.field)).toBe(true);
        }
    });

    it("every enum knownDivergence is internally consistent (has schema, enumProperty, reason, owner)", () => {
        for (const entry of unmodeled.knownDivergences) {
            if (entry.kind !== "enum") continue;
            expect(
                isKnownEnumDivergence(
                    unmodeled,
                    entry.schema,
                    entry.enumProperty,
                    entry.member ?? "anything"
                )
            ).toBe(true);
        }
    });
});

describe("withPendingMapEntries", () => {
    const base: SpecMap = {
        enums: [],
        types: [
            {
                spec: { schema: "PayinOut" },
                sdk: [{ file: "src/resources/payins/index.ts", symbol: "Payin" }],
            },
        ],
        ignore: { schemas: [] },
    };

    it("adds a schema mapping and an inline-body path mapping the run is about to persist", () => {
        const merged = withPendingMapEntries(base, [
            {
                kind: "schema",
                schema: "PlaidLinkOut",
                file: "src/resources/bank-accounts/index.ts",
                symbol: "CreatePlaidBankAccountResponse",
                notes: null,
            },
            {
                kind: "path",
                path: "/v1/instances/{instance_id}/widgets",
                method: "get",
                location: "response:200",
                file: "src/resources/widgets/index.ts",
                symbol: "ListWidgetsResponse",
                notes: "inline",
            },
        ]);
        expect(merged.types.map((t) => t.spec)).toEqual([
            { schema: "PayinOut" },
            { schema: "PlaidLinkOut" },
            {
                path: "/v1/instances/{instance_id}/widgets",
                method: "get",
                location: "response:200",
            },
        ]);
    });

    it("adds a new SDK site to an existing locator once, and leaves the input untouched", () => {
        const entry = {
            kind: "schema" as const,
            schema: "PayinOut",
            file: "src/resources/payins/index.ts",
            symbol: "GetPayinResponse",
            notes: null,
        };
        const merged = withPendingMapEntries(base, [entry, entry]);
        expect(merged.types).toHaveLength(1);
        expect(merged.types[0].sdk.map((s) => s.symbol)).toEqual(["Payin", "GetPayinResponse"]);
        expect(base.types[0].sdk).toHaveLength(1);
    });
});
