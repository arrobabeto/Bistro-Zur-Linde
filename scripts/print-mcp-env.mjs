/**
 * Prints the shell exports Cursor's MCP client needs.
 *
 * MCP resolves `${env:...}` from Cursor's own environment, not from this
 * project's .env, so these have to live in your shell profile.
 */
import fs from "node:fs"

const KEYS = [
  "ORBITYPE_SQL_API_KEY",
  "ORBITYPE_S3_PUBLIC_API_KEY",
  "ORBITYPE_S3_PRIVATE_API_KEY",
]

function readEnvFile() {
  if (!fs.existsSync(".env")) return {}

  return Object.fromEntries(
    fs
      .readFileSync(".env", "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=")
        if (index === -1) return null
        return [
          line.slice(0, index).trim(),
          line
            .slice(index + 1)
            .trim()
            .replace(/^["']|["']$/g, ""),
        ]
      })
      .filter((entry) => entry !== null),
  )
}

const env = readEnvFile()

// The app reads ORBITYPE_API_SQL_KEY; MCP reads ORBITYPE_SQL_API_KEY. Same
// key, two consumers with different naming.
const fallbacks = { ORBITYPE_SQL_API_KEY: env["ORBITYPE_API_SQL_KEY"] }

console.log("# Add to ~/.zshrc (or your shell profile), then restart Cursor.")
console.log("# Reload afterwards via Cursor Settings -> Tools & MCP.\n")

for (const key of KEYS) {
  const value = env[key] ?? fallbacks[key] ?? ""
  if (value) {
    console.log(`export ${key}="${value}"`)
  } else {
    console.log(`# export ${key}="..."   # not set locally`)
  }
}
