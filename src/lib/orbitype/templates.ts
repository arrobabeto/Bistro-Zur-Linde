import type { Template } from "~/types/contact"
import type { Section } from "~/types/section"
import { normalizeSections } from "~/lib/normalize-sections"
import { orbitypeSql } from "./client"
import { hasSqlConfigured, isMockMode } from "./config"

export type ResolvedTemplate = {
  name: string
  sections_before: Section[]
  sections_after: Section[]
}

export async function getTemplate(
  name: string | null | undefined,
): Promise<ResolvedTemplate | null> {
  if (!name || isMockMode() || !hasSqlConfigured()) return null

  try {
    const rows = await orbitypeSql<Template>(
      "SELECT * FROM templates WHERE name = :name LIMIT 1",
      { name },
    )
    const row = rows[0]
    if (!row) return null
    return {
      name: row.name,
      sections_before: normalizeSections(row.sections_before),
      sections_after: normalizeSections(row.sections_after),
    }
  } catch (error) {
    console.error("[orbitype] getTemplate failed:", error)
    return null
  }
}
