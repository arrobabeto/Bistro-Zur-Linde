# Bistro Zur Linde

Marketing website for **Bistro Zur Linde**. Built with Astro 7, content from [Orbitype](https://www.orbitype.com), and deployed on Vercel. Pages are composed from CMS-authored JSON sections; SEO is server-rendered; CDN caching uses native Astro / `@astrojs/vercel` tags.

Package name: `bistro-zur`. Set `PUBLIC_SITE_NAME` to `Bistro Zur Linde` (and a real `PUBLIC_SITE_DESCRIPTION`) in `.env`.

This site is based on the original [Orbitype](https://www.orbitype.com) Astro template, adapted by [@arrobabeto](https://github.com/arrobabeto).

---

## Feature status

| Feature                                | Status                                                     |
| -------------------------------------- | ---------------------------------------------------------- |
| CMS catch-all router `[...slug].astro` | Ready                                                      |
| Mock mode + seed content               | Ready                                                      |
| Schema install / seed                  | Ready — **CLI only** (`pnpm run cms:install` / `cms:seed`) |
| `RENDER_MODE=server`                   | Ready                                                      |
| `RENDER_MODE=static`                   | Ready (pages prerendered; `/api/**` remain serverless)     |
| E2E without live Orbitype keys         | Ready                                                      |
| Contact form + email provider          | Stub — wire `EmailProvider` before launch                  |
| CDN cache HIT verification             | Needs a Vercel project                                     |
| Orbitype Workflow → `/api/revalidate`  | Code ready; Workflow not verified end-to-end               |
| CI (GitHub Actions)                    | See `.github/workflows/ci.yml`                             |

Do not describe an incomplete row as production-ready.

---

## Quick start

```bash
corepack enable
pnpm install
pnpm run setup
pnpm dev
```

Open `http://localhost:4321`. With `ORBITYPE_MOCK=true` (default in `.env.example`) the site serves built-in seed content and makes no CMS network calls.

Use `pnpm run setup`, not `pnpm setup` — the latter is a built-in pnpm command.

## Requirements

- Node **24.x** (see `.nvmrc` / `.node-version` / `engines`). Pin the same major in Vercel Project Settings.
- pnpm 11, via `corepack enable`.

## Scripts

| Script                  | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `pnpm dev`              | Dev server on port 4321                                |
| `pnpm run build`        | Production build (current `RENDER_MODE`)               |
| `pnpm run build:server` | Server build; fails on unexpected warnings             |
| `pnpm run build:static` | Static prerender build                                 |
| `pnpm run setup`        | Create `.env` from `.env.example`, sync types, husky   |
| `pnpm run cms:install`  | Install CMS schema (CLI, confirms connector)           |
| `pnpm run cms:migrate`  | Additive migrations                                    |
| `pnpm run cms:seed`     | Seed starter rows                                      |
| `pnpm run lint`         | ESLint, zero warnings                                  |
| `pnpm run typecheck`    | `astro check`                                          |
| `pnpm run verify`       | Lint, typecheck, leakage, e2e, both builds (mock)      |
| `pnpm run mcp:env`      | Show whether MCP env vars are present (no secret dump) |
| `pnpm run mcp:verify`   | Check Orbitype MCP wiring                              |
| `pnpm run figma:verify` | Check Figma REST connection                            |

There is **no** `astro preview` script: `@astrojs/vercel` does not support it. Use `pnpm dev` locally, or a Vercel preview deployment for CDN behaviour.

## Documentation

| Document                                                       | Contents                                     |
| -------------------------------------------------------------- | -------------------------------------------- |
| [docs/00-TEMPLATE-BLUEPRINT.md](docs/00-TEMPLATE-BLUEPRINT.md) | Architecture and Orbitype contract           |
| [docs/01-orbitype-cms.md](docs/01-orbitype-cms.md)             | Operator CMS guide                           |
| [docs/03-deployment.md](docs/03-deployment.md)                 | Vercel, render modes, revalidate             |
| [docs/preview-promote.md](docs/preview-promote.md)             | Preview checks → promote → rollback          |
| [docs/vercel-linking.md](docs/vercel-linking.md)               | Linking Vercel without committing `.vercel/` |
| [docs/DEVIATIONS.md](docs/DEVIATIONS.md)                       | Verified departures                          |
| `docs/adr/`                                                    | Architecture decision records                |

## Environment

1. Copy `.env.example` via `pnpm run setup` if `.env` is missing.
2. Set `PUBLIC_SITE_URL` (production must use `https://`, never localhost), `PUBLIC_SITE_NAME=Bistro Zur Linde`, and `PUBLIC_SITE_DESCRIPTION`.
3. Create an Orbitype SQL connector key; set `ORBITYPE_API_SQL_KEY`; set `ORBITYPE_MOCK=false` when talking to the live CMS.
4. Run `pnpm run cms:install` then `pnpm run cms:seed` from an authorized machine (**never** via HTTP).
5. Export authoring keys for Cursor MCP (`pnpm run mcp:env -- --write-file …`), reload MCP.
6. Design tokens live in `src/styles/global.css`. Locale is `en` in `src/config/locales.ts`.

## Rendering modes

`RENDER_MODE=server` (default) renders on demand and caches at the CDN.

`RENDER_MODE=static` prerenders CMS pages at build time. API routes under `src/pages/api/` still deploy as serverless functions. Content changes need a rebuild (or keep server mode + revalidate).

Caching is inert under `astro dev`. Observe CDN behaviour on a Vercel preview/production deployment — not via `astro preview`.

## MCP and agents

- Cursor: `.cursor/mcp.json` + `.cursor/rules` + `.cursor/skills` (symlinks into `.agents/skills`).
- Codex / ChatGPT desktop: `AGENTS.md` + `.agents/skills`.
- ChatGPT web needs a platform connector/plugin — a local `.env` alone is not enough.

## License

Proprietary.
