import {
  ORBITYPE_API_SQL_KEY,
  ORBITYPE_API_SQL_URL,
  ORBITYPE_MOCK,
} from "astro:env/server"

const PLACEHOLDER_KEYS = new Set(["", "your-api-key", "changeme"])

export function isMockMode(): boolean {
  return ORBITYPE_MOCK === true
}

export function hasSqlConfigured(): boolean {
  if (!ORBITYPE_API_SQL_URL) return false
  const key = (ORBITYPE_API_SQL_KEY ?? "").trim()
  return !PLACEHOLDER_KEYS.has(key.toLowerCase())
}

export function sqlEndpoint(): string {
  return ORBITYPE_API_SQL_URL ?? "https://core.orbitype.com/api/sql/v1"
}

export function sqlKey(): string {
  return ORBITYPE_API_SQL_KEY ?? ""
}

export const ORBITYPE_API_KEYS_URL =
  "https://app.orbitype.com/settings/api-keys"
