#!/usr/bin/env node
/**
 * Fail on placeholder / unapproved content patterns in src and public copy.
 */
import fs from "node:fs"
import path from "node:path"

const ROOTS = ["src", "public"]
const PATTERNS = [
  { name: "TODO", re: /\bTODO\b/ },
  { name: "TBD", re: /\bTBD\b/ },
  { name: "PENDIENTE", re: /PENDIENTE/i },
  { name: "Lorem", re: /\bLorem ipsum\b/i },
  { name: "example.com", re: /\bexample\.com\b/i },
  { name: "href=#", re: /href=["']#["']/ },
  { name: "_WP", re: /_WP\b/ },
]

const ALLOW_FILES = new Set(["scripts/check-content-placeholders.mjs"])

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue
      walk(full, files)
    } else if (/\.(astro|ts|tsx|js|mjs|md|html|txt|svg)$/i.test(entry.name)) {
      files.push(full)
    }
  }
  return files
}

let failures = 0
for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (ALLOW_FILES.has(file)) continue
    // Allow the check script and seed template dots
    if (file.includes("check-content-placeholders")) continue
    const content = fs.readFileSync(file, "utf8")
    if (/content-placeholder-ok:/.test(content)) continue

    for (const { name, re } of PATTERNS) {
      if (re.test(content)) {
        // schema defaults use "..." which is fine; skip schema-sql dots
        if (name === "TBD" && file.includes("schema")) continue
        console.error(`FAIL  ${name} in ${file}`)
        failures += 1
      }
    }
  }
}

if (failures) process.exit(1)
console.log("ok    no content placeholders")
