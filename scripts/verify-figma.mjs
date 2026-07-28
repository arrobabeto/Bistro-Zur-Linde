#!/usr/bin/env node
/**
 * Verify Figma REST credentials (not MCP).
 */
import { loadEnvFile, env } from "./lib/env.mjs"

loadEnvFile()

const token = env("FIGMA_API_KEY")
const fileKey = env("FIGMA_FILE_KEY")
const expectedName = env("FIGMA_EXPECTED_FILE_NAME")
const expectedEmail = env("FIGMA_EXPECTED_ACCOUNT_EMAIL")

if (!token) {
  console.error("FAIL  FIGMA_API_KEY missing (shell or .env)")
  process.exit(1)
}

const meRes = await fetch("https://api.figma.com/v1/me", {
  headers: { "X-Figma-Token": token },
})
if (!meRes.ok) {
  console.error(`FAIL  /v1/me → HTTP ${meRes.status}`)
  process.exit(1)
}
const me = await meRes.json()
console.log(`ok    Figma account: ${me.email ?? me.handle ?? "(unknown)"}`)

if (expectedEmail && me.email && me.email !== expectedEmail) {
  console.error(
    `FAIL  account email ${me.email} !== FIGMA_EXPECTED_ACCOUNT_EMAIL`,
  )
  process.exit(1)
}

if (!fileKey) {
  console.warn("WARN  FIGMA_FILE_KEY unset — skipping file check")
  process.exit(0)
}

const fileRes = await fetch(
  `https://api.figma.com/v1/files/${fileKey}?depth=1`,
  {
    headers: { "X-Figma-Token": token },
  },
)
if (!fileRes.ok) {
  console.error(`FAIL  /v1/files/${fileKey} → HTTP ${fileRes.status}`)
  process.exit(1)
}
const file = await fileRes.json()
console.log(`ok    Figma file: ${file.name}`)

if (expectedName && file.name !== expectedName) {
  console.error(`FAIL  file name "${file.name}" !== FIGMA_EXPECTED_FILE_NAME`)
  process.exit(1)
}

console.log("ok    Figma REST connection")
