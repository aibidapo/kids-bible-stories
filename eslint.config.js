import js from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "dev-dist/**",
      "scratch/**",
      "coverage/**",
      "node_modules/**",
      "design/**",
      "docs/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    languageOptions: { globals: globals.browser },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["scripts/**/*.{ts,tsx,mjs}", "*.config.{js,ts}", "vite.config.ts"],
    languageOptions: { globals: { ...globals.node, WebSocket: "readonly" } },
    rules: {
      // Build scripts read paths they compute from their own arguments.
      "security/detect-non-literal-fs-filename": "off",
    },
  },
);
