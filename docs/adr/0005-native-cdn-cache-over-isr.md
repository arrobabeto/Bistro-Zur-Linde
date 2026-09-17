# ADR-0005: Native CDN cache over adapter ISR

**Status:** Accepted, with a **project exception** for HTML.

## Context

Server-mode Astro on Vercel can cache HTML via adapter ISR or via Astro 7's native `cache` + `routeRules` backed by `cacheVercel()`. Both avoid function invocations on CDN hits.

Adapter ISR has a disqualifying limitation: **search params are stripped** from ISR requests. Pagination (`/posts?page=2`) would always serve page 1.

This site also hashes CSS as `/_astro/Base.<hash>.css` (Vite + one Tailwind bundle). Cached HTML that names a **previous** hash, plus Vercel **404 + immutable** on the missing file, leaves visitors unstyled until a hard refresh. A CDN purge does **not** clear that 404 in the browser. Product expectation: a **normal refresh** must show the current deploy.

## Decision

The template default remains `cacheVercel()` + `routeRules` (not adapter ISR).

**This deployment** does **not** cache HTML:

- No `routeRules` cache TTLs in `astro.config.ts`
- `src/middleware.ts` sets `cache.set(false)` and `Cache-Control: no-store` on every Astro response (pages + `/api/**`)

Hashed `/_astro/*.css` **200** responses stay on the platform CDN (they do not go through Astro middleware). Apex `bistrozurlinde.ch` **308**s to `www` so there is one browser origin.

`/api/revalidate` remains for optional CMS tag invalidation; it is not the fix for unstyled pages.

## Consequences

- **Positive:** A normal refresh fetches HTML that points at the current CSS hash; client/PM do not need a hard refresh after deploy (once this build is live; already-open documents still need one reload).
- **Positive:** Successful hashed CSS can still be cached long-term.
- **Negative:** Every page view hits the serverless function and Orbitype (NFR-12 relaxed here).
- **Negative:** Sticky CSS **404s already stored as immutable in a browser** still need one refresh after HTML is no-store (new HTML → new CSS URL).
