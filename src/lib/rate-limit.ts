/**
 * Simple in-memory sliding window rate limiter.
 * Per-instance only — acceptable for soft spam resistance on serverless.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function rateLimit(
  key: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSec: Math.ceil(windowMs / 1000) }
  }
  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }
  existing.count += 1
  return { ok: true, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) }
}

export function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}
