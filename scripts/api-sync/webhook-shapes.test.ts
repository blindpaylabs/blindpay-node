import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSpecMap } from "./map";
import { loadSpec, type Spec } from "./spec";
import type { SpecMap } from "./types";
import { findWebhookShapeDrift } from "./webhook-shapes";

const REPO_ROOT = resolve(__dirname, "../..");
const snapshot = loadSpec(resolve(REPO_ROOT, ".api-sync/spec-snapshot.json"));
const map = loadSpecMap(resolve(REPO_ROOT, ".api-sync/spec-map.json"));

/** A deep copy of the snapshot with `edit` applied to its schemas. */
function specWith(edit: (schemas: Spec["components"]["schemas"]) => void): Spec {
    const copy: Spec = structuredClone(snapshot);
    edit(copy.components.schemas);
    return copy;
}

describe("findWebhookShapeDrift", () => {
    it("is clean for the committed snapshot and map", () => {
        expect(findWebhookShapeDrift(snapshot, map)).toEqual([]);
    });

    it("names every ignored webhook schema's base in the map", () => {
        const ignoredWebhooks = map.ignore.schemas.filter((e) => e.name.endsWith("WebhookOut"));
        expect(ignoredWebhooks.filter((e) => e.sameShapeAs).length).toBeGreaterThan(0);
    });

    it("fails on a field added to one webhook schema only (webhook-only drift)", () => {
        const spec = specWith((s) => {
            s.LimitIncreaseNewWebhookOut.properties.webhook_only_note = { type: "string" };
        });
        expect(findWebhookShapeDrift(spec, map)).toEqual([
            expect.stringContaining(
                '"LimitIncreaseNewWebhookOut" no longer has the same shape as "GetCustomerLimitIncreaseOut" (only on the webhook: webhook_only_note)'
            ),
        ]);
    });

    it("fails on a definition or required-list change on the webhook schema only", () => {
        const spec = specWith((s) => {
            s.CustomerUpdateWebhookOut.properties.email = { type: "integer" };
            s.WalletNewWebhookOut.required = [...(s.WalletNewWebhookOut.required ?? []), "zz"];
        });
        const problems = findWebhookShapeDrift(spec, map);
        expect(problems).toHaveLength(2);
        expect(problems[0]).toContain('"CustomerUpdateWebhookOut"');
        expect(problems[0]).toContain("different definition: email");
        expect(problems[1]).toContain('"WalletNewWebhookOut"');
        expect(problems[1]).toContain("different required list");
    });

    it("fails on an ignored, unmapped webhook schema with no sameShapeAs", () => {
        const bare: SpecMap = {
            ...map,
            ignore: {
                ...map.ignore,
                schemas: map.ignore.schemas.map((e) =>
                    e.name === "PayableNewWebhookOut" ? { name: e.name, reason: e.reason } : e
                ),
            },
        };
        expect(findWebhookShapeDrift(snapshot, bare)).toEqual([
            expect.stringContaining('"PayableNewWebhookOut" is ignored and unmapped'),
        ]);
    });
});
