import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * The committed snapshot's layout: 2-space JSON with a trailing newline, the layout blindpay-v2
 * ships and the public spec uses. Parsing and re-serialising a spec already in that layout gives
 * back the same bytes, so a pretty delivery is copied unchanged, while a minified delivery is
 * expanded instead of turning every future snapshot refresh into a one-line, whole-file diff.
 */
export function formatSnapshot(specText: string): string {
    return `${JSON.stringify(JSON.parse(specText), null, 2)}\n`;
}

/**
 * Refreshes the committed snapshot from the delivered spec, in the snapshot layout
 * (`formatSnapshot`). A no-op when `specPath` already IS `snapshotPath` (e.g. a determinism
 * proof run against the committed baseline itself).
 */
export function refreshSnapshot(specPath: string, snapshotPath: string): void {
    if (resolve(specPath) === resolve(snapshotPath)) return;
    writeFileSync(snapshotPath, formatSnapshot(readFileSync(specPath, "utf8")));
}
