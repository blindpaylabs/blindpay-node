import { operationIsImplementedAnywhere } from "./resource-registry";
import { operationKeys, type Spec } from "./spec";

/**
 * Spec operations no SDK method implements: method-aware ("PUT /x" isn't covered by a "GET /x")
 * and path-shape exact, with auto-pagers not counting as the list op they page. The standalone
 * --coverage report and the --check/--apply report both use it.
 */
export function computeCoverageGaps(spec: Spec, repoRoot: string): string[] {
    const gaps: string[] = [];
    for (const key of operationKeys(spec)) {
        const [method, path] = key.split(" ");
        if (!operationIsImplementedAnywhere(repoRoot, method, path)) {
            gaps.push(`${method.toUpperCase()} ${path}`);
        }
    }
    return gaps.sort();
}
