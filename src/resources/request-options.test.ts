import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const RESOURCES = __dirname;

function sourceFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return sourceFiles(path);
        return path.endsWith(".ts") && !path.endsWith(".test.ts") ? [path] : [];
    });
}

/** The argument text of the call whose `(` is at `open`, found by balancing parentheses. */
function callArguments(source: string, open: number): string {
    let depth = 0;
    for (let i = open; i < source.length; i++) {
        if (source[i] === "(") depth++;
        else if (source[i] === ")" && --depth === 0) return source.slice(open + 1, i);
    }
    throw new Error(`unbalanced call at offset ${open}`);
}

/** Every `client.<method>(...)` call whose last argument isn't `options`. */
function callsWithoutOptions(): string[] {
    return sourceFiles(RESOURCES).flatMap((file) => {
        const source = readFileSync(file, "utf8");
        const calls = source.matchAll(/client\.(get|post|put|patch|delete|postMultipart)\(/g);
        return [...calls]
            .map((call) => ({
                call,
                args: callArguments(source, (call.index ?? 0) + call[0].length - 1),
            }))
            .filter(({ args }) => !/\boptions,?$/.test(args.trim()))
            .map(
                ({ call, args }) => `${relative(RESOURCES, file)}: ${call[0]}${args.split("\n")[0]}`
            );
    });
}

describe("RequestOptions", () => {
    it("is forwarded by every method, so each one can take an Idempotency-Key, timeout, headers or signal", () => {
        expect(callsWithoutOptions()).toEqual([]);
    });
});
