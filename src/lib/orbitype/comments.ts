import { PUBLIC_COMMENTS_ENABLED } from "astro:env/client"
import type { Comment } from "~/types/contact"
import { orbitypeSql } from "./client"
import { hasSqlConfigured, isMockMode } from "./config"

export function commentsEnabled(): boolean {
  return PUBLIC_COMMENTS_ENABLED === true
}

export async function listComments(postId: string): Promise<Comment[]> {
  if (!commentsEnabled() || isMockMode() || !hasSqlConfigured()) return []

  try {
    return await orbitypeSql<Comment>(
      `SELECT * FROM comments
       WHERE post_id = :post_id
       ORDER BY created_at ASC`,
      { post_id: postId },
    )
  } catch (error) {
    console.error("[orbitype] listComments failed:", error)
    return []
  }
}

export async function insertComment(
  comment: Omit<Comment, "id" | "created_at">,
): Promise<Comment | null> {
  if (!commentsEnabled() || !hasSqlConfigured() || isMockMode()) return null

  const rows = await orbitypeSql<Comment>(
    `INSERT INTO comments (post_id, author, text)
     VALUES (:post_id, :author, :text)
     RETURNING *`,
    {
      post_id: comment.post_id,
      author: comment.author,
      text: comment.text,
    },
  )
  return rows[0] ?? null
}
