import { defineConfig } from "vitest/config";

// Tests run in node: the pure seams need no DOM, and React is exercised
// through react-dom/server. Asset imports resolve to their path string.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/**",
        "src/components/**",
        "src/hooks/**",
        "src/art/raster.tsx",
        "src/art/v2/tone.ts",
        "scripts/lib/**",
      ],
      // Ratchet: set at the measured floor after each test-adding commit and only ever
      // raised. Widening the include set (components, hooks on 2026-09-18) resets the
      // floor for the new set; a number may only drop when the set grows.
      thresholds: { lines: 100, branches: 93, functions: 98.5, statements: 99 },
    },
  },
});
