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

if (!fs.existsSync(".cursor/mcp.json")) {
  console.log(
    "• hint: copy .cursor/mcp.json.example to .cursor/mcp.json and add your keys,\n" +
      "  then run `pnpm run mcp:env` to print the shell exports Cursor needs",
  )
}

console.log("• setup complete")
