import { defineConfig } from "tsup";

export default defineConfig({
    // Each resource stays its own entry (dist/index.d.ts re-exports from dist/resources/*);
    // tests are left out so the published package carries no test bundles.
    entry: ["src/index.ts", "src/resources/**/*.ts", "!src/**/*.test.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
});
