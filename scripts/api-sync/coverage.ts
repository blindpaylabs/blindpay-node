import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { operationKeys, type Spec } from "./spec";

function allResourceSource(repoRoot: string): string {
    const dir = join(repoRoot, "src/resources");
    const parts: string[] = [];
    const walk = (d: string) => {
        for (const entry of readdirSync(d, { withFileTypes: true })) {
            const full = join(d, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
                parts.push(readFileSync(full, "utf8"));
            }
        }
    };
    walk(dir);
    return parts.join("\n");
}

/**
 * Non-blocking heuristic: an operation "has SDK coverage" if the last literal (non-`{param}`)
 * path segment appears anywhere in the resource sources' request-building template strings.
 * Approximate by design (this is a printed report, not a gate), its job is to make gaps like
 * the RFI resource and POST /v1/upload/analyze show up on every run instead of silently.
 */
export function computeCoverageGaps(spec: Spec, repoRoot: string): string[] {
    const source = allResourceSource(repoRoot);
    const gaps: string[] = [];
    for (const key of operationKeys(spec)) {
        const [method, path] = key.split(" ");
        const segments = path
            .replace(/^\/v1\//, "")
            .split("/")
            .filter((seg) => seg.length > 0 && !seg.startsWith("{"));
        const needle = segments[segments.length - 1];
        if (!needle || !source.includes(needle)) {
            gaps.push(`${method.toUpperCase()} ${path}`);
        }
    }
    return gaps.sort();
}
