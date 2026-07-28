#!/usr/bin/env node
/**
 * Validate seed/mock (and optionally live) CMS coverage against content-manifest.json.
 * Default: mock/seed only — safe for CI without secrets.
 */
import fs from "node:fs"
import { buildSeedPages } from "../src/lib/orbitype/seed-data.mjs"

const manifest = JSON.parse(fs.readFileSync("content-manifest.json", "utf8"))
const pages = buildSeedPages()
const bySlug = Object.fromEntries(pages.map((p) => [p.slug, p]))

let failures = 0

for (const [slug, req] of Object.entries(manifest.requiredPages ?? {})) {
  const page = bySlug[slug]
  if (!page) {
    console.error(`FAIL  missing required page slug "${slug}" in seed`)
    failures += 1
    continue
  }

  const components = (page.sections ?? [])
    .map((s) => s?._orbi?.component)
    .filter(Boolean)

  for (const name of req.components ?? []) {
    if (!components.includes(name)) {
      console.error(
        `FAIL  page "${slug}" missing component ${name} (have: ${components.join(", ")})`,
      )
      failures += 1
    }
  }

  for (const section of page.sections ?? []) {
    if (!section?._orbi?.component) {
      console.error(`FAIL  page "${slug}" has section without _orbi.component`)
      failures += 1
    }
  }
}

if (failures) process.exit(1)
console.log("ok    cms:validate (seed/manifest)")
