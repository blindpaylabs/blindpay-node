import {
    operationKeys,
    reachableSchemas,
    resolveEnumMembers,
    resolveProperties,
    type Spec,
} from "./spec";
import { isPathLocator, type SpecMap } from "./types";

function locatorLabel(loc: {
    schema?: string;
    property?: string;
    path?: string;
    method?: string;
}): string {
    if (loc.path) return `${loc.method} ${loc.path}`;
    return loc.property ? `${loc.schema}.${loc.property}` : (loc.schema as string);
}

/**
 * The only place old-vs-new spec diffing is used: catching something the state-based pass
 * cannot, by definition, ever see, a member/property that existed in the committed snapshot
 * and is simply gone from the newly delivered spec. Always a hard fail; removals are breaking
 * and must be a deliberate major version bump, never automatic.
 */
export function detectRemovals(oldSpec: Spec, newSpec: Spec, map: SpecMap): string[] {
    const messages: string[] = [];

    for (const entry of map.enums) {
        let oldMembers: Set<string>;
        try {
            oldMembers = resolveEnumMembers(oldSpec, entry.spec);
        } catch {
            continue; // wasn't resolvable in the old snapshot either; nothing to compare
        }
        let newMembers: Set<string>;
        try {
            newMembers = resolveEnumMembers(newSpec, entry.spec);
        } catch {
            continue; // surfaced separately by reconcile() as "no longer resolves"
        }
        const removed = [...oldMembers].filter((m) => !newMembers.has(m)).sort();
        if (removed.length > 0) {
            messages.push(
                `enum "${locatorLabel(entry.spec)}" lost member(s) [${removed.join(", ")}] present in the committed snapshot; a removal needs a deliberate major version bump, not this patcher.`
            );
        }
    }

    for (const entry of map.types) {
        let oldProps: Set<string>;
        try {
            oldProps = resolveProperties(oldSpec, entry.spec);
        } catch {
            continue;
        }
        let newProps: Set<string>;
        try {
            newProps = resolveProperties(newSpec, entry.spec);
        } catch {
            continue;
        }
        const removed = [...oldProps].filter((p) => !newProps.has(p)).sort();
        if (removed.length > 0) {
            messages.push(
                `schema "${locatorLabel(entry.spec)}" lost propert${removed.length === 1 ? "y" : "ies"} [${removed.join(", ")}] present in the committed snapshot; a removal needs a deliberate major version bump, not this patcher.`
            );
        }
    }

    return messages;
}

/** A schema that becomes reachable for the first time and is neither mapped nor ignored. */
export function detectNewSchemas(oldSpec: Spec, newSpec: Spec, map: SpecMap): string[] {
    const oldReachable = reachableSchemas(oldSpec);
    const newReachable = reachableSchemas(newSpec);

    const mappedNames = new Set<string>();
    for (const entry of [...map.enums, ...map.types]) {
        if (!isPathLocator(entry.spec)) mappedNames.add(entry.spec.schema);
    }
    const ignoredNames = new Set(map.ignore.schemas.map((e) => e.name));

    const newlyReachable = [...newReachable].filter((n) => !oldReachable.has(n)).sort();
    return newlyReachable
        .filter((n) => !mappedNames.has(n) && !ignoredNames.has(n))
        .map(
            (n) =>
                `new schema "${n}" is now reachable from the spec and is neither mapped nor in ignore.schemas; needs a human to decide how (or whether) to model it.`
        );
}

/** A "METHOD path" combination present in the new spec but absent from the old snapshot. */
export function detectNewOperations(oldSpec: Spec, newSpec: Spec): string[] {
    const oldOps = operationKeys(oldSpec);
    const newOps = operationKeys(newSpec);
    const added = [...newOps].filter((o) => !oldOps.has(o)).sort();
    return added.map(
        (o) =>
            `new operation "${o}" needs a human to decide the SDK surface (new method, or a new resource entirely).`
    );
}
