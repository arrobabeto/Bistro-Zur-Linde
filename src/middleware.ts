import { defineMiddleware } from "astro:middleware"

/**
 * Mandatory cache guard.
 *
 * The `/[...slug]` route rule in astro.config.ts also matches `/api/**`, and
 * there is no declarative opt-out: a rule object with no cache fields is
 * dropped from the compiled set rather than shadowing the catch-all. The only
 * reliable way to keep API responses out of the CDN is to disable caching at
 * runtime. Removing this file silently makes every API response cacheable.
 *
 * See docs/DEVIATIONS.md D-07 and NFR-13.
 */
export const onRequest = defineMiddleware((context, next) => {
  // `cache.enabled` is false in dev and in static mode; guarding avoids a
  // spurious warning when no cache provider is active.
  if (context.cache.enabled && context.url.pathname.startsWith("/api/")) {
    context.cache.set(false)
  }

  return next()
})
