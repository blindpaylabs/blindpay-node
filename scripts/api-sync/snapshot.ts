import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Refreshes the committed snapshot with the delivered spec's exact bytes: read bytes, write
 * bytes, never a JSON.parse + JSON.stringify round trip (that reformats the file in this
 * language's own JSON style even when semantically unchanged, producing a huge diff on every
 * future sync PR and leaving the committed snapshot no longer byte-identical to what
 * blindpay-v2 ships as spec-current.json).
 *
 * A no-op when `specPath` already IS `snapshotPath` (e.g. a determinism proof run against the
 * committed baseline itself): copying a file onto itself is never useful, and some copyfile()
 * implementations truncate the destination before reading the identical source, destroying it.
 */
export function refreshSnapshot(specPath: string, snapshotPath: string): void {
    if (resolve(specPath) === resolve(snapshotPath)) return;
    copyFileSync(specPath, snapshotPath);
}
