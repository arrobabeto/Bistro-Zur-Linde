import type { APIRoute } from "astro"
import { z } from "zod"
import {
  MAIL_FROM_EMAIL,
  MAIL_FROM_NAME,
  MAIL_TO_EMAIL,
} from "astro:env/server"
import { PUBLIC_SITE_NAME } from "astro:env/client"
import { sendEmail } from "~/lib/email"
import { insertContact } from "~/lib/orbitype/contacts"

export const prerender = false

const schema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.email(),
  phone: z.string().trim().optional().default(""),
  topic: z.string().trim().optional().default(""),
  message: z.string().trim().min(1),
  // Honeypot — bots fill this; humans leave it empty.
  website: z.string().optional().default(""),
})

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return json({ ok: false, message: "Invalid JSON body" }, 400)
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return json(
      { ok: false, message: "Validation failed", issues: parsed.error.issues },
      400,
    )
  }

  const data = parsed.data
  if (data.website) {
    // Silent success for honeypot hits.
    return json({ ok: true, message: "Sent" })
  }

  const to = MAIL_TO_EMAIL
  const from = MAIL_FROM_EMAIL
  if (!to || !from) {
    return json(
      {
        ok: false,
        message:
          "Mail is not configured. Set MAIL_TO_EMAIL and MAIL_FROM_EMAIL.",
      },
      503,
    )
  }

  try {
    await sendEmail({
      to,
      from,
      fromName: MAIL_FROM_NAME || PUBLIC_SITE_NAME,
      subject: `Contact from ${data.first_name} ${data.last_name}`,
      text: [
        `Name: ${data.first_name} ${data.last_name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.topic ? `Topic: ${data.topic}` : "",
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    })
  } catch (error) {
    return json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Email failed",
      },
      502,
    )
  }

  // Best-effort persistence — a failed insert must not fail the request.
  try {
    await insertContact({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      topic: data.topic,
      message: data.message,
    })
  } catch (error) {
    console.error("[contact] insert failed after email sent:", error)
  }

  return json({ ok: true, message: "Sent" })
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
