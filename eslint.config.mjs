import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Full a11y rule set — core-web-vitals only enables a handful of jsx-a11y
  // rules; the rest (keyboard interaction, iframe titles for embeds, etc.)
  // matter for an accessible-by-default site (see docs/ACCESSIBILITY.md).
  // Rules only: the plugin itself is already registered by core-web-vitals.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design reference exports — not app code.
    "design-system/**",
  ]),
]);

export default eslintConfig;
