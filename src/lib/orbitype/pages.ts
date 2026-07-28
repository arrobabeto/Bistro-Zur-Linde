import type { Page } from "~/types/page"
import { normalizeSections } from "~/lib/normalize-sections"
import { OrbitypeError, orbitypeSql } from "./client"
import { hasSqlConfigured, isMockMode } from "./config"
import { findSeedPage, seedPages } from "./seed"

function normalizePage(page: Page): Page {
  return { ...page, sections: normalizeSections(page.sections) }
}

function isPublished(page: Page): boolean {
  const status = page.status
  if (!status) return true
  if (typeof status === "string") return status === "published"
  return (status.value ?? "published") === "published"
}

export async function getPage(slug: string): Promise<Page | null> {
  if (isMockMode() || !hasSqlConfigured()) {
    const seeded = findSeedPage(slug)
    return seeded ? normalizePage(seeded) : null
  }

  try {
    const rows = await orbitypeSql<Page>(
      `SELECT * FROM pages
       WHERE slug = :slug
       ORDER BY updated_at DESC NULLS LAST, id ASC
       LIMIT 1`,
      { slug },
    )
    const row = rows[0]
    if (row) {
      const page = normalizePage(row)
      if (!isPublished(page)) return null
      return page
    }
    const seeded = findSeedPage(slug)
    return seeded ? normalizePage(seeded) : null
  } catch (error) {
    if (error instanceof OrbitypeError && error.isUnavailable) {
      throw error
    }
    console.error("[orbitype] getPage failed:", error)
    throw error instanceof OrbitypeError
      ? error
      : new OrbitypeError("getPage failed", undefined, undefined, "network")
  }
}

export async function listPageSlugs(): Promise<
  Array<Pick<Page, "slug" | "updated_at">>
> {
  if (isMockMode() || !hasSqlConfigured()) {
    return seedPages().map(({ slug, updated_at }) => ({ slug, updated_at }))
  }

  try {
    return await orbitypeSql(
      `SELECT slug, updated_at FROM pages
       WHERE COALESCE(status->>'value', 'published') = 'published'
       ORDER BY updated_at DESC`,
    )
  } catch (error) {
    if (error instanceof OrbitypeError && error.isUnavailable) {
      throw error
    }
    console.error("[orbitype] listPageSlugs failed:", error)
    throw error instanceof Error
      ? error
      : new OrbitypeError("listPageSlugs failed", undefined, undefined, "sql")
  }
}
