# ADR-0007: Server-only secrets

**Status:** Accepted

## Context

`ORBITYPE_API_SQL_KEY` grants arbitrary SQL execution against the connector. A leaked key in client bundles or static HTML is a full database compromise. Astro's `astro:env` schema distinguishes server secrets from public client vars, but schema alone does not stop accidental imports in components.

## Decision

Enforce secrets stay server-side through **three layers**:

1. **Lint** — `eslint.config.js` forbids `astro:env/server` and `~/lib/orbitype/*` imports in `src/components/**` and `src/layouts/**`.
2. **Env schema** — secrets use `context: "server", access: "secret"` in `astro.config.ts`; public vars use `context: "client", access: "public"`.
3. **Build grep** — `scripts/check-key-leakage.mjs` scans `dist/` and `.vercel/output/static/` for the configured key value; wired into `pnpm run verify`.

Data fetching lives in `src/lib/orbitype/` and API routes only.

## Consequences

- **Positive:** Defense in depth; mis-imports fail CI before deploy.
- **Positive:** Clear boundary — sections receive resolved props, never raw credentials.
- **Negative:** `astro.config.ts` must read `process.env` directly because `astro:env` is unavailable there.
- **Negative:** Leakage scan skips when no real key is configured — production builds with keys must run the check.
