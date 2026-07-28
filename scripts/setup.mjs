import fs from "node:fs"

// Keep this in sync with .env.example. The predecessor's setup script and its
// committed example disagreed, which made the first run fail for no reason.
const ENV_TEMPLATE = `HOST=localhost
PORT=4321

RENDER_MODE=server

# Mock mode ships enabled so the first \`pnpm dev\` works with no credentials.
ORBITYPE_MOCK=true

ORBITYPE_API_SQL_URL=https://core.orbitype.com/api/sql/v1
ORBITYPE_API_SQL_KEY=

REVALIDATE_SECRET=

MAIL_API_KEY=
MAIL_FROM_EMAIL=
MAIL_FROM_NAME=
MAIL_TO_EMAIL=

PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=My Site
PUBLIC_SITE_DESCRIPTION=Describe this site in one sentence.
PUBLIC_ORGANIZATION_NAME=My Organisation
PUBLIC_ORGANIZATION_LOGO=/favicon.svg
PUBLIC_OG_LOGO_PATH=/favicon.svg
PUBLIC_OG_IMAGE_ENABLED=true
PUBLIC_COMMENTS_ENABLED=false
PUBLIC_GTM_ID=
PUBLIC_TWITTER_SITE=
PUBLIC_TWITTER_CREATOR=
`

if (fs.existsSync(".env")) {
  console.log("• .env already exists, leaving it untouched")
} else {
  console.log("• creating .env")
  fs.writeFileSync(".env", ENV_TEMPLATE)
}

if (fs.existsSync(".cursor/mcp.json")) {
  console.log(
    "• MCP is committed (.cursor/mcp.json). Run `pnpm run mcp:env`, export the\n" +
      "  printed variables, then reload MCP in Cursor Settings → Tools & MCP",
  )
} else {
  console.log(
    "• hint: .cursor/mcp.json is missing — restore it from git so clones inherit MCP",
  )
}

console.log("• setup complete")
