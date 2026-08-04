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
