import type { APIRoute } from "astro"
import { orbitypeSql } from "~/lib/orbitype/client"
import { ORBITYPE_API_KEYS_URL, hasSqlConfigured } from "~/lib/orbitype/config"
import { CMS_MIGRATIONS_SQL } from "~/lib/orbitype/schema"

export const prerender = false

export const POST: APIRoute = async () => {
  if (!hasSqlConfigured()) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: `Orbitype SQL API is not configured. See ${ORBITYPE_API_KEYS_URL}`,
        results: [],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  const results: Array<{
    migration: string
    status: "ok" | "error"
    error?: string
  }> = []

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

  const ok = results.every((r) => r.status === "ok")
  return new Response(
    JSON.stringify({
      ok,
      message: ok ? "Migrations applied." : "Migrations finished with errors.",
      results,
    }),
    {
      status: ok ? 200 : 207,
      headers: { "Content-Type": "application/json" },
    },
  )
}
