import { describe, expect, it } from "vitest";
import { detectNewOperations, detectNewSchemas, detectRemovals } from "./diff";
import type { Spec } from "./spec";
import type { SpecMap } from "./types";

function emptyMap(overrides: Partial<SpecMap> = {}): SpecMap {
    return { enums: [], types: [], ignore: { schemas: [] }, ...overrides };
}

describe("detectRemovals", () => {
    it("hard-fails when a mapped enum loses a member between the snapshot and the new spec", () => {
        const oldSpec: Spec = {
            paths: {},
            components: {
                schemas: {
                    S: { type: "object", properties: { f: { type: "string", enum: ["a", "b"] } } },
                },
            },
        };
        const newSpec: Spec = {
            paths: {},
            components: {
                schemas: {
                    S: { type: "object", properties: { f: { type: "string", enum: ["a"] } } },
                },
            },
        };
        const map = emptyMap({
            enums: [{ spec: { schema: "S", property: "f" }, sdk: [{ file: "x.ts", symbol: "X" }] }],
        });
        const removed = detectRemovals(oldSpec, newSpec, map);
        expect(removed.length).toBe(1);
        expect(removed[0]).toContain("b");
        expect(removed[0]).toContain("major version bump");
    });

    it("hard-fails when a mapped schema loses a property", () => {
        const oldSpec: Spec = {
            paths: {},
            components: {
                schemas: {
                    S: {
                        type: "object",
                        properties: { a: { type: "string" }, b: { type: "string" } },
                    },
                },
            },
        };
        const newSpec: Spec = {
            paths: {},
            components: {
                schemas: { S: { type: "object", properties: { a: { type: "string" } } } },
            },
        };
        const map = emptyMap({
            types: [{ spec: { schema: "S" }, sdk: [{ file: "x.ts", symbol: "X" }] }],
        });
        const removed = detectRemovals(oldSpec, newSpec, map);
        expect(removed.length).toBe(1);
        expect(removed[0]).toContain("b");
    });

    it("reports nothing when nothing was removed", () => {
        const spec: Spec = {
            paths: {},
            components: {
                schemas: { S: { type: "object", properties: { a: { type: "string" } } } },
            },
        };
        const map = emptyMap({
            types: [{ spec: { schema: "S" }, sdk: [{ file: "x.ts", symbol: "X" }] }],
        });
        expect(detectRemovals(spec, spec, map)).toEqual([]);
    });
});

describe("detectNewSchemas", () => {
    it("flags a newly reachable schema that is neither mapped nor ignored", () => {
        const oldSpec: Spec = { paths: {}, components: { schemas: {} } };
        const newSpec: Spec = {
            paths: {
                "/v1/widgets": {
                    get: {
                        responses: {
                            "200": {
                                content: {
                                    "application/json": {
                                        schema: { $ref: "#/components/schemas/Widget" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: {
                schemas: { Widget: { type: "object", properties: { id: { type: "string" } } } },
            },
        };
        const messages = detectNewSchemas(oldSpec, newSpec, emptyMap());
        expect(messages.length).toBe(1);
        expect(messages[0]).toContain("Widget");
    });

    it("orphan-schema skipping: a schema unreachable by any path or webhook never generates work", () => {
        const oldSpec: Spec = { paths: {}, components: { schemas: {} } };
        const newSpec: Spec = {
            paths: {},
            components: {
                schemas: {
                    NeverReferenced: { type: "object", properties: { id: { type: "string" } } },
                },
            },
        };
        expect(detectNewSchemas(oldSpec, newSpec, emptyMap())).toEqual([]);
    });

    it("does not flag a newly reachable schema that is already mapped", () => {
        const oldSpec: Spec = { paths: {}, components: { schemas: {} } };
        const newSpec: Spec = {
            paths: {
                "/v1/widgets": {
                    get: {
                        responses: {
                            "200": {
                                content: {
                                    "application/json": {
                                        schema: { $ref: "#/components/schemas/Widget" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: {
                schemas: { Widget: { type: "object", properties: { id: { type: "string" } } } },
            },
        };
        const map = emptyMap({
            types: [{ spec: { schema: "Widget" }, sdk: [{ file: "x.ts", symbol: "X" }] }],
        });
        expect(detectNewSchemas(oldSpec, newSpec, map)).toEqual([]);
    });

    it("does not flag a newly reachable schema that is explicitly ignored", () => {
        const oldSpec: Spec = { paths: {}, components: { schemas: {} } };
        const newSpec: Spec = {
            paths: {
                "/v1/widgets": {
                    get: {
                        responses: {
                            "200": {
                                content: {
                                    "application/json": {
                                        schema: { $ref: "#/components/schemas/Widget" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: {
                schemas: { Widget: { type: "object", properties: { id: { type: "string" } } } },
            },
        };
        const map = emptyMap({
            ignore: { schemas: [{ name: "Widget", reason: "not modeled yet" }] },
        });
        expect(detectNewSchemas(oldSpec, newSpec, map)).toEqual([]);
    });
});

describe("detectNewOperations", () => {
    it("flags a new method+path combination", () => {
        const oldSpec: Spec = { paths: { "/v1/x": { get: {} } }, components: { schemas: {} } };
        const newSpec: Spec = {
            paths: { "/v1/x": { get: {}, post: {} } },
            components: { schemas: {} },
        };
        const messages = detectNewOperations(oldSpec, newSpec);
        expect(messages.length).toBe(1);
        expect(messages[0]).toContain("post /v1/x");
    });

    it("reports nothing when no operations changed", () => {
        const spec: Spec = { paths: { "/v1/x": { get: {} } }, components: { schemas: {} } };
        expect(detectNewOperations(spec, spec)).toEqual([]);
    });
});
