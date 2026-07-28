import type { APIRoute } from "astro"
import { orbitypeSql } from "~/lib/orbitype/client"
import { ORBITYPE_API_KEYS_URL, hasSqlConfigured } from "~/lib/orbitype/config"
import {
  CMS_SCHEMA_SQL_SAFE,
  CREATE_UID_FUNCTION_SQL,
  type CmsTable,
} from "~/lib/orbitype/schema"

export const prerender = false

type InstallResult = {
  table: string
  status: "ok" | "error"
  error?: string
}

export const POST: APIRoute = async ({ request }) => {
  if (!hasSqlConfigured()) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: `Orbitype SQL API is not configured. Create a connector-scoped key at ${ORBITYPE_API_KEYS_URL} and set ORBITYPE_API_SQL_KEY.`,
        results: [],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  let body: { table?: string }
  try {
    body = (await request.json()) as { table?: string }
  } catch {
    body = {}
  }

  const requested = body.table ?? "all"
  const tables: CmsTable[] =
    requested === "all"
      ? (Object.keys(CMS_SCHEMA_SQL_SAFE) as CmsTable[])
      : requested in CMS_SCHEMA_SQL_SAFE
        ? [requested as CmsTable]
        : []

  if (tables.length === 0) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: `Unknown table "${requested}". Use one of: all, ${Object.keys(CMS_SCHEMA_SQL_SAFE).join(", ")}`,
        results: [],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  const results: InstallResult[] = []

  // uid() first — every table's primary key defaults to it.
  // Orbitype often provisions uid() on connector creation; CREATE OR REPLACE
  // can return 500 even when the function already works. Treat that as ok.
  try {
    await orbitypeSql(CREATE_UID_FUNCTION_SQL)
    results.push({ table: "uid()", status: "ok" })
  } catch (error) {
    try {
      await orbitypeSql("SELECT uid() AS id")
      results.push({ table: "uid()", status: "ok" })
    } catch {
      results.push({
        table: "uid()",
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  for (const table of tables) {
    try {
      await orbitypeSql(CMS_SCHEMA_SQL_SAFE[table])
      results.push({ table, status: "ok" })
    } catch (error) {
      results.push({
        table,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const ok = results.every((r) => r.status === "ok")
  return new Response(
    JSON.stringify({
      ok,
      message: ok
        ? "Schema installed successfully."
        : "Schema install finished with errors. See results.",
      results,
    }),
    {
      status: ok ? 200 : 207,
      headers: { "Content-Type": "application/json" },
    },
  )
}
