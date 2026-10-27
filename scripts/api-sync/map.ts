import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type {
    KnownDivergenceEntry,
    NewSchemaMapEntry,
    PathLocator,
    SpecLocator,
    SpecMap,
    UnmodeledFile,
} from "./types";

export function loadSpecMap(path: string): SpecMap {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    if (
        !Array.isArray(raw.enums) ||
        !Array.isArray(raw.types) ||
        !Array.isArray(raw.ignore?.schemas)
    ) {
        throw new Error(`${path}: expected {enums: [], types: [], ignore: {schemas: []}}`);
    }
    return raw;
}

/**
 * The map as it will look once this run's operation-inserts persist their new types[] entries.
 * `--apply` judges new schemas and enum coverage against it, so a schema the generator is about
 * to map is not reported as needing a human. Never mutates `map`.
 */
export function withPendingMapEntries<M extends Pick<SpecMap, "types">>(
    map: M,
    entries: NewSchemaMapEntry[]
): M {
    const types = map.types.map((t) => ({ ...t, sdk: [...t.sdk] }));
    for (const entry of entries) {
        const locator: SpecLocator =
            entry.kind === "schema"
                ? { schema: entry.schema }
                : {
                      path: entry.path,
                      method: entry.method,
                      location: entry.location as PathLocator["location"],
                  };
        const site = { file: entry.file, symbol: entry.symbol };
        const existing = types.find((t) => JSON.stringify(t.spec) === JSON.stringify(locator));
        if (!existing) {
            types.push({ spec: locator, sdk: [site], notes: entry.notes });
        } else if (!existing.sdk.some((t) => t.symbol === entry.symbol)) {
            existing.sdk.push(site);
        }
    }
    return { ...map, types };
}

export function loadUnmodeled(path: string): UnmodeledFile {
    const raw = JSON.parse(readFileSync(path, "utf8"));
    if (
        !Array.isArray(raw.properties) ||
        !Array.isArray(raw.knownDivergences) ||
        !Array.isArray(raw.enumPropertyOmissions) ||
        !Array.isArray(raw.nestedShapeOmissions)
    ) {
        throw new Error(
            `${path}: expected {properties: [], knownDivergences: [], enumPropertyOmissions: [], nestedShapeOmissions: []}`
        );
    }
    return raw;
}

export function isUnmodeledProperty(
    unmodeled: UnmodeledFile,
    schema: string,
    field: string
): boolean {
    return unmodeled.properties.some((e) => e.schema === schema && e.field === field);
}

/**
 * True if the given (schema, enumProperty, member) is covered by a knownDivergences entry.
 * An entry with a specific `member` covers only that member; an entry with no `member` at all
 * is a blanket note covering the whole enum's current gap state for that (schema, enumProperty).
 */
export function isKnownEnumDivergence(
    unmodeled: UnmodeledFile,
    schema: string,
    enumProperty: string,
    member: string
): boolean {
    return unmodeled.knownDivergences.some((e: KnownDivergenceEntry) => {
        if (e.kind !== "enum" || e.schema !== schema || e.enumProperty !== enumProperty)
            return false;
        return e.member === undefined || e.member === member;
    });
}

export function isKnownTypeMismatchDivergence(
    unmodeled: UnmodeledFile,
    schema: string,
    field: string
): boolean {
    return unmodeled.knownDivergences.some(
        (e) => e.kind === "type-mismatch" && e.schema === schema && e.field === field
    );
}

export function findSdkFileExists(repoRoot: string, file: string): boolean {
    return existsSync(join(repoRoot, file));
}

/** True if `${method.toUpperCase()} ${path}` is a recorded, human-accepted ignore.operations entry. */
export function isIgnoredOperation(map: SpecMap, method: string, path: string): boolean {
    const key = `${method.toUpperCase()} ${path}`;
    return (map.ignore.operations ?? []).some((e) => e.name === key);
}
