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
    },
  },
});
