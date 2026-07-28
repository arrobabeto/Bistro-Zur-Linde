#!/usr/bin/env node
/**
 * Runs a build command and fails on unexpected stderr/stdout warnings.
 * Allowlist is intentionally tiny — only known Astro hybrid-mode noise.
 */
import { spawnSync } from "node:child_process"

const mode = process.argv[2] === "static" ? "static" : "server"
const env = {
  ...process.env,
  RENDER_MODE: mode,
}

const ALLOWED = [
  // Astro still detects the getStaticPaths binding in hybrid modules even
  // when the runtime value is undefined under output: "server".
  /getStaticPaths\(\) ignored in dynamic page/,
]

const result = spawnSync("pnpm", ["exec", "astro", "build"], {
  env,
  encoding: "utf8",
  shell: false,
})

const combined = `${result.stdout ?? ""}\n${result.stderr ?? ""}`
process.stdout.write(result.stdout ?? "")
process.stderr.write(result.stderr ?? "")

if (result.status !== 0 && result.status !== null) {
  process.exit(result.status)
}

const warningLines = combined
  .split("\n")
  .filter((line) => /\[WARN\]|warning:/i.test(line))

const unexpected = warningLines.filter(
  (line) => !ALLOWED.some((re) => re.test(line)),
)

if (unexpected.length > 0) {
  console.error("\nUnexpected build warnings:")
  for (const line of unexpected) console.error(`  ${line}`)
  process.exit(1)
}

console.log(`\nok    build:${mode} completed with only allowlisted warnings`)
