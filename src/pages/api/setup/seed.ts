import type { APIRoute } from "astro"
import { orbitypeSql } from "~/lib/orbitype/client"
import { ORBITYPE_API_KEYS_URL, hasSqlConfigured } from "~/lib/orbitype/config"
import { seedPages, seedPosts } from "~/lib/orbitype/seed"

export const prerender = false

export const POST: APIRoute = async () => {
  if (!hasSqlConfigured()) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: `Orbitype SQL API is not configured. See ${ORBITYPE_API_KEYS_URL}`,
        results: [],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  const results: Array<{
    kind: string
    slug?: string
    id?: string
    status: "inserted" | "skipped" | "error"
    error?: string
  }> = []

  for (const page of seedPages()) {
    try {
      const existing = await orbitypeSql<{ slug: string }>(
        "SELECT slug FROM pages WHERE slug = :slug LIMIT 1",
        { slug: page.slug },
      )
      if (existing[0]) {
        results.push({
          kind: "page",
          slug: page.slug,
          status: "skipped",
        })
        continue
      }

      await orbitypeSql(
        `INSERT INTO pages (title, slug, lead, img, sections, keywords, head)
         VALUES (
           :title::json,
           :slug,
           :lead::json,
           :img,
           :sections::json,
           :keywords::json,
           :head::json
         )
         RETURNING id, slug`,
        {
          title: JSON.stringify(page.title),
          slug: page.slug,
          lead: JSON.stringify(page.lead ?? { en: "" }),
          img: page.img ?? "",
          sections: JSON.stringify(page.sections),
          keywords: JSON.stringify(page.keywords ?? []),
          head: JSON.stringify(page.head ?? {}),
        },
      )
      results.push({ kind: "page", slug: page.slug, status: "inserted" })
    } catch (error) {
      results.push({
        kind: "page",
        slug: page.slug,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const post of seedPosts()) {
    try {
      const titleEn = post.title.en
      const existing = await orbitypeSql<{ id: string }>(
        `SELECT id FROM posts WHERE title->>'en' = :title LIMIT 1`,
        { title: titleEn },
      )
      if (existing[0]) {
        results.push({ kind: "post", id: existing[0].id, status: "skipped" })
        continue
      }

      const inserted = await orbitypeSql<{ id: string }>(
        `INSERT INTO posts (title, lead, img, status, sections, keywords)
         VALUES (
           :title::json,
           :lead::json,
           :img,
           :status::json,
           :sections::json,
           :keywords::json
         )
         RETURNING id`,
        {
          title: JSON.stringify(post.title),
          lead: JSON.stringify(post.lead ?? { en: "" }),
          img: post.img ?? "",
          status: JSON.stringify(
            post.status ?? {
              options: ["draft", "review", "published"],
              value: "published",
            },
          ),
          sections: JSON.stringify(post.sections),
          keywords: JSON.stringify(post.keywords ?? []),
        },
      )
      results.push({
        kind: "post",
        id: inserted[0]?.id ?? post.id,
        status: "inserted",
      })
    } catch (error) {
      results.push({
        kind: "post",
        id: post.id,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const ok = results.every((r) => r.status !== "error")
  return new Response(
    JSON.stringify({
      ok,
      message: ok
        ? "Starter content seeded (existing rows skipped)."
        : "Seed finished with errors.",
      results,
    }),
    {
      status: ok ? 200 : 207,
      headers: { "Content-Type": "application/json" },
    },
  )
}
