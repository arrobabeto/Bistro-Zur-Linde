import type { APIRoute } from "astro"

export const prerender = false

/**
 * Side-effect-free probe for cache middleware tests.
 * Always disables CDN cache and returns 204 with no-store headers.
 */
export const GET: APIRoute = async ({ cache }) => {
  if (cache.enabled) {
    cache.set(false)
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
    },
  })
}
