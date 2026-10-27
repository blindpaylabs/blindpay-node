#!/usr/bin/env bun
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
    ensureSharedTypeImports,
    insertEnumMember,
    insertOptionalField,
    insertResourceMethod,
    insertTypeDeclarations,
} from "./apply";
import { auditTypes } from "./audit";
import { computeCoverageGaps } from "./coverage";
import { detectNewSchemas, detectRemovals } from "./diff";
import { findUnmappedEnumProperties } from "./enum-coverage";
import { isIgnoredOperation, loadSpecMap, loadUnmodeled } from "./map";
import { classifyNewOperation, HTTP_METHODS, loadCanonicalEnums } from "./operation-gen";
import { reconcile } from "./reconcile";
import { readSource } from "./sdk-scan";
import { refreshSnapshot } from "./snapshot";
import { loadSpec, operationKeys, type Spec } from "./spec";
import type {
    ApplicableChange,
    NewSchemaMapEntry,
    OperationInsertChange,
    SpecMap,
    SyncReport,
} from "./types";
import { changesetFileName, classifyBump, renderChangeset } from "./version";

/**
 * Every "METHOD path" in the spec with no matching SDK endpoint, classified: STANDARD ones
 * become operation-insert ApplicableChanges (generated deterministically), NON-STANDARD ones
 * become needs-human messages unless a human has already reviewed and ignored them. State-based
 * (mirrors enum-insert/field-insert), not a diff against the previous spec: a spec operation
 * whose SDK method was deleted by hand is exactly as "missing" as one the spec just introduced.
 */
function classifyOperationGaps(
    spec: Spec,
    map: SpecMap,
    repoRoot: string
): { applicable: OperationInsertChange[]; needsHuman: string[] } {
    const applicable: OperationInsertChange[] = [];
    const needsHuman: string[] = [];
    const canonicalEnums = loadCanonicalEnums(repoRoot);

    for (const key of operationKeys(spec)) {
        const [method, path] = key.split(" ");
        if (!(HTTP_METHODS as readonly string[]).includes(method)) continue;
        const result = classifyNewOperation(
            spec,
            method as (typeof HTTP_METHODS)[number],
            path,
            map,
            repoRoot,
            canonicalEnums
        );
        if (result.standard) {
            applicable.push(result.change);
            continue;
        }
        if (result.alreadyImplemented) continue;
        if (isIgnoredOperation(map, method, path)) continue;
        needsHuman.push(
            `spec operation "${method.toUpperCase()} ${path}" has no SDK endpoint and the generator cannot build it: ${result.reason}`
        );
    }
    return { applicable, needsHuman };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../..");

interface Args {
    mode: "check" | "apply" | "audit-types" | "coverage";
    specPath: string;
    reportPath: string | null;
}

function parseArgs(argv: string[]): Args {
    let mode: Args["mode"] | null = null;
    let specPath: string | null = null;
    let reportPath: string | null = null;
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === "--check") mode = "check";
        else if (argv[i] === "--apply") mode = "apply";
        else if (argv[i] === "--audit-types") mode = "audit-types";
        else if (argv[i] === "--coverage") mode = "coverage";
        else if (argv[i] === "--spec") specPath = resolve(process.cwd(), argv[++i]);
        else if (argv[i] === "--report") reportPath = resolve(process.cwd(), argv[++i]);
    }
    if (!mode) {
        console.error(
            "usage: bun scripts/api-sync/index.ts (--check|--apply|--audit-types|--coverage) [--spec path] [--report path]"
        );
        process.exit(1);
    }
    // Everything except apply asserts against committed state, so the snapshot is
    // the right default: spec-current.json only exists on the api-sync-data branch.
    const defaultSpec =
        mode === "apply" ? ".api-sync/spec-current.json" : ".api-sync/spec-snapshot.json";
    return { mode, specPath: specPath ?? resolve(REPO_ROOT, defaultSpec), reportPath };
}

function changeSortKey(c: ApplicableChange): string {
    if (c.kind === "enum-insert") return `${c.site.file} ${c.site.symbol} enum ${c.member}`;
    if (c.kind === "field-insert") return `${c.site.file} ${c.site.symbol} field ${c.field}`;
    return `${c.site.file} ${c.site.symbol} operation ${c.methodName}`;
}

function describeChange(c: ApplicableChange): string {
    if (c.kind === "enum-insert")
        return `add enum member "${c.member}" to ${c.site.file}:${c.site.symbol} (${c.schema}${c.property ? `.${c.property}` : ""})`;
    if (c.kind === "field-insert")
        return `add field "${c.field}?: ${c.tsType}" to ${c.site.file}:${c.site.symbol} (${c.schema}${c.property ? `.${c.property}` : ""})`;
    return `add method "${c.methodName}" to ${c.site.file}:${c.site.symbol} (${c.method.toUpperCase()} ${c.path})`;
}

function writeReport(reportPath: string | null, report: SyncReport): void {
    if (!reportPath) return;
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

/** Appends `entries` to spec-map.json's types[], deduping against sites already present for the
 * same schema/path locator so a second --apply against unchanged state stays byte-identical. */
function persistNewMapEntries(specMapPath: string, entries: NewSchemaMapEntry[]): void {
    if (entries.length === 0) return;
    // biome-ignore lint/suspicious/noExplicitAny: raw spec-map.json JSON
    const raw: any = JSON.parse(readFileSync(specMapPath, "utf8"));
    for (const entry of entries) {
        const locator =
            entry.kind === "schema"
                ? { schema: entry.schema }
                : { path: entry.path, method: entry.method, location: entry.location };
        const existing = raw.types.find(
            (t: { spec: Record<string, unknown> }) =>
                JSON.stringify(t.spec) === JSON.stringify(locator)
        );
        if (existing) {
            if (!existing.sdk.some((s: { symbol: string }) => s.symbol === entry.symbol)) {
                existing.sdk.push({ file: entry.file, symbol: entry.symbol });
            }
            continue;
        }
        raw.types.push({
            spec: locator,
            sdk: [{ file: entry.file, symbol: entry.symbol }],
            notes: entry.notes,
        });
    }
    writeFileSync(specMapPath, `${JSON.stringify(raw, null, 4)}\n`);
}

function main(): void {
    const args = parseArgs(process.argv.slice(2));
    const specMapPath = resolve(REPO_ROOT, ".api-sync/spec-map.json");
    const unmodeledPath = resolve(REPO_ROOT, ".api-sync/unmodeled.json");
    const snapshotPath = resolve(REPO_ROOT, ".api-sync/spec-snapshot.json");
    const packageJsonPath = resolve(REPO_ROOT, "package.json");

    if (!existsSync(args.specPath)) {
        console.error(`[api-sync] spec not found at ${args.specPath}`);
        process.exit(1);
    }

    const map = loadSpecMap(specMapPath);
    const spec = loadSpec(args.specPath);

    if (args.mode === "coverage") {
        // Non-blocking, printed on every run: spec operations with no recognizable SDK endpoint
        // string (e.g. the Rfi family, POST /v1/upload/analyze). Never gates CI.
        const gaps = computeCoverageGaps(spec, REPO_ROOT);
        console.log(
            `[api-sync] coverage: ${gaps.length} spec operation(s) with no SDK endpoint string (non-blocking).`
        );
        for (const g of gaps) console.log(`  - ${g}`);
        if (args.reportPath) writeFileSync(args.reportPath, `${JSON.stringify(gaps, null, 2)}\n`);
        process.exit(0);
    }

    if (args.mode === "audit-types") {
        // Full STATE-based comparison, including nullability; always non-blocking (see audit.ts).
        const findings = auditTypes(spec, map, REPO_ROOT);
        console.log(
            `[api-sync] audit:types: ${findings.length} finding(s) (non-blocking, informational only).`
        );
        for (const f of findings) {
            console.log(`  [${f.category}] ${f.locator}.${f.field} on ${f.site}: ${f.detail}.`);
        }
        if (args.reportPath)
            writeFileSync(args.reportPath, `${JSON.stringify(findings, null, 2)}\n`);
        process.exit(0);
    }

    const unmodeled = loadUnmodeled(unmodeledPath);
    const snapshot = loadSpec(snapshotPath);

    // State-based, like the rest of reconcile(): a spec operation with no SDK endpoint, whether
    // the spec just introduced it or a human deleted the SDK method by hand. Computed first so
    // reconcile() can be told which sites are about to be (re)created this same run: an existing
    // map entry pointing at one of those (not-yet-existing) sites is the coverage gap itself,
    // not a second, separate "type mapping not found" failure.
    const operationGaps = classifyOperationGaps(spec, map, REPO_ROOT);
    const pendingSites = new Set<string>();
    for (const change of operationGaps.applicable) {
        for (const m of change.typeDecls.matchAll(/export type (\w+)/g)) {
            pendingSites.add(`${change.site.file}:${m[1]}`);
        }
    }

    const {
        applicable: rawApplicable,
        needsHuman,
        divergencesHit,
    } = reconcile(spec, map, unmodeled, REPO_ROOT, pendingSites);
    const applicable = [...rawApplicable, ...operationGaps.applicable].sort((a, b) =>
        changeSortKey(a) < changeSortKey(b) ? -1 : 1
    );

    const removalMessages = detectRemovals(snapshot, spec, map);
    const newSchemaMessages = detectNewSchemas(snapshot, spec, map);
    // Enum-constrained properties invisible to both the enum-insert patcher and the ordinary
    // field-type audit (chiefly anyOf/oneOf-wrapped enums): the exact bug class this system
    // exists to kill, so a new one hard-fails --check/--apply immediately instead of shipping
    // silently. See enum-coverage.ts.
    const enumCoverageMessages = findUnmappedEnumProperties(spec, map, unmodeled).map(
        (g) =>
            `enum-constrained property "${g.schema}.${g.property}" (${g.kind}) is not mapped in spec-map.json's enums[], not covered by the ordinary field-type audit, and has no recorded omission in .api-sync/unmodeled.json's enumPropertyOmissions.`
    );

    const allNeedsHuman = [
        ...needsHuman,
        ...removalMessages,
        ...newSchemaMessages,
        ...operationGaps.needsHuman,
        ...enumCoverageMessages,
    ].sort();

    if (allNeedsHuman.length > 0) {
        writeReport(args.reportPath, {
            applied: [],
            needsHuman: allNeedsHuman,
            knownDivergences: divergencesHit.sort(),
            bump: "none",
            changeset: null,
            coverageGaps: [],
        });
        console.error("\n[api-sync] FAIL: needs-human changes detected:\n");
        for (const m of allNeedsHuman) console.error(`  - ${m}`);
        process.exit(1);
    }

    if (args.mode === "check") {
        if (applicable.length > 0) {
            console.error("\n[api-sync] FAIL: pending drift not yet applied (run with --apply):\n");
            for (const c of applicable) console.error(`  - ${describeChange(c)}`);
            process.exit(1);
        }
        console.log(
            `[api-sync] sync:check OK, no pending drift (${divergencesHit.length} known divergence(s) recorded and skipped).`
        );
        return;
    }

    const filesTouched = new Map<string, string>();
    const applied: string[] = [];
    const newMapEntries: NewSchemaMapEntry[] = [];
    for (const change of applicable) {
        const file = change.site.file;
        let before = filesTouched.get(file) ?? readSource(REPO_ROOT, file);
        let after: string;
        if (change.kind === "enum-insert") {
            after = insertEnumMember(before, change.site.symbol, change.member);
        } else if (change.kind === "field-insert") {
            after = insertOptionalField(before, change.site.symbol, change.field, change.tsType);
        } else {
            before = ensureSharedTypeImports(before, change.importsNeeded);
            after = insertTypeDeclarations(before, change.site.symbol, change.typeDecls);
            after = insertResourceMethod(
                after,
                change.site.symbol,
                change.methodName,
                change.methodSource
            );
            newMapEntries.push(...change.newMapEntries);
        }
        if (after !== before) applied.push(describeChange(change));
        filesTouched.set(file, after);
    }
    for (const [file, content] of filesTouched) {
        writeFileSync(resolve(REPO_ROOT, file), content);
    }
    persistNewMapEntries(specMapPath, newMapEntries);

    refreshSnapshot(args.specPath, snapshotPath);

    const hasEnumInsert = applicable.some((c) => c.kind === "enum-insert");
    const hasFieldInsert = applicable.some((c) => c.kind === "field-insert");
    const hasOperationInsert = applicable.some((c) => c.kind === "operation-insert");
    const bump = classifyBump(hasEnumInsert, hasFieldInsert, hasOperationInsert);

    applied.sort();
    let changeset: string | null = null;
    if (bump !== "none") {
        const { name } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name: string };
        const specSha256 = createHash("sha256").update(readFileSync(args.specPath)).digest("hex");
        changeset = `.changeset/${changesetFileName(specSha256)}`;
        writeFileSync(resolve(REPO_ROOT, changeset), renderChangeset(name, bump, applied));
    }

    const report: SyncReport = {
        applied,
        needsHuman: [],
        knownDivergences: divergencesHit.sort(),
        bump,
        changeset,
        coverageGaps: computeCoverageGaps(spec, REPO_ROOT),
    };

    writeReport(args.reportPath, report);
    console.log(JSON.stringify(report, null, 2));
}

main();
