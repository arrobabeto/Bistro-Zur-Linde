#!/usr/bin/env node
/**
 * Soft-invalidate Astro CDN cache tags after a production deploy.
 *
 * Usage:
 *   PUBLIC_SITE_URL=https://www.bistrozurlinde.ch \
 *   REVALIDATE_SECRET=… \
 *   pnpm run cdn:revalidate
 *
 * Or pass an explicit site:
 *   node scripts/revalidate-cdn.mjs https://www.bistrozurlinde.ch
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function loadEnvFile() {
  const envPath = path.join(ROOT, ".env")
  if (!fs.existsSync(envPath)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const i = line.indexOf("=")
        return [
          line.slice(0, i).trim(),
          line
            .slice(i + 1)
            .trim()
            .replace(/^["']|["']$/g, ""),
        ]
      }),
  )
}

const fileEnv = loadEnvFile()
const siteArg = process.argv[2]
const site = (
  siteArg ||
  process.env.PUBLIC_SITE_URL ||
  fileEnv.PUBLIC_SITE_URL ||
  ""
).replace(/\/$/, "")
const secret = process.env.REVALIDATE_SECRET || fileEnv.REVALIDATE_SECRET || ""

const TAGS = ["cms", "pages", "posts", "page:home"]

if (!site || site.includes("localhost")) {
  console.error(
    "FAIL  set PUBLIC_SITE_URL (or pass the production URL) — refusing localhost",
  )
  process.exit(1)
}
if (!secret) {
  console.error("FAIL  REVALIDATE_SECRET is required")
  process.exit(1)
}

const url = `${site}/api/revalidate`
const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secret}`,
  },
  body: JSON.stringify({ tags: TAGS }),
})
const text = await response.text()
console.log(`HTTP ${response.status} ${url}`)
console.log(text)
if (!response.ok) process.exit(1)
