import type { Settings } from "~/types/contact"
import { OrbitypeError, orbitypeSql } from "./client"
import { hasSqlConfigured, isMockMode } from "./config"

export async function getSettings(id: string): Promise<Settings | null> {
  if (isMockMode() || !hasSqlConfigured()) return null

  try {
    const rows = await orbitypeSql<Settings>(
      "SELECT * FROM settings WHERE id = :id ORDER BY id ASC LIMIT 1",
      { id },
    )
    return rows[0] ?? null
  } catch (error) {
    if (error instanceof OrbitypeError && error.isUnavailable) throw error
    console.error("[orbitype] getSettings failed:", error)
    throw error instanceof Error
      ? error
      : new OrbitypeError("getSettings failed", undefined, undefined, "sql")
  }
}

export async function getSettingsByName(
  name: string,
): Promise<Settings | null> {
  if (isMockMode() || !hasSqlConfigured()) return null

  try {
    const rows = await orbitypeSql<Settings>(
      "SELECT * FROM settings WHERE name = :name ORDER BY id ASC LIMIT 1",
      { name },
    )
    return rows[0] ?? null
  } catch (error) {
    if (error instanceof OrbitypeError && error.isUnavailable) throw error
    console.error("[orbitype] getSettingsByName failed:", error)
    throw error instanceof Error
      ? error
      : new OrbitypeError(
          "getSettingsByName failed",
          undefined,
          undefined,
          "sql",
        )
  }
}
