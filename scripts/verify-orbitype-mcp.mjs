/**
 * Checks that Orbitype MCP wiring is plausible before you rely on it, and
 * probes the SQL API if a key is available.
 *
 * This verifies configuration, not MCP itself — only Cursor can exercise the
 * MCP transport. Confirm the connector with `orbitype_get_context` in a chat.
 */
import fs from "node:fs"

const MCP_CONFIG = ".cursor/mcp.json"
const MCP_EXAMPLE = ".cursor/mcp.json.example"

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
  warn(`${MCP_CONFIG} not found — copy the example and add your keys`)
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

    const variable = match[1]
    if (process.env[variable]) {
      pass(`${name}: ${variable} is exported`)
    } else {
      fail(`${name}: ${variable} is not exported — run \`pnpm run mcp:env\``)
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
}

console.log(
  failures === 0
    ? "\nAll checks passed. Run `orbitype_get_context` in Cursor to confirm the connector.\n"
    : `\n${failures} check(s) failed.\n`,
)

process.exit(failures === 0 ? 0 : 1)
