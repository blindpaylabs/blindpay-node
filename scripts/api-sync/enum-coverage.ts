import { reachableSchemas, resolveProperties, type Spec } from "./spec";
import { isPathLocator, type SpecMap, type UnmodeledFile } from "./types";

export type EnumConstraintKind = "direct" | "items" | "anyOf" | "oneOf";

export type EnumConstraint = {
    schema: string;
    property: string;
    kind: EnumConstraintKind;
};

// biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
function enumKind(node: any): EnumConstraintKind | null {
    if (!node || typeof node !== "object") return null;
    if (Array.isArray(node.enum)) return "direct";
    const t = node.type;
    const isArray = Array.isArray(t) ? t.includes("array") : t === "array";
    // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
    if (isArray && node.items && Array.isArray((node.items as any).enum)) return "items";
    // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
    if (Array.isArray(node.anyOf) && node.anyOf.some((m: any) => Array.isArray(m?.enum)))
        return "anyOf";
    // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
    if (Array.isArray(node.oneOf) && node.oneOf.some((m: any) => Array.isArray(m?.enum)))
        return "oneOf";
    return null;
}

/** Every enum-constrained top-level property on every in-scope (reachable, non-ignored) schema. */
export function findEnumConstraints(spec: Spec, map: SpecMap): EnumConstraint[] {
    const reachable = reachableSchemas(spec);
    const ignored = new Set(map.ignore.schemas.map((e) => e.name));
    const out: EnumConstraint[] = [];
    for (const schemaName of reachable) {
        if (ignored.has(schemaName)) continue;
        const node = spec.components.schemas[schemaName];
        const props = node?.properties ?? {};
        for (const [property, propNode] of Object.entries(props)) {
            const kind = enumKind(propNode);
            if (kind) out.push({ schema: schemaName, property, kind });
        }
    }
    return out;
}

function isMappedEnumSymbol(map: SpecMap, c: EnumConstraint): boolean {
    return map.enums.some((e) => {
        if (isPathLocator(e.spec)) return false;
        if (e.spec.schema !== c.schema || e.spec.property !== c.property) return false;
        return c.kind === "items" ? e.spec.itemsEnum === true : !e.spec.itemsEnum;
    });
}

/**
 * "direct" and "items" enums on a schema.property already covered by a map.types entry are not
 * invisible: reconcile.ts's per-field type comparison (specTypeSignature) reads node.enum /
 * node.items.enum and flags any drift as a needs-human failure or a recorded known-divergence,
 * even without a dedicated map.enums entry. "anyOf"/"oneOf"-wrapped enums are the real blind
 * spot: specTypeSignature does not look inside anyOf/oneOf, so a property shaped that way is
 * genuinely unchecked by any existing mechanism.
 */
function isCoveredByFieldTypeCheck(spec: Spec, map: SpecMap, c: EnumConstraint): boolean {
    if (c.kind !== "direct" && c.kind !== "items") return false;
    for (const entry of map.types) {
        if (isPathLocator(entry.spec) || entry.spec.schema !== c.schema) continue;
        try {
            if (resolveProperties(spec, entry.spec).has(c.property)) return true;
        } catch {
            // locator doesn't resolve; reconcile.ts already reports this separately
        }
    }
    return false;
}

function isRecordedOmission(unmodeled: UnmodeledFile, c: EnumConstraint): boolean {
    return unmodeled.enumPropertyOmissions.some(
        (e) => e.schema === c.schema && e.property === c.property
    );
}

/** Enum-constrained properties invisible to both the enum-insert patcher and the field-type audit. */
export function findUnmappedEnumProperties(
    spec: Spec,
    map: SpecMap,
    unmodeled: UnmodeledFile
): EnumConstraint[] {
    return findEnumConstraints(spec, map).filter(
        (c) =>
            !isMappedEnumSymbol(map, c) &&
            !isCoveredByFieldTypeCheck(spec, map, c) &&
            !isRecordedOmission(unmodeled, c)
    );
}
