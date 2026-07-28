import { env } from "./env.mjs"

const DEFAULT_URL = "https://core.orbitype.com/api/sql/v1"
const DEFAULT_TIMEOUT_MS = 15_000
const PLACEHOLDER_KEYS = new Set(["", "your-api-key", "changeme"])

export class OrbitypeSqlError extends Error {
  constructor(message, { status, cause, kind } = {}) {
    super(message, cause ? { cause } : undefined)
    this.name = "OrbitypeSqlError"
    this.status = status
    this.kind = kind ?? "sql"
  }
}

export function sqlConfigured() {
  const key = env("ORBITYPE_API_SQL_KEY") || env("ORBITYPE_SQL_API_KEY")
  return !PLACEHOLDER_KEYS.has(key.toLowerCase())
}

export function sqlEndpoint() {
  return env("ORBITYPE_API_SQL_URL", DEFAULT_URL)
}

function sqlKey() {
  return env("ORBITYPE_API_SQL_KEY") || env("ORBITYPE_SQL_API_KEY")
}

/**
 * POST SQL to the Orbitype connector. Never logs the API key.
 */
export async function orbitypeSql(sql, bindings = {}, options = {}) {
  if (!sqlConfigured()) {
    throw new OrbitypeSqlError("Orbitype SQL API is not configured.", {
      kind: "config",
    })
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  let response
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
      throw new OrbitypeSqlError(
        `Orbitype SQL timed out after ${timeoutMs}ms`,
        {
          kind: "timeout",
          cause: error,
        },
      )
    }
    throw new OrbitypeSqlError("Orbitype SQL network error", {
      kind: "network",
      cause: error instanceof Error ? error : undefined,
    })
  }

  if (!response.ok) {
    await response.text().catch(() => undefined)
    const kind =
      response.status === 404
        ? "auth"
        : response.status === 400
          ? "request"
          : "sql"
    throw new OrbitypeSqlError(
      `Orbitype SQL request failed with ${response.status}`,
      { status: response.status, kind },
    )
  }

  const data = await response.json()
  return Array.isArray(data) ? data : [data]
}

/**
 * Probe connector scope via OPTIONS on the Orbitype API root.
 * Returns { projectId, connectorId } when available.
 */
export async function getConnectorContext(options = {}) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const response = await fetch("https://core.orbitype.com/api", {
    method: "OPTIONS",
    headers: { "X-API-KEY": sqlKey() },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!response.ok) {
    throw new OrbitypeSqlError(
      `Connector context probe failed with ${response.status}`,
      { status: response.status, kind: "auth" },
    )
  }
  const data = await response.json().catch(() => ({}))
  return {
    projectId: data.projectId ?? data.project_id ?? null,
    connectorId: data.connectorId ?? data.connector_id ?? null,
  }
}
