import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { KnownDivergenceEntry, SpecMap, UnmodeledFile } from "./types";

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
