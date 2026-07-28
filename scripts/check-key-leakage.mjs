/**
 * Fails the build if the Orbitype SQL key value appears in any client-served
 * artefact under dist/ or .vercel/output/static/.
 */
import fs from "node:fs"
import path from "node:path"

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

function loadKey() {
  if (process.env["ORBITYPE_API_SQL_KEY"]) {
    return process.env["ORBITYPE_API_SQL_KEY"]
  }
  if (!fs.existsSync(".env")) return ""
  const match = fs
    .readFileSync(".env", "utf8")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.startsWith("ORBITYPE_API_SQL_KEY="))
  if (!match) return ""
  return match.slice("ORBITYPE_API_SQL_KEY=".length).replace(/^["']|["']$/g, "")
}

const key = loadKey().trim()
if (!key || key.length < 8) {
  console.log("ok    no real SQL key configured — skipping leakage scan")
  process.exit(0)
}

const roots = ["dist", ".vercel/output/static"]
let hits = 0

for (const root of roots) {
  for (const file of walk(root)) {
    if (/\.(png|jpg|jpeg|gif|webp|woff2?|ico|map)$/i.test(file)) continue
    let content
    try {
      content = fs.readFileSync(file, "utf8")
    } catch {
      continue
    }
    if (content.includes(key)) {
      console.error(`FAIL  key found in ${file}`)
      hits += 1
    }
  }
}

if (hits > 0) {
  console.error(`\n${hits} leakage hit(s).`)
  process.exit(1)
}

console.log("ok    no SQL key leakage in build output")
