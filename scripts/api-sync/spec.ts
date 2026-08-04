import { readFileSync } from "node:fs";
import { isPathLocator, type SpecLocator } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: OpenAPI documents are arbitrarily shaped JSON.
export type JsonValue = any;

export type Spec = {
    paths: Record<string, Record<string, JsonValue>>;
    webhooks?: Record<string, JsonValue>;
    components: { schemas: Record<string, JsonValue> };
};

export function loadSpec(path: string): Spec {
    return JSON.parse(readFileSync(path, "utf8"));
}

function collectRefs(node: JsonValue, out: Set<string>): void {
    if (Array.isArray(node)) {
        for (const item of node) collectRefs(item, out);
        return;
    }
    if (node && typeof node === "object") {
        if (typeof node.$ref === "string") {
            out.add(node.$ref.split("/").pop() as string);
        }
        for (const value of Object.values(node)) collectRefs(value, out);
    }
}

/** Transitive $ref closure from every path operation plus the top-level webhooks object. */
export function reachableSchemas(spec: Spec): Set<string> {
    const allNames = new Set(Object.keys(spec.components.schemas));
    const seed = new Set<string>();
    collectRefs(spec.paths, seed);
    if (spec.webhooks) collectRefs(spec.webhooks, seed);

    const reachable = new Set<string>();
    let frontier = new Set([...seed].filter((n) => allNames.has(n)));
    while (frontier.size > 0) {
        for (const name of frontier) reachable.add(name);
        const next = new Set<string>();
        for (const name of frontier) {
            const refs = new Set<string>();
            collectRefs(spec.components.schemas[name], refs);
            for (const r of refs) {
                if (allNames.has(r) && !reachable.has(r)) next.add(r);
            }
        }
        frontier = next;
    }
    return reachable;
}

/** Every "METHOD path" tuple declared in spec.paths, as a stable string key. */
export function operationKeys(spec: Spec): Set<string> {
    const out = new Set<string>();
    for (const [path, methods] of Object.entries(spec.paths)) {
        for (const method of Object.keys(methods)) {
            if (["get", "post", "put", "patch", "delete"].includes(method)) {
                out.add(`${method} ${path}`);
            }
        }
    }
    return out;
}

function isArrayType(node: JsonValue): boolean {
    const t = node?.type;
    if (Array.isArray(t)) return t.includes("array");
    return t === "array";
}

function resolveRef(spec: Spec, node: JsonValue): JsonValue {
    if (node && typeof node === "object" && typeof node.$ref === "string") {
        const name = node.$ref.split("/").pop() as string;
        return spec.components.schemas[name];
    }
    return node;
}

/** Walks schema.property.property... (dotted, with "[]" for array item) down to a schema node. */
function resolveSchemaNode(spec: Spec, schemaName: string, propertyPath?: string): JsonValue {
    let node = spec.components.schemas[schemaName];
    if (node === undefined) {
        throw new Error(`schema "${schemaName}" not found in spec`);
    }
    if (!propertyPath) return node;
    for (const part of propertyPath.split(".")) {
        if (part === "[]") {
            node = node?.items;
            if (node === undefined) throw new Error(`"${schemaName}.${propertyPath}" has no items`);
            node = resolveRef(spec, node);
        } else {
            node = node?.properties?.[part];
            if (node === undefined) {
                throw new Error(
                    `property "${part}" not found while resolving "${schemaName}.${propertyPath}"`
                );
            }
            node = resolveRef(spec, node);
        }
    }
    return node;
}

function propsOf(spec: Spec, node: JsonValue): Set<string> {
    if (isArrayType(node) && node.items) {
        const item = resolveRef(spec, node.items);
        return new Set(Object.keys(item?.properties ?? {}));
    }
    return new Set(Object.keys(node?.properties ?? {}));
}

function resolveOperationNode(
    spec: Spec,
    loc: { path: string; method: string; location: string }
): JsonValue {
    const op = spec.paths[loc.path]?.[loc.method];
    if (!op) throw new Error(`operation "${loc.method} ${loc.path}" not found in spec`);
    if (loc.location === "requestBody") {
        const content = op.requestBody?.content ?? {};
        const body = content["application/json"] ?? content["multipart/form-data"];
        if (!body) throw new Error(`no requestBody content for "${loc.method} ${loc.path}"`);
        return body.schema;
    }
    if (loc.location.startsWith("response:")) {
        const code = loc.location.split(":")[1];
        const content = op.responses?.[code]?.content?.["application/json"];
        if (!content)
            throw new Error(`no response:${code} content for "${loc.method} ${loc.path}"`);
        return content.schema;
    }
    throw new Error(`unsupported path locator location "${loc.location}"`);
}

/** Resolves a spec locator to a JSON schema node (following $ref once at the leaf). */
export function resolveLocator(spec: Spec, loc: SpecLocator): JsonValue {
    if (isPathLocator(loc)) {
        return resolveRef(spec, resolveOperationNode(spec, loc));
    }
    return resolveSchemaNode(spec, loc.schema, loc.property);
}

/** Property-name set for a locator, unwrapping one array level if the resolved node is an array. */
export function resolveProperties(spec: Spec, loc: SpecLocator): Set<string> {
    const node = resolveLocator(spec, loc);
    return propsOf(spec, node);
}

/** Enum member set for a locator. If `itemsEnum` is set, reads properties.<name>.items.enum instead. */
export function resolveEnumMembers(spec: Spec, loc: SchemaLocatorWithEnum): Set<string> {
    if (loc.itemsEnum) {
        const node = resolveSchemaNode(spec, loc.schema, loc.property);
        const values = node?.items?.enum;
        if (!Array.isArray(values)) {
            throw new Error(`no items.enum found for "${loc.schema}.${loc.property}"`);
        }
        return new Set(values);
    }
    const node = resolveSchemaNode(spec, loc.schema, loc.property);
    const values = node?.enum;
    if (!Array.isArray(values)) {
        throw new Error(
            `no enum found for "${loc.schema}${loc.property ? `.${loc.property}` : ""}"`
        );
    }
    return new Set(values);
}

type SchemaLocatorWithEnum = { schema: string; property?: string; itemsEnum?: boolean };
