#!/usr/bin/env node
/**
 * Ensures package.json engines.node, .nvmrc, and .node-version agree on a major.
 */
import fs from "node:fs"

function readTrim(path) {
  if (!fs.existsSync(path)) return null
  return fs.readFileSync(path, "utf8").trim()
}

function majorFromEngines(enginesNode) {
  const match = String(enginesNode).match(/(\d+)/)
  return match ? match[1] : null
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
const enginesMajor = majorFromEngines(pkg.engines?.node)
const nvmrc = readTrim(".nvmrc")
const nodeVersion = readTrim(".node-version")

const errors = []
if (!enginesMajor)
  errors.push("package.json engines.node missing or unparseable")
if (!nvmrc) errors.push(".nvmrc missing")
if (!nodeVersion) errors.push(".node-version missing")

if (enginesMajor && nvmrc && enginesMajor !== nvmrc.replace(/^v/, "")) {
  errors.push(`engines.node major ${enginesMajor} !== .nvmrc ${nvmrc}`)
}
if (
  enginesMajor &&
  nodeVersion &&
  enginesMajor !== nodeVersion.replace(/^v/, "")
) {
  errors.push(
    `engines.node major ${enginesMajor} !== .node-version ${nodeVersion}`,
  )
}
if (nvmrc && nodeVersion && nvmrc !== nodeVersion) {
  errors.push(`.nvmrc (${nvmrc}) !== .node-version (${nodeVersion})`)
}

if (errors.length) {
  for (const e of errors) console.error(`FAIL  ${e}`)
  process.exit(1)
}

console.log(`ok    Node pin consistent at major ${enginesMajor}`)
