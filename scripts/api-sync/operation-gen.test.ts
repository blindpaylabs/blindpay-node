import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { classifyNewOperation, loadCanonicalEnums } from "./operation-gen";
import type { Spec } from "./spec";
import type { SpecMap } from "./types";

let dir: string | null = null;

function makeRepo(files: Record<string, string>): string {
    dir = mkdtempSync(join(tmpdir(), "api-sync-opgen-"));
    writeFileSync(
        join(dir, "package.json.placeholder"),
        "" // keep the dir non-empty even before any files
    );
    for (const [rel, content] of Object.entries(files)) {
        const full = join(dir, rel);
        mkdirSync(join(full, ".."), { recursive: true });
        writeFileSync(full, content);
    }
    return dir;
}

afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = null;
});

function emptyMap(): SpecMap {
    return { enums: [], types: [], ignore: { schemas: [] } };
}

const WIDGETS_RESOURCE = `import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export type ListWidgetsResponse = { id: string }[];

export function createWidgetsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(): Promise<BlindpayApiResponse<ListWidgetsResponse>> {
            return client.get(\`/instances/\${instanceId}/widgets\`);
        },
    };
}
`;

function baseFiles(): Record<string, string> {
    return {
        "src/resources/widgets/index.ts": WIDGETS_RESOURCE,
        "types/index.d.ts": 'export type Currency = "USD" | "EUR";\n',
    };
}

describe("operation-insert classifier", () => {
    it("classifies a GET-by-id on an existing resource as STANDARD", () => {
        const repoRoot = makeRepo(baseFiles());
        const spec: Spec = {
            paths: {
                "/v1/instances/{instance_id}/widgets/{id}": {
                    get: {
                        parameters: [
                            { name: "id", in: "path", required: true, schema: { type: "string" } },
                        ],
                        responses: {
                            "200": {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: { id: { type: "string" } },
                                            required: ["id"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: { schemas: {} },
        };
        const canon = loadCanonicalEnums(repoRoot);
        const result = classifyNewOperation(
            spec,
            "get",
            "/v1/instances/{instance_id}/widgets/{id}",
            emptyMap(),
            repoRoot,
            canon
        );
        expect(result.standard).toBe(true);
        if (!result.standard) throw new Error("unreachable");
        expect(result.change.methodName).toBe("get");
        expect(result.change.site.file).toBe("src/resources/widgets/index.ts");
        expect(result.change.methodSource).toContain("get(widgetId: GetWidgetInput)");
        expect(result.change.methodSource).toContain(
            "client.get(`/instances/${instanceId}/widgets/${widgetId}`)"
        );
    });

    it("passes a parent resource ID that precedes the resource segment (e.g. customer_id)", () => {
        const repoRoot = makeRepo(baseFiles());
        const json = (schema: unknown) => ({ content: { "application/json": { schema } } });
        const object = { type: "object", properties: { url: { type: "string" } } };
        const path = "/v1/instances/{instance_id}/customers/{customer_id}/widgets/plaid";
        const spec: Spec = {
            paths: {
                [path]: {
                    post: {
                        parameters: [{ name: "customer_id", in: "path", required: true }],
                        requestBody: json(object),
                        responses: { "200": json(object) },
                    },
                },
            },
            components: { schemas: {} },
        };
        const result = classifyNewOperation(
            spec,
            "post",
            path,
            emptyMap(),
            repoRoot,
            loadCanonicalEnums(repoRoot)
        );
        expect(result.standard).toBe(true);
        if (!result.standard) throw new Error("unreachable");
        expect(result.change.typeDecls).toContain("customer_id: string;");
        expect(result.change.methodSource).toContain("customer_id,");
        expect(result.change.methodSource).toContain(
            "`/instances/${instanceId}/customers/${customer_id}/widgets/plaid`"
        );
    });

    describe("RequestOptions (the Idempotency-Key header)", () => {
        const json = (schema: unknown) => ({ content: { "application/json": { schema } } });
        const object = { type: "object", properties: { url: { type: "string" } } };
        const classify = (method: string, path: string, op: Record<string, unknown>) => {
            const spec: Spec = { paths: { [path]: { [method]: op } }, components: { schemas: {} } };
            const repoRoot = makeRepo(baseFiles());
            const result = classifyNewOperation(
                spec,
                method,
                path,
                emptyMap(),
                repoRoot,
                loadCanonicalEnums(repoRoot)
            );
            if (!result.standard) throw new Error(result.reason);
            return result.change;
        };

        it("is the last parameter of a mutating method, forwarded to the client and imported", () => {
            const change = classify("post", "/v1/instances/{instance_id}/widgets", {
                requestBody: json(object),
                responses: { "200": json(object) },
            });
            expect(change.methodSource).toContain(
                "create({ ...data }: CreateWidgetInput, options?: RequestOptions)"
            );
            expect(change.methodSource).toContain(
                "return client.post(`/instances/${instanceId}/widgets`, data, options);"
            );
            expect(change.importsNeeded).toContain("RequestOptions");
        });

        it("is the only argument a DELETE by scalar id passes after its path", () => {
            const change = classify("delete", "/v1/instances/{instance_id}/widgets/{id}", {
                parameters: [{ name: "id", in: "path", required: true }],
                responses: { "200": json(object) },
            });
            expect(change.methodSource).toContain(", options?: RequestOptions)");
            expect(change.methodSource).toContain(
                "client.delete(`/instances/${instanceId}/widgets/${widgetId}`, options);"
            );
        });

        it("leaves a DELETE with a body to a human: the client's delete sends none", () => {
            const spec: Spec = {
                paths: {
                    "/v1/instances/{instance_id}/widgets/{id}": {
                        delete: {
                            parameters: [{ name: "id", in: "path", required: true }],
                            requestBody: json(object),
                            responses: { "200": json(object) },
                        },
                    },
                },
                components: { schemas: {} },
            };
            const repoRoot = makeRepo(baseFiles());
            const result = classifyNewOperation(
                spec,
                "delete",
                "/v1/instances/{instance_id}/widgets/{id}",
                emptyMap(),
                repoRoot,
                loadCanonicalEnums(repoRoot)
            );
            expect(result.standard).toBe(false);
        });

        it("is never added to a GET", () => {
            const change = classify("get", "/v1/instances/{instance_id}/widgets/{id}", {
                parameters: [{ name: "id", in: "path", required: true }],
                responses: { "200": json(object) },
            });
            expect(change.methodSource).not.toContain("RequestOptions");
            expect(change.importsNeeded).not.toContain("RequestOptions");
        });
    });

    describe("query parameters (the shared toQueryString helper)", () => {
        const json = (schema: unknown) => ({ content: { "application/json": { schema } } });
        const list = { type: "array", items: { type: "object", properties: {} } };
        const query = (name: string) => ({ name, in: "query", schema: { type: "string" } });
        const classify = (path: string, parameters: unknown[]) => {
            const spec: Spec = {
                paths: { [path]: { get: { parameters, responses: { "200": json(list) } } } },
                components: { schemas: {} },
            };
            const repoRoot = makeRepo(baseFiles());
            const result = classifyNewOperation(
                spec,
                "get",
                path,
                emptyMap(),
                repoRoot,
                loadCanonicalEnums(repoRoot)
            );
            if (!result.standard) throw new Error(result.reason);
            return result.change;
        };

        it("serialises a GET's query input with toQueryString, never URLSearchParams", () => {
            const change = classify("/v1/instances/{instance_id}/widgets/archived", [
                query("status"),
                query("limit"),
            ]);
            expect(change.methodSource).toContain(
                // biome-ignore lint/suspicious/noTemplateCurlyInString: asserts generated source text
                "return client.get(`/instances/${instanceId}/widgets/archived${toQueryString(params)}`);"
            );
            expect(change.methodSource).not.toContain("URLSearchParams");
            expect(change.usesQueryString).toBe(true);
            // A query input has no request body, so it gets no "requestBody" spec-map entry.
            expect(change.newMapEntries.map((e) => e.location)).not.toContain("requestBody");
        });

        it("destructures path ids before serialising the remaining query fields", () => {
            const change = classify("/v1/instances/{instance_id}/customers/{customer_id}/widgets", [
                { name: "customer_id", in: "path", required: true },
                query("status"),
            ]);
            expect(change.methodSource).toContain("{ customer_id, ...params }");
            expect(change.methodSource).toContain(
                // biome-ignore lint/suspicious/noTemplateCurlyInString: asserts generated source text
                "/customers/${customer_id}/widgets${toQueryString(params)}`);"
            );
            expect(change.methodSource).not.toContain("URLSearchParams");
            expect(change.usesQueryString).toBe(true);
        });

        it("doesn't ask for the helper when there is no query input", () => {
            const change = classify("/v1/instances/{instance_id}/widgets/archived", []);
            expect(change.methodSource).not.toContain("toQueryString");
            expect(change.usesQueryString).toBe(false);
        });
    });

    it("names a lone parent-ID scalar after its own parameter, not after the resource", () => {
        const repoRoot = makeRepo(baseFiles());
        const path = "/v1/instances/{instance_id}/customers/{customer_id}/widgets";
        const spec: Spec = {
            paths: {
                [path]: {
                    get: {
                        parameters: [{ name: "customer_id", in: "path", required: true }],
                        responses: {
                            "200": {
                                content: {
                                    "application/json": { schema: { type: "array", items: {} } },
                                },
                            },
                        },
                    },
                },
            },
            components: { schemas: {} },
        };
        const result = classifyNewOperation(
            spec,
            "get",
            path,
            emptyMap(),
            repoRoot,
            loadCanonicalEnums(repoRoot)
        );
        expect(result.standard).toBe(true);
        if (!result.standard) throw new Error("unreachable");
        expect(result.change.methodSource).toContain("(customerId: ");
        expect(result.change.methodSource).toContain("/customers/${customerId}/widgets");
    });

    it("keeps an acronym path segment like `tos` whole when naming the generated types", () => {
        const repoRoot = makeRepo({
            ...baseFiles(),
            "src/resources/terms-of-service/index.ts": `import type { BlindpayApiResponse } from "../../../types";
import type { InternalApiClient } from "../../internal/api-client";

export function createTermsOfServiceResource(instanceId: string, client: InternalApiClient) {
    return {
        initiate(): Promise<BlindpayApiResponse<{ url: string }>> {
            return client.post(\`/e/instances/\${instanceId}/tos\`, {});
        },
    };
}
`,
        });
        const json = (schema: unknown) => ({ content: { "application/json": { schema } } });
        const object = { type: "object", properties: { tos_id: { type: "string" } } };
        const spec: Spec = {
            paths: {
                "/v1/instances/{instance_id}/tos/passthrough": {
                    post: { requestBody: json(object), responses: { "200": json(object) } },
                },
            },
            components: { schemas: {} },
        };
        const result = classifyNewOperation(
            spec,
            "post",
            "/v1/instances/{instance_id}/tos/passthrough",
            emptyMap(),
            repoRoot,
            loadCanonicalEnums(repoRoot)
        );
        expect(result.standard).toBe(true);
        if (!result.standard) throw new Error("unreachable");
        expect(result.change.typeDecls).toContain("export type CreatePassthroughTosInput");
        expect(result.change.typeDecls).toContain("export type CreatePassthroughTosResponse");
    });

    it("classifies a multipart/form-data request body as NON-STANDARD, never generated", () => {
        const repoRoot = makeRepo(baseFiles());
        const spec: Spec = {
            paths: {
                "/v1/instances/{instance_id}/widgets/upload": {
                    post: {
                        requestBody: {
                            content: { "multipart/form-data": { schema: { type: "object" } } },
                        },
                        responses: {
                            "200": {
                                content: {
                                    "application/json": {
                                        schema: { type: "object", properties: {} },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: { schemas: {} },
        };
        const canon = loadCanonicalEnums(repoRoot);
        const result = classifyNewOperation(
            spec,
            "post",
            "/v1/instances/{instance_id}/widgets/upload",
            emptyMap(),
            repoRoot,
            canon
        );
        expect(result.standard).toBe(false);
        if (result.standard) throw new Error("unreachable");
        expect(result.alreadyImplemented).not.toBe(true);
        expect((result as { reason: string }).reason).toContain("multipart/binary");
    });

    it("adds a new schema map entry when the request body is a never-before-modeled named schema", () => {
        const repoRoot = makeRepo(baseFiles());
        const spec: Spec = {
            paths: {
                "/v1/instances/{instance_id}/widgets": {
                    post: {
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/WidgetIn" },
                                },
                            },
                        },
                        responses: {
                            "200": {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: { id: { type: "string" } },
                                            required: ["id"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: {
                schemas: {
                    WidgetIn: {
                        type: "object",
                        properties: { name: { type: "string" } },
                        required: ["name"],
                    },
                },
            },
        };
        const canon = loadCanonicalEnums(repoRoot);
        const result = classifyNewOperation(
            spec,
            "post",
            "/v1/instances/{instance_id}/widgets",
            emptyMap(),
            repoRoot,
            canon
        );
        expect(result.standard).toBe(true);
        if (!result.standard) throw new Error("unreachable");
        expect(result.change.typeDecls).toContain("export type CreateWidgetInput");
        expect(result.change.typeDecls).toContain("name: string;");
        expect(
            result.change.newMapEntries.some(
                (e) =>
                    e.kind === "schema" &&
                    e.schema === "WidgetIn" &&
                    e.symbol === "CreateWidgetInput"
            )
        ).toBe(true);
    });
});
