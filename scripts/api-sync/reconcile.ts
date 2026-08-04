import { isKnownEnumDivergence, isKnownTypeMismatchDivergence, isUnmodeledProperty } from "./map";
import {
    extractEnumMembers,
    extractTopLevelFields,
    extractTopLevelKeys,
    type FieldInfo,
    findDeclarationSpan,
    makeLookup,
    readSource,
} from "./sdk-scan";
import { resolveEnumMembers, resolveLocator, resolveProperties, type Spec } from "./spec";
import { classifySdkType, compareTypeSignatures, specTypeSignature } from "./type-check";
import {
    type ApplicableChange,
    isPathLocator,
    type SpecLocator,
    type SpecMap,
    type UnmodeledFile,
} from "./types";

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

/** Resolves the raw property schema for `field` on whatever a locator points at (unwrapping one array level). */
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

function inferTsType(node: unknown): string {
    // biome-ignore lint/suspicious/noExplicitAny: raw OpenAPI schema node
    const n = node as any;
    const rawType = n?.type;
    const types: string[] = Array.isArray(rawType) ? rawType : rawType ? [rawType] : [];
    const nullable = types.includes("null");
    let base = "string";
    if (types.includes("integer") || types.includes("number")) base = "number";
    else if (types.includes("boolean")) base = "boolean";
    else if (types.includes("object")) base = "Record<string, unknown>";
    else if (types.includes("array")) base = "unknown[]";
    return nullable ? `${base} | null` : base;
}

/**
 * Field names a factory function body injects itself (discriminators, is_account_abstraction),
 * never carried on the corresponding input/response type by design. Excluded from type-checking
 * entirely: each fan-out variant deliberately narrows to its own single literal, which is not a
 * "missing enum value" against the schema's full discriminator range, it is the discriminator
 * working as intended.
 */
const DISCRIMINATOR_FIELDS = new Set(["type", "kyc_type", "is_account_abstraction"]);

export type ReconcileResult = {
    applicable: ApplicableChange[];
    needsHuman: string[];
    divergencesHit: string[];
};

export function reconcile(
    spec: Spec,
    map: SpecMap,
    unmodeled: UnmodeledFile,
    repoRoot: string
): ReconcileResult {
    const applicable: ApplicableChange[] = [];
    const needsHuman: string[] = [];
    const divergencesHit: string[] = [];

    // (schema, property) pairs already covered by a dedicated enums[] mapping, so the type-check
    // pass below never double-reports an enum-member gap the enum-reconciliation pass already owns.
    const enumCovered = new Set(map.enums.map((e) => `${e.spec.schema} ${e.spec.property ?? ""}`));
    // Shared union symbols covered by a dedicated enums[] mapping (at ANY schema.property site,
    // not just the one canonical locator an entry happens to be anchored to): the same symbol
    // (e.g. Currency, Rail, BusinessIndustry) is routinely reused across many other schemas'
    // properties, and each of those reuses is this same drift, not a new one.
    const enumSymbolsCovered = new Set(map.enums.flatMap((e) => e.sdk.map((s) => s.symbol)));

    for (const entry of map.enums) {
        const label = locatorLabel(entry.spec);
        let specMembers: Set<string>;
        try {
            specMembers = resolveEnumMembers(spec, entry.spec);
        } catch (err) {
            needsHuman.push(
                `enum mapping "${label}" no longer resolves in the delivered spec: ${(err as Error).message}`
            );
            continue;
        }

        for (const site of entry.sdk) {
            let sdkMembers: Set<string>;
            try {
                const content = readSource(repoRoot, site.file);
                const span = findDeclarationSpan(content, site.symbol);
                const extracted = extractEnumMembers(span.text);
                if (extracted === null) {
                    needsHuman.push(
                        `enum mapping "${label}" -> ${site.file}:${site.symbol} does not look like a string-literal union; anchor may have drifted.`
                    );
                    continue;
                }
                sdkMembers = extracted;
            } catch (err) {
                needsHuman.push(
                    `enum mapping "${label}" -> ${site.file}:${site.symbol} not found: ${(err as Error).message}`
                );
                continue;
            }

            const missing = [...specMembers].filter((m) => !sdkMembers.has(m)).sort();
            for (const member of missing) {
                const enumProperty = entry.spec.property ?? "";
                if (isKnownEnumDivergence(unmodeled, entry.spec.schema, enumProperty, member)) {
                    divergencesHit.push(
                        `${label} is missing enum member "${member}" on ${site.file}:${site.symbol} (known divergence, not applied)`
                    );
                    continue;
                }
                applicable.push({
                    kind: "enum-insert",
                    schema: entry.spec.schema,
                    property: enumProperty,
                    member,
                    site,
                });
            }
        }
    }

    for (const entry of map.types) {
        const label = locatorLabel(entry.spec);
        const schemaName = isPathLocator(entry.spec) ? label : entry.spec.schema;
        const propertyName = isPathLocator(entry.spec) ? undefined : entry.spec.property;

        let specProps: Set<string>;
        try {
            specProps = resolveProperties(spec, entry.spec);
        } catch (err) {
            needsHuman.push(
                `type mapping "${label}" no longer resolves in the delivered spec: ${(err as Error).message}`
            );
            continue;
        }

        const union = new Set<string>();
        const opaqueSites = new Set<string>();
        const fieldsBySite = new Map<string, Map<string, FieldInfo>>();
        for (const site of entry.sdk) {
            const siteKey = `${site.file}:${site.symbol}`;
            try {
                const content = readSource(repoRoot, site.file);
                const span = findDeclarationSpan(content, site.symbol);
                if (!span.text.includes("{")) {
                    opaqueSites.add(siteKey);
                    continue;
                }
                const keys = extractTopLevelKeys(span.text, makeLookup(repoRoot, site.file));
                for (const k of keys) union.add(k);
                fieldsBySite.set(siteKey, extractTopLevelFields(span.text));
            } catch (err) {
                needsHuman.push(
                    `type mapping "${label}" -> ${siteKey} not found: ${(err as Error).message}`
                );
            }
        }

        const missing = [...specProps].filter((p) => !union.has(p)).sort();
        const missingSet = new Set(missing);
        for (const field of missing) {
            if (isUnmodeledProperty(unmodeled, schemaName, field)) {
                divergencesHit.push(
                    `${label} is missing property "${field}" (recorded in unmodeled.json, not applied)`
                );
                continue;
            }
            const nonOpaqueSites = entry.sdk.filter(
                (s) => !opaqueSites.has(`${s.file}:${s.symbol}`)
            );
            if (nonOpaqueSites.length === 0) {
                needsHuman.push(
                    `type mapping "${label}" is missing property "${field}" and every mapped SDK site (${entry.sdk
                        .map((s) => `${s.file}:${s.symbol}`)
                        .join(
                            ", "
                        )}) is a derived type expression this patcher will not edit automatically. Add it by hand and record it in unmodeled.json.`
                );
                continue;
            }
            // Added to every mapped SDK site (not just one): the design's rule for an additive
            // property is "add it in each mapped type", matching how enum members are broadcast
            // to every declared union site above. Always optional (`field?: T`), matching spec: an
            // added property is never required on an already-shipped type, and emitting it as
            // non-optional would force every existing caller to start passing it.
            const tsType = inferTsType(resolveFieldNode(spec, entry.spec, field));
            for (const target of nonOpaqueSites) {
                applicable.push({
                    kind: "field-insert",
                    schema: schemaName,
                    property: propertyName,
                    field,
                    tsType,
                    site: target,
                });
            }
        }

        // Type-change detection: for every spec property the SDK actually models (present, not
        // in `missing` above), compare the spec's declared type against each site's declared
        // TypeScript type. A mismatch is never auto-applicable: silently rewriting a
        // consumer-facing type is exactly the kind of change that needs a human's eyes, so every
        // finding here is either a needs-human failure or (if pre-recorded) a known divergence.
        //
        // Scoped narrower than the full comparison `auditTypes` runs (see audit.ts):
        //   - nullability is not enforced here. This codebase does not mirror JSON nullability
        //     into `| null` on response fields as a matter of pervasive, pre-existing house
        //     style (hundreds of fields), not oversight; retrofitting that is a separate,
        //     wholesale, human-reviewed pass, not a Phase A concern. `bun run audit:types`
        //     reports it in full, non-blocking, for exactly that follow-up.
        //   - discriminator fields (DISCRIMINATOR_FIELDS) are skipped entirely; see its comment.
        for (const field of specProps) {
            if (missingSet.has(field) || DISCRIMINATOR_FIELDS.has(field)) continue;
            const specSig = specTypeSignature(resolveFieldNode(spec, entry.spec, field));
            for (const [siteKey, fields] of fieldsBySite) {
                const info = fields.get(field);
                if (!info) continue; // this particular site doesn't carry the field (a fan-out variant)
                const [siteFile] = siteKey.split(":");
                const sdkSig = classifySdkType(info.typeExpr, repoRoot, siteFile);
                const skipEnumValues =
                    enumCovered.has(`${schemaName} ${field}`) ||
                    (!!sdkSig.namedAs && enumSymbolsCovered.has(sdkSig.namedAs));
                const problems = compareTypeSignatures(specSig, sdkSig, {
                    skipEnumValues,
                    skipNullability: true,
                });
                for (const problem of problems) {
                    if (isKnownTypeMismatchDivergence(unmodeled, schemaName, field)) {
                        divergencesHit.push(
                            `${label}.${field} on ${siteKey}: ${problem} (known divergence, recorded).`
                        );
                        continue;
                    }
                    needsHuman.push(`type mapping "${label}.${field}" on ${siteKey}: ${problem}.`);
                }
            }
        }
    }

    return { applicable, needsHuman, divergencesHit };
}
