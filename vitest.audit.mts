/**
 * Config for the calendar audit (`npm run audit`).
 *
 * Kept separate from vitest.config.mts because the audit is an investigation
 * rather than a regression gate: it asserts what each calendar *should* say and
 * therefore fails wherever the app is still wrong. CI runs `npm test`, which
 * excludes this directory and must stay green.
 */
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    include: ["tests/audit/**/*.test.ts"],
  },
});
