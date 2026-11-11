import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { KNOWN_DIVERGENCES, type KnownDivergence } from "../internal/fixture-divergences";
import { readFixture, responseVariants } from "../internal/test-fixtures";
import { OPERATIONS, RAIL_TYPES } from "../internal/test-operations";

/**
 * The type half of the fixture test (sdk-parity C8): every shared spec-shaped fixture variant is
 * assigned, as a literal, to the response type its SDK method declares, and every webhook
 * fixture to `WebhookEvent`, then type-checked with the repo's tsconfig. A field the SDK types
 * as required that a `required_only` variant omits, or as non-null that `nullables_null` sets to
 * null, is a type error here. Extra spec fields the SDK doesn't model are fine (no excess
 * property check), and `unknown_enum` variants are left to the runtime round-trip: the SDK's
 * string unions are closed at compile time by design and open at runtime.
 *
 * Deliberate, source-verified differences are listed in src/internal/fixture-divergences.ts; the check
 * patches each one back in before type-checking, and fails if an entry no longer matches a real
 * difference (so the list can't go stale).
 */

const REPO_ROOT = join(__dirname, "../..");
const VIRTUAL_FILE = join(REPO_ROOT, "src/__fixture_types__.ts");

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Check = { label: string; target: string; body: unknown; expectError: boolean };

/** `payouts.get` -> the type of that method's `data`; `webhook:x` -> `WebhookEvent`. */
function typeOf(target: string): string {
    if (target.startsWith("webhook:")) return "WebhookEvent";
    return `Data<BlindPay${target
        .split(".")
        .map((p) => `["${p}"]`)
        .join("")}>`;
}

/** The objects a divergence path is relative to: the body, its items, or its envelope's items. */
function containers(value: Json): { [key: string]: Json }[] {
    if (Array.isArray(value)) return value.flatMap(containers);
    if (value === null || typeof value !== "object") return [];
    return Array.isArray(value.data) ? [value, ...value.data.flatMap(containers)] : [value];
}

/** The value at `path` in the first container of `full` that has it. */
function valueAt(full: Json, path: string[]): Json | undefined {
    for (const container of containers(full)) {
        let cur: Json | undefined = container;
        for (const key of path) {
            cur = cur && typeof cur === "object" && !Array.isArray(cur) ? cur[key] : undefined;
        }
        if (cur !== undefined) return cur;
    }
    return undefined;
}

/** Sets `path` from `full` wherever its parent exists; true if anything changed. */
function restore(body: Json, full: Json, path: string[], placeholder?: unknown): boolean {
    const source = placeholder === undefined ? valueAt(full, path) : (placeholder as Json);
    if (source === undefined) return false;
    let changed = false;
    for (const container of containers(body)) {
        let parent: Json = container;
        for (const key of path.slice(0, -1)) {
            parent =
                parent && typeof parent === "object" && !Array.isArray(parent) ? parent[key] : null;
        }
        if (!parent || typeof parent !== "object" || Array.isArray(parent)) continue;
        const key = path[path.length - 1];
        if (JSON.stringify(parent[key]) === JSON.stringify(source)) continue;
        parent[key] = structuredClone(source);
        changed = true;
    }
    return changed;
}

/** Fixture artefacts that aren't SDK bugs, normalised in every variant. */
function normalise(target: string, body: Json): Json {
    const copy = structuredClone(body);
    for (const container of containers(copy)) {
        // `manual_concluded_at` is `z.any()` in the API contract, so the spec (and the fixture
        // generator) give it no type and emit `{}`; the API sends a date-time string.
        if (JSON.stringify(container.manual_concluded_at) === "{}") {
            container.manual_concluded_at = "2025-01-01T00:00:00Z";
        }
        // One rail-agnostic bank-account fixture serves every rail's create method.
        const rail = RAIL_TYPES[target.split(".").pop() as keyof typeof RAIL_TYPES];
        if (rail && target.startsWith("customers.bankAccounts.")) container.type = rail;
    }
    return copy;
}

function divergencesFor(target: string, variant: string): KnownDivergence[] {
    const kind = variant.startsWith("required_only")
        ? "missing"
        : variant.startsWith("nullables_null")
          ? "null"
          : null;
    return KNOWN_DIVERGENCES.filter(
        (d) => (d.kind === kind || d.kind === "absent") && d.targets.includes(target)
    );
}

/** `"<target> <path>"` of every divergence that patched at least one variant. */
const usedDivergences = new Set<string>();

/** Divergence entries that matched no fixture difference at all (wrong target, path or kind). */
function unusedDivergences(): string[] {
    return KNOWN_DIVERGENCES.flatMap((d) =>
        d.targets.flatMap((t) => d.paths.map((p) => `${t} ${p}`))
    ).filter((key) => !usedDivergences.has(key));
}

/** One check per variant (divergences patched in), plus one per divergence path left unpatched. */
function checksFor(target: string, variants: [string, unknown][]): Check[] {
    const checks: Check[] = [];
    const fullOf = (variant: string) => {
        const branch = variant.includes(".") ? `.${variant.split(".")[1]}` : "";
        const full = variants.find(([name]) => name === `full${branch}`)?.[1] as Json;
        return normalise(target, full ?? null);
    };
    for (const [variant, raw] of variants) {
        if (variant.startsWith("unknown_enum")) continue;
        const body = normalise(target, raw as Json);
        const full = fullOf(variant);
        const patches = divergencesFor(target, variant).flatMap((d) =>
            d.paths.map((p) => ({ path: p.split("."), placeholder: d.placeholder }))
        );
        const apply = (into: Json, patch: (typeof patches)[number]) =>
            restore(into, full, patch.path, patch.placeholder);
        const applied = patches.filter((patch) => apply(body, patch));
        for (const { path } of applied) usedDivergences.add(`${target} ${path.join(".")}`);
        checks.push({ label: `${target} ${variant}`, target, body, expectError: false });
        for (const patch of applied) {
            const without = normalise(target, raw as Json);
            for (const other of applied) if (other !== patch) apply(without, other);
            checks.push({
                label: `${target} ${variant} divergence ${patch.path.join(".")}`,
                target,
                body: without,
                expectError: true,
            });
        }
    }
    return checks;
}

function allChecks(): Check[] {
    const checks = OPERATIONS.flatMap(({ operation, method }) =>
        checksFor(method, responseVariants(operation))
    );
    const index = readFixture<{ webhooks: Record<string, string> }>("index.json");
    for (const [event, file] of Object.entries(index.webhooks)) {
        // Routed to UnknownWebhookEvent ({ webhook_event, raw }) at runtime: webhooks.test.ts.
        if (event === "_unknown_event") continue;
        const fixture = readFixture<{ variants: Record<string, unknown> }>(file);
        checks.push(...checksFor(`webhook:${event}`, Object.entries(fixture.variants)));
    }
    // Negative control: proves the checks really type-check (a broken import would pass them all).
    checks.push({
        label: "negative control",
        target: "payouts.get",
        body: { id: 1 },
        expectError: true,
    });
    return checks;
}

/** Type-checks every check in one in-memory file; returns the checks whose outcome is wrong. */
function typeCheck(checks: Check[]): { wrong: string[]; stray: string[] } {
    const header = [
        'import type { BlindPay } from "./client";',
        'import type { WebhookEvent } from "./resources/webhooks/events";',
        "type Data<F> = F extends (...args: never[]) => Promise<infer R> ? NonNullable<R extends { data: infer D } ? D : never> : never;",
        "declare function decodes<T>(): <const U extends T>(value: U) => U;",
    ];
    const lines = [
        ...header,
        ...checks.map((c) => `decodes<${typeOf(c.target)}>()(${JSON.stringify(c.body)});`),
    ];
    const source = `${lines.join("\n")}\n`;

    const config = ts.readConfigFile(join(REPO_ROOT, "tsconfig.json"), ts.sys.readFile);
    const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, REPO_ROOT);
    const host = ts.createCompilerHost(options);
    const getSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (file, language, ...rest) =>
        file === VIRTUAL_FILE
            ? ts.createSourceFile(file, source, language)
            : getSourceFile(file, language, ...rest);
    const fileExists = host.fileExists.bind(host);
    host.fileExists = (file) => file === VIRTUAL_FILE || fileExists(file);

    const program = ts.createProgram([VIRTUAL_FILE], { ...options, noEmit: true }, host);
    const file = program.getSourceFile(VIRTUAL_FILE);
    if (!file) throw new Error("virtual file not loaded");
    const diagnostics = [
        ...program.getSyntacticDiagnostics(file),
        ...program.getSemanticDiagnostics(file),
    ];

    const erroredLines = new Set<number>();
    const stray: string[] = [];
    for (const d of diagnostics) {
        const line = file.getLineAndCharacterOfPosition(d.start ?? 0).line - header.length;
        if (line < 0) stray.push(ts.flattenDiagnosticMessageText(d.messageText, "\n"));
        else erroredLines.add(line);
    }
    const wrong = checks
        .filter((c, i) => erroredLines.has(i) !== c.expectError)
        .map((c) => (c.expectError ? `no longer differs: ${c.label}` : `type error: ${c.label}`));
    return { wrong, stray };
}

describe("Spec fixtures against the SDK's declared types", () => {
    it("every response and webhook variant fits its type, apart from the listed divergences", () => {
        const { wrong, stray } = typeCheck(allChecks());
        expect(stray).toEqual([]);
        expect(wrong).toEqual([]);
        expect(unusedDivergences()).toEqual([]);
    }, 60_000);
});
