#!/usr/bin/env node
/**
 * Type-checks what a consumer compiles against the built package (`dist/`, so run
 * `bun run build` first), with a strict consumer tsconfig: `module`/`moduleResolution`
 * `nodenext`, `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` and
 * `skipLibCheck: false`.
 *
 * - Every ```typescript block in README.md, each as its own ES module, so a snippet that
 *   doesn't compile when pasted (a top-level `return`, an undeclared name) fails here. The
 *   snippets after "Configuration" may use the `blindpay` client it creates (README says so);
 *   `express` is stubbed with the few members the webhook snippet uses.
 * - Every file in test/consumer-types/ (e.g. options accepting an explicit `undefined`).
 *
 * Run: node scripts/check-consumer-types.mjs
 */
import { execFileSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    symlinkSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (!existsSync(join(REPO_ROOT, "dist/index.d.mts"))) {
    console.error("[check-consumer-types] dist/ is missing: run `bun run build` first.");
    process.exit(1);
}

/** The ```typescript blocks of a Markdown file, with the line each starts on. */
export function typescriptBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (!/^```(typescript|ts)\s*$/.test(lines[i])) continue;
        const start = i + 1;
        let end = start;
        while (end < lines.length && !lines[end].startsWith("```")) end++;
        blocks.push({ line: start + 1, code: lines.slice(start, end).join("\n") });
        i = end;
    }
    return blocks;
}

const dir = mkdtempSync(join(tmpdir(), "blindpay-consumer-types-"));
try {
    // The package as a consumer installs it: node_modules/@blindpay/node -> this repo (package.json
    // `exports` + dist/), plus the repo's own @types/node and the runtime dependency svix.
    mkdirSync(join(dir, "node_modules/@blindpay"), { recursive: true });
    symlinkSync(REPO_ROOT, join(dir, "node_modules/@blindpay/node"), "dir");
    for (const dep of ["@types", "undici-types", "svix"]) {
        symlinkSync(join(REPO_ROOT, "node_modules", dep), join(dir, "node_modules", dep), "dir");
    }

    writeFileSync(
        join(dir, "package.json"),
        JSON.stringify({ name: "consumer-types", private: true, type: "module" })
    );
    writeFileSync(
        join(dir, "tsconfig.json"),
        JSON.stringify(
            {
                compilerOptions: {
                    target: "ES2022",
                    module: "nodenext",
                    moduleResolution: "nodenext",
                    strict: true,
                    exactOptionalPropertyTypes: true,
                    noUncheckedIndexedAccess: true,
                    skipLibCheck: false,
                    noEmit: true,
                    types: ["node"],
                },
                include: ["*.mts", "*.d.ts"],
            },
            null,
            2
        )
    );
    writeFileSync(
        join(dir, "readme-globals.d.ts"),
        [
            "// The client README's Configuration section creates; later snippets use it.",
            'declare const blindpay: import("@blindpay/node").BlindPay;',
            "// The members of Express the webhook snippet uses (express isn't a dependency here).",
            'declare module "express" {',
            '    import type { IncomingHttpHeaders } from "node:http";',
            "    interface Request { body: Buffer; headers: IncomingHttpHeaders }",
            "    interface Response { sendStatus(status: number): Response }",
            "    type Handler = (req: Request, res: Response) => unknown;",
            "    interface App { post(path: string, ...handlers: Handler[]): void }",
            "    interface Express { (): App; raw(options: { type: string }): Handler }",
            "    const express: Express;",
            "    export default express;",
            "}",
            "",
        ].join("\n")
    );

    const files = [];
    const blocks = typescriptBlocks(readFileSync(join(REPO_ROOT, "README.md"), "utf8"));
    for (const [i, block] of blocks.entries()) {
        const name = `readme-${String(i + 1).padStart(2, "0")}-line-${block.line}.mts`;
        writeFileSync(join(dir, name), `${block.code}\nexport {};\n`);
        files.push(name);
    }
    for (const name of readdirSync(join(REPO_ROOT, "test/consumer-types"))) {
        cpSync(join(REPO_ROOT, "test/consumer-types", name), join(dir, name));
        files.push(name);
    }

    const tsc = join(REPO_ROOT, "node_modules/typescript/bin/tsc");
    try {
        execFileSync(process.execPath, [tsc, "-p", "tsconfig.json", "--pretty", "false"], {
            cwd: dir,
            stdio: ["ignore", "pipe", "pipe"],
            encoding: "utf8",
        });
    } catch (error) {
        console.error(
            `[check-consumer-types] FAIL (README blocks are named readme-<n>-line-<README line>):\n${error.stdout ?? ""}${error.stderr ?? ""}`
        );
        process.exit(1);
    }
    console.log(
        `[check-consumer-types] OK: ${blocks.length} README snippet(s) and ${files.length - blocks.length} type test(s) compile against dist/ (nodenext, strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, skipLibCheck false).`
    );
} finally {
    rmSync(dir, { recursive: true, force: true });
}
