import { describe, expect, it } from "vitest";
import { findNestedShapes, findUnmappedNestedShapes } from "./nested-coverage";
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

function specWithSchema(schema: Record<string, unknown>): Spec {
    return {
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
        components: { schemas: { S: schema } },
    };
}

describe("findNestedShapes", () => {
    it("finds an inline nested object property", () => {
        const spec = specWithSchema({
            type: "object",
            properties: { nested: { type: "object", properties: { a: { type: "string" } } } },
        });
        expect(findNestedShapes(spec, emptyMap())).toEqual([{ schema: "S", path: "nested" }]);
    });

    it("finds an inline object shape under an array property and marks the array hop", () => {
        const spec = specWithSchema({
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: { type: "object", properties: { a: { type: "string" } } },
                },
            },
        });
        expect(findNestedShapes(spec, emptyMap())).toEqual([{ schema: "S", path: "items[]" }]);
    });

    it("does not descend into a $ref'd schema (that's a reusable named schema, not an inline shape)", () => {
        const spec = specWithSchema({
            type: "object",
            properties: { other: { $ref: "#/components/schemas/Other" } },
        });
        expect(findNestedShapes(spec, emptyMap())).toEqual([]);
    });

    it("recurses into nested-within-nested shapes", () => {
        const spec = specWithSchema({
            type: "object",
            properties: {
                outer: {
                    type: "object",
                    properties: {
                        inner: { type: "object", properties: { a: { type: "string" } } },
                    },
                },
            },
        });
        const paths = findNestedShapes(spec, emptyMap())
            .map((s) => s.path)
            .sort();
        expect(paths).toEqual(["outer", "outer.inner"]);
    });

    it("skips schemas listed in map.ignore.schemas", () => {
        const spec = specWithSchema({
            type: "object",
            properties: { nested: { type: "object", properties: { a: { type: "string" } } } },
        });
        const map = emptyMap({ ignore: { schemas: [{ name: "S", reason: "n/a" }] } });
        expect(findNestedShapes(spec, map)).toEqual([]);
    });
});

describe("findUnmappedNestedShapes", () => {
    it("a recorded omission suppresses the gap", () => {
        const spec = specWithSchema({
            type: "object",
            properties: { nested: { type: "object", properties: { a: { type: "string" } } } },
        });
        const unmodeled = emptyUnmodeled({
            nestedShapeOmissions: [
                { schema: "S", path: "nested", reason: "test", owner: "eric@blindpay.com" },
            ],
        });
        expect(findUnmappedNestedShapes(spec, emptyMap(), unmodeled)).toEqual([]);
    });

    it("an unrecorded nested shape is a gap", () => {
        const spec = specWithSchema({
            type: "object",
            properties: { nested: { type: "object", properties: { a: { type: "string" } } } },
        });
        expect(findUnmappedNestedShapes(spec, emptyMap(), emptyUnmodeled())).toEqual([
            { schema: "S", path: "nested" },
        ]);
    });
});
