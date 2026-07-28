# Orbitype Astro Template

A zero-JavaScript-by-default Astro starter for [Orbitype](https://www.orbitype.com)-powered websites. Pages are composed from CMS-authored JSON sections, SEO is server-rendered, and CDN caching uses native Astro/`@astrojs/vercel` tags.

Use it for landing pages, marketing sites, brochure sites and documentation sites — anywhere content dominates and interactivity is incidental.

> Independent Astro counterpart to a Nuxt/Vue Orbitype CMS template. Same `pages` / `posts` / `settings` schema and `sections` JSON convention.

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

Do not describe an incomplete row as production-ready for a client launch.

---

## Quick start

```bash
corepack enable
pnpm install
pnpm run setup
pnpm dev
```

Open `http://localhost:4321`. No credentials are needed — the template starts in **mock mode** and serves **built-in content** until you connect a CMS.

Note the explicit `run` in `pnpm run setup`. `pnpm setup` is a built-in pnpm command and will not run the project script.

For a **client project** cloned from this template, also run `pnpm run bootstrap` (package name, locale, favicon, `template.lock.json`).

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
| `pnpm run bootstrap`    | Clone checklist for a real project                     |
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

## Configuring a project

1. `pnpm run bootstrap` (or manually set `name` in `package.json`).
2. Replace `public/favicon.svg` (bootstrap fails if the template hash remains).
3. Fill in the `PUBLIC_*` variables in `.env` — production must use `https://`, never localhost.
4. Create an Orbitype SQL connector key; set `ORBITYPE_API_SQL_KEY`; set `ORBITYPE_MOCK=false`.
5. Run `pnpm run cms:install` then `pnpm run cms:seed` from an authorized machine (**never** via HTTP).
6. Export authoring keys for Cursor MCP (`pnpm run mcp:env -- --write-file …`), reload MCP.
7. Set design tokens in `src/styles/global.css`.
8. Confirm locale in `src/config/locales.ts`.

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
