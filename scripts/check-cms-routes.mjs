#!/usr/bin/env node
/**
 * Editorial CMS pages must use [...slug].astro. Physical marketing routes
 * need an explicit bypass annotation.
 */
import fs from "node:fs"
import path from "node:path"

const PAGES = "src/pages"
const ALLOWED = new Set([
  "[...slug].astro",
  "404.astro",
  "posts/index.astro",
  "posts/[id]/[...slug].astro",
])

const ALLOWED_PREFIXES = ["api/", "robots.txt.ts", "sitemap.xml.ts", "llms"]

function walk(dir, base = "") {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name)
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, rel))
    else if (/\.(astro|ts|js)$/.test(entry.name)) out.push(rel)
  }
  return out
}

const files = walk(PAGES)
let failures = 0

for (const file of files) {
  if (ALLOWED.has(file)) continue
  if (ALLOWED_PREFIXES.some((p) => file.startsWith(p) || file === p)) continue

  if (!file.endsWith(".astro")) continue

  const content = fs.readFileSync(path.join(PAGES, file), "utf8")
  if (/cms-bypass-approved:/.test(content)) {
    console.log(`ok    bypass ${file}`)
    continue
  }

  console.error(
    `FAIL  ${file} — physical page without // cms-bypass-approved: … annotation`,
  )
  failures += 1
}

if (failures) {
  process.exit(1)
}
console.log("ok    CMS route boundaries hold")
