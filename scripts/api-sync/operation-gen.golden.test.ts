import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const REPO_ROOT = join(__dirname, "../..");

let scratchDir: string | null = null;

/** A scratch copy of the whole repo (source only; node_modules is symlinked in, not copied,
 * so `tsc`/`vitest` inside the copy resolve real dependencies without a second install). */
function makeScratchRepo(): string {
    const dir = mkdtempSync(join(tmpdir(), "api-sync-golden-"));
    cpSync(REPO_ROOT, dir, {
        recursive: true,
        filter: (src) =>
            !src.includes(`${REPO_ROOT}/node_modules`) &&
            !src.includes(`${REPO_ROOT}/.git`) &&
            // Not itself: `bun run test` inside the scratch copy would otherwise re-run this
            // same golden test recursively (and against an already-regenerated repo, wrongly).
            !src.endsWith("operation-gen.golden.test.ts"),
    });
    symlinkSync(join(REPO_ROOT, "node_modules"), join(dir, "node_modules"));
    return dir;
}

afterEach(() => {
    if (scratchDir) rmSync(scratchDir, { recursive: true, force: true });
    scratchDir = null;
});

function deleteSpan(content: string, startMarker: string, endMarker: string): string {
    const start = content.indexOf(startMarker);
    if (start === -1) throw new Error(`marker not found: ${startMarker}`);
    const end = content.indexOf(endMarker, start);
    if (end === -1) throw new Error(`end marker not found: ${endMarker}`);
    return content.slice(0, start) + content.slice(end);
}

/**
 * Deletes payins.get + its Input/Output types, and quotes.create + its Input/Output types:
 * the SDK method and the types it exposes, exactly what a human accidentally reverting or
 * force-pushing over that code would lose. (spec-map.json's own QuoteIn/QuoteOut coverage
 * entries are deliberately left alone here: they're exercised by a separate, isolated unit
 * test below, `operation-insert on a never-before-modeled schema`, without entangling this
 * live-repo run with the unrelated enum-coverage gate a fully-unmapped QuoteIn would also trip.)
 */
function deleteTwoOperations(dir: string): void {
    const payinsPath = join(dir, "src/resources/payins/index.ts");
    let payins = readFileSync(payinsPath, "utf8");
    payins = deleteSpan(
        payins,
        "export type GetPayinInput = string;",
        "export type GetPayinTrackInput"
    );
    payins = deleteSpan(payins, "        get(payinId: GetPayinInput)", "        getTrack(");
    writeFileSync(payinsPath, payins);

    const quotesPath = join(dir, "src/resources/quotes/index.ts");
    let quotes = readFileSync(quotesPath, "utf8");
    quotes = deleteSpan(quotes, "export type CreateQuoteInput", "export type GetFxRateInput");
    quotes = deleteSpan(
        quotes,
        "        create({ ...data }: CreateQuoteInput)",
        "        getFxRate("
    );
    writeFileSync(quotesPath, quotes);
}

function runSync(dir: string, ...args: string[]): { status: number; output: string } {
    try {
        const output = execFileSync(
            "bun",
            ["scripts/api-sync/index.ts", ...args, "--spec", ".api-sync/spec-snapshot.json"],
            { cwd: dir, encoding: "utf8" }
        );
        return { status: 0, output };
    } catch (err) {
        const e = err as { status: number; stdout: string; stderr: string };
        return { status: e.status, output: `${e.stdout}\n${e.stderr}` };
    }
}

describe("operation-insert golden self-test", () => {
    it("regenerates a deleted GET-by-id and a deleted POST-with-body from the committed snapshot spec", () => {
        const dir = makeScratchRepo();
        scratchDir = dir;
        deleteTwoOperations(dir);

        const first = runSync(dir, "--apply");
        expect(first.status).toBe(0);

        const payins = readFileSync(join(dir, "src/resources/payins/index.ts"), "utf8");
        expect(payins).toContain("export type GetPayinInput = string;");
        expect(payins).toContain("export type GetPayinResponse = Payin;");
        expect(payins).toContain(
            "get(payinId: GetPayinInput): Promise<BlindpayApiResponse<GetPayinResponse>> {"
        );
        expect(payins).toContain(
            "return client.get(`/instances/${instanceId}/payins/${payinId}`);"
        );

        const quotes = readFileSync(join(dir, "src/resources/quotes/index.ts"), "utf8");
        expect(quotes).toContain("bank_account_id: string;");
        expect(quotes).toContain("currency_type:");
        expect(quotes).toContain("request_amount: number;");
        expect(quotes).toContain(
            "create({ ...data }: CreateQuoteInput): Promise<BlindpayApiResponse<CreateQuoteResponse>> {"
        );
        expect(quotes).toContain("return client.post(`/instances/${instanceId}/quotes`, data);");

        execFileSync("bun", ["run", "check-types"], { cwd: dir, stdio: "pipe" });
        execFileSync("bun", ["run", "test"], { cwd: dir, stdio: "pipe" });

        const afterFirstApply: Record<string, string> = {
            payins,
            quotes,
            map: readFileSync(join(dir, ".api-sync/spec-map.json"), "utf8"),
            pkg: readFileSync(join(dir, "package.json"), "utf8"),
        };

        const second = runSync(dir, "--apply");
        expect(second.status).toBe(0);
        expect(readFileSync(join(dir, "src/resources/payins/index.ts"), "utf8")).toBe(
            afterFirstApply.payins
        );
        expect(readFileSync(join(dir, "src/resources/quotes/index.ts"), "utf8")).toBe(
            afterFirstApply.quotes
        );
        expect(readFileSync(join(dir, ".api-sync/spec-map.json"), "utf8")).toBe(
            afterFirstApply.map
        );
        expect(readFileSync(join(dir, "package.json"), "utf8")).toBe(afterFirstApply.pkg);

        const check = runSync(dir, "--check");
        expect(check.status).toBe(0);
    }, 60_000);
});
