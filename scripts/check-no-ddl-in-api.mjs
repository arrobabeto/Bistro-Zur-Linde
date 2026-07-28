#!/usr/bin/env node
/**
 * Zero CREATE/ALTER/CREATE OR REPLACE under src/pages/api.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = "src/pages/api"
const FORBIDDEN = /\b(CREATE\s+TABLE|ALTER\s+TABLE|CREATE\s+OR\s+REPLACE)\b/i

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(ts|js|mjs)$/.test(entry.name)) files.push(full)
  }
  return files
}

let failures = 0
for (const file of walk(ROOT)) {
  const content = fs.readFileSync(file, "utf8")
  if (FORBIDDEN.test(content)) {
    console.error(`FAIL  DDL pattern in ${file}`)
    failures += 1
  }
}

if (failures) process.exit(1)
console.log("ok    no DDL in src/pages/api")
