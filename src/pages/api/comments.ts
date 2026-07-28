import type { APIRoute } from "astro"
import { z } from "zod"
import {
  commentsEnabled,
  insertComment,
  listComments,
} from "~/lib/orbitype/comments"

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  if (!commentsEnabled()) {
    return new Response(null, { status: 404 })
  }

  const postId = url.searchParams.get("post_id")
  if (!postId) {
    return json({ ok: false, message: "post_id is required" }, 400)
  }

  const comments = await listComments(postId)
  return json({ ok: true, comments })
}

const postSchema = z.object({
  post_id: z.string().min(1),
  author: z.string().trim().min(1),
  text: z.string().trim().min(1),
})

export const POST: APIRoute = async ({ request }) => {
  if (!commentsEnabled()) {
    return new Response(null, { status: 404 })
  }

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return json({ ok: false, message: "Invalid JSON body" }, 400)
  }

  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    return json(
      { ok: false, message: "Validation failed", issues: parsed.error.issues },
      400,
    )
  }

  try {
    const comment = await insertComment(parsed.data)
    return json({ ok: true, comment }, 201)
  } catch (error) {
    return json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Insert failed",
      },
      500,
    )
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
