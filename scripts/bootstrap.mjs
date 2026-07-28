#!/usr/bin/env node
/**
 * Interactive bootstrap for a project cloned from this template.
 * Refuses to leave template defaults (package name, favicon, locale unset, etc.).
 */
import fs from "node:fs"
import crypto from "node:crypto"
import readline from "node:readline"
import { execSync } from "node:child_process"

const TEMPLATE_FAVICON_SHA256 =
  "e8c6650ea0a8d35c82218c456a44f5a82211f4894a5c4f41a0d4fd1c7b89a41e"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

function sha256File(path) {
  if (!fs.existsSync(path)) return null
  return crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex")
}

async function main() {
  console.log("Bootstrap — clone checklist for a real project\n")

  const name = (
    await ask("package.json name (not orbitype-astro-template): ")
  ).trim()
  if (!name || name === "orbitype-astro-template") {
    console.error("FAIL  choose a project-specific package name")
    process.exit(1)
  }

  const domain = (await ask("Production domain (https://…): ")).trim()
  if (!domain.startsWith("https://")) {
    console.error("FAIL  domain must be an https:// URL")
    process.exit(1)
  }

  const locale = (await ask("Default locale (e.g. en, es): ")).trim()
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
    console.error("FAIL  locale looks invalid")
    process.exit(1)
  }

  const owner = (await ask("Owner / team: ")).trim()
  if (!owner) {
    console.error("FAIL  owner is required")
    process.exit(1)
  }

  const productionBranch =
    (await ask("Production branch [main]: ")).trim() || "main"

  const connector = (await ask("Orbitype connector id (optional): ")).trim()

  const faviconHash = sha256File("public/favicon.svg")
  if (faviconHash === TEMPLATE_FAVICON_SHA256) {
    console.error(
      "FAIL  public/favicon.svg still matches the template hash. Replace it before bootstrap completes.",
    )
    process.exit(1)
  }

  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
  pkg.name = name
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n")

  let localesSrc = fs.readFileSync("src/config/locales.ts", "utf8")
  localesSrc = localesSrc.replace(
    /export const LOCALES = \[[^\]]*\] as const/,
    `export const LOCALES = ["${locale}"] as const`,
  )
  localesSrc = localesSrc.replace(
    /export const DEFAULT_LOCALE: Locale = "[^"]+"/,
    `export const DEFAULT_LOCALE: Locale = "${locale}"`,
  )
  fs.writeFileSync("src/config/locales.ts", localesSrc)

  if (fs.existsSync(".env")) {
    let env = fs.readFileSync(".env", "utf8")
    env = env.replace(/^PUBLIC_SITE_URL=.*$/m, `PUBLIC_SITE_URL=${domain}`)
    fs.writeFileSync(".env", env)
  }

  let commit = null
  try {
    commit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim()
  } catch {
    // leave null when not in a git checkout
  }

  const lock = {
    repository: "arrobabeto/orbitype-astro-template",
    version: pkg.version ?? "0.1.0",
    commit,
    createdAt: new Date().toISOString(),
    owner,
    productionBranch,
    connectorId: connector || null,
    domain,
    locale,
  }
  fs.writeFileSync("template.lock.json", JSON.stringify(lock, null, 2) + "\n")

  console.log(
    "\nok    bootstrap wrote package name, locale, template.lock.json",
  )
  console.log("      Next: pnpm run cms:install && pnpm run cms:seed")
  rl.close()
}

main().catch((error) => {
  console.error(error)
  rl.close()
  process.exit(1)
})
