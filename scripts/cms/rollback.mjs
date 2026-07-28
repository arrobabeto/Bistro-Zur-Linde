#!/usr/bin/env node
/**
 * Restore pages from a prior cms:export artifact (destructive — confirms first).
 */
import fs from "node:fs"
import { loadEnvFile } from "../lib/env.mjs"
import {
  getConnectorContext,
  orbitypeSql,
  sqlConfigured,
} from "../lib/orbitype-sql.mjs"
import { confirm, hasYesFlag } from "../lib/confirm.mjs"

loadEnvFile()

const file =
  process.argv.find((a) => a.endsWith(".json") && !a.includes("package")) ??
  process.argv[2]

async function main() {
  if (!file || !fs.existsSync(file)) {
    console.error("Usage: pnpm run cms:rollback -- artifacts/cms-export-….json")
    process.exit(1)
  }
  if (!sqlConfigured()) {
    console.error("Missing ORBITYPE_API_SQL_KEY")
    process.exit(1)
  }

  const artifact = JSON.parse(fs.readFileSync(file, "utf8"))
  const context = await getConnectorContext().catch(() => ({}))
  console.log(`artifact connector: ${artifact.context?.connectorId ?? "?"}`)
  console.log(`live connector:     ${context.connectorId ?? "?"}`)

  const ok = await confirm(
    `Restore ${artifact.pages?.length ?? 0} pages from ${file}? This UPDATEs matching slugs.`,
    { yes: hasYesFlag() },
  )
  if (!ok) process.exit(0)

  for (const page of artifact.pages ?? []) {
    await orbitypeSql(
      `UPDATE pages
       SET title = :title::json,
           lead = :lead::json,
           img = :img,
           sections = :sections::json,
           keywords = :keywords::json,
           head = :head::json,
           template = :template,
           updated_at = CURRENT_TIMESTAMP
       WHERE slug = :slug
       RETURNING id, slug`,
      {
        title: JSON.stringify(page.title),
        lead: JSON.stringify(page.lead ?? { en: "" }),
        img: page.img ?? "",
        sections: JSON.stringify(page.sections ?? []),
        keywords: JSON.stringify(page.keywords ?? []),
        head: JSON.stringify(page.head ?? {}),
        template: page.template ?? null,
        slug: page.slug,
      },
    )
    console.log(`  restored page ${page.slug}`)
  }

  console.log("ok    rollback applied for pages in artifact")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
