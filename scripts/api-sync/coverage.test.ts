import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { computeCoverageGaps } from "./coverage";
import type { Spec } from "./spec";

let dir: string | null = null;

function repoWith(resource: string): string {
    dir = mkdtempSync(join(tmpdir(), "api-sync-coverage-"));
    mkdirSync(join(dir, "src/resources/widgets"), { recursive: true });
    writeFileSync(join(dir, "src/resources/widgets/index.ts"), resource);
    return dir;
}

afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = null;
});

const op = { responses: {} };
const spec: Spec = {
    paths: {
        "/v1/instances/{instance_id}/widgets": { get: op, post: op },
        "/v1/instances/{instance_id}/widgets/{id}": { get: op, put: op },
        "/v1/available/rails": { get: op },
        "/v1/upload": { post: op },
    },
    components: { schemas: {} },
};

describe("computeCoverageGaps", () => {
    it("is method-aware: a GET on a path doesn't cover a PUT on it", () => {
        const repo = repoWith(`
export function createWidgetsResource(instanceId: string, client: InternalApiClient) {
    return {
        list(params, options) {
            return client.get(\`/instances/\${instanceId}/widgets\${toQueryString(params)}\`, options);
        },
        create(data, options) {
            return client.post(\`/instances/\${instanceId}/widgets\`, data, options);
        },
        get(id, options) {
            return client.get(\`/instances/\${instanceId}/widgets/\${id}\`, options);
        },
        getRails(options) {
            return client.get("/available/rails", options);
        },
        upload(form, options) {
            return client.postMultipart(\`/upload\${toQueryString({ instance_id })}\`, form, options);
        },
    };
}
`);
        expect(computeCoverageGaps(spec, repo)).toEqual([
            "PUT /v1/instances/{instance_id}/widgets/{id}",
        ]);
    });

    it("doesn't count an auto-pager as the list op it pages", () => {
        const repo = repoWith(`
export function createWidgetsResource(instanceId: string, client: InternalApiClient) {
    return {
        listAutoPaging(params, options) {
            return autoPage(
                (page) => client.get(\`/instances/\${instanceId}/widgets\${toQueryString(page)}\`, options),
                params
            );
        },
    };
}
`);
        expect(computeCoverageGaps(spec, repo)).toContain(
            "GET /v1/instances/{instance_id}/widgets"
        );
    });
});
