import type { APIRoute } from "astro"
import { z } from "zod"
import { PUBLIC_SITE_NAME } from "astro:env/client"
import { getMailConfig, isEmailConfigured, sendEmail } from "~/lib/email"
import { clientKey, rateLimit } from "~/lib/rate-limit"

export const prerender = false

const schema = z.object({
  email: z.email().max(254),
})

async function readEmail(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    return request.json()
  }
  const form = await request.formData()
  return Object.fromEntries(form.entries())
}

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(`newsletter:${clientKey(request)}`, {
    limit: 5,
    windowMs: 60_000,
  })
  if (!limited.ok) {
    return Response.redirect(new URL("/?newsletter=error", request.url), 303)
  }

  let raw: unknown
  try {
    raw = await readEmail(request)
  } catch {
    return Response.redirect(new URL("/?newsletter=error", request.url), 303)
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return Response.redirect(new URL("/?newsletter=error", request.url), 303)
  }

  const { to, from, fromName } = getMailConfig()
  if (!to || !from || !isEmailConfigured()) {
    return Response.redirect(
      new URL("/?newsletter=unavailable", request.url),
      303,
    )
  }

  try {
    await sendEmail({
      to,
      from,
      fromName: fromName || PUBLIC_SITE_NAME,
      subject: `Newsletter signup: ${parsed.data.email}`,
      text: [
        "New newsletter signup from the website.",
        "",
        `Email: ${parsed.data.email}`,
      ].join("\n"),
    })
  } catch (error) {
    console.error("[newsletter] send failed:", error)
    return Response.redirect(new URL("/?newsletter=error", request.url), 303)
  }

  return Response.redirect(new URL("/?newsletter=sent", request.url), 303)
}
