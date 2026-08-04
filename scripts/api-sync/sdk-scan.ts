import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Matches a single- or double-quoted string literal; this codebase uses both inconsistently
 * (e.g. types/index.d.ts's TrackingStatus/EstimatedTimeOfArrival are single-quoted while most
 * other unions are double-quoted). Group 1 or group 2 holds the literal's contents. */
export const QUOTED_STRING_SOURCE = `"([^"]*)"|'([^']*)'`;

/**
 * A `|`-separated list of quoted string literals, allowing the pipe on either side of each
 * item (both `"a" | "b"` and the one-member-per-line `| "a"\n| "b"` style used for some unions
 * in this codebase are valid TypeScript and both appear here).
 */
export const QUOTED_UNION_LIST_SOURCE = `(?:\\|?\\s*(?:${QUOTED_STRING_SOURCE})\\s*)+`;

export function matchAllQuoted(text: string): string[] {
    return [...text.matchAll(new RegExp(QUOTED_STRING_SOURCE, "g"))].map((m) => m[1] ?? m[2]);
}

/**
 * Bounds a search to one top-level `export type <symbol> = ...;` declaration: from its
 * `export type` line up to (but not including) the next top-level `export ` declaration,
 * or EOF. Every scan/apply below is scoped this way so a match can never leak into an
 * unrelated symbol declared later in the file (mirrors blindpay-cli's sliceToNextExport).
 */
export function findDeclarationSpan(
    content: string,
    symbol: string
): { start: number; end: number; text: string } {
    const declRe = new RegExp(`^export type ${escapeRegExp(symbol)}\\b`, "m");
    const match = declRe.exec(content);
    if (!match) {
        throw new Error(`type "${symbol}" not found`);
    }
    const start = match.index;
    const rest = content.slice(start + 1);
    const nextExport = rest.search(/^export /m);
    const end = nextExport === -1 ? content.length : start + 1 + nextExport;
    return { start, end, text: content.slice(start, end) };
}

export type FieldInfo = { optional: boolean; typeExpr: string };

/**
 * Direct (depth-1) fields of an `export type X = { ... }` (or `Array<{ ... }>`, or
 * `Pick<Y, ...> & { ... }`) declaration, keyed by name, each with its optionality and full
 * type-expression text. Tracks a combined `{ ( < [` / `} ) > ]` depth so a field's own type ,
 * including a single-line nested object literal with its own internal `;` separators, is
 * captured whole and never truncated at the first semicolon encountered, and so nothing at
 * depth 0 (e.g. a `Pick<A, "x">` reference before `& {`) is misread as a field.
 */
export function extractTopLevelFields(declText: string): Map<string, FieldInfo> {
    const fields = new Map<string, FieldInfo>();
    let depth = 0;
    let i = 0;
    const n = declText.length;
    const fieldStartRe = /^(?:readonly\s+)?([A-Za-z_][A-Za-z0-9_]*)(\??)\s*:\s*/;

    while (i < n) {
        if (depth === 1) {
            const rest = declText.slice(i);
            const m = fieldStartRe.exec(rest);
            if (m) {
                const name = m[1];
                const optional = m[2] === "?";
                let j = i + m[0].length;
                let localDepth = 0;
                let lastNonSpace = "";
                const typeStart = j;
                while (j < n) {
                    const ch = declText[j];
                    if (ch === "{" || ch === "(" || ch === "<" || ch === "[") {
                        localDepth++;
                        lastNonSpace = ch;
                    } else if (ch === "}" || ch === ")" || ch === ">" || ch === "]") {
                        if (localDepth === 0) break;
                        localDepth--;
                        lastNonSpace = ch;
                    } else if (ch === ";" && localDepth === 0) {
                        break;
                    } else if (ch === "\n" && localDepth === 0) {
                        // A newline is itself a valid TS object-type member separator (members
                        // may be delimited by `;`, `,`, or just a line break): treat it as an
                        // implicit terminator too, unless the statement clearly continues onto
                        // the next line, either forward (a dangling `|`, `&`, `,` just before this
                        // newline) or backward (the next non-blank content starts with `|` or
                        // `&`, the one-member-per-line union style used elsewhere in this codebase).
                        if ("|&,".includes(lastNonSpace)) {
                            // falls through to advance j below
                        } else {
                            let k = j + 1;
                            while (k < n && /\s/.test(declText[k])) k++;
                            if (k < n && (declText[k] === "|" || declText[k] === "&")) {
                                // leading-continuation style; keep consuming
                            } else {
                                break;
                            }
                        }
                    } else if (!/\s/.test(ch)) {
                        lastNonSpace = ch;
                    }
                    j++;
                }
                const typeText = declText.slice(typeStart, j);
                fields.set(name, { optional, typeExpr: typeText.trim() });
                for (const ch of typeText) {
                    if (ch === "{") depth++;
                    else if (ch === "}") depth--;
                }
                i = j < n && (declText[j] === ";" || declText[j] === "\n") ? j + 1 : j;
                continue;
            }
        }
        const ch = declText[i];
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
        i++;
    }

    return fields;
}

/**
 * Top-level property keys of a declaration (see extractTopLevelFields). Also resolves one
 * level of `Pick<Other, "a" | "b">` by looking up Other's own top-level keys (via
 * `lookupOther`) and intersecting with the picked literal names.
 */
export function extractTopLevelKeys(
    declText: string,
    lookupOther?: (symbol: string) => Set<string> | null
): Set<string> {
    const keys = new Set(extractTopLevelFields(declText).keys());

    const pickMatch = new RegExp(
        `Pick<\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*,\\s*(${QUOTED_UNION_LIST_SOURCE})>`
    ).exec(declText);
    if (pickMatch && lookupOther) {
        const otherKeys = lookupOther(pickMatch[1]);
        if (otherKeys) {
            const picked = matchAllQuoted(pickMatch[2]);
            for (const p of picked) {
                if (otherKeys.has(p)) keys.add(p);
            }
        }
    }

    return keys;
}

/** String-literal union members of an `export type X = "a" | "b" | ...;` declaration, or null. */
export function extractEnumMembers(declText: string): Set<string> | null {
    const eqIdx = declText.indexOf("=");
    if (eqIdx === -1) return null;
    const semiIdx = declText.indexOf(";");
    const body = declText.slice(eqIdx + 1, semiIdx === -1 ? undefined : semiIdx);
    // Reject anything that looks like an object/array/generic shape, not a bare string union.
    if (/[{<]/.test(body)) return null;
    const quoted = matchAllQuoted(body);
    if (quoted.length === 0) return null;
    return new Set(quoted);
}

const fileCache = new Map<string, string>();

export function readSource(repoRoot: string, file: string): string {
    const key = join(repoRoot, file);
    const cached = fileCache.get(key);
    if (cached !== undefined) return cached;
    if (!existsSync(key)) throw new Error(`file "${file}" not found`);
    const content = readFileSync(key, "utf8");
    fileCache.set(key, content);
    return content;
}

export function clearSourceCache(): void {
    fileCache.clear();
}

/** Builds a same-file symbol lookup for extractTopLevelKeys' Pick<> resolution. */
export function makeLookup(repoRoot: string, file: string): (symbol: string) => Set<string> | null {
    return (symbol: string) => {
        try {
            const content = readSource(repoRoot, file);
            const span = findDeclarationSpan(content, symbol);
            return extractTopLevelKeys(span.text);
        } catch {
            return null;
        }
    };
}
