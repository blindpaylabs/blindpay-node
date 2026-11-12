import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { formatSnapshot, refreshSnapshot } from "./snapshot";

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

    it("writes a minified spec as 2-space JSON with a trailing newline", () => {
        dir = mkdtempSync(join(tmpdir(), "api-sync-snapshot-"));
        const specPath = join(dir, "spec-current.json");
        const snapshotPath = join(dir, "spec-snapshot.json");
        writeFileSync(specPath, '{"openapi":"3.1.0","info":{"title":"x"},"tags":["é"]}');
        writeFileSync(snapshotPath, "{}");

        refreshSnapshot(specPath, snapshotPath);

        expect(readFileSync(snapshotPath, "utf8")).toBe(
            '{\n  "openapi": "3.1.0",\n  "info": {\n    "title": "x"\n  },\n  "tags": [\n    "é"\n  ]\n}\n'
        );
    });

    it("gives back the committed snapshot's exact bytes (the layout is a fixed point)", () => {
        const committed = readFileSync(
            join(__dirname, "../../.api-sync/spec-snapshot.json"),
            "utf8"
        );
        expect(formatSnapshot(committed)).toBe(committed);
    });
});
