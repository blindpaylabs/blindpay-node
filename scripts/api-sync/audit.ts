import { extractTopLevelFields, findDeclarationSpan, readSource } from "./sdk-scan";
import { resolveLocator, resolveProperties, type Spec } from "./spec";
import { classifySdkType, compareTypeSignatures, specTypeSignature } from "./type-check";
import { isPathLocator, type SpecLocator, type SpecMap } from "./types";

export type AuditFinding = {
    locator: string;
    field: string;
    site: string;
    category: "type-kind-mismatch" | "nullability" | "enum-narrowed-or-dropped";
    detail: string;
};

function locatorLabel(loc: SpecLocator): string {
    if (isPathLocator(loc)) return `${loc.method} ${loc.path}`;
    return loc.property ? `${loc.schema}.${loc.property}` : loc.schema;
}

function isArrayNode(node: unknown): node is { items: unknown } {
    // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
    const n = node as any;
    const t = n?.type;
    const isArray = Array.isArray(t) ? t.includes("array") : t === "array";
    return isArray && n?.items !== undefined;
}

function resolveFieldNode(spec: Spec, loc: SpecLocator, field: string): unknown {
    // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
    let node: any;
    try {
        node = resolveLocator(spec, loc);
    } catch {
        return undefined;
    }
    if (isArrayNode(node)) {
        // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
        const items = node.items as any;
        node = items?.$ref ? spec.components.schemas[items.$ref.split("/").pop()] : items;
    }
    return node?.properties?.[field];
}

function categorize(problem: string): AuditFinding["category"] {
    if (problem.startsWith("declared type changed")) return "type-kind-mismatch";
    if (problem.startsWith("spec allows null")) return "nullability";
    return "enum-narrowed-or-dropped";
}

/**
 * Full STATE-based comparison of every mapped property's spec type against its declared
 * TypeScript type, including nullability, which the blocking `--check`/`--apply` path
 * deliberately does not enforce (see reconcile.ts: this codebase does not mirror JSON
 * nullability into `| null` on response fields as a matter of pervasive, pre-existing house
 * style, not oversight; enforcing it retroactively is a separate, wholesale, human-reviewed
 * pass, not a Phase A concern). Always non-blocking: this function only ever reports, it never
 * throws or exits non-zero, so it is safe to run unconditionally in CI. Its purpose is exactly
 * the one state-based reconciliation exists for elsewhere in this tool: make sure the SDK's
 * CURRENT surface disagreeing with the CURRENT spec is never invisible, even when the disagreement
 * predates this run and nothing "changed."
 */
export function auditTypes(spec: Spec, map: SpecMap, repoRoot: string): AuditFinding[] {
    const findings: AuditFinding[] = [];

    for (const entry of map.types) {
        const label = locatorLabel(entry.spec);
        let specProps: Set<string>;
        try {
            specProps = resolveProperties(spec, entry.spec);
        } catch {
            continue; // surfaced by the blocking path already
        }

        for (const site of entry.sdk) {
            const siteKey = `${site.file}:${site.symbol}`;
            let fields: Map<string, { optional: boolean; typeExpr: string }>;
            try {
                const content = readSource(repoRoot, site.file);
                const span = findDeclarationSpan(content, site.symbol);
                if (!span.text.includes("{")) continue;
                fields = extractTopLevelFields(span.text);
            } catch {
                continue;
            }

            for (const field of specProps) {
                const info = fields.get(field);
                if (!info) continue;
                const specSig = specTypeSignature(resolveFieldNode(spec, entry.spec, field));
                const sdkSig = classifySdkType(info.typeExpr, repoRoot, site.file);
                const problems = compareTypeSignatures(specSig, sdkSig, { skipEnumValues: false });
                for (const problem of problems) {
                    findings.push({
                        locator: label,
                        field,
                        site: siteKey,
                        category: categorize(problem),
                        detail: problem,
                    });
                }
            }
        }
    }

    return findings.sort((a, b) =>
        a.locator + a.field + a.site < b.locator + b.field + b.site ? -1 : 1
    );
}
