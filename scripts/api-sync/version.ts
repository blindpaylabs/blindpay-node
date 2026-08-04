import type { BumpType } from "./types";

/**
 * minor: any enum member was inserted this run, or (never reachable in practice, since a new
 *   operation always hard-fails as needs-human before a bump is computed, kept only so the
 *   rule stated by the design is total, not because it can currently fire) an operation changed.
 * patch: only field additions were inserted.
 * none: nothing was applied.
 * major is never automatic: removals hard-fail long before this point.
 */
export function classifyBump(
    hasEnumInsert: boolean,
    hasFieldInsert: boolean,
    hasOperationChange: boolean
): BumpType {
    if (hasOperationChange || hasEnumInsert) return "minor";
    if (hasFieldInsert) return "patch";
    return "none";
}

export function bumpSemver(version: string, bump: BumpType): string {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
    if (!match) throw new Error(`cannot parse semver "${version}"`);
    const major = Number(match[1]);
    const minor = Number(match[2]);
    const patch = Number(match[3]);
    if (bump === "minor") return `${major}.${minor + 1}.0`;
    if (bump === "patch") return `${major}.${minor}.${patch + 1}`;
    return version;
}

/** Targeted regex replace, never a JSON.parse/stringify round trip: preserves every other byte of package.json. */
export function patchPackageJsonVersion(raw: string, newVersion: string): string {
    const re = /"version":\s*"\d+\.\d+\.\d+"/;
    if (!re.test(raw))
        throw new Error('could not find a plain-semver "version" field in package.json');
    return raw.replace(re, `"version": "${newVersion}"`);
}

export function readPackageJsonVersion(raw: string): string {
    const match = /"version":\s*"(\d+\.\d+\.\d+)"/.exec(raw);
    if (!match) throw new Error('could not find a plain-semver "version" field in package.json');
    return match[1];
}
