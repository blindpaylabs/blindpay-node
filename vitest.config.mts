import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        setupFiles: ["./vitest.setup.mts"],
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["src/internal/**", "src/index.ts"],
        },
    },
});
