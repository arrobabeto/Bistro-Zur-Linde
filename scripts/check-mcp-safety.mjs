/**
 * Fails if any committed MCP config file inlines a literal API key.
 * Every X-API-KEY must be a bare ${env:VAR} reference.
 *
 * Wired into the pre-commit hook so .cursor/mcp.json can safely be committed.
 * See ADR-0014.
 */
import fs from "node:fs"
import path from "node:path"

const FILES = [".cursor/mcp.json", ".cursor/mcp.json.example"]
const ENV_REF = /^\$\{env:[A-Z0-9_]+\}$/

let failures = 0

for (const file of FILES) {
  if (!fs.existsSync(file)) continue

  let config
  try {
    config = JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (error) {
    console.error(`FAIL  ${file}: invalid JSON — ${error.message}`)
    failures += 1
    continue
  }

  const servers = config?.mcpServers ?? {}
  for (const [name, server] of Object.entries(servers)) {
    const apiKey = server?.headers?.["X-API-KEY"] ?? ""
    if (!ENV_REF.test(apiKey)) {
      console.error(
        `FAIL  ${path.basename(file)} → ${name}: X-API-KEY must be \${env:VAR}, got ${JSON.stringify(apiKey.slice(0, 40))}`,
      )
      failures += 1
    }
  }
}

if (failures > 0) {
  console.error(
    `\n${failures} MCP safety check(s) failed. Never commit literal API keys.`,
  )
  process.exit(1)
}

console.log(
  "ok    MCP safety: all X-API-KEY values are ${env:...} placeholders",
)
