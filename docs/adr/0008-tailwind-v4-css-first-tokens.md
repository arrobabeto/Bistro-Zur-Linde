# ADR-0008: Tailwind v4 CSS-first tokens

**Status:** Accepted

## Context

Tailwind 4 integrates via `@tailwindcss/vite` and `@import "tailwindcss"`. Design tokens live in CSS `@theme` blocks, not in `tailwind.config.js`. `@astrojs/tailwind` does not support Astro 7.

Tailwind 4 processes `<style>` blocks inside `.astro` files as **separate stylesheets**. Theme variables and utilities from `global.css` are invisible there unless a `@reference` import is added. `@apply` in component styles fails with "Cannot apply unknown utility class."

## Decision

Define all design tokens in **`src/styles/global.css`** inside `@theme { ... }`. Shared utility compositions (e.g. `.container-prose`) live in `@layer components` in that same file.

**Forbid `@apply` inside `.astro` `<style>` blocks.** Components use Tailwind utility classes in markup or shared classes from `global.css`.

ESLint flags hardcoded hex colours in components, layouts, and pages (OG image routes exempt).

## Consequences

- **Positive:** One retheme point per project; no JS config drift.
- **Positive:** Avoids Tailwind 4 Astro style-block footgun entirely.
- **Negative:** Component-scoped styles cannot compose utilities via `@apply` without moving rules to `global.css`.
- **Neutral:** `darkMode` config key is gone; use `@custom-variant dark` if needed.
