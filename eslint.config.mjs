import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // React rules
            "react/prop-types": "off", // TypeScript handles prop types
            "react/react-in-jsx-scope": "off", // Not needed in Next.js
            "react/display-name": "off", // Not needed for function components
            "react/no-unescaped-entities": "warn", // Allow quotes in JSX

            // TypeScript rules
            "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],
            "@typescript-eslint/explicit-module-boundary-types": "off", // Not needed with TypeScript inference
            "@typescript-eslint/no-explicit-any": "warn", // Discourage use of 'any'
            "@typescript-eslint/no-non-null-assertion": "warn", // Discourage non-null assertions

            // Import rules
            "import/no-anonymous-default-export": "warn",

            // General rules
            "no-console": ["warn", { allow: ["warn", "error"] }], // Allow console.warn and console.error
            "prefer-const": "warn", // Prefer const over let
            "no-var": "error", // No var
            "eqeqeq": ["error", "always"], // Always use === and !==
        },
    },
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "public/**",
            "**/*.d.ts",
        ],
    },
];

export default eslintConfig;
