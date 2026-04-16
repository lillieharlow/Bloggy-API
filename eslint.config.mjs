/**
 * ESLint config set in this file:
 * - js/recommended rules for all .js files
 * - .js files as CommonJS
 * - Node globals for the whole project
 * - Jest globals in tests
 */

// biome-ignore assist/source/organizeImports: organizing imports not needed in config file
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
