#!/usr/bin/env node
/**
 * Orbitype SQL helper (read). Uses ORBITYPE_API_SQL_KEY (or
 * ORBITYPE_SQL_API_KEY) from process.env or .env. Never prints the key.
 *
 * Usage:
 *   node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs context
 *   node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs query 'SELECT ...' [--bind k=v ...]
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
)

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env")
  if (!fs.existsSync(envPath)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const i = line.indexOf("=")
        if (i === -1) return null
        return [
          line.slice(0, i).trim(),
          line
            .slice(i + 1)
            .trim()
            .replace(/^["']|["']$/g, ""),
        ]
      })
      .filter(Boolean),
  )
}

const fileEnv = loadEnvFile()
const key =
  process.env.ORBITYPE_API_SQL_KEY ||
  process.env.ORBITYPE_SQL_API_KEY ||
  fileEnv.ORBITYPE_API_SQL_KEY ||
  fileEnv.ORBITYPE_SQL_API_KEY
const endpoint =
  process.env.ORBITYPE_API_SQL_URL ||
  fileEnv.ORBITYPE_API_SQL_URL ||
  "https://core.orbitype.com/api/sql/v1"

if (!key) {
  console.error("Missing ORBITYPE_API_SQL_KEY (shell or .env)")
  process.exit(1)
}

function parseBindings(argv) {
  const bindings = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--bind" && argv[i + 1]) {
      const raw = argv[++i]
      const eq = raw.indexOf("=")
      if (eq === -1) continue
      const k = raw.slice(0, eq)
      let v = raw.slice(eq + 1)
      try {
        v = JSON.parse(v)
      } catch {
        // keep string
      }
      bindings[k] = v
    }
  }
  return bindings
}

async function sql(statement, bindings = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": key,
    },
    body: JSON.stringify({ sql: statement, bindings }),
  })
  const text = await response.text()
  if (!response.ok) {
    console.error(`HTTP ${response.status}`)
    console.error(text)
    process.exit(1)
  }
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const [cmd, ...rest] = process.argv.slice(2)

switch (cmd) {
  case "context": {
    const response = await fetch("https://core.orbitype.com/api", {
      method: "OPTIONS",
      headers: { "X-API-KEY": key },
    })
    const text = await response.text()
    console.log(`HTTP ${response.status}`)
    console.log(text)
    if (!response.ok) process.exit(1)
    break
  }
  case "query":
  case "mutate": {
    const statement = rest[0]
    if (!statement) {
      console.error(`Usage: orbitype-sql.mjs ${cmd} 'SQL' [--bind k=v ...]`)
      process.exit(1)
    }
    if (cmd === "mutate" && !/\bRETURNING\b/i.test(statement)) {
      console.error("Mutations must include RETURNING — aborting.")
      process.exit(1)
    }
    if (
      cmd === "mutate" &&
      !/\b(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(statement)
    ) {
      console.error("mutate expects a write/DDL statement.")
      process.exit(1)
    }
    const bindings = parseBindings(rest.slice(1))
    const result = await sql(statement, bindings)
    console.log(
      typeof result === "string" ? result : JSON.stringify(result, null, 2),
    )
    break
  }
  default:
    console.error(`Unknown command: ${cmd || "(none)"}`)
    console.error("Commands: context | query | mutate")
    process.exit(1)
}
