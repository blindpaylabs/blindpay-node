import { describe, expect, it } from "vitest";
import { findEnumConstraints, findUnmappedEnumProperties } from "./enum-coverage";
import type { Spec } from "./spec";
import type { SpecMap, UnmodeledFile } from "./types";

function emptyMap(overrides: Partial<SpecMap> = {}): SpecMap {
    return { enums: [], types: [], ignore: { schemas: [] }, ...overrides };
}

function emptyUnmodeled(overrides: Partial<UnmodeledFile> = {}): UnmodeledFile {
    return {
        properties: [],
        knownDivergences: [],
        enumPropertyOmissions: [],
        nestedShapeOmissions: [],
        ...overrides,
    };
}

describe("findEnumConstraints", () => {
    it("finds direct, items, anyOf, and oneOf enum-constrained properties", () => {
        const spec: Spec = {
            paths: { "/x": { get: { responses: { "200": {} } } } },
            components: {
                schemas: {
                    S: {
                        type: "object",
                        properties: {
                            direct: { type: "string", enum: ["a", "b"] },
                            items: { type: "array", items: { type: "string", enum: ["a"] } },
                            wrappedAny: {
                                anyOf: [{ type: "string", enum: ["a"] }, { type: "null" }],
                            },
                            wrappedOne: {
                                oneOf: [{ type: "string", enum: ["a"] }, { type: "null" }],
                            },
                            plain: { type: "string" },
                        },
                    },
                },
            },
        };
        // S must be reachable: seed it via a $ref from paths.
        spec.paths["/x"].get.responses["200"] = {
            content: { "application/json": { schema: { $ref: "#/components/schemas/S" } } },
        };
        const kinds = findEnumConstraints(spec, emptyMap())
            .map((c) => `${c.property}:${c.kind}`)
            .sort();
        expect(kinds).toEqual([
            "direct:direct",
            "items:items",
            "wrappedAny:anyOf",
            "wrappedOne:oneOf",
        ]);
    });

    it("skips schemas listed in map.ignore.schemas", () => {
        const spec: Spec = {
            paths: {
                "/x": {
                    get: {
                        responses: {
                            "200": {
                                content: {
                                    "application/json": {
                                        schema: { $ref: "#/components/schemas/S" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: {
                schemas: {
                    S: { type: "object", properties: { f: { type: "string", enum: ["a"] } } },
                },
            },
        };
        const map = emptyMap({ ignore: { schemas: [{ name: "S", reason: "n/a" }] } });
        expect(findEnumConstraints(spec, map)).toEqual([]);
    });
});

describe("findUnmappedEnumProperties", () => {
    const baseSpec: Spec = {
        paths: {
            "/x": {
                get: {
                    responses: {
                        "200": {
                            content: {
                                "application/json": { schema: { $ref: "#/components/schemas/S" } },
                            },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                S: {
                    type: "object",
                    properties: {
                        direct: { type: "string", enum: ["a", "b"] },
                        wrapped: { anyOf: [{ type: "string", enum: ["a"] }, { type: "null" }] },
                    },
                },
            },
        },
    };

    it("a direct/items enum on a schema covered by a map.types entry is not a gap, even without a dedicated enums[] entry", () => {
        const map = emptyMap({ types: [{ spec: { schema: "S" }, sdk: [] }] });
        const gaps = findUnmappedEnumProperties(baseSpec, map, emptyUnmodeled());
        expect(gaps.map((g) => g.property)).toEqual(["wrapped"]);
    });

    it("a direct enum with a dedicated map.enums entry is covered even without a map.types entry", () => {
        const map = emptyMap({
            enums: [{ spec: { schema: "S", property: "direct" }, sdk: [] }],
        });
        const gaps = findUnmappedEnumProperties(baseSpec, map, emptyUnmodeled());
        expect(gaps.map((g) => g.property).sort()).toEqual(["wrapped"]);
    });

    it("anyOf/oneOf-wrapped enums are never covered by the ordinary field-type comparison", () => {
        const map = emptyMap({ types: [{ spec: { schema: "S" }, sdk: [] }] });
        const gaps = findUnmappedEnumProperties(baseSpec, map, emptyUnmodeled());
        expect(gaps).toEqual([{ schema: "S", property: "wrapped", kind: "anyOf" }]);
    });

    it("a recorded omission suppresses the gap", () => {
        const map = emptyMap({ types: [{ spec: { schema: "S" }, sdk: [] }] });
        const unmodeled = emptyUnmodeled({
            enumPropertyOmissions: [
                { schema: "S", property: "wrapped", reason: "test", owner: "eric@blindpay.com" },
            ],
        });
        expect(findUnmappedEnumProperties(baseSpec, map, unmodeled)).toEqual([]);
    });
});
