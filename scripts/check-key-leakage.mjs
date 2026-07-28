/**
 * Fails if configured secret values appear in build artefacts, tracked
 * sources, sourcemaps, or Playwright reports. Reports variable name + file
 * only — never the secret value.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { loadEnvFile, env } from "./lib/env.mjs"

loadEnvFile()

const SECRET_NAMES = [
  "ORBITYPE_API_SQL_KEY",
  "ORBITYPE_SQL_API_KEY",
  "ORBITYPE_S3_PUBLIC_API_KEY",
  "ORBITYPE_S3_PRIVATE_API_KEY",
  "FIGMA_API_KEY",
  "REVALIDATE_SECRET",
  "MAIL_API_KEY",
]

const PREFIX_PATTERNS = [
  { name: "FIGMA_API_KEY_PREFIX", regex: /figd_[A-Za-z0-9]{10,}/g },
]

const SKIP_EXT = /\.(png|jpg|jpeg|gif|webp|avif|woff2?|ico|mp4|webm|pdf)$/i
const SCAN_DIRS = [
  "dist",
  ".vercel/output",
  "playwright-report",
  "test-results",
]

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue
      walk(full, files)
    } else {
      files.push(full)
    }
  }
  return files
}

function trackedFiles() {
  try {
    const out = execSync("git ls-files", { encoding: "utf8" })
    return out
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((f) => !SKIP_EXT.test(f))
  } catch {
    return []
  }
}

function collectSecrets() {
  const secrets = []
  for (const name of SECRET_NAMES) {
    const value = env(name)
    if (!value || value.length < 8) continue
    if (
      ["your-api-key", "changeme", "your-connector-key"].includes(
        value.toLowerCase(),
      )
    ) {
      continue
    }
    secrets.push({ name, value })
  }
  return secrets
}

const secrets = collectSecrets()
const files = new Set([...SCAN_DIRS.flatMap((d) => walk(d)), ...trackedFiles()])

let hits = 0

for (const file of files) {
  if (SKIP_EXT.test(file)) continue
  // Never scan .env itself or this script's own source patterns in plans
  if (file === ".env" || file.endsWith("/.env")) continue
  if (file.includes("check-key-leakage.mjs")) continue

  let content
  try {
    content = fs.readFileSync(file, "utf8")
  } catch {
    continue
  }

  for (const { name, value } of secrets) {
    if (content.includes(value)) {
      console.error(`FAIL  ${name} value found in ${file}`)
      hits += 1
    }
  }

  // Prefix detectors only on build/report artefacts — not on docs/examples.
  const isArtefact =
    file.startsWith("dist/") ||
    file.startsWith(".vercel/") ||
    file.startsWith("playwright-report/") ||
    file.startsWith("test-results/")

  if (isArtefact) {
    for (const { name, regex } of PREFIX_PATTERNS) {
      regex.lastIndex = 0
      const matches = content.match(regex) ?? []
      const real = matches.filter((m) => m !== "figd_..." && m.length > 12)
      if (real.length > 0) {
        console.error(`FAIL  ${name} pattern found in ${file}`)
        hits += 1
      }
    }
  }
}

if (secrets.length === 0) {
  console.log("ok    no real secrets configured — scanned prefix patterns only")
}

if (hits > 0) {
  console.error(`\n${hits} leakage hit(s).`)
  process.exit(1)
}

console.log("ok    no secret leakage in scanned artefacts")
