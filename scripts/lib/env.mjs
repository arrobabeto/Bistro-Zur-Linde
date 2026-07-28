import fs from "node:fs"
import path from "node:path"

/**
 * Load KEY=VALUE pairs from a .env file into process.env when the key is
 * not already set. Does not override shell environment.
 */
export function loadEnvFile(filePath = ".env") {
  const resolved = path.resolve(filePath)
  if (!fs.existsSync(resolved)) return

  const text = fs.readFileSync(resolved, "utf8")
  for (const line of text.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

export function env(name, fallback = "") {
  return (process.env[name] ?? fallback).trim()
}

export function requireEnv(name) {
  const value = env(name)
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}
