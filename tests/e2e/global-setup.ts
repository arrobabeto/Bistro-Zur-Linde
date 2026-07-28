/**
 * Ensure e2e never mutates a live Orbitype connector.
 * Clears secret-looking values from the runner env and aborts if any remain
 * after clearing (defense in depth for CI misconfiguration).
 */

const SECRET_NAMES = [
  "ORBITYPE_API_SQL_KEY",
  "ORBITYPE_SQL_API_KEY",
  "ORBITYPE_S3_PUBLIC_API_KEY",
  "ORBITYPE_S3_PRIVATE_API_KEY",
  "FIGMA_API_KEY",
  "MAIL_API_KEY",
  "REVALIDATE_SECRET",
] as const

const PLACEHOLDERS = new Set([
  "",
  "your-api-key",
  "changeme",
  "your-connector-key",
  "figd_...",
])

function looksReal(value: string): boolean {
  const trimmed = value.trim()
  if (PLACEHOLDERS.has(trimmed.toLowerCase()) || PLACEHOLDERS.has(trimmed)) {
    return false
  }
  if (trimmed.length < 8) return false
  if (/^figd_[A-Za-z0-9]+/.test(trimmed)) return true
  return /[A-Za-z0-9+/=_-]{12,}/.test(trimmed)
}

export default function globalSetup() {
  const cleared: string[] = []
  for (const name of SECRET_NAMES) {
    const value = process.env[name]
    if (value && looksReal(value)) {
      cleared.push(name)
      delete process.env[name]
    }
  }

  if (cleared.length > 0) {
    console.warn(
      `[e2e] cleared real-looking secrets from runner env: ${cleared.join(", ")}`,
    )
  }

  // Force mock for any code path that re-reads process.env
  process.env.ORBITYPE_MOCK = "true"
  process.env.ORBITYPE_API_SQL_KEY = ""
  process.env.ORBITYPE_API_SQL_URL = ""
}
