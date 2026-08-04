#!/usr/bin/env node
/**
 * Contract check: verifies the SDK's wire-facing type declarations match the
 * committed OpenAPI spec snapshot at .api-sync/spec-snapshot.json.
 *
 * Direction A (hard fail): every snake_case property key the SDK declares in a
 * resource type (or types/index.d.ts) must exist as a property name SOMEWHERE
 * in the snapshot's schemas, unless allow-listed.
 *
 * Direction B (hard fail): every member of the snapshot's webhook events enum
 * (WebhookEndpointIn.properties.events.items.enum) must exist in the SDK's
 * WebhookEvents union.
 *
 * Direction B (warning, non-blocking): snapshot property names the SDK does
 * not model anywhere are printed as a warning, not a failure.
 *
 * Unused allow-list entries (warning, non-blocking): an entry can be
 * legitimately unused today and still needed tomorrow, e.g. a field the spec
 * is about to stop exposing elsewhere. Flagged so they get cleaned up, but
 * not blocking.
 *
 * Run: node scripts/contract-check.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const SNAPSHOT_PATH = path.join(REPO_ROOT, ".api-sync/spec-snapshot.json");
const ALLOWLIST_PATH = path.join(REPO_ROOT, ".api-sync/contract-check-allowlist.json");
const RESOURCES_DIR = path.join(REPO_ROOT, "src/resources");
const SHARED_TYPES_PATH = path.join(REPO_ROOT, "types/index.d.ts");

function fail(message) {
    console.error(`\n[contract-check] FAIL: ${message}\n`);
    process.exitCode = 1;
}

function loadJson(filePath, label) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`${label} not found at ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// ---------------------------------------------------------------------------
// Snapshot indexing
// ---------------------------------------------------------------------------

function collectAllPropertyNames(node, into) {
    if (Array.isArray(node)) {
        for (const item of node) collectAllPropertyNames(item, into);
        return;
    }
    if (node && typeof node === "object") {
        if (node.properties && typeof node.properties === "object") {
            for (const key of Object.keys(node.properties)) into.add(key);
        }
        // OpenAPI Parameter objects (query/path params) carry their wire name
        // in `name`, not under `properties`.
        if (typeof node.name === "string" && typeof node.in === "string") {
            into.add(node.name);
        }
        for (const value of Object.values(node)) collectAllPropertyNames(value, into);
    }
}

function collectWebhookEventEnum(spec) {
    const schema = spec.components?.schemas?.WebhookEndpointIn;
    const enumValues = schema?.properties?.events?.items?.enum;
    if (!Array.isArray(enumValues) || enumValues.length === 0) {
        throw new Error(
            "Could not locate components.schemas.WebhookEndpointIn.properties.events.items.enum in the snapshot"
        );
    }
    return new Set(enumValues);
}

// ---------------------------------------------------------------------------
// SDK source scanning
// ---------------------------------------------------------------------------

function listResourceSourceFiles(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            listResourceSourceFiles(full, out);
        } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
            out.push(full);
        }
    }
    return out;
}

// Only the type-declaration section of a resource file is wire-contract
// surface. The factory function body builds/calls requests using values
// already typed above it, so we stop scanning at that boundary.
function typeDeclarationSection(content) {
    const marker = content.indexOf("\nexport function create");
    return marker === -1 ? content : content.slice(0, marker);
}

const TOP_LEVEL_TYPE_RE = /^export type ([A-Za-z_][A-Za-z0-9_]*)\b/;
const PROPERTY_KEY_RE = /^\s*(?:readonly\s+)?([A-Za-z_][A-Za-z0-9_]*)\??\s*:\s*\S/;

/**
 * Returns [{ file, line, schema, field }] for every property key declared in
 * the type-declaration section of the given file's content. `schema` is the
 * nearest enclosing top-level `export type` name (best-effort attribution,
 * used only for allow-list scoping).
 */
function extractDeclaredWireKeys(filePath, content) {
    const section = typeDeclarationSection(content);
    const lines = section.split("\n");
    const found = [];
    let currentSchema = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Union members ( | "value" ) and comments are never object keys.
        if (trimmed.startsWith("|") || trimmed.startsWith("//") || trimmed.startsWith("*")) {
            continue;
        }

        const topLevelMatch = TOP_LEVEL_TYPE_RE.exec(line);
        if (topLevelMatch) {
            currentSchema = topLevelMatch[1];
            continue;
        }

        const propMatch = PROPERTY_KEY_RE.exec(line);
        if (propMatch) {
            found.push({
                file: path.relative(REPO_ROOT, filePath),
                line: i + 1,
                schema: currentSchema ?? "(module-level)",
                field: propMatch[1],
            });
        }
    }

    return found;
}

// ---------------------------------------------------------------------------
// Allow-list
// ---------------------------------------------------------------------------

function loadAllowList() {
    if (!fs.existsSync(ALLOWLIST_PATH)) return [];
    const raw = loadJson(ALLOWLIST_PATH, "allow-list");
    if (!Array.isArray(raw)) {
        throw new Error(`${ALLOWLIST_PATH} must be a JSON array`);
    }
    for (const [i, entry] of raw.entries()) {
        for (const key of ["schema", "field", "reason", "owner"]) {
            if (typeof entry[key] !== "string" || entry[key].trim() === "") {
                throw new Error(`${ALLOWLIST_PATH}[${i}] is missing a non-empty string "${key}"`);
            }
        }
    }
    return raw;
}

function allowListKey(schema, field) {
    return `${schema}.${field}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
    const spec = loadJson(SNAPSHOT_PATH, "spec snapshot");
    const allowList = loadAllowList();
    const allowedKeys = new Set(allowList.map((e) => allowListKey(e.schema, e.field)));

    // Walk the whole document, not just components.schemas: list-endpoint
    // envelopes ({ data, pagination }) and some request bodies are defined
    // inline on the path item rather than as a reusable named schema.
    const allWireProperties = new Set();
    collectAllPropertyNames(spec, allWireProperties);

    const webhookEventEnum = collectWebhookEventEnum(spec);

    const sourceFiles = [SHARED_TYPES_PATH, ...listResourceSourceFiles(RESOURCES_DIR)].filter((f) =>
        fs.existsSync(f)
    );

    const declaredKeys = [];
    for (const file of sourceFiles) {
        const content = fs.readFileSync(file, "utf8");
        declaredKeys.push(...extractDeclaredWireKeys(file, content));
    }

    // --- Direction A: every declared wire key must exist somewhere in the snapshot ---
    const directionAViolations = [];
    const usedAllowListKeys = new Set();
    for (const decl of declaredKeys) {
        if (allWireProperties.has(decl.field)) continue;
        const key = allowListKey(decl.schema, decl.field);
        if (allowedKeys.has(key)) {
            usedAllowListKeys.add(key);
            continue;
        }
        directionAViolations.push(decl);
    }

    // --- Direction B (hard fail): webhook events enum, explicitly mapped ---
    let webhookEventsUnion;
    {
        const webhooksFile = path.join(RESOURCES_DIR, "webhooks/index.ts");
        const content = fs.readFileSync(webhooksFile, "utf8");
        const match = content.match(/export type WebhookEvents =\s*([\s\S]*?);/);
        if (!match) {
            throw new Error(
                `Could not locate "export type WebhookEvents = ..." in ${webhooksFile}`
            );
        }
        webhookEventsUnion = new Set([...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
    }

    const missingWebhookEvents = [...webhookEventEnum].filter(
        (evt) => !webhookEventsUnion.has(evt)
    );

    // --- Direction B (warning): spec fields the SDK does not model anywhere ---
    const declaredFieldNames = new Set(declaredKeys.map((d) => d.field));
    const unmodeledSpecFields = [...allWireProperties]
        .filter((name) => !declaredFieldNames.has(name))
        .sort();

    // --- Report ---
    let hasHardFailure = false;

    if (directionAViolations.length > 0) {
        hasHardFailure = true;
        fail(
            `${directionAViolations.length} SDK-declared field(s) do not exist anywhere in the spec snapshot:`
        );
        for (const v of directionAViolations) {
            console.error(`  ${v.file}:${v.line}  ${v.schema}.${v.field}`);
        }
        console.error(
            "\n  Rename the field to match the snapshot, or add a justified entry to\n" +
                `  ${path.relative(REPO_ROOT, ALLOWLIST_PATH)} (schema, field, reason, owner).`
        );
    }

    if (missingWebhookEvents.length > 0) {
        hasHardFailure = true;
        fail(
            `WebhookEvents is missing enum member(s) present in the snapshot: ${missingWebhookEvents.join(", ")}`
        );
    }

    const staleAllowListEntries = allowList.filter(
        (e) => !usedAllowListKeys.has(allowListKey(e.schema, e.field))
    );
    if (staleAllowListEntries.length > 0) {
        console.warn(
            "\n[contract-check] WARNING: allow-list entries not currently needed (non-blocking; " +
                "verify they're still justified and remove if not):"
        );
        for (const e of staleAllowListEntries) {
            console.warn(`  ${e.schema}.${e.field}`);
        }
    }

    if (unmodeledSpecFields.length > 0) {
        console.warn(
            `\n[contract-check] WARNING: ${unmodeledSpecFields.length} spec field name(s) are not modeled by any SDK type ` +
                "(non-blocking; this is expected for internal/ops-only and business-specific fields):"
        );
        console.warn(
            `  ${unmodeledSpecFields.slice(0, 25).join(", ")}${unmodeledSpecFields.length > 25 ? ", ..." : ""}`
        );
    }

    if (!hasHardFailure) {
        console.log(
            `[contract-check] OK — ${declaredKeys.length} declared field(s) checked, ` +
                `${webhookEventEnum.size} webhook event(s) checked, ${allowList.length} allow-list entr${allowList.length === 1 ? "y" : "ies"} in use.`
        );
    }

    process.exit(hasHardFailure ? 1 : 0);
}

main();
