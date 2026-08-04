import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { isKnownEnumDivergence, isUnmodeledProperty, loadSpecMap, loadUnmodeled } from "./map";
import { findDeclarationSpan, readSource } from "./sdk-scan";
import {
    loadSpec,
    reachableSchemas,
    resolveEnumMembers,
    resolveProperties,
    type Spec,
} from "./spec";
import { isPathLocator } from "./types";

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
