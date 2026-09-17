#!/usr/bin/env node
/**
 * Fail if src/middleware.ts is missing or no longer disables HTML + API cache.
 */
import fs from "node:fs"

const PATH = "src/middleware.ts"
if (!fs.existsSync(PATH)) {
  console.error(
    "FAIL  src/middleware.ts is missing — HTML/APIs would be cacheable",
  )
  process.exit(1)
}

const content = fs.readFileSync(PATH, "utf8")
if (!content.includes("cache.set(false)")) {
  console.error("FAIL  middleware does not disable the Astro cache provider")
  process.exit(1)
}
if (!content.includes("no-store")) {
  console.error("FAIL  middleware does not set no-store")
  process.exit(1)
}

console.log("ok    middleware HTML + API no-store guards present")
