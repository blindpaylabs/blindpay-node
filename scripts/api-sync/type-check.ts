import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import {
    extractEnumMembers,
    findDeclarationSpan,
    matchAllQuoted,
    QUOTED_UNION_LIST_SOURCE,
    readSource,
} from "./sdk-scan";

export { extractTopLevelFields, type FieldInfo } from "./sdk-scan";

export type TypeSignature = {
    baseKind: "string" | "number" | "boolean" | "array" | "object" | "unknown";
    nullable: boolean;
    enumValues: string[] | null;
    narrowedFrom?: { op: "Extract" | "Exclude"; base: string };
    /** The shared union symbol this type resolves to (bare reference or Extract/Exclude base), if any. */
    namedAs?: string;
};

export function specTypeSignature(node: unknown): TypeSignature {
    // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
    const n = node as any;
    const raw = n?.type;
    const types: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const nullable = types.includes("null");
    const nonNull = types.filter((t) => t !== "null");
    let baseKind: TypeSignature["baseKind"] = "unknown";
    if (nonNull.includes("string")) baseKind = "string";
    else if (nonNull.includes("integer") || nonNull.includes("number")) baseKind = "number";
    else if (nonNull.includes("boolean")) baseKind = "boolean";
    else if (nonNull.includes("array")) baseKind = "array";
    else if (nonNull.includes("object")) baseKind = "object";
    const enumValues: string[] | null = Array.isArray(n?.enum) ? n.enum : (n?.items?.enum ?? null);
    return { baseKind, nullable, enumValues };
}

/** Resolves `name` as a string-literal union: same file first, then types/index.d.ts, then any resource file. */
export function resolveNamedUnion(
    repoRoot: string,
    currentFile: string,
    name: string
): Set<string> | null {
    const candidates = [currentFile, "types/index.d.ts"];
    for (const file of candidates) {
        try {
            const content = readSource(repoRoot, file);
            const span = findDeclarationSpan(content, name);
            const values = extractEnumMembers(span.text);
            if (values) return values;
        } catch {
            // not in this file; try the next candidate
        }
    }
    try {
        const resourcesDir = join(repoRoot, "src/resources");
        for (const file of listTsFiles(resourcesDir)) {
            const rel = relative(repoRoot, file);
            if (candidates.includes(rel)) continue;
            try {
                const content = readSource(repoRoot, rel);
                const span = findDeclarationSpan(content, name);
                const values = extractEnumMembers(span.text);
                if (values) return values;
            } catch {
                // not here either
            }
        }
    } catch {
        // resources dir missing (shouldn't happen)
    }
    return null;
}

function listTsFiles(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) listTsFiles(full, out);
        else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) out.push(full);
    }
    return out;
}

/** Classifies a TypeScript type expression (the text after `field?:` up to its terminating `;`). */
export function classifySdkType(
    typeExpr: string,
    repoRoot: string,
    currentFile: string
): TypeSignature {
    const nullable = /\|\s*null\b/.test(typeExpr) || /\bnull\s*\|/.test(typeExpr);
    const withoutNull = typeExpr
        .replace(/\s*\|\s*null\b/g, "")
        .replace(/\bnull\s*\|\s*/g, "")
        .trim();

    const narrowMatch = new RegExp(
        `^(Extract|Exclude)<\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*,\\s*(${QUOTED_UNION_LIST_SOURCE})>$`
    ).exec(withoutNull);
    if (narrowMatch) {
        const op = narrowMatch[1] as "Extract" | "Exclude";
        const base = narrowMatch[2];
        const list = matchAllQuoted(narrowMatch[3]);
        const baseSet = resolveNamedUnion(repoRoot, currentFile, base);
        let enumValues: string[] | null = null;
        if (baseSet) {
            enumValues =
                op === "Extract"
                    ? list.filter((v) => baseSet.has(v))
                    : [...baseSet].filter((v) => !list.includes(v));
        } else {
            enumValues = list;
        }
        return {
            baseKind: "string",
            nullable,
            enumValues,
            narrowedFrom: { op, base },
            namedAs: base,
        };
    }

    if (new RegExp(`^${QUOTED_UNION_LIST_SOURCE}$`).test(withoutNull)) {
        const values = matchAllQuoted(withoutNull);
        return { baseKind: "string", nullable, enumValues: values };
    }

    if (/^Array<string>$/.test(withoutNull) || /^string\[\]$/.test(withoutNull)) {
        return { baseKind: "array", nullable, enumValues: null };
    }
    if (withoutNull === "string") return { baseKind: "string", nullable, enumValues: null };
    if (withoutNull === "number") return { baseKind: "number", nullable, enumValues: null };
    if (withoutNull === "boolean") return { baseKind: "boolean", nullable, enumValues: null };
    if (withoutNull.startsWith("{") || withoutNull.startsWith("Record<")) {
        return { baseKind: "object", nullable, enumValues: null };
    }
    if (withoutNull.endsWith("[]") || /^Array</.test(withoutNull)) {
        return { baseKind: "array", nullable, enumValues: null };
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(withoutNull)) {
        const values = resolveNamedUnion(repoRoot, currentFile, withoutNull);
        if (values)
            return { baseKind: "string", nullable, enumValues: [...values], namedAs: withoutNull };
        return { baseKind: "object", nullable, enumValues: null };
    }

    return { baseKind: "unknown", nullable, enumValues: null };
}

/**
 * Compares a spec property's declared type against the SDK's declared type for the same
 * field. Returns a list of human-readable problems (empty = compatible). `skipEnumValues`
 * lets the caller defer enum-member accounting to the dedicated enum-reconciliation pass for
 * fields that are also a `spec-map.json` `enums[]` entry, so the same drift is not reported
 * twice.
 */
export function compareTypeSignatures(
    spec: TypeSignature,
    sdk: TypeSignature,
    opts: { skipEnumValues: boolean; skipNullability?: boolean } = { skipEnumValues: false }
): string[] {
    const problems: string[] = [];

    if (
        spec.baseKind !== "unknown" &&
        sdk.baseKind !== "unknown" &&
        spec.baseKind !== sdk.baseKind
    ) {
        problems.push(
            `declared type changed: spec is "${spec.baseKind}", SDK declares "${sdk.baseKind}"`
        );
        return problems; // a base-kind mismatch makes enum/nullability comparisons meaningless
    }

    if (!opts.skipNullability && spec.nullable && !sdk.nullable) {
        problems.push('spec allows null but the SDK type has no "| null"');
    }

    if (!opts.skipEnumValues && spec.enumValues) {
        if (sdk.enumValues) {
            const missing = spec.enumValues.filter(
                (v) => !(sdk.enumValues as string[]).includes(v)
            );
            if (missing.length > 0) {
                const narrowDesc = sdk.narrowedFrom
                    ? ` (${sdk.narrowedFrom.op}<${sdk.narrowedFrom.base}, ...>)`
                    : "";
                problems.push(
                    `spec enum value(s) [${missing.join(", ")}] not present in the SDK's type${narrowDesc}`
                );
            }
        } else if (sdk.baseKind === "string") {
            problems.push(
                "spec constrains this field to a fixed set of values, but the SDK declares it as a bare string (enum constraint dropped)"
            );
        }
    }

    return problems;
}
