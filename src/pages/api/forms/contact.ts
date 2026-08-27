import type { APIRoute } from "astro"
import { z } from "zod"
import {
  MAIL_FROM_EMAIL,
  MAIL_FROM_NAME,
  MAIL_TO_EMAIL,
} from "astro:env/server"
import { PUBLIC_SITE_NAME } from "astro:env/client"
import { isEmailConfigured, sendEmail } from "~/lib/email"
import { insertContact } from "~/lib/orbitype/contacts"
import { clientKey, rateLimit } from "~/lib/rate-limit"

export const prerender = false

const schema = z.object({
  salutation: z.enum(["Frau", "Herr"]),
  first_name: z.string().trim().min(1).max(120),
  last_name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  topic: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  privacy: z.union([z.literal("on"), z.literal("true"), z.literal(true)]),
  // Honeypot — bots fill this; humans leave it empty.
  website: z.string().max(200).optional().default(""),
})

async function readBody(request: Request): Promise<{
  raw: unknown
  isForm: boolean
}> {
  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    return { raw: await request.json(), isForm: false }
  }
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData()
    return { raw: Object.fromEntries(form.entries()), isForm: true }
  }
  try {
    return { raw: await request.json(), isForm: false }
  } catch {
    const form = await request.formData()
    return { raw: Object.fromEntries(form.entries()), isForm: true }
  }
}

function wantsJson(request: Request, isForm: boolean): boolean {
  if (isForm) return false
  const accept = request.headers.get("accept") ?? ""
  return accept.includes("application/json")
}

function redirectToKontakt(
  request: Request,
  query: "sent=1" | "error=1",
): Response {
  const url = new URL(request.url)
  return Response.redirect(
    new URL(`/kontakt?${query}#schreiben`, url.origin),
    303,
  )
}

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(`contact:${clientKey(request)}`, {
    limit: 5,
    windowMs: 60_000,
  })
  if (!limited.ok) {
    return json({ ok: false, message: "Too many requests" }, 429, {
      "Retry-After": String(limited.retryAfterSec),
    })
  }

  let raw: unknown
  let isForm: boolean
  try {
    ;({ raw, isForm } = await readBody(request))
  } catch {
    return json({ ok: false, message: "Invalid request body" }, 400)
  }

  const asJson = wantsJson(request, isForm)

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    if (!asJson) return redirectToKontakt(request, "error=1")
    return json(
      { ok: false, message: "Validation failed", issues: parsed.error.issues },
      400,
    )
  }

  const data = parsed.data
  if (data.website) {
    if (!asJson) return redirectToKontakt(request, "sent=1")
    return json({ ok: true, message: "Sent" })
  }

  const to = MAIL_TO_EMAIL
  const from = MAIL_FROM_EMAIL
  if (!to || !from || !isEmailConfigured()) {
    if (!asJson) return redirectToKontakt(request, "error=1")
    return json(
      {
        ok: false,
        message:
          "Mail is not configured. Implement EmailProvider and set MAIL_TO_EMAIL / MAIL_FROM_EMAIL.",
      },
      503,
    )
  }

  try {
    await sendEmail({
      to,
      from,
      fromName: MAIL_FROM_NAME || PUBLIC_SITE_NAME,
      subject: `Contact from ${data.salutation} ${data.first_name} ${data.last_name}`,
      text: [
        `Ansprache: ${data.salutation}`,
        `Name: ${data.first_name} ${data.last_name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.topic ? `Betreff: ${data.topic}` : "",
        "Privacy consent: yes",
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    })
  } catch (error) {
    if (!asJson) return redirectToKontakt(request, "error=1")
    return json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Email failed",
      },
      502,
    )
  }

  const topicForStore = [data.salutation, data.topic]
    .filter(Boolean)
    .join(" · ")

  try {
    await insertContact({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      topic: topicForStore,
      message: data.message,
    })
  } catch (error) {
    console.error("[contact] insert failed after email sent:", error)
  }

  if (!asJson) return redirectToKontakt(request, "sent=1")
  return json({ ok: true, message: "Sent" })
}

function json(
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  })
}
