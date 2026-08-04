import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { refreshSnapshot } from "./snapshot";

let dir: string | null = null;

afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = null;
});

describe("refreshSnapshot", () => {
    it("leaves the snapshot byte-identical to the source spec file", () => {
        dir = mkdtempSync(join(tmpdir(), "api-sync-snapshot-"));
        const specPath = join(dir, "spec-current.json");
        const snapshotPath = join(dir, "spec-snapshot.json");
        const content = '{\n  "openapi": "3.1.0",\n  "info": {\n    "title": "x"\n  }\n}\n';
        writeFileSync(specPath, content);
        writeFileSync(snapshotPath, '{"stale": true}');

        refreshSnapshot(specPath, snapshotPath);

        expect(readFileSync(snapshotPath, "utf8")).toBe(content);
        expect(readFileSync(snapshotPath)).toEqual(readFileSync(specPath));
    });

    it("is a safe no-op when --spec already points at the snapshot itself", () => {
        dir = mkdtempSync(join(tmpdir(), "api-sync-snapshot-"));
        const snapshotPath = join(dir, "spec-snapshot.json");
        const content = '{"a": 1}\n';
        writeFileSync(snapshotPath, content);

        expect(() => refreshSnapshot(snapshotPath, snapshotPath)).not.toThrow();
        expect(readFileSync(snapshotPath, "utf8")).toBe(content);
    });

    it("does not reformat: byte-for-byte, not a JSON.parse + JSON.stringify round trip", () => {
        dir = mkdtempSync(join(tmpdir(), "api-sync-snapshot-"));
        const specPath = join(dir, "spec-current.json");
        const snapshotPath = join(dir, "spec-snapshot.json");
        // Deliberately unusual (but valid) JSON formatting: a JSON.stringify round trip would
        // normalize this away, so a byte-for-byte copy is the only way to preserve it.
        const content = '{"a":1,   "b":  2,\r\n"c":3}';
        writeFileSync(specPath, content);
        writeFileSync(snapshotPath, "{}");

        refreshSnapshot(specPath, snapshotPath);

        expect(readFileSync(snapshotPath, "utf8")).toBe(content);
    });
});
