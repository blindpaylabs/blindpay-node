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

/** Every `client.post|put|patch|delete(...)` call whose last argument isn't `options`. */
function mutationsWithoutOptions(): string[] {
    return sourceFiles(RESOURCES).flatMap((file) => {
        const source = readFileSync(file, "utf8");
        const calls = source.matchAll(/client\.(post|put|patch|delete)\(([\s\S]*?)\);/g);
        return [...calls]
            .filter(([, , args]) => !args.trim().startsWith("`/e/"))
            .filter(([, , args]) => !/\boptions,?$/.test(args.trim()))
            .map(([call]) => `${relative(RESOURCES, file)}: ${call.split("\n")[0]}`);
    });
}

describe("RequestOptions", () => {
    it("is forwarded by every authenticated mutation, so each one can send an Idempotency-Key", () => {
        expect(mutationsWithoutOptions()).toEqual([]);
    });
});
