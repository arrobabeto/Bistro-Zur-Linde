#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const CURSOR = ".cursor/skills"
const AGENTS = ".agents/skills"

if (!fs.existsSync(AGENTS) || !fs.existsSync(CURSOR)) {
  console.error("FAIL  .agents/skills or .cursor/skills missing")
  process.exit(1)
}

const expected = fs
  .readdirSync(AGENTS)
  .filter((name) => fs.statSync(path.join(AGENTS, name)).isDirectory())

let failures = 0
for (const name of expected) {
  const link = path.join(CURSOR, name)
  let st
  try {
    st = fs.lstatSync(link)
  } catch {
    console.error(`FAIL  missing symlink ${link}`)
    failures += 1
    continue
  }
  if (!st.isSymbolicLink()) {
    console.error(`FAIL  ${link} is not a symlink`)
    failures += 1
    continue
  }
  try {
    fs.statSync(link) // follows link; throws if broken
  } catch {
    console.error(`FAIL  broken symlink ${link}`)
    failures += 1
  }
}

if (failures) process.exit(1)
console.log(`ok    ${expected.length} skill symlinks`)
