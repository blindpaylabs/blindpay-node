import type { JsonValue, Spec } from "./spec";
import type { SpecMap } from "./types";

const WEBHOOK_EVENT = "webhook_event";

function withoutWebhookEvent(schema: JsonValue): { properties: JsonValue; required: string[] } {
    const properties = { ...(schema?.properties ?? {}) };
    delete properties[WEBHOOK_EVENT];
    const required = (Array.isArray(schema?.required) ? schema.required : [])
        .filter((name: string) => name !== WEBHOOK_EVENT)
        .sort();
    return { properties, required };
}

/** Schema keywords that document a value without changing its shape or type. */
const ANNOTATIONS: ReadonlySet<string> = new Set(["description", "example", "examples", "title"]);

/**
 * JSON with object keys sorted and annotation keywords dropped, so neither key order nor a
 * reworded description counts as a shape difference. Keys of a `properties` map are property
 * names, not keywords, so they are always kept.
 */
function canonical(value: JsonValue, isPropertyMap = false): string {
    if (Array.isArray(value)) return `[${value.map((v) => canonical(v)).join(",")}]`;
    if (value && typeof value === "object") {
        return `{${Object.keys(value)
            .filter((k) => isPropertyMap || !ANNOTATIONS.has(k))
            .sort()
            .map(
                (k) =>
                    `${JSON.stringify(k)}:${canonical(value[k], !isPropertyMap && k === "properties")}`
            )
            .join(",")}}`;
    }
    return JSON.stringify(value);
}

/**
 * Webhook payload schemas (`*WebhookOut`) are invisible to the field patcher when they sit in
 * `ignore.schemas`: their SDK type is `{ webhook_event } & X`, checked only through X's own
 * schema. That is sound only while the webhook schema keeps X's exact shape, so this fails
 * (needs-human) when:
 * - an ignored `*WebhookOut` schema that isn't mapped in `types[]` names no `sameShapeAs`;
 * - its `sameShapeAs` schema is missing from the spec;
 * - its properties or required list (minus `webhook_event`) differ from that schema's, which is
 *   exactly webhook-only drift, e.g. a field added to `LimitIncreaseNewWebhookOut` alone.
 */
export function findWebhookShapeDrift(spec: Spec, map: SpecMap): string[] {
    const schemas = spec.components.schemas;
    const mapped = new Set(map.types.flatMap((t) => ("schema" in t.spec ? [t.spec.schema] : [])));
    const problems: string[] = [];
    for (const entry of map.ignore.schemas) {
        if (!entry.name.endsWith("WebhookOut") || !(entry.name in schemas)) continue;
        if (!entry.sameShapeAs) {
            if (!mapped.has(entry.name)) {
                problems.push(
                    `webhook schema "${entry.name}" is ignored and unmapped but names no sameShapeAs schema in spec-map.json, so webhook-only drift on it would go unnoticed.`
                );
            }
            continue;
        }
        const base = schemas[entry.sameShapeAs];
        if (!base) {
            problems.push(
                `webhook schema "${entry.name}" is ignored as the same shape as "${entry.sameShapeAs}", which is not in the spec.`
            );
            continue;
        }
        const hook = withoutWebhookEvent(schemas[entry.name]);
        const ref = withoutWebhookEvent(base);
        const hookProps = Object.keys(hook.properties);
        const refProps = Object.keys(ref.properties);
        const onlyHook = hookProps.filter((p) => !(p in ref.properties)).sort();
        const onlyRef = refProps.filter((p) => !(p in hook.properties)).sort();
        const differing = hookProps
            .filter((p) => p in ref.properties)
            .filter((p) => canonical(hook.properties[p]) !== canonical(ref.properties[p]))
            .sort();
        const requiredDiffers = canonical(hook.required) !== canonical(ref.required);
        if (onlyHook.length || onlyRef.length || differing.length || requiredDiffers) {
            const parts = [
                onlyHook.length ? `only on the webhook: ${onlyHook.join(", ")}` : "",
                onlyRef.length ? `only on ${entry.sameShapeAs}: ${onlyRef.join(", ")}` : "",
                differing.length ? `different definition: ${differing.join(", ")}` : "",
                requiredDiffers ? "different required list" : "",
            ].filter(Boolean);
            problems.push(
                `webhook schema "${entry.name}" no longer has the same shape as "${entry.sameShapeAs}" (${parts.join("; ")}); its SDK event type reuses ${entry.sameShapeAs}'s type, so it needs its own mapping or a type change.`
            );
        }
    }
    return problems.sort();
}
