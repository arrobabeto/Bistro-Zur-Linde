/**
 * Provider-agnostic transactional email.
 * SendGrid is wired when MAIL_API_KEY is set; otherwise the stub throws.
 */
import { MAIL_API_KEY } from "astro:env/server"

export interface EmailMessage {
  to: string
  from: string
  fromName?: string
  subject: string
  text: string
  html?: string
}

export interface EmailProvider {
  readonly name: string
  send(message: EmailMessage): Promise<void>
}

class UnconfiguredEmailProvider implements EmailProvider {
  readonly name = "unconfigured"

  send(_message: EmailMessage): Promise<void> {
    return Promise.reject(
      new Error(
        "No email provider configured. Implement EmailProvider in src/lib/email.ts.",
      ),
    )
  }
}

class SendGridEmailProvider implements EmailProvider {
  readonly name = "sendgrid"

  constructor(private readonly apiKey: string) {}

  async send(message: EmailMessage): Promise<void> {
    const content: Array<{ type: string; value: string }> = [
      { type: "text/plain", value: message.text },
    ]
    if (message.html) {
      content.push({ type: "text/html", value: message.html })
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: message.to }] }],
        from: {
          email: message.from,
          ...(message.fromName ? { name: message.fromName } : {}),
        },
        subject: message.subject,
        content,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error(`[email:sendgrid] ${response.status}`, body)
      throw new Error(`SendGrid failed with status ${response.status}`)
    }
  }
}

let provider: EmailProvider = MAIL_API_KEY
  ? new SendGridEmailProvider(MAIL_API_KEY)
  : new UnconfiguredEmailProvider()

export function setEmailProvider(next: EmailProvider): void {
  provider = next
}

export function isEmailConfigured(): boolean {
  return provider.name !== "unconfigured"
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  await provider.send(message)
}
