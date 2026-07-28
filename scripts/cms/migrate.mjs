#!/usr/bin/env node
import { loadEnvFile } from "../lib/env.mjs"
import { confirm, hasYesFlag } from "../lib/confirm.mjs"
import {
  getConnectorContext,
  orbitypeSql,
  sqlConfigured,
} from "../lib/orbitype-sql.mjs"
import { CMS_MIGRATIONS_SQL } from "../../src/lib/orbitype/schema-sql.mjs"

loadEnvFile()

const yes = hasYesFlag()

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

  const names = Object.keys(CMS_MIGRATIONS_SQL)
  console.log("• about to apply additive migrations")
  console.log(`  projectId:   ${context.projectId ?? "(unknown)"}`)
  console.log(`  connectorId: ${context.connectorId ?? "(unknown)"}`)
  console.log(`  migrations:  ${names.join(", ")}`)

  const ok = await confirm("Apply ALTER TABLE migrations on this connector?", {
    yes,
  })
  if (!ok) {
    console.log("• aborted")
    process.exit(0)
  }

  const results = []
  for (const [name, sql] of Object.entries(CMS_MIGRATIONS_SQL)) {
    try {
      await orbitypeSql(sql)
      results.push({ migration: name, status: "ok" })
    } catch (error) {
      results.push({
        migration: name,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const r of results) {
    const suffix = r.error ? ` — ${r.error}` : ""
    console.log(`  ${r.migration}: ${r.status}${suffix}`)
  }

  const success = results.every((r) => r.status === "ok")
  console.log(
    success ? "• migrations applied" : "• migrations finished with errors",
  )
  process.exit(success ? 0 : 1)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
