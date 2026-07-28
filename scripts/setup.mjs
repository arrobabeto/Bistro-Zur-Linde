import fs from "node:fs"

if (fs.existsSync(".env")) {
  console.log("• .env already exists, leaving it untouched")
} else if (!fs.existsSync(".env.example")) {
  console.error("• FAIL  .env.example is missing — cannot create .env")
  process.exit(1)
} else {
  console.log("• creating .env from .env.example")
  fs.copyFileSync(".env.example", ".env")
}

if (fs.existsSync(".cursor/mcp.json")) {
  console.log(
    "• MCP is committed (.cursor/mcp.json). Run `pnpm run mcp:env`, then\n" +
      "  `pnpm run mcp:env -- --write-file /tmp/mcp-env.sh` if you need exports.",
  )
} else {
  console.log(
    "• hint: .cursor/mcp.json is missing — restore it from git so clones inherit MCP",
  )
}

console.log("• setup complete")
