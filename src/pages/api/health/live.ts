import type { APIRoute } from "astro"

export const prerender = false

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      status: "live",
      version: process.env["npm_package_version"] ?? "0.1.0",
      commit:
        process.env["VERCEL_GIT_COMMIT_SHA"] ??
        process.env["GIT_COMMIT"] ??
        null,
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
