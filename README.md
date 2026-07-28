# Orbitype Astro Template

A production-ready, zero-JavaScript-by-default Astro starter for [Orbitype](https://www.orbitype.com)-powered websites. Pages are composed from CMS-authored JSON sections, SEO metadata is server-rendered, responses are CDN-cached with tag invalidation, and content is authored through an MCP workflow inside the editor.

Use it for landing pages, marketing sites, brochure sites and documentation sites — anywhere content dominates and interactivity is incidental.

> This template is an independent, Astro-based counterpart to a Nuxt/Vue Orbitype CMS template. It reimplements the same Orbitype content contract — the same `pages` / `posts` / `settings` schema and the same `sections` JSON convention — on a zero-JavaScript-by-default stack. Content authored for one can be rendered by the other.

---

## Quick start

```bash
corepack enable
pnpm install
pnpm run setup
pnpm dev
```

Open `http://localhost:4321`. No credentials are needed — the template starts in mock mode and serves built-in content until you connect a CMS.

Note the explicit `run` in `pnpm run setup`. `pnpm setup` is a built-in pnpm command and will not run the project script.

## Requirements

- Node `>=22.12.0`. Only even-numbered majors are supported — Astro does not support 23, 25, and so on.
- pnpm 11, via `corepack enable`.

## Scripts

| Script                  | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `pnpm dev`              | Dev server on port 4321                               |
| `pnpm run build`        | Production build through the Vercel adapter           |
| `pnpm preview`          | Serve the production build locally                    |
| `pnpm run setup`        | Create `.env`, sync Astro types, install the git hook |
| `pnpm run lint`         | ESLint, zero warnings tolerated                       |
| `pnpm run typecheck`    | `astro check`                                         |
| `pnpm run format`       | Prettier                                              |
| `pnpm run verify`       | Lint, typecheck and end-to-end tests                  |
| `pnpm run mcp:env`      | Print the shell exports Cursor's MCP client needs     |
| `pnpm run mcp:verify`   | Check Orbitype MCP wiring and probe the SQL API       |
| `pnpm run figma:verify` | Check Figma MCP wiring                                |

## Documentation

Start with the blueprint. It is the source of truth for architecture, the Orbitype contract, and the build plan.

| Document                                                       | Contents                                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [docs/00-TEMPLATE-BLUEPRINT.md](docs/00-TEMPLATE-BLUEPRINT.md) | Architecture, requirements, the Orbitype contract, the phased build plan |
| [docs/DEVIATIONS.md](docs/DEVIATIONS.md)                       | Every departure from the original plan, with reasons and evidence        |
| `docs/adr/`                                                    | Architecture decision records                                            |

§8 of the blueprint is normative and self-contained: schema DDL, the sections contract, the real API error shapes, and canonical SQL. Read it before touching CMS data.

## Configuring a project

1. Set `name` in `package.json`.
2. Replace `public/favicon.svg` and add `public/og-default.jpg`.
3. Fill in the `PUBLIC_*` variables in `.env`.
4. Create an Orbitype SQL connector and API key at [app.orbitype.com](https://app.orbitype.com/settings/api-keys), set `ORBITYPE_API_SQL_KEY`, and set `ORBITYPE_MOCK=false`.
5. Run the schema installer from the welcome screen, then the seeder.
6. Copy `.cursor/mcp.json.example` to `.cursor/mcp.json`, add your keys, and reload MCP in Cursor.
7. Set design tokens in `src/styles/global.css`.
8. Change the site language in `src/config/locales.ts`.

The full checklist is in blueprint §13.4.

## Rendering modes

`RENDER_MODE=server` (the default) renders on demand and caches at the CDN, so an edit goes live within the route's TTL — or immediately, when an Orbitype Workflow calls `/api/revalidate`.

`RENDER_MODE=static` prerenders everything at build time. Content changes then require a rebuild, which suits campaign sites driven by a deploy hook.

Caching is inert under `astro dev`. To observe it, run `pnpm run build && pnpm preview`, or deploy.

## Migrating a `.env` from the Nuxt template

| Nuxt template                    | This template                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`           | `PUBLIC_SITE_URL`                                                                                 |
| `NUXT_PUBLIC_SITE_NAME`          | `PUBLIC_SITE_NAME`                                                                                |
| `NUXT_PUBLIC_SITE_DESCRIPTION`   | `PUBLIC_SITE_DESCRIPTION`                                                                         |
| `NUXT_PUBLIC_ORGANIZATION_NAME`  | `PUBLIC_ORGANIZATION_NAME`                                                                        |
| `NUXT_PUBLIC_ORGANIZATION_LOGO`  | `PUBLIC_ORGANIZATION_LOGO`                                                                        |
| `NUXT_PUBLIC_OG_LOGO_PATH`       | `PUBLIC_OG_LOGO_PATH`                                                                             |
| `NUXT_PUBLIC_OG_IMAGE_ENABLED`   | `PUBLIC_OG_IMAGE_ENABLED`                                                                         |
| `NUXT_PUBLIC_COMMENTS_ENABLED`   | `PUBLIC_COMMENTS_ENABLED`                                                                         |
| `NUXT_PUBLIC_GTM_ID`             | `PUBLIC_GTM_ID`                                                                                   |
| `NUXT_PUBLIC_TWITTER_SITE`       | `PUBLIC_TWITTER_SITE`                                                                             |
| `NUXT_PUBLIC_TWITTER_CREATOR`    | `PUBLIC_TWITTER_CREATOR`                                                                          |
| `NUXT_PUBLIC_SITE_LOCALE`        | not an env var — see `src/config/locales.ts`                                                      |
| `ORBITYPE_*`                     | unchanged                                                                                         |
| provider-specific mail variables | `MAIL_*`                                                                                          |
| `ISR_*`                          | no equivalent — caching is configured in `astro.config.ts`, invalidation uses `REVALIDATE_SECRET` |

## Build status

Phases 0–9 are implemented in this repository. Phase 10 (Vercel CDN hit + Orbitype Workflow) needs your Vercel project — follow [docs/03-deployment.md](docs/03-deployment.md).

## MCP

`.cursor/mcp.json` is committed with `${env:...}` placeholders. After clone:

```bash
pnpm run mcp:env   # print export lines
# add ORBITYPE_SQL_API_KEY to ~/.zshrc, restart Cursor, reload MCP
pnpm run mcp:verify
```

Figma MCP is optional per project; `pnpm run figma:verify` is shipped unused until you add tokens.

## License

Proprietary.
