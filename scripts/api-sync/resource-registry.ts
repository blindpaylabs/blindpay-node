import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

export type ResourceInfo = {
    file: string;
    factoryFn: string;
    /** True only for the common `(instanceId: string, client: InternalApiClient)` shape the
     * generator's method template assumes; anything else is out of scope (needs-human). */
    standardSignature: boolean;
};

function listResourceFiles(repoRoot: string): string[] {
    const dir = join(repoRoot, "src/resources");
    const out: string[] = [];
    const walk = (d: string) => {
        for (const entry of readdirSync(d, { withFileTypes: true })) {
            const full = join(d, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) out.push(full);
        }
    };
    walk(dir);
    return out;
}

/** Same rule as `resourceSegmentOf`, applied to a hand-written request-path template instead
 * of a spec path: the deepest literal segment that starts a new collection level. */
function owningSegmentOfTemplate(template: string): string | null {
    const rest = template
        .replace(/^\/instances\/\$\{[^}]+\}\/?/, "")
        .split("/")
        .filter((s) => s.length > 0);
    let last: string | null = null;
    for (let i = 0; i < rest.length; i++) {
        const seg = rest[i];
        if (/^\{[^}]*\}$/.test(seg) || /^\$\{[^}]*\}$/.test(seg)) continue;
        const literal = seg.split("${")[0]; // drop a trailing non-slash spread, e.g. "payins${queryParams}"
        if (!literal) continue;
        const prev = rest[i - 1];
        const prevIsParam =
            prev !== undefined && (/^\{[^}]*\}$/.test(prev) || /^\$\{[^}]*\}$/.test(prev));
        if (i === 0 || prevIsParam) last = literal;
    }
    return last;
}

/**
 * Maps a resource segment (e.g. "payins", "bank-accounts") to the resource file(s) that OWN a
 * `client.get/post/put/patch/delete(\`...\`)` call at that collection level (see
 * `owningSegmentOfTemplate`; a segment merely passing through as an ancestor, like "customers"
 * in a bank-accounts template, is not ownership). The same segment owned by more than one file
 * is ambiguous on purpose: the classifier treats that as "no single resource owns this", never
 * a guess.
 */
export function buildSegmentIndex(repoRoot: string): Map<string, Set<string>> {
    const index = new Map<string, Set<string>>();
    for (const full of listResourceFiles(repoRoot)) {
        const rel = relative(repoRoot, full);
        const content = readFileSync(full, "utf8");
        const calls = content.matchAll(/client\.(?:get|post|put|patch|delete)\(\s*`([^`]*)`/g);
        for (const m of calls) {
            const seg = owningSegmentOfTemplate(m[1]);
            if (!seg) continue;
            if (!index.has(seg)) index.set(seg, new Set());
            (index.get(seg) as Set<string>).add(rel);
        }
    }
    return index;
}

/** Path shape with every `{param}` / `${...}` segment collapsed to a bare "{}" marker, and any
 * trailing dynamic suffix on the final segment (e.g. a spread `${queryParams}`) dropped, so a
 * spec path and a hand-written template literal can be compared regardless of variable names. */
function pathShape(segments: string[]): string {
    return segments
        .map((seg, i) => {
            // A whole-segment param, either OpenAPI's `{name}` or a JS template's `${name}`.
            if (/^\{[^}]*\}$/.test(seg) || /^\$\{[^}]*\}$/.test(seg)) return "{}";
            if (i === segments.length - 1) {
                // A trailing spread with no slash of its own, e.g. `payins${queryParams}`
                // (query string, not a path segment): keep only its literal prefix.
                const idx = seg.indexOf("${");
                if (idx > 0) return seg.slice(0, idx);
            }
            return seg;
        })
        .join("/");
}

/**
 * Precise (not the coarse "does this literal segment appear anywhere" heuristic coverage.ts
 * uses for its non-blocking report): true only if `resourceFile` has a `client.<method>(...)`
 * call whose path template has the exact same literal/dynamic segment shape as `path`, after
 * dropping the `instances/{instance_id}` prefix both sides share. Sensitive to a single method
 * disappearing even when its resource file still implements sibling operations on the same
 * literal segment (unlike the coarse heuristic), which is what makes it safe to use as the
 * operation-insert discovery signal instead of only a diff against the previous spec.
 */
export function operationIsImplemented(
    repoRoot: string,
    method: string,
    path: string,
    resourceFile: string
): boolean {
    const expected = pathShape(
        path
            .replace(/^\/v1\/?/, "")
            .replace(/^instances\/\{[^}]+\}\/?/, "")
            .split("/")
            .filter((s) => s.length > 0)
    );
    const content = readFileSync(join(repoRoot, resourceFile), "utf8");
    const calls = content.matchAll(new RegExp(`client\\.${method}\\(\\s*\`([^\`]*)\``, "g"));
    for (const m of calls) {
        const template = m[1]
            .replace(/^\/instances\/\$\{[^}]+\}\/?/, "")
            .split("/")
            .filter((s) => s.length > 0);
        if (pathShape(template) === expected) return true;
    }
    return false;
}

export function findResourceInfo(repoRoot: string, file: string): ResourceInfo | null {
    const content = readFileSync(join(repoRoot, file), "utf8");
    const m = /^export function (create\w+Resource)\(([^)]*)\)/m.exec(content);
    if (!m) return null;
    const params = m[2].replace(/\s+/g, " ").trim();
    const standardSignature = /^instanceId:\s*string,\s*client:\s*InternalApiClient$/.test(params);
    return { file, factoryFn: m[1], standardSignature };
}

/**
 * The path segment that identifies which resource a new operation belongs to: the deepest
 * literal segment that starts a new "collection level" (either the very first segment after
 * {instance_id}, or a literal immediately following a `{param}`). For a nested path like
 * `customers/{customer_id}/bank-accounts/{id}` that is "bank-accounts", not "customers": the
 * generic parent container is never the right resource once the path nests past it.
 */
export function resourceSegmentOf(path: string): string | null {
    const rest = path
        .replace(/^\/v1\/?/, "")
        .replace(/^instances\/\{[^}]+\}\/?/, "")
        .split("/")
        .filter((s) => s.length > 0);
    let last: string | null = null;
    for (let i = 0; i < rest.length; i++) {
        if (rest[i].startsWith("{")) continue;
        if (i === 0 || rest[i - 1].startsWith("{")) last = rest[i];
    }
    return last;
}
