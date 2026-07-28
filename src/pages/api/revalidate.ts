import type { APIRoute } from "astro"
import { REVALIDATE_SECRET } from "astro:env/server"
import { timingSafeEqual } from "node:crypto"
import { z } from "zod"

export const prerender = false

const bodySchema = z.object({
  tags: z.array(z.string().min(1)).optional(),
  path: z.string().min(1).optional(),
})

function secretsEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export const POST: APIRoute = async ({ request, cache }) => {
  // Unconfigured deployments expose nothing.
  if (!REVALIDATE_SECRET) {
    return new Response(null, { status: 404 })
  }

  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-revalidate-secret") ??
    ""

  if (!header || !secretsEqual(header, REVALIDATE_SECRET)) {
    return new Response(
      JSON.stringify({ ok: false, message: "Unauthorized" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: "Invalid JSON" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ ok: false, message: "Validation failed" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  const { tags = [], path } = parsed.data
  if (tags.length === 0 && !path) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Provide at least one of tags or path",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  const invalidated: string[] = []

  if (cache.enabled) {
    if (tags.length > 0) {
      await cache.invalidate({ tags })
      invalidated.push(...tags.map((t) => `tag:${t}`))
    }
    if (path) {
      await cache.invalidate({ path })
      invalidated.push(`path:${path}`)
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message: cache.enabled
        ? "Invalidation requested (soft)."
        : "Cache provider inactive; nothing to invalidate.",
      invalidated,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  )
}
