import { defineMiddleware } from "astro:middleware"

/**
 * Cache + robots + baseline security headers.
 *
 * HTML and `/api/**` are no-store so a normal browser refresh after deploy
 * fetches HTML that points at the current hashed `/_astro/*.css`. Platform
 * static files (successful `/_astro` 200s) do not pass through this file.
 *
 * Response.redirect() exposes immutable headers; mutate a copied Headers
 * map and return a new Response so form POST 303s do not throw TypeError.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.cache.enabled) {
    context.cache.set(false)
  }

  const pathname = context.url.pathname
  const isApi = pathname.startsWith("/api/")

  const upstream = await next()
  const headers = new Headers(upstream.headers)

  headers.set("Cache-Control", "no-store")
  headers.set("CDN-Cache-Control", "no-store")
  headers.set("Vercel-CDN-Cache-Control", "no-store")

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
