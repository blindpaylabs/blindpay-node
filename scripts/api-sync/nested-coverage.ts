import { reachableSchemas, type Spec } from "./spec";
import type { SpecMap, UnmodeledFile } from "./types";

export type NestedShape = {
    schema: string;
    /** Dot-path from the schema root, e.g. "tracking_transaction.pse_instruction". "[]" marks an array-item hop. */
    path: string;
};

// biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
function isObjectNode(n: any): boolean {
    if (!n || typeof n !== "object" || n.$ref) return false;
    const t = n.type;
    const types: string[] = Array.isArray(t) ? t : t ? [t] : [];
    return types.includes("object") || (!!n.properties && types.length === 0);
}

// biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
function isArrayNode(n: any): boolean {
    const t = n?.type;
    const types: string[] = Array.isArray(t) ? t : t ? [t] : [];
    return types.includes("array");
}

// biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
function walk(schemaName: string, node: any, path: string, out: NestedShape[]): void {
    if (!node?.properties) return;
    for (const [property, propNode] of Object.entries(node.properties) as [string, unknown][]) {
        const subpath = path ? `${path}.${property}` : property;
        // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
        let target = propNode as any;
        let arrayHop = false;
        if (isArrayNode(target) && target.items) {
            target = target.items;
            arrayHop = true;
        }
        if (target?.$ref) continue; // reusable named schema, not an inline shape
        if (isObjectNode(target)) {
            const fullPath = arrayHop ? `${subpath}[]` : subpath;
            out.push({ schema: schemaName, path: fullPath });
            walk(schemaName, target, fullPath, out);
        }
    }
}

/** Every inline nested object/array-item-object shape under every in-scope (reachable, non-ignored) schema. */
export function findNestedShapes(spec: Spec, map: SpecMap): NestedShape[] {
    const reachable = reachableSchemas(spec);
    const ignored = new Set(map.ignore.schemas.map((e) => e.name));
    const out: NestedShape[] = [];
    for (const schemaName of reachable) {
        if (ignored.has(schemaName)) continue;
        walk(schemaName, spec.components.schemas[schemaName], "", out);
    }
    return out;
}

function isRecordedOmission(unmodeled: UnmodeledFile, s: NestedShape): boolean {
    return unmodeled.nestedShapeOmissions.some((e) => e.schema === s.schema && e.path === s.path);
}

/** Nested shapes with neither a map entry (none exist yet; the map format is flat) nor a recorded omission. */
export function findUnmappedNestedShapes(
    spec: Spec,
    map: SpecMap,
    unmodeled: UnmodeledFile
): NestedShape[] {
    return findNestedShapes(spec, map).filter((s) => !isRecordedOmission(unmodeled, s));
}
