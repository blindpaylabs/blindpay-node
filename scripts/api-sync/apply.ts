import { findDeclarationSpan } from "./sdk-scan";

function leadingWhitespace(line: string): string {
    return /^(\s*)/.exec(line)?.[1] ?? "";
}

/**
 * Inserts a new string-literal member into a scoped `export type X = ...;` union, matching
 * whichever style the declaration already uses:
 *   - single-line: `export type X = "a" | "b";` -> appended before the closing `;` on that line.
 *   - one-member-per-line (leading `|`): a new `| "member"` line is inserted just before the
 *     final member's line, so that line keeps its own trailing `;` untouched.
 * Idempotent: returns `content` unchanged if `member` is already present in the union.
 */
export function insertEnumMember(content: string, symbol: string, member: string): string {
    const span = findDeclarationSpan(content, symbol);
    if (new RegExp(`"${member.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(span.text)) {
        return content;
    }

    const lines = span.text.split("\n");
    const declLineIdx = lines.findIndex((l) => l.includes(`export type ${symbol}`));
    if (declLineIdx === -1)
        throw new Error(`apply: could not locate declaration line for "${symbol}"`);

    if (lines[declLineIdx].includes(";")) {
        // single-line union: `export type X = "a" | "b" | "c";`
        const semiIdx = lines[declLineIdx].lastIndexOf(";");
        lines[declLineIdx] =
            `${lines[declLineIdx].slice(0, semiIdx)} | "${member}"${lines[declLineIdx].slice(semiIdx)}`;
    } else if (/=\s*"[^"]*"(\s*\|\s*"[^"]*")*\s*$/.test(lines[declLineIdx])) {
        // single-line union with no trailing `;` (valid in a .d.ts): `export type X = "a" | "b"`
        lines[declLineIdx] = `${lines[declLineIdx].trimEnd()} | "${member}"`;
    } else {
        // one-member-per-line union with a leading `|`; find the last such line (it carries the `;`).
        let lastMemberIdx = -1;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (/^\s*\|\s*".*"\s*;\s*$/.test(lines[i])) {
                lastMemberIdx = i;
                break;
            }
        }
        if (lastMemberIdx === -1) {
            throw new Error(`apply: could not locate the last union member line for "${symbol}"`);
        }
        const indent = leadingWhitespace(lines[lastMemberIdx]);
        lines.splice(lastMemberIdx, 0, `${indent}| "${member}"`);
    }

    const patched = lines.join("\n");
    return content.slice(0, span.start) + patched + content.slice(span.end);
}

/**
 * Inserts `<field>?: <tsType>;` as the last property of a scoped `export type X = { ... }`
 * (or `Array<{ ... }>`) declaration, matching the indentation of its sibling properties.
 * Idempotent: returns `content` unchanged if `field` is already declared on this type.
 */
export function insertOptionalField(
    content: string,
    symbol: string,
    field: string,
    tsType: string
): string {
    const span = findDeclarationSpan(content, symbol);
    if (new RegExp(`^\\s*(?:readonly\\s+)?${field}\\??\\s*:`, "m").test(span.text)) {
        return content;
    }

    const lines = span.text.split("\n");
    let depth = 0;
    let closingIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        const before = depth;
        for (const ch of lines[i]) {
            if (ch === "{") depth++;
            else if (ch === "}") depth--;
        }
        if (before === 1 && depth === 0) {
            closingIdx = i;
            break;
        }
    }
    if (closingIdx === -1) {
        throw new Error(
            `apply: could not locate the closing brace of "${symbol}" to anchor the new field before`
        );
    }

    let indent = "    ";
    for (let i = closingIdx - 1; i >= 0; i--) {
        if (lines[i].trim() !== "") {
            indent = leadingWhitespace(lines[i]);
            break;
        }
    }

    const typeText = tsType.split("\n").join(`\n${indent}`);
    lines.splice(closingIdx, 0, `${indent}${field}?: ${typeText};`);
    const patched = lines.join("\n");
    return content.slice(0, span.start) + patched + content.slice(span.end);
}

/**
 * Inserts `typeDecls` (one or more `export type X = ...;` blocks, already blank-line separated)
 * directly above `export function <factoryFn>(...)`. Idempotent: a no-op if the exact block
 * (verbatim) is already present, so a second --apply against unchanged state is byte-identical.
 */
export function insertTypeDeclarations(
    content: string,
    factoryFn: string,
    typeDecls: string
): string {
    if (!typeDecls) return content;
    if (content.includes(typeDecls)) return content;
    const declRe = new RegExp(`^export function ${factoryFn}\\b`, "m");
    const match = declRe.exec(content);
    if (!match) throw new Error(`apply: could not locate "export function ${factoryFn}"`);
    return `${content.slice(0, match.index)}${typeDecls}\n\n${content.slice(match.index)}`;
}

/**
 * Inserts one method (already formatted as `methodName(...): ReturnType { ... },`, 8-space
 * indented) as the last entry of `export function <factoryFn>(...) { return { ... }; }`'s
 * returned object literal. Idempotent: a no-op if a method with the same name already exists
 * anywhere in that returned object.
 */
export function insertResourceMethod(
    content: string,
    factoryFn: string,
    methodName: string,
    methodSource: string
): string {
    const declRe = new RegExp(`^export function ${factoryFn}\\b[^{]*\\{`, "m");
    const declMatch = declRe.exec(content);
    if (!declMatch) throw new Error(`apply: could not locate "export function ${factoryFn}"`);

    const fnBodyStart = declMatch.index + declMatch[0].length;
    const returnRe = /return\s*\{/;
    const returnMatch = returnRe.exec(content.slice(fnBodyStart));
    if (!returnMatch) throw new Error(`apply: could not locate "return {" in "${factoryFn}"`);
    const objStart = fnBodyStart + returnMatch.index + returnMatch[0].length; // just after "return {"

    let depth = 1;
    let i = objStart;
    while (i < content.length && depth > 0) {
        if (content[i] === "{") depth++;
        else if (content[i] === "}") depth--;
        if (depth === 0) break;
        i++;
    }
    const objEnd = i; // index of the matching "}"

    const objectText = content.slice(objStart, objEnd);
    if (new RegExp(`(^|\\s)${methodName}\\s*\\(`).test(objectText)) {
        return content; // method already present; idempotent no-op
    }

    const insertion = `\n        ${methodSource}`;
    return `${content.slice(0, objEnd)}${insertion}\n    ${content.slice(objEnd)}`;
}

/**
 * Adds any of `names` not already present to the (single) `import type { ... } from
 * "../../../types";` statement, alphabetically merged into the existing list.
 */
export function ensureSharedTypeImports(content: string, names: string[]): string {
    if (names.length === 0) return content;
    const re = /import type \{([^}]*)\} from "([./]*types)";/;
    const match = re.exec(content);
    if (!match) {
        const missing = names.map((n) => `"${n}"`).join(", ");
        throw new Error(
            `apply: could not locate a shared "import type { ... } from \\".../types\\";" statement to add ${missing} to`
        );
    }
    const existing = match[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const merged = new Set([...existing, ...names]);
    const sorted = [...merged].sort();
    const replacement = `import type {\n    ${sorted.join(",\n    ")},\n} from "${match[2]}";`;
    return (
        content.slice(0, match.index) + replacement + content.slice(match.index + match[0].length)
    );
}

/**
 * Adds `import { toQueryString } from ".../internal/query";` among the file's other
 * `.../internal/*` imports, in the alphabetical slot Biome's organizeImports expects, reusing
 * the relative prefix of its `InternalApiClient` import. Idempotent: a no-op when the helper is
 * already imported.
 */
export function ensureQueryStringImport(content: string): string {
    if (/import \{[^}]*\btoQueryString\b[^}]*\} from "[./]*internal\/query";/.test(content)) {
        return content;
    }
    const anchor = /import type \{ InternalApiClient \} from "([./]*)internal\/api-client";/.exec(
        content
    );
    if (!anchor) {
        throw new Error(
            'apply: could not locate the "import type { InternalApiClient } ..." statement to add the toQueryString import next to'
        );
    }
    const prefix = anchor[1];
    const target = `${prefix}internal/query`;
    // Insert after the last `${prefix}internal/...` import whose module sorts before ours.
    let insertAt = anchor.index + anchor[0].length;
    for (const m of content.matchAll(/^import [^;]* from "([^"]+)";$/gm)) {
        const from = m[1];
        if (from.startsWith(`${prefix}internal/`) && from < target && m.index !== undefined) {
            insertAt = Math.max(insertAt, m.index + m[0].length);
        }
    }
    return `${content.slice(0, insertAt)}\nimport { toQueryString } from "${target}";${content.slice(insertAt)}`;
}
