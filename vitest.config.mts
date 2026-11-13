import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        exclude: ["tests/browser-harness/**", "**/node_modules/**", "**/dist/**"],
    },
    resolve: {
        alias: {
            "@": path.resolve(directory, "src"),
        },
    },
});
