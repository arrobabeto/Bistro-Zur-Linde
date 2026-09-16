/**
 * Provider-agnostic transactional email.
 * SendGrid is used when MAIL_API_KEY, MAIL_FROM_EMAIL and MAIL_TO_EMAIL are set.
 */
import {
  MAIL_API_KEY,
  MAIL_FROM_EMAIL,
  MAIL_FROM_NAME,
  MAIL_TO_EMAIL,
} from "astro:env/server"

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

export interface MailConfig {
  apiKey: string
  from: string
  to: string
  fromName: string
}

class UnconfiguredEmailProvider implements EmailProvider {
  readonly name = "unconfigured"

  send(_message: EmailMessage): Promise<void> {
    return Promise.reject(
      new Error(
        "No email provider configured. Set MAIL_API_KEY, MAIL_FROM_EMAIL, and MAIL_TO_EMAIL.",
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

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim()
}

export function getMailConfig(): MailConfig {
  return {
    apiKey: trimEnv(MAIL_API_KEY),
    from: trimEnv(MAIL_FROM_EMAIL),
    to: trimEnv(MAIL_TO_EMAIL),
    fromName: trimEnv(MAIL_FROM_NAME),
  }
}

const mailConfig = getMailConfig()

let provider: EmailProvider = mailConfig.apiKey
  ? new SendGridEmailProvider(mailConfig.apiKey)
  : new UnconfiguredEmailProvider()

export function setEmailProvider(next: EmailProvider): void {
  provider = next
}

export function isEmailConfigured(): boolean {
  const { apiKey, from, to } = getMailConfig()
  return Boolean(apiKey && from && to && provider.name !== "unconfigured")
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  await provider.send(message)
}
