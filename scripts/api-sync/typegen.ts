import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractEnumMembers, findDeclarationSpan } from "./sdk-scan";
import type { JsonValue, Spec } from "./spec";
import type { SpecMap } from "./types";

function resolveRef(spec: Spec, node: JsonValue): JsonValue {
    if (node && typeof node === "object" && typeof node.$ref === "string") {
        const name = node.$ref.split("/").pop() as string;
        return spec.components.schemas[name];
    }
    return node;
}

function refName(node: JsonValue): string | null {
    if (node && typeof node === "object" && typeof node.$ref === "string") {
        return node.$ref.split("/").pop() as string;
    }
    return null;
}

/** Every `export type X = "a" | "b" | ...;` declared in types/index.d.ts, keyed by a sorted,
 * comma-joined signature of its member values, so an inline spec enum with the same value set
 * can be pointed at the canonical shared symbol instead of a fresh inline literal union. */
export function loadCanonicalEnums(repoRoot: string): Map<string, string> {
    const path = join(repoRoot, "types/index.d.ts");
    const content = readFileSync(path, "utf8");
    const out = new Map<string, string>();
    const declRe = /^export type ([A-Za-z_][A-Za-z0-9_]*)\b/gm;
    for (const m of content.matchAll(declRe)) {
        const symbol = m[1];
        try {
            const span = findDeclarationSpan(content, symbol);
            const members = extractEnumMembers(span.text);
            if (members && members.size > 0) {
                out.set([...members].sort().join(","), symbol);
            }
        } catch {
            // not a bare string-literal union; skip
        }
    }
    return out;
}

/** Whole-schema entries (no `property`) already mapped in spec-map.json, keyed by schema name,
 * so a $ref to an already-modeled schema reuses its SDK symbol instead of being re-inlined. */
export function loadWholeSchemaSymbols(
    map: SpecMap
): Map<string, { file: string; symbol: string }> {
    const out = new Map<string, { file: string; symbol: string }>();
    for (const entry of [...map.enums, ...map.types]) {
        const loc = entry.spec as { schema?: string; property?: string };
        if (loc.schema && !loc.property && entry.sdk[0]) {
            out.set(loc.schema, entry.sdk[0]);
        }
    }
    return out;
}

export type TypegenContext = {
    spec: Spec;
    canonicalEnums: Map<string, string>;
    wholeSchemas: Map<string, { file: string; symbol: string }>;
    /** Symbols this synthesis run ended up reusing; the caller must ensure each is imported. */
    importsNeeded: Set<string>;
};

function quoteUnion(values: unknown[]): string {
    return values.map((v) => JSON.stringify(v)).join(" | ");
}

function wrapArrayItem(itemType: string): string {
    return itemType.includes("|") ? `(${itemType})[]` : `${itemType}[]`;
}

/**
 * Recursively compiles a raw OpenAPI schema node into a TypeScript type expression:
 *   - required object properties are non-optional; optional ones keep `?`.
 *   - a nullable spec node appends `| null`, required or not (reconcile.ts enforces this).
 *   - string enums become a literal union, or the canonical shared symbol if one already
 *     declares the exact same value set (e.g. spec inlines Network's values -> `Network`).
 *   - a $ref to a schema already mapped whole in spec-map.json reuses that SDK symbol.
 */
export function synthesizeType(ctx: TypegenContext, node: JsonValue): string {
    const named = refName(node);
    if (named) {
        const whole = ctx.wholeSchemas.get(named);
        if (whole) {
            ctx.importsNeeded.add(whole.symbol);
            return whole.symbol;
        }
    }
    const resolved = resolveRef(ctx.spec, node);
    return synthesizeResolvedType(ctx, resolved);
}

function synthesizeResolvedType(ctx: TypegenContext, node: JsonValue): string {
    if (node === undefined || node === null) return "unknown";

    if (Array.isArray(node.enum) && node.enum.length > 0) {
        const sig = [...node.enum].map(String).sort().join(",");
        const canonical = ctx.canonicalEnums.get(sig);
        const base = canonical ?? quoteUnion(node.enum);
        if (canonical) ctx.importsNeeded.add(canonical);
        return nullableSuffix(node, base);
    }

    const rawTypes: string[] = Array.isArray(node.type) ? node.type : node.type ? [node.type] : [];
    const nonNull = rawTypes.filter((t) => t !== "null");

    if (nonNull.includes("array")) {
        const itemType = node.items ? synthesizeType(ctx, node.items) : "unknown";
        return nullableSuffix(node, wrapArrayItem(itemType));
    }
    if (nonNull.includes("object") || node.properties) {
        return nullableSuffix(node, synthesizeObjectLiteral(ctx, node));
    }
    if (nonNull.includes("integer") || nonNull.includes("number")) {
        return nullableSuffix(node, "number");
    }
    if (nonNull.includes("boolean")) {
        return nullableSuffix(node, "boolean");
    }
    if (nonNull.includes("string")) {
        return nullableSuffix(node, "string");
    }
    return "unknown";
}

function nullableSuffix(node: JsonValue, base: string): string {
    const rawTypes: string[] = Array.isArray(node.type) ? node.type : node.type ? [node.type] : [];
    return rawTypes.includes("null") ? `${base} | null` : base;
}

/** Compiles an object schema's properties into `{ a: T; b?: U; }`, one property per line. */
export function synthesizeObjectLiteral(ctx: TypegenContext, node: JsonValue): string {
    const props = node?.properties ?? {};
    const requiredSet = new Set<string>(node?.required ?? []);
    const lines: string[] = [];
    for (const [name, propNode] of Object.entries(props)) {
        const isRequired = requiredSet.has(name);
        const tsType = synthesizeType(ctx, propNode);
        lines.push(`    ${name}${isRequired ? "" : "?"}: ${tsType};`);
    }
    if (lines.length === 0) return "Record<string, unknown>";
    return `{\n${lines.join("\n")}\n}`;
}

/** Property list of an object schema, each with its own compiled type text (not indented),
 * used to build a flat Input type merging path/query fields with a request body's properties. */
export function synthesizeObjectFields(
    ctx: TypegenContext,
    node: JsonValue
): Array<{ name: string; tsType: string; required: boolean }> {
    const props = node?.properties ?? {};
    const requiredSet = new Set<string>(node?.required ?? []);
    return Object.entries(props).map(([name, propNode]) => {
        const isRequired = requiredSet.has(name);
        return { name, tsType: synthesizeType(ctx, propNode), required: isRequired };
    });
}
