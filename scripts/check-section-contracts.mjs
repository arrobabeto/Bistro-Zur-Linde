#!/usr/bin/env node
/**
 * Section size + composition checks.
 * Warning >100 lines (logged). Error >200 lines.
 * Error if Props only declare locale (page-monolith smell).
 */
import fs from "node:fs"
import path from "node:path"

const DIR = "src/components/sections"
const WARN_LINES = 100
const ERROR_LINES = 200

let failures = 0

for (const file of fs.readdirSync(DIR)) {
  if (!file.startsWith("Section") || !file.endsWith(".astro")) continue
  if (file === "SectionSpacer.astro") continue

  const full = path.join(DIR, file)
  const content = fs.readFileSync(full, "utf8")
  const lines = content.split("\n").length

  if (lines > ERROR_LINES) {
    console.error(`FAIL  ${file}: ${lines} lines (max ${ERROR_LINES})`)
    failures += 1
  } else if (lines > WARN_LINES) {
    console.warn(`WARN  ${file}: ${lines} lines (prefer ≤${WARN_LINES})`)
  }

  const propsMatch = content.match(/interface Props\s*\{([^}]*)\}/s)
  if (propsMatch) {
    const body = propsMatch[1]
    const props = [
      ...body.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*[?:]/gm),
    ].map((m) => m[1])
    const editorial = props.filter((p) => p !== "locale")
    if (props.includes("locale") && editorial.length === 0) {
      console.error(
        `FAIL  ${file}: Props only declare locale — section has no CMS fields`,
      )
      failures += 1
    }
  }
}

if (failures) process.exit(1)
console.log("ok    section contracts")
