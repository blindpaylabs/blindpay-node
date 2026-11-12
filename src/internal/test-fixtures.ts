import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Test-only loader for the shared spec-shaped fixtures in test/fixtures/spec (generated from
 * the public spec and shared by every BlindPay SDK; see its README). Never import this from SDK code: it reads files.
 */

const FIXTURES = join(__dirname, "../../test/fixtures/spec");

type FixtureIndex = { operations: Record<string, string>; webhooks: Record<string, string> };

type ResponseFixture = {
    responses: Record<string, { variants?: Record<string, unknown>; empty_body?: boolean }>;
};

/** An `errors/*.json` body: a JSON envelope (`body`) or a raw one (`raw_body`). */
export type ErrorFixture = {
    status: number;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
    raw_body?: string;
    sdk_behaviour?: string;
};

export function readFixture<T>(relativePath: string): T {
    return JSON.parse(readFileSync(join(FIXTURES, relativePath), "utf8")) as T;
}

/** `[variantName, body]` pairs of the 200 response for `"METHOD /v1/path"`. */
export function responseVariants(operation: string): [string, unknown][] {
    const file = readFixture<FixtureIndex>("index.json").operations[operation];
    if (!file) throw new Error(`no fixture for ${operation}`);
    const ok = readFixture<ResponseFixture>(file).responses["200"];
    return Object.entries(ok?.variants ?? {});
}

/** `[fileName, fixture]` pairs for every `errors/*.json`. */
export function errorFixtures(): [string, ErrorFixture][] {
    return readdirSync(join(FIXTURES, "errors"))
        .filter((name) => name.endsWith(".json"))
        .sort()
        .map((name) => [name, readFixture<ErrorFixture>(`errors/${name}`)]);
}
