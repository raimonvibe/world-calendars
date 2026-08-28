import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // The audit suite is an investigation, not a regression gate: it fails on
    // purpose wherever a calendar is wrong. Run it with `npm run audit`.
    exclude: ["tests/audit/**"],
  },
});
