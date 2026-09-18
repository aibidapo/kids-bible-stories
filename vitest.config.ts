import { defineConfig } from "vitest/config";

// Tests run in node: the pure seams need no DOM, and React is exercised
// through react-dom/server. Asset imports resolve to their path string.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/art/raster.tsx", "src/art/v2/tone.ts", "scripts/lib/**"],
      // Ratchet: set at the measured baseline after each test-adding commit and only ever
      // raised. `sound.ts` (Web Audio, 0 %) is the main drag; see the local-gates record.
      thresholds: { lines: 45, branches: 56, functions: 67, statements: 44 },
    },
  },
});
