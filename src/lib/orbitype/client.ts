import { hasSqlConfigured, sqlEndpoint, sqlKey } from "./config"

export class OrbitypeError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: string,
  ) {
    super(message)
    this.name = "OrbitypeError"
  }
}

/**
 * Single point of contact with the Orbitype SQL API.
 * Never logs the key. Never called from a component.
 */
export async function orbitypeSql<T = unknown>(
  sql: string,
  bindings: Record<string, unknown> = {},
): Promise<T[]> {
  if (!hasSqlConfigured()) {
    throw new OrbitypeError("Orbitype SQL API is not configured.")
  }

  const response = await fetch(sqlEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": sqlKey(),
    },
    body: JSON.stringify({ sql, bindings }),
  })

  if (!response.ok) {
    // Error bodies are inconsistent: 400 is text/plain, 404 is JSON.
    // Always read as text. A bad key returns 404, never 401.
    const body = await response.text().catch(() => undefined)
    throw new OrbitypeError(
      `Orbitype SQL request failed with ${response.status}`,
      response.status,
      body,
    )
  }

  const data: unknown = await response.json()
  return Array.isArray(data) ? (data as T[]) : ([data] as T[])
}
