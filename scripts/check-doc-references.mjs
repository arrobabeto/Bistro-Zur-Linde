#!/usr/bin/env node
/**
 * Ensure paths referenced in docs/README/ADRs exist on disk.
 */
import fs from "node:fs"
import path from "node:path"

const DOC_GLOBS = [
  "README.md",
  "docs/01-orbitype-cms.md",
  "docs/02-sections-cookbook.md",
  "docs/03-deployment.md",
  "docs/DEVIATIONS.md",
  "docs/adr",
  "docs/vercel-linking.md",
  "AGENTS.md",
]

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  const stat = fs.statSync(dir)
  if (stat.isFile()) {
    files.push(dir)
    return files
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(md|mdc)$/i.test(entry.name)) files.push(full)
  }
  return files
}

const files = DOC_GLOBS.flatMap((p) => walk(p))
const pathRe =
  /(?:`|\]\()((?:src|scripts|docs|\.cursor|\.agents|\.github)\/[A-Za-z0-9_./[\]-]+\.[A-Za-z0-9]+)/g

let failures = 0
const seen = new Set()

for (const file of files) {
  const content = fs.readFileSync(file, "utf8")
  let match
  while ((match = pathRe.exec(content))) {
    const ref = match[1]
    if (seen.has(ref)) continue
    seen.add(ref)
    // Skip glob-like and template examples
    if (ref.includes("*") || ref.includes("SectionName")) continue
    if (!fs.existsSync(ref)) {
      console.error(`FAIL  missing ${ref} (referenced from ${file})`)
      failures += 1
    }
  }
}

if (failures) process.exit(1)
console.log(`ok    doc path references (${seen.size} checked)`)
