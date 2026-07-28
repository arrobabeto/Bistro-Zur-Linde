#!/usr/bin/env node
/**
 * Asset budget for public/.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = "public"
const MAX_IMAGE_BYTES = 1_500_000 // 1.5 MB
const MAX_VIDEO_BYTES = 8_000_000 // 8 MB
const MAX_TOTAL_BYTES = 30_000_000 // 30 MB

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

let total = 0
let failures = 0

for (const file of walk(ROOT)) {
  const size = fs.statSync(file).size
  total += size
  if (/\.(png|jpe?g|webp|gif|avif)$/i.test(file) && size > MAX_IMAGE_BYTES) {
    console.error(
      `FAIL  image too large (${size} bytes > ${MAX_IMAGE_BYTES}): ${file}`,
    )
    failures += 1
  }
  if (/\.(mp4|webm|mov)$/i.test(file) && size > MAX_VIDEO_BYTES) {
    console.error(
      `FAIL  video too large (${size} bytes > ${MAX_VIDEO_BYTES}): ${file}`,
    )
    failures += 1
  }
}

if (total > MAX_TOTAL_BYTES) {
  console.error(`FAIL  public/ total ${total} bytes > ${MAX_TOTAL_BYTES}`)
  failures += 1
}

if (failures) process.exit(1)
console.log(`ok    asset budget (public/ ${total} bytes)`)
