/**
 * Provider-agnostic transactional email.
 * Implement EmailProvider and wire it below. Until then the stub throws.
 */
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

let provider: EmailProvider = new UnconfiguredEmailProvider()

export function setEmailProvider(next: EmailProvider): void {
  provider = next
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  await provider.send(message)
}
