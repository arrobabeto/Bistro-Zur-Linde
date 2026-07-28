import type { APIRoute } from "astro"
import { listPageSlugs } from "~/lib/orbitype/pages"
import { listPublishedPostIds } from "~/lib/orbitype/posts"
import { DEFAULT_LOCALE } from "~/config/locales"
import { localePath, translate } from "~/lib/i18n"
import { siteDescription, siteName, siteUrl } from "~/lib/site"

export const prerender = false

export const GET: APIRoute = async () => {
  const base = siteUrl()
  const pages = await listPageSlugs()
  const posts = await listPublishedPostIds()

  const pageLinks = pages
    .map((p) => {
      const path = localePath(DEFAULT_LOCALE, p.slug)
      return `- [${p.slug}](${base}${path === "/" ? "/" : path})`
    })
    .join("\n")

  const postLinks = posts
    .map((p) => {
      const slug = translate(p.title, DEFAULT_LOCALE)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      return `- [${translate(p.title, DEFAULT_LOCALE)}](${base}/posts/${p.id}/${slug})`
    })
    .join("\n")

  const body = `# ${siteName()}

> ${siteDescription()}

## Pages

${pageLinks || "- (none)"}

## Posts

${postLinks || "- (none)"}

## Optional

- [Full content](${base}/llms-full.txt)
- [Sitemap](${base}/sitemap.xml)
`

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}
