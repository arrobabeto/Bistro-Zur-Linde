import type { APIRoute } from "astro"
import { hasSqlConfigured, isMockMode } from "~/lib/orbitype/config"
import { orbitypeSql, OrbitypeError } from "~/lib/orbitype/client"

export const prerender = false

export const GET: APIRoute = async () => {
  const base = {
    version: process.env["npm_package_version"] ?? "0.1.0",
    commit:
      process.env["VERCEL_GIT_COMMIT_SHA"] ?? process.env["GIT_COMMIT"] ?? null,
    mock: isMockMode(),
  }

  if (isMockMode() || !hasSqlConfigured()) {
    return new Response(
      JSON.stringify({
        ok: true,
        status: "ready",
        cms: "mock",
        ...base,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    )
  }

  try {
    await orbitypeSql("SELECT 1 AS ok", {}, { timeoutMs: 5_000 })
    return new Response(
      JSON.stringify({
        ok: true,
        status: "ready",
        cms: "up",
        ...base,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    )
  } catch (error) {
    const kind = error instanceof OrbitypeError ? error.kind : "unknown"
    return new Response(
      JSON.stringify({
        ok: false,
        status: "not_ready",
        cms: "down",
        kind,
        ...base,
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Retry-After": "60",
        },
      },
    )
  }
}
