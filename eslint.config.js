import js from "@eslint/js"
import astro from "eslint-plugin-astro"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      ".vercel/**",
      "node_modules/**",
      "example-only/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
    },
  },

  {
    // ADR-0007, lint layer. The Orbitype key grants arbitrary SQL execution,
    // so nothing that can reach the client may import server secrets. The type
    // system and a build-output grep cover the other two layers.
    files: ["src/components/**", "src/layouts/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "astro:env/server",
              message:
                "Components must not read server secrets. Fetch in src/lib/orbitype/ and pass resolved props down.",
            },
          ],
          patterns: [
            {
              group: ["~/lib/orbitype/*", "**/lib/orbitype/*"],
              message:
                "Components must not import the data layer. Sections receive fully-resolved props (blueprint §7.3).",
            },
          ],
        },
      ],
    },
  },

  {
    // ADR-0008. Design tokens live in src/styles/global.css; a hardcoded
    // colour cannot be re-themed.
    files: ["src/components/**", "src/layouts/**", "src/pages/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}){1,2}$/]",
          message:
            "Hardcoded colour value. Use a theme token from src/styles/global.css.",
        },
      ],
    },
  },

  {
    // Setup and verification scripts run on Node, outside the bundle, and
    // talk to the operator through stdout.
    files: ["scripts/**/*.mjs", "*.config.{js,mjs,ts}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
    },
  },
]
