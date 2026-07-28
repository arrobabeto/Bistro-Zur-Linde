# ADR-0012: Seed as single source of starter content

**Status:** Accepted

## Context

Development and onboarding need realistic page content before a live Orbitype connector is configured. Earlier approaches duplicated mock page shapes in multiple places or returned a welcome page for every unknown slug — breaking 404 behaviour in mock mode.

The welcome screen, mock fetches, empty-database fallback, and `pnpm run cms:seed` should all reflect the same starter content.

## Decision

**`src/lib/orbitype/seed-data.mjs`** holds the starter page/post payloads. **`src/lib/orbitype/seed.ts`** wraps them for the Astro runtime (`seedPages` / `seedPosts` / `findSeedPage`). The CLI seeder imports the same `.mjs` builders.

`getPage()` uses seeds in mock mode and as a fallback when SQL is unconfigured or empty, but propagates `null` so unknown slugs reach `Astro.rewrite("/404")`.

## Consequences

- **Positive:** One edit updates mock mode, fallback UX, and database seeding.
- **Positive:** FR-07 (unknown slug → 404) holds in mock mode.
- **Negative:** Seed content must stay aligned with section components and schema defaults.
- **Neutral:** Seeding is explicit via CLI — it does not auto-run on deploy and is never a public HTTP endpoint.
