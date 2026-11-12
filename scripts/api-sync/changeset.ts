import type { BumpType } from "./types";

/**
 * minor: anything was applied. New enum members, new optional fields, new methods and new error
 *   codes all widen the public API without breaking callers, which the repo's semver rules ship
 *   as a minor (an added optional field is a new feature callers can use, not a fix).
 * none: nothing was applied.
 * major is never automatic: removals hard-fail long before this point.
 */
export function classifyBump(
    hasEnumInsert: boolean,
    hasFieldInsert: boolean,
    hasOperationChange: boolean
): BumpType {
    if (hasOperationChange || hasEnumInsert || hasFieldInsert) return "minor";
    return "none";
}

/**
 * Named after the delivered spec, not a random Changesets name: the determinism proof applies
 * twice and diffs, and two syncs queued behind one Version Packages PR must not overwrite
 * each other's changeset.
 */
export function changesetFileName(specSha256: string): string {
    if (!/^[0-9a-f]{64}$/.test(specSha256))
        throw new Error(`expected a sha256 hex digest, got "${specSha256}"`);
    return `api-sync-${specSha256.slice(0, 12)}.md`;
}

/** The bump ships through the Version Packages PR; package.json is never edited here. */
export function renderChangeset(
    packageName: string,
    bump: Exclude<BumpType, "none">,
    applied: string[]
): string {
    return [
        "---",
        `"${packageName}": ${bump}`,
        "---",
        "",
        "Sync SDK with API changes:",
        "",
        ...applied.map((a) => `- ${a}`),
        "",
    ].join("\n");
}

/**
 * A second --apply against the same spec (say, after a spec-map fix lets the patcher reach
 * more) writes to the same file, so it carries the earlier run's changes and bump forward
 * instead of dropping them.
 */
export function mergeChangeset(
    existing: string | null,
    packageName: string,
    bump: Exclude<BumpType, "none">,
    applied: string[]
): string {
    if (existing === null) return renderChangeset(packageName, bump, applied);
    // Both patterns read renderChangeset's own output: the bump line and the "- " bullets.
    const mergedBump = /^".+": minor$/m.test(existing) ? "minor" : bump;
    const earlierApplied = [...existing.matchAll(/^- (.+)$/gm)].map((match) => match[1]);
    const merged = [...new Set([...earlierApplied, ...applied])].sort();
    return renderChangeset(packageName, mergedBump, merged);
}
