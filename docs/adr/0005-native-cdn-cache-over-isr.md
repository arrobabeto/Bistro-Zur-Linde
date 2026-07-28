# ADR-0005: Native CDN cache over adapter ISR

**Status:** Accepted

## Context

Server-mode Astro on Vercel can cache HTML via adapter ISR or via Astro 7's native `cache` + `routeRules` backed by `cacheVercel()`. Both avoid function invocations on CDN hits.

Adapter ISR has a disqualifying limitation: **search params are stripped** from ISR requests. Pagination (`/posts?page=2`) would always serve page 1. ISR also uses one global expiration, excludes routes via internal pattern strings, and offers no tag-based invalidation.

## Decision

Use **`cache: { provider: cacheVercel() }`** and per-route **`routeRules`** with explicit `maxAge`, `swr`, and `tags`. Every rule sets `maxAge` — rules with only `swr` emit no cache headers at all.

`src/middleware.ts` disables caching for `/api/**` at runtime because the `/[...slug]` catch-all rule matches API paths and there is no declarative opt-out.

## Consequences

- **Positive:** Query strings preserved; per-route TTLs; tag invalidation via `/api/revalidate`.
- **Positive:** Aligns with CMS workflows that purge by tag or path.
- **Negative:** Native CDN cache is regional; miss traffic hits SQL more often than ISR's durable store.
- **Negative:** Cache headers appear at runtime, not in build output — caching tests need preview or deploy.
