import type { APIRoute } from "astro"
import { siteUrl } from "~/lib/site"

export const prerender = false

export const GET: APIRoute = async () => {
  const base = siteUrl()
  const body = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
LLMs: ${base}/llms.txt
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}
