/**
 * Checks that Figma MCP wiring works before you rely on it in a design session.
 *
 * Figma MCP is configured at the Cursor level, so this repository commits no
 * Figma server entry. This script only verifies that a token is exported and
 * that Figma accepts it.
 */
const token = process.env["FIGMA_API_KEY"]
const fileKey = process.env["FIGMA_FILE_KEY"]

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

console.log("\nFigma MCP configuration\n")

if (!token) {
  fail("FIGMA_API_KEY is not exported — add it to your shell profile")
} else {
  pass("FIGMA_API_KEY is exported")

  try {
    const response = await fetch("https://api.figma.com/v1/me", {
      headers: { "X-Figma-Token": token },
    })

    if (response.ok) {
      const me = await response.json()
      pass(`authenticated as ${me.email ?? me.handle ?? "unknown user"}`)
    } else {
      fail(`Figma API responded ${response.status}`)
    }
  } catch (error) {
    fail(`Figma API request failed: ${error.message}`)
  }
}

if (!fileKey) {
  warn("FIGMA_FILE_KEY is not set — optional, but handy as a default target")
} else {
  pass(`FIGMA_FILE_KEY is set (${fileKey})`)
}

console.log(
  failures === 0
    ? "\nAll checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
)

process.exit(failures === 0 ? 0 : 1)
