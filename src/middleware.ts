import { defineMiddleware } from "astro:middleware"

/**
 * Mandatory cache + robots + baseline security headers.
 *
 * The `/[...slug]` route rule in astro.config.ts also matches `/api/**`.
 * Removing this file silently makes every API response cacheable.
 * 404s must also be no-store: hashed `/_astro` misses are otherwise cached
 * as immutable for a year by the CDN and leave visitors on an unstyled site.
 *
 * Response.redirect() exposes immutable headers; mutate a copied Headers
 * map and return a new Response so form POST 303s do not throw TypeError.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname
  const isApi = pathname.startsWith("/api/")

  if (context.cache.enabled && isApi) {
    context.cache.set(false)
  }

  const upstream = await next()
  const headers = new Headers(upstream.headers)

  if (isApi || upstream.status === 404) {
    headers.set("Cache-Control", "no-store")
    headers.set("CDN-Cache-Control", "no-store")
    headers.set("Vercel-CDN-Cache-Control", "no-store")
  }

  const vercelEnv = process.env["VERCEL_ENV"]
  const forceNoindex = process.env["NOINDEX"] === "true"
  const isProduction = vercelEnv === "production"
  const shouldNoindex =
    forceNoindex || isApi || (vercelEnv !== undefined && !isProduction)

  if (shouldNoindex) {
    headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  if (isProduction) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    )
  }

  if (!headers.has("Content-Security-Policy")) {
    headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline' https://www.opentable.de https://*.opentable.com https://*.otstatic.com",
        "connect-src 'self' https:",
        "frame-src 'self' https://www.google.com https://maps.google.com https://www.opentable.de https://*.opentable.com https://*.otstatic.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    )
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
})
