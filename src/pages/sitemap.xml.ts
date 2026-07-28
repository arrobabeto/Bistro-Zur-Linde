import type { APIRoute } from "astro"
import { listPageSlugs } from "~/lib/orbitype/pages"
import { listPublishedPostIds } from "~/lib/orbitype/posts"
import { LOCALES, DEFAULT_LOCALE } from "~/config/locales"
import type { Locale } from "~/config/locales"
import { localePath } from "~/lib/i18n"
import { postPath, postTitleSlug } from "~/lib/post-slug"
import { siteUrl } from "~/lib/site"

export const prerender = false

export const GET: APIRoute = async () => {
  const base = siteUrl()
  const pages = await listPageSlugs()
  const posts = await listPublishedPostIds()

  const urls: string[] = []

  for (const page of pages) {
    for (const locale of LOCALES) {
      const path = localePath(locale as Locale, page.slug)
      const loc = `${base}${path === "/" ? "/" : path}`
      const lastmod = page.updated_at
        ? `<lastmod>${new Date(page.updated_at).toISOString()}</lastmod>`
        : ""
      const alternates = LOCALES.map(
        (alt) =>
          `<xhtml:link rel="alternate" hreflang="${alt}" href="${base}${localePath(alt as Locale, page.slug)}" />`,
      ).join("")
      const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${base}${localePath(DEFAULT_LOCALE, page.slug)}" />`
      urls.push(
        `<url><loc>${escapeXml(loc)}</loc>${lastmod}${alternates}${xDefault}</url>`,
      )
    }
  }

  for (const post of posts) {
    const slug = postTitleSlug(post.title)
    const loc = `${base}${postPath(post.id, slug)}`
    const lastmod = post.updated_at
      ? `<lastmod>${new Date(post.updated_at).toISOString()}</lastmod>`
      : ""
    urls.push(`<url><loc>${escapeXml(loc)}</loc>${lastmod}</url>`)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  })
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
