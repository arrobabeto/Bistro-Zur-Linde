import { hasSqlConfigured, sqlEndpoint, sqlKey } from "./config"

export type OrbitypeErrorKind =
  "config" | "timeout" | "network" | "auth" | "sql" | "invalid"

export class OrbitypeError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: string,
    readonly kind: OrbitypeErrorKind = "sql",
  ) {
    super(message)
    this.name = "OrbitypeError"
  }

  get isUnavailable(): boolean {
    return (
      this.kind === "timeout" ||
      this.kind === "network" ||
      this.kind === "auth" ||
      this.kind === "config" ||
      (typeof this.status === "number" && this.status >= 500)
    )
  }
}

const DEFAULT_TIMEOUT_MS = 12_000

/**
 * Single point of contact with the Orbitype SQL API.
 * Never logs the key. Never called from a component.
 */
export async function orbitypeSql<T = unknown>(
  sql: string,
  bindings: Record<string, unknown> = {},
  options: { timeoutMs?: number } = {},
): Promise<T[]> {
  if (!hasSqlConfigured()) {
    throw new OrbitypeError(
      "Orbitype SQL API is not configured.",
      undefined,
      undefined,
      "config",
    )
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  let response: Response
  try {
    response = await fetch(sqlEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": sqlKey(),
      },
      body: JSON.stringify({ sql, bindings }),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new OrbitypeError(
        `Orbitype SQL timed out after ${timeoutMs}ms`,
        undefined,
        undefined,
        "timeout",
      )
    }
    throw new OrbitypeError(
      "Orbitype SQL network error",
      undefined,
      undefined,
      "network",
    )
  }

  if (!response.ok) {
    // Error bodies are inconsistent: 400 is text/plain, 404 is JSON.
    // Always read as text. A bad key returns 404, never 401.
    const body = await response.text().catch(() => undefined)
    const kind: OrbitypeErrorKind =
      response.status === 404
        ? "auth"
        : response.status === 400
          ? "invalid"
          : "sql"
    throw new OrbitypeError(
      `Orbitype SQL request failed with ${response.status}`,
      response.status,
      body,
      kind,
    )
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new OrbitypeError(
      "Orbitype SQL returned invalid JSON",
      response.status,
      undefined,
      "invalid",
    )
  }
  return Array.isArray(data) ? (data as T[]) : ([data] as T[])
}
