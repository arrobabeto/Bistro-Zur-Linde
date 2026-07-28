/**
 * Checks that Orbitype MCP wiring is plausible before you rely on it, and
 * probes the SQL API if a key is available.
 *
 * This verifies configuration and reachability. Confirm the connector with
 * `orbitype_get_context` in a Cursor chat after exporting ORBITYPE_SQL_API_KEY
 * and reloading MCP (Settings → Tools & MCP).
 */
import fs from "node:fs"

const MCP_CONFIG = ".cursor/mcp.json"
const MCP_EXAMPLE = ".cursor/mcp.json.example"
const MCP_ENDPOINT = "https://core.orbitype.com/api/mcp/v1"

let failures = 0

function pass(message) {
  console.log(`  ok    ${message}`)
}

function fail(message) {
  console.log(`  FAIL  ${message}`)
  failures += 1
}

function warn(message) {
  console.log(`  warn  ${message}`)
}

console.log("\nOrbitype MCP configuration\n")

if (!fs.existsSync(MCP_EXAMPLE)) {
  fail(`${MCP_EXAMPLE} is missing`)
} else {
  pass(`${MCP_EXAMPLE} present`)
}

if (!fs.existsSync(MCP_CONFIG)) {
  fail(`${MCP_CONFIG} is missing — it must be committed so clones inherit MCP`)
} else {
  let config
  try {
    config = JSON.parse(fs.readFileSync(MCP_CONFIG, "utf8"))
    pass(`${MCP_CONFIG} is valid JSON`)
  } catch (error) {
    fail(`${MCP_CONFIG} is not valid JSON: ${error.message}`)
  }

  const servers = config?.mcpServers ?? {}
  const names = Object.keys(servers)

  if (names.length === 0) {
    fail("no mcpServers entries configured")
  } else {
    pass(`${names.length} server entry/entries: ${names.join(", ")}`)
  }

  for (const [name, server] of Object.entries(servers)) {
    const apiKey = server?.headers?.["X-API-KEY"] ?? ""
    const match = /^\$\{env:([A-Z0-9_]+)\}$/.exec(apiKey)

    if (!match) {
      if (apiKey && !apiKey.startsWith("${env:")) {
        fail(
          `${name}: API key is inlined — use \${env:VAR} so it stays out of git`,
        )
      } else {
        fail(`${name}: missing or malformed X-API-KEY header`)
      }
      continue
    }

    if (server?.url !== MCP_ENDPOINT) {
      warn(`${name}: unexpected URL ${server?.url}`)
    }

    const variable = match[1]
    if (process.env[variable]) {
      pass(`${name}: ${variable} is exported`)
    } else {
      warn(
        `${name}: ${variable} is not exported — run \`pnpm run mcp:env\` and add it to your shell profile`,
      )
    }
  }
}

console.log("\nSQL API reachability\n")

const sqlUrl =
  process.env["ORBITYPE_API_SQL_URL"] ?? "https://core.orbitype.com/api/sql/v1"
const sqlKey =
  process.env["ORBITYPE_API_SQL_KEY"] ?? process.env["ORBITYPE_SQL_API_KEY"]

if (!sqlKey) {
  warn("no SQL key in the environment — skipping the live probe")
} else {
  try {
    const response = await fetch(sqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": sqlKey },
      body: JSON.stringify({ sql: "SELECT 1 AS ok", bindings: {} }),
    })

    if (response.ok) {
      pass(`SQL API responded ${response.status}`)
    } else {
      // A bad key returns 404, not 401, and a missing key returns plain text.
      // Always read as text. See blueprint §8.3.
      const body = await response.text().catch(() => "")
      fail(`SQL API responded ${response.status}: ${body.slice(0, 200)}`)
    }
  } catch (error) {
    fail(`SQL API request failed: ${error.message}`)
  }

  // Probe connector scope the same way MCP's orbitype_get_context does —
  // OPTIONS /api with the key. Confirms the key is bound to a connector.
  console.log("\nConnector scope (orbitype_get_context equivalent)\n")
  try {
    const response = await fetch("https://core.orbitype.com/api", {
      method: "OPTIONS",
      headers: { "X-API-KEY": sqlKey },
    })
    if (response.ok || response.status === 204) {
      const body = await response.text().catch(() => "")
      pass(
        `connector scope probe responded ${response.status}${body ? `: ${body.slice(0, 120)}` : ""}`,
      )
    } else {
      const body = await response.text().catch(() => "")
      warn(
        `connector scope probe responded ${response.status}: ${body.slice(0, 200)}`,
      )
    }
  } catch (error) {
    warn(`connector scope probe failed: ${error.message}`)
  }
}

console.log(
  failures === 0
    ? "\nAll checks passed. Export ORBITYPE_SQL_API_KEY, reload MCP in Cursor, then run `orbitype_get_context`.\n"
    : `\n${failures} check(s) failed.\n`,
)

process.exit(failures === 0 ? 0 : 1)
