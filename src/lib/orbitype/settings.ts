import type { Settings } from "~/types/contact"
import { orbitypeSql } from "./client"
import { hasSqlConfigured, isMockMode } from "./config"

export async function getSettings(id: string): Promise<Settings | null> {
  if (isMockMode() || !hasSqlConfigured()) return null

  try {
    const rows = await orbitypeSql<Settings>(
      "SELECT * FROM settings WHERE id = :id LIMIT 1",
      { id },
    )
    return rows[0] ?? null
  } catch (error) {
    console.error("[orbitype] getSettings failed:", error)
    return null
  }
}

export async function getSettingsByName(
  name: string,
): Promise<Settings | null> {
  if (isMockMode() || !hasSqlConfigured()) return null

  try {
    const rows = await orbitypeSql<Settings>(
      "SELECT * FROM settings WHERE name = :name LIMIT 1",
      { name },
    )
    return rows[0] ?? null
  } catch (error) {
    console.error("[orbitype] getSettingsByName failed:", error)
    return null
  }
}
