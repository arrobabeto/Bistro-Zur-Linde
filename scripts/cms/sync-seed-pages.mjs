#!/usr/bin/env node
/**
 * Upsert seed pages into Orbitype (INSERT missing, UPDATE when content differs).
 * Used by "Sube cambios" after GitHub merge so live CMS matches seed.
 *
 *   pnpm run cms:sync-seed -- --yes --changed-only
 *   pnpm run cms:sync-seed -- --yes --slug=events
 */
import { loadEnvFile } from "../lib/env.mjs"
import { confirm, hasYesFlag } from "../lib/confirm.mjs"
import {
  getConnectorContext,
  orbitypeSql,
  sqlConfigured,
} from "../lib/orbitype-sql.mjs"
import { buildSeedPages } from "../../src/lib/orbitype/seed-data.mjs"

loadEnvFile()

const yes = hasYesFlag()
const changedOnly =
  process.argv.includes("--changed-only") || process.argv.includes("--diff")

function slugFlags(argv = process.argv) {
  const slugs = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith("--slug=")) slugs.push(arg.slice("--slug=".length))
    else if (arg === "--slug" && argv[i + 1]) {
      slugs.push(argv[++i])
    }
  }
  return slugs.filter(Boolean)
}

function stableStringify(value) {
  return JSON.stringify(value, (_, v) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.fromEntries(
        Object.keys(v)
          .sort()
          .map((k) => [k, v[k]]),
      )
    }
    return v
  })
}

function pagePayload(page) {
  return {
    title: page.title ?? {},
    lead: page.lead ?? {},
    img: page.img ?? "",
    sections: page.sections ?? [],
    keywords: page.keywords ?? [],
    head: page.head ?? {},
  }
}

function sameContent(a, b) {
  return stableStringify(pagePayload(a)) === stableStringify(pagePayload(b))
}

async function main() {
  if (!sqlConfigured()) {
    console.error(
      "Orbitype SQL API is not configured. Set ORBITYPE_API_SQL_KEY in .env",
    )
    process.exit(1)
  }

  let context = { projectId: null, connectorId: null }
  try {
    context = await getConnectorContext()
  } catch (error) {
    console.warn(
      "• could not probe connector context:",
      error instanceof Error ? error.message : error,
    )
  }

  const wanted = new Set(slugFlags())
  const pages = buildSeedPages().filter(
    (p) => wanted.size === 0 || wanted.has(p.slug),
  )

  if (pages.length === 0) {
    console.error("• no seed pages matched")
    process.exit(1)
  }

  console.log("• about to sync seed pages → Orbitype")
  console.log(`  projectId:   ${context.projectId ?? "(unknown)"}`)
  console.log(`  connectorId: ${context.connectorId ?? "(unknown)"}`)
  console.log(`  mode:        ${changedOnly ? "changed-only" : "force"}`)
  console.log(`  pages:       ${pages.map((p) => p.slug).join(", ")}`)

  const ok = await confirm("Upsert matching seed pages into Orbitype?", {
    yes,
  })
  if (!ok) {
    console.log("• aborted")
    process.exit(0)
  }

  const results = []

  for (const page of pages) {
    try {
      const existing = await orbitypeSql(
        `SELECT id, slug, title, lead, img, sections, keywords, head
         FROM pages WHERE slug = :slug LIMIT 1`,
        { slug: page.slug },
      )
      const row = existing[0]

      if (row && changedOnly && sameContent(row, page)) {
        results.push({ slug: page.slug, status: "unchanged", id: row.id })
        continue
      }

      const bindings = {
        title: JSON.stringify(page.title ?? {}),
        slug: page.slug,
        lead: JSON.stringify(page.lead ?? {}),
        img: page.img ?? "",
        sections: JSON.stringify(page.sections ?? []),
        keywords: JSON.stringify(page.keywords ?? []),
        head: JSON.stringify(page.head ?? {}),
      }

      if (!row) {
        const inserted = await orbitypeSql(
          `INSERT INTO pages (title, slug, lead, img, sections, keywords, head)
           VALUES (
             :title::json,
             :slug,
             :lead::json,
             :img,
             :sections::json,
             :keywords::json,
             :head::json
           )
           RETURNING id, slug`,
          bindings,
        )
        results.push({
          slug: page.slug,
          status: "inserted",
          id: inserted[0]?.id,
        })
        continue
      }

      const updated = await orbitypeSql(
        `UPDATE pages SET
           title = :title::json,
           lead = :lead::json,
           img = :img,
           sections = :sections::json,
           keywords = :keywords::json,
           head = :head::json
         WHERE slug = :slug
         RETURNING id, slug`,
        bindings,
      )
      results.push({
        slug: page.slug,
        status: "updated",
        id: updated[0]?.id ?? row.id,
      })
    } catch (error) {
      results.push({
        slug: page.slug,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const r of results) {
    const suffix = r.error ? ` — ${r.error}` : r.id ? ` (${r.id})` : ""
    console.log(`  page ${r.slug}: ${r.status}${suffix}`)
  }

  const success = results.every((r) => r.status !== "error")
  console.log(success ? "• seed pages synced" : "• sync finished with errors")
  process.exit(success ? 0 : 1)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
