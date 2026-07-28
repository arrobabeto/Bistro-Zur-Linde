# ADR-0006: Explicit locale propagation

**Status:** Accepted

## Context

Orbitype stores translatable fields as JSON objects (`{ "en": "...", "de": "..." }`). Astro's built-in i18n expects folder-based locale routes (`src/pages/de/...`), which conflicts with a single CMS catch-all route (`src/pages/[...slug].astro`).

The template ships one locale (`en`) with no URL prefix today, but must support adding locales without restructuring the page tree.

## Decision

**Do not rely on Astro i18n middleware for slug routing.** Locale and slug are derived in `parseRoute()` from the catch-all param. Astro's `i18n` config remains for `Astro.currentLocale` compatibility and future manual routing.

Every section and layout component receives an explicit **`locale` prop**. All user-visible strings pass through **`translate(value, locale)`**, which resolves: requested locale → `en` → empty string.

`I18nString` requires `en`; other locales are optional keys on the same object.

## Consequences

- **Positive:** CMS-driven catch-all routing works with zero or many locales.
- **Positive:** Resolution order is total and predictable — no `"..."` placeholders.
- **Negative:** Each new component must accept and thread `locale`; ESLint cannot enforce every string path.
- **Negative:** Multi-locale URL prefixes require configuring `LOCALES` and manual path helpers, not Astro folder conventions.
