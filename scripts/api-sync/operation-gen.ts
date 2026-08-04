import { allResourceSource, hasCoarseSdkEndpointString } from "./coverage";
import {
    buildSegmentIndex,
    findResourceInfo,
    operationIsImplemented,
    resourceSegmentOf,
} from "./resource-registry";
import type { JsonValue, Spec } from "./spec";
import {
    loadCanonicalEnums,
    loadWholeSchemaSymbols,
    synthesizeObjectFields,
    synthesizeType,
    type TypegenContext,
} from "./typegen";
import type { OperationInsertChange, SpecMap } from "./types";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

export type ClassifyResult =
    | { standard: true; change: OperationInsertChange }
    | { standard: false; alreadyImplemented: true }
    | { standard: false; alreadyImplemented?: false; reason: string };

function pascalCase(segment: string): string {
    return segment
        .split(/[-_]/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("");
}

function camelCase(segment: string): string {
    const p = pascalCase(segment);
    return p ? p[0].toLowerCase() + p.slice(1) : p;
}

function singularize(segment: string): string {
    if (segment.endsWith("ies")) return `${segment.slice(0, -3)}y`;
    if (segment.endsWith("ss")) return segment;
    if (segment.endsWith("s")) return segment.slice(0, -1);
    return segment;
}

function refName(node: JsonValue): string | null {
    if (node && typeof node === "object" && typeof node.$ref === "string") {
        return node.$ref.split("/").pop() as string;
    }
    return null;
}

function pathSegments(path: string): string[] {
    return path
        .replace(/^\/v1\/?/, "")
        .split("/")
        .filter((s) => s.length > 0);
}

/** JSON content-type map for a requestBody or response, or null if there is none at all. */
function jsonContentOnly(content: Record<string, unknown> | undefined): "none" | "json" | "other" {
    if (!content) return "none";
    const keys = Object.keys(content);
    if (keys.length === 0) return "none";
    if (keys.length === 1 && keys[0] === "application/json") return "json";
    return "other";
}

type Field = { name: string; tsType: string; required: boolean };

/** True if `declareNamedType({refName: ref, pure, currentFile, ...})` will end up emitting a
 * bare alias to an already-modeled symbol, without ever looking at `fields`: mirrors exactly
 * the condition inside `declareNamedType` itself, checked before doing the (possibly deeply
 * recursive) field synthesis, so that work's only side effect (canonical-enum import
 * collection) never fires for a schema whose own shape we're not actually declaring. */
function willBeAlias(
    ref: string | null,
    pure: boolean,
    currentFile: string,
    alreadyWholeMapped: Map<string, { file: string; symbol: string }>,
    symbolName: string
): boolean {
    if (!ref || !pure) return false;
    const existing = alreadyWholeMapped.get(ref);
    if (!existing) return false;
    return !(existing.symbol === symbolName && existing.file === currentFile);
}

function objectBody(fields: Field[] | null): string {
    if (!fields || fields.length === 0) return "Record<string, unknown>";
    return `{\n${fields.map((f) => `    ${f.name}${f.required ? "" : "?"}: ${f.tsType};`).join("\n")}\n}`;
}

/**
 * Compiles a schema/query/response block into a named TypeScript type declaration.
 *
 * `pure` (the merged shape has no extra path/query fields folded in, only the ref's own body)
 * decides whether reusing an already-modeled schema can be a bare alias (`export type X = Y;`);
 * a merged shape is never a byte-for-byte alias of its ref, even when the ref is named.
 *
 * Reuses the ref's SDK symbol when it is already modeled whole elsewhere; declares the full
 * synthesized shape and records a new schema map entry when it is not (or when regenerating
 * this exact site, so it never aliases to itself).
 */
function declareNamedType(params: {
    symbolName: string;
    fields: Field[] | null;
    refName: string | null;
    pure: boolean;
    currentFile: string;
    alreadyWholeMapped: Map<string, { file: string; symbol: string }>;
    pathLocator: { path: string; method: string; location: string } | null;
}): { decl: string; mapEntry: OperationInsertChange["newMapEntries"][number] | null } {
    const {
        symbolName,
        fields,
        refName: ref,
        pure,
        currentFile,
        alreadyWholeMapped,
        pathLocator,
    } = params;

    if (ref) {
        const existing = alreadyWholeMapped.get(ref);
        const regeneratingSelf =
            !!existing && existing.symbol === symbolName && existing.file === currentFile;
        if (pure && existing && !regeneratingSelf) {
            return { decl: `export type ${symbolName} = ${existing.symbol};`, mapEntry: null };
        }
        if (existing && (regeneratingSelf || !pure)) {
            // Either regenerating the exact site the existing entry already points at, or a
            // merged shape that folds in path/query fields the ref alone doesn't carry: declare
            // the full shape, and only add a *new* map entry when the existing one is anchored
            // to a different site than the one we're about to (re)write.
            const mapEntry = regeneratingSelf
                ? null
                : {
                      kind: "schema" as const,
                      schema: ref,
                      file: currentFile,
                      symbol: symbolName,
                      notes: null,
                  };
            return { decl: `export type ${symbolName} = ${objectBody(fields)};`, mapEntry };
        }
        return {
            decl: `export type ${symbolName} = ${objectBody(fields)};`,
            mapEntry: {
                kind: "schema",
                schema: ref,
                file: currentFile,
                symbol: symbolName,
                notes: null,
            },
        };
    }

    const mapEntry = pathLocator
        ? {
              kind: "path" as const,
              path: pathLocator.path,
              method: pathLocator.method,
              location: pathLocator.location,
              file: currentFile,
              symbol: symbolName,
              notes: "inline object body, not a named schema",
          }
        : null;
    return { decl: `export type ${symbolName} = ${objectBody(fields)};`, mapEntry };
}

export function classifyNewOperation(
    spec: Spec,
    method: HttpMethod,
    path: string,
    map: SpecMap,
    repoRoot: string,
    canonicalEnums: Map<string, string>
): ClassifyResult {
    const op = spec.paths[path]?.[method];
    if (!op) return { standard: false, reason: `operation "${method} ${path}" not found in spec` };

    if (!/^\/v1\/instances\/\{instance_id\}\//.test(path)) {
        // Outside the generator's template shape by construction (available/*, upload, the
        // instances resource's own CRUD keyed by {id} rather than a wrapping instanceId, ...).
        // Reuse the coarse coverage.ts heuristic here (imprecise, but this SDK already accepted
        // that trade-off for its non-blocking report) so an already-hand-implemented one of
        // these doesn't turn into a needs-human finding on every single run.
        if (hasCoarseSdkEndpointString(path, allResourceSource(repoRoot))) {
            return { standard: false, alreadyImplemented: true };
        }
        return {
            standard: false,
            reason: `"${method} ${path}" is not instance-scoped (does not start with /v1/instances/{instance_id}/); the generator's method template assumes that shape.`,
        };
    }

    const requestBodyKind = jsonContentOnly(op.requestBody?.content);
    if (requestBodyKind === "other") {
        return {
            standard: false,
            reason: `"${method} ${path}" has a non-JSON request body (${Object.keys(op.requestBody.content).join(", ")}); multipart/binary uploads are never auto-generated.`,
        };
    }

    const successCode = ["200", "201"].find((c) => op.responses?.[c]);
    if (!successCode) {
        return {
            standard: false,
            reason: `"${method} ${path}" has no 200/201 response declared; cannot determine the SDK's return type.`,
        };
    }
    const responseKind = jsonContentOnly(op.responses[successCode].content);
    if (responseKind === "other") {
        return {
            standard: false,
            reason: `"${method} ${path}" has a non-JSON success response (${Object.keys(op.responses[successCode].content).join(", ")}); streaming/binary responses are never auto-generated.`,
        };
    }

    const parameters: JsonValue[] = op.parameters ?? [];
    // An *optional* header (e.g. every mutation's "Idempotency-Key") is never modeled by this
    // SDK at all, on any existing hand-written method; only a REQUIRED header/cookie param is
    // out of the generator's scope, since the template has nowhere to plumb it from.
    if (parameters.some((p) => (p.in === "header" || p.in === "cookie") && p.required)) {
        return {
            standard: false,
            reason: `"${method} ${path}" has a required header or cookie parameter; unsupported by the generator template.`,
        };
    }
    const queryParams = parameters.filter((p) => p.in === "query");
    if (queryParams.length > 0 && method !== "get") {
        return {
            standard: false,
            reason: `"${method} ${path}" has query parameters on a non-GET operation; unsupported by the generator template.`,
        };
    }

    const resourceSegment = resourceSegmentOf(path);
    if (!resourceSegment) {
        return {
            standard: false,
            reason: `"${method} ${path}" has no literal path segment after {instance_id} to identify a resource.`,
        };
    }
    const segmentIndex = buildSegmentIndex(repoRoot);
    const candidates = [...(segmentIndex.get(resourceSegment) ?? [])];
    if (candidates.length !== 1) {
        return {
            standard: false,
            reason:
                candidates.length === 0
                    ? `"${method} ${path}" belongs to no existing resource (no SDK file uses path segment "${resourceSegment}"); this needs a brand-new resource, which a human must design.`
                    : `"${method} ${path}" is ambiguous: path segment "${resourceSegment}" appears in ${candidates.length} different resource files (${candidates.join(", ")}).`,
        };
    }
    const resourceFile = candidates[0];
    const resourceInfo = findResourceInfo(repoRoot, resourceFile);
    if (!resourceInfo || !resourceInfo.standardSignature) {
        return {
            standard: false,
            reason: `resource file "${resourceFile}" does not have the standard (instanceId, client) factory signature the generator template requires.`,
        };
    }

    if (operationIsImplemented(repoRoot, method, path, resourceFile)) {
        return { standard: false, alreadyImplemented: true };
    }

    const segs = pathSegments(path);
    const rest = segs.slice(2); // drop "instances", "{instance_id}"
    const resourceIdx = rest.lastIndexOf(resourceSegment);
    const pathParamNames = rest
        .slice(resourceIdx + 1)
        .filter((s) => s.startsWith("{"))
        .map((s) => s.slice(1, -1));
    const extraLiteralSegments = rest.slice(resourceIdx + 1).filter((s) => !s.startsWith("{"));
    const isCollection = !rest[rest.length - 1]?.startsWith("{");

    let verbWord: string;
    if (method === "get") verbWord = isCollection ? "list" : "get";
    else if (method === "post") verbWord = "create";
    else if (method === "delete") verbWord = "delete";
    else verbWord = "update"; // put | patch

    const methodName = verbWord + extraLiteralSegments.map(pascalCase).join("");
    const resourcePascal = pascalCase(singularize(resourceSegment));
    const typePrefix = pascalCase(methodName) + resourcePascal;

    const wholeSchemas = loadWholeSchemaSymbols(map);
    const ctx: TypegenContext = { spec, canonicalEnums, wholeSchemas, importsNeeded: new Set() };

    const newMapEntries: OperationInsertChange["newMapEntries"] = [];

    // --- request body ---
    const bodySchemaRaw: JsonValue | null =
        requestBodyKind === "json" ? op.requestBody.content["application/json"].schema : null;
    const bodyRefName = bodySchemaRaw ? refName(bodySchemaRaw) : null;
    let bodyFields: Field[] = [];
    const inputIsPure = pathParamNames.length === 0 && queryParams.length === 0;
    if (bodySchemaRaw) {
        const resolved = bodyRefName ? spec.components.schemas[bodyRefName] : bodySchemaRaw;
        const looksLikeObject =
            !!resolved?.properties || resolved?.type === "object" || !resolved?.type;
        if (!looksLikeObject) {
            return {
                standard: false,
                reason: `"${method} ${path}" request body does not resolve to a plain JSON object; unsupported by the generator template.`,
            };
        }
        const inputSymbolGuess = `${typePrefix}Input`;
        if (!willBeAlias(bodyRefName, inputIsPure, resourceFile, wholeSchemas, inputSymbolGuess)) {
            bodyFields = synthesizeObjectFields(ctx, resolved);
        }
    }

    const pathFields: Field[] = pathParamNames.map((name) => ({
        name,
        tsType: "string",
        required: true,
    }));
    const queryFields: Field[] = queryParams.map((p) => ({
        name: p.name as string,
        tsType: synthesizeType(ctx, p.schema, !!p.required),
        required: !!p.required,
    }));

    let inputKind: "none" | "scalar" | "object" = "none";
    let inputSymbol = "void";
    let scalarArgName = "";
    const mergedFields = [...pathFields, ...bodyFields, ...queryFields];
    const hasBody = bodySchemaRaw !== null;

    if (pathFields.length === 0 && !hasBody && queryFields.length === 0) {
        inputKind = "none";
    } else if (pathFields.length === 1 && !hasBody && queryFields.length === 0) {
        inputKind = "scalar";
        inputSymbol = `${typePrefix}Input`;
        scalarArgName = `${camelCase(singularize(resourceSegment))}Id`;
    } else {
        inputKind = "object";
        inputSymbol = `${typePrefix}Input`;
    }
    let typeDecls = "";
    if (inputKind === "scalar") {
        typeDecls += `export type ${inputSymbol} = string;\n\n`;
    } else if (inputKind === "object") {
        const { decl, mapEntry } = declareNamedType({
            symbolName: inputSymbol,
            fields: mergedFields,
            refName: bodyRefName,
            pure: inputIsPure,
            currentFile: resourceFile,
            alreadyWholeMapped: wholeSchemas,
            pathLocator: bodyRefName ? null : { path, method, location: "requestBody" },
        });
        typeDecls += `${decl}\n\n`;
        if (mapEntry) newMapEntries.push(mapEntry);
    }

    // --- response ---
    let outputSymbol = "void";
    if (responseKind === "json") {
        outputSymbol = `${typePrefix}Response`;
        const responseSchemaRaw = op.responses[successCode].content["application/json"].schema;
        const responseRefName = refName(responseSchemaRaw);
        const responseResolved = responseRefName
            ? spec.components.schemas[responseRefName]
            : responseSchemaRaw;
        const responseFields = willBeAlias(
            responseRefName,
            true,
            resourceFile,
            wholeSchemas,
            outputSymbol
        )
            ? null
            : synthesizeObjectFields(ctx, responseResolved);
        const { decl, mapEntry } = declareNamedType({
            symbolName: outputSymbol,
            fields: responseFields,
            refName: responseRefName,
            pure: true,
            currentFile: resourceFile,
            alreadyWholeMapped: wholeSchemas,
            pathLocator: responseRefName
                ? null
                : { path, method, location: `response:${successCode}` },
        });
        typeDecls += `${decl}\n\n`;
        if (mapEntry) newMapEntries.push(mapEntry);
    }

    const pathTemplate = buildPathTemplate(path, inputKind, scalarArgName);
    const methodSource = buildMethodSource({
        methodName,
        method,
        inputKind,
        inputSymbol,
        scalarArgName,
        pathFieldNames: pathFields.map((f) => f.name),
        queryFieldNames: queryFields.map((f) => f.name),
        hasBody,
        outputSymbol,
        pathTemplate,
    });

    return {
        standard: true,
        change: {
            kind: "operation-insert",
            method,
            path,
            site: { file: resourceFile, symbol: resourceInfo.factoryFn },
            methodName,
            typeDecls: typeDecls.trimEnd(),
            methodSource,
            importsNeeded: [...ctx.importsNeeded].sort(),
            newMapEntries,
        },
    };
}

function buildPathTemplate(
    path: string,
    inputKind: "none" | "scalar" | "object",
    scalarArgName: string
): string {
    const segs = pathSegments(path).slice(2); // drop "instances", "{instance_id}"
    let scalarUsed = false;
    const rendered = segs.map((seg) => {
        if (!seg.startsWith("{")) return seg;
        const name = seg.slice(1, -1);
        if (inputKind === "scalar" && !scalarUsed) {
            scalarUsed = true;
            return `\${${scalarArgName}}`;
        }
        return `\${${name}}`;
    });
    return `/instances/\${instanceId}/${rendered.join("/")}`;
}

function buildMethodSource(args: {
    methodName: string;
    method: HttpMethod;
    inputKind: "none" | "scalar" | "object";
    inputSymbol: string;
    scalarArgName: string;
    pathFieldNames: string[];
    queryFieldNames: string[];
    hasBody: boolean;
    outputSymbol: string;
    pathTemplate: string;
}): string {
    const {
        methodName,
        method,
        inputKind,
        inputSymbol,
        scalarArgName,
        pathFieldNames,
        queryFieldNames,
        hasBody,
        outputSymbol,
        pathTemplate,
    } = args;
    const returnType = `Promise<BlindpayApiResponse<${outputSymbol}>>`;

    if (inputKind === "none") {
        return `${methodName}(): ${returnType} {\n            return client.${method}(\`${pathTemplate}\`);\n        },`;
    }

    if (inputKind === "scalar") {
        return (
            `${methodName}(${scalarArgName}: ${inputSymbol}): ${returnType} {\n` +
            `            return client.${method}(\`${pathTemplate}\`);\n` +
            `        },`
        );
    }

    // inputKind === "object"
    if (method === "get" && pathFieldNames.length === 0 && queryFieldNames.length > 0) {
        return (
            `${methodName}(params?: ${inputSymbol}): ${returnType} {\n` +
            `            const queryParams = params ? \`?\${new URLSearchParams(params)}\` : "";\n` +
            `            return client.get(\`${pathTemplate}\${queryParams}\`);\n` +
            `        },`
        );
    }
    if (method === "get" && pathFieldNames.length > 0 && queryFieldNames.length > 0) {
        return (
            `${methodName}({ ${pathFieldNames.join(", ")}, ...params }: ${inputSymbol}): ${returnType} {\n` +
            `            const queryParams = Object.keys(params).length\n` +
            `                ? \`?\${new URLSearchParams(params as Record<string, string>)}\`\n` +
            `                : "";\n` +
            `            return client.get(\`${pathTemplate}\${queryParams}\`);\n` +
            `        },`
        );
    }
    if (pathFieldNames.length > 0 && hasBody) {
        return (
            `${methodName}({ ${pathFieldNames.join(", ")}, ...data }: ${inputSymbol}): ${returnType} {\n` +
            `            return client.${method}(\`${pathTemplate}\`, data);\n` +
            `        },`
        );
    }
    if (pathFieldNames.length > 0 && !hasBody) {
        return (
            `${methodName}({ ${pathFieldNames.join(", ")} }: ${inputSymbol}): ${returnType} {\n` +
            `            return client.${method}(\`${pathTemplate}\`);\n` +
            `        },`
        );
    }
    // pathFieldNames.length === 0 && hasBody
    return (
        `${methodName}({ ...data }: ${inputSymbol}): ${returnType} {\n` +
        `            return client.${method}(\`${pathTemplate}\`, data);\n` +
        `        },`
    );
}

export { loadCanonicalEnums, HTTP_METHODS };
