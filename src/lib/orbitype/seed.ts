import { ORBITYPE_API_KEYS_URL, hasSqlConfigured } from "./config"
import { buildSeedPages, buildSeedPosts } from "./seed-data.mjs"
import type { Page } from "~/types/page"
import type { Post } from "~/types/post"

/**
 * One definition of starter content serving mock mode, the unconfigured/empty
 * fallback, and `pnpm run cms:seed`. findSeedPage returns null for unknown
 * slugs so FR-07 holds in mock mode.
 */
export function seedPages(): Page[] {
  return buildSeedPages({
    hasSqlKeyConfigured: hasSqlConfigured(),
    apiKeysUrl: ORBITYPE_API_KEYS_URL,
  }) as Page[]
}

export function seedPosts(): Post[] {
  return buildSeedPosts() as Post[]
}

export function findSeedPage(slug: string): Page | null {
  return seedPages().find((page) => page.slug === slug) ?? null
}

export function findSeedPost(id: string): Post | null {
  return seedPosts().find((post) => post.id === id) ?? null
}
