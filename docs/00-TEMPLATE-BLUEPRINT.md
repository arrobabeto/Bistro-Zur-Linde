# Orbitype Astro Template — Build Blueprint & Source of Truth

**Document status:** Authoritative. First document of the project.
**Audience:** Human maintainers and AI build agents.
**Scope:** Everything required to create a fully operational, deployable repository from zero.
**Last revised:** 2026-07-27, after the §6.2 verification gate completed.

> **Read this first.** This document has been revised against live package registry data, current Astro 7 documentation, the Orbitype API, and a predecessor-stack implementation. The revision corrected four defects that would have broken the build. Where this document now contradicts an earlier draft, this version wins. Every change is recorded in [DEVIATIONS.md](DEVIATIONS.md).

---

## Table of contents

1. How to use this document
2. Provenance, attribution and de-branding
3. Product definition
4. Scope and non-goals
5. Requirements
6. Technology stack and version verification gate
7. Architecture
8. The Orbitype contract
9. Repository structure
10. Configuration files
11. Implementation specification
12. Section component catalogue
13. Installation and setup flow
14. Environment variables reference
15. MCP configuration
16. Developer workflow (Figma → Cursor → Orbitype)
17. Testing specification
18. Deployment specification
19. Architecture Decision Records
20. Cursor rules to author
21. Phased build plan with acceptance criteria
22. Definition of done
23. Known risks, open questions and owner decisions
24. References

---

## 1. How to use this document

This is the single source of truth for building the template. It is written to be executed, not skimmed.

**If you are an AI agent building this repository:**

- Read this document end to end before writing any file.
- Execute §21 (Phased build plan) in order. Do not skip phases. Each phase has acceptance criteria that must pass before you move on.
- §8 is **normative and self-contained**. It is the sole authority on Orbitype behaviour, schema and conventions. There is no external reference repository to consult — if §8 does not answer your question, verify against the official Orbitype documentation (§24) or a live connector, then record what you learned in [DEVIATIONS.md](DEVIATIONS.md).
- Code in §10–§12 is a specification. Where a pinned package's actual API differs from what is written here, the current official documentation wins — and you must record the deviation.
- Never invent Orbitype API behaviour.

**If you are a human maintainer:** §3, §4, §7, §13, §19 and §23.1 are the parts you will reread. The rest is build detail.

---

## 2. Provenance, attribution and de-branding

### 2.1 Relationship to the predecessor template

This template is a **conceptual fork** of a Nuxt/Vue Orbitype CMS template.

"Conceptual fork" means:

- **Not** a git fork. This repository starts with a fresh, empty git history. No commits, authors or history are inherited.
- The **CMS data contract is preserved**: the same Postgres table shapes, the same `sections` JSON convention, the same `_orbi.component` binding rule, the same localized-field format. An Orbitype project provisioned for the predecessor can be pointed at a site built from this template without data migration.
- The **authoring workflow is preserved exactly**: Figma → Figma MCP → build section components in Cursor → publish `sections` JSON via Orbitype MCP → content operations in the Orbitype app.
- The **runtime is entirely new**: Astro instead of Nuxt, `.astro` components instead of Vue SFCs, no client-side UI framework at all.

The `README.md` states this relationship in one short paragraph:

> This template is an independent, Astro-based counterpart to a Nuxt/Vue Orbitype CMS template. It reimplements the same Orbitype content contract — the same `pages` / `posts` / `settings` schema and the same `sections` JSON convention — on a zero-JavaScript-by-default stack. Content authored for one can be rendered by the other.

### 2.2 Attribution rules

- **Author / owner:** the organisation that owns this repository. `package.json` gets no `author` field pointing at any individual, and no third-party company is credited as author or copyright holder.
- **No individual contributor from the predecessor is credited as author.** That history is not inherited and no such name may appear anywhere in this repository — not in `package.json`, `LICENSE`, `README.md`, code comments, or commit metadata.
- **No third-party company copyright.** The footer copyright is driven entirely by the `PUBLIC_SITE_NAME` environment variable, so each deployment shows its own owner.
- `license` stays `proprietary` in `package.json` unless the owner decides otherwise. If a `LICENSE` file is added, it names the owning organisation only.

### 2.3 De-branding and neutrality checklist

Every item below must hold true in this repository.

| Requirement              | Rule                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Footer copyright         | `© {currentYear} {PUBLIC_SITE_NAME}`, fully env-driven. Never a hardcoded company name.                                                                                                          |
| Default OG logo          | `PUBLIC_OG_LOGO_PATH`, defaulting to the local `/favicon.svg`. Never a third-party hosted asset.                                                                                                 |
| Default OG title         | `PUBLIC_SITE_NAME`. Never a hardcoded product name.                                                                                                                                              |
| Vercel team links        | The owning organisation's team, or omitted entirely.                                                                                                                                             |
| Package name             | `orbitype-astro-template`.                                                                                                                                                                       |
| Logo assets in `public/` | Only the owner's favicon and OG fallback. No third-party logos.                                                                                                                                  |
| **Client neutrality**    | **No client, project or site name may appear anywhere in this repository.** This template is cloned for each new project, so any client name embedded here would propagate to unrelated clients. |

**Scope of the client-neutrality rule.** It binds _this template repository only_. A clone made for a real project is expected to carry that project's name, branding and content — that is the point of cloning. The rule exists so the template itself stays a clean starting point. Phase 9 enforces it with a repository-wide grep.

### 2.4 What is NOT a watermark — keep these

These references to Orbitype are **functional** and must be preserved. Removing them breaks the product.

- The SQL API endpoint `https://core.orbitype.com/api/sql/v1`.
- The S3 API endpoint `https://core.orbitype.com/api/s3/v1`.
- The MCP endpoint `https://core.orbitype.com/api/mcp/v1`.
- The API-key management deep link `https://app.orbitype.com/settings/api-keys`, shown in the welcome screen and in error messages. Operators need it.
- Links to the official Orbitype documentation.
- The name "Orbitype" used descriptively — as the CMS this template integrates with, in the repository name, README, rules and ADRs. That is accurate description, not misattributed authorship.

### 2.5 Documentation removal rule

No documentation, rule, ADR, comment or example in this repository may describe the Nuxt/Vue stack as if it were this repository's stack. Specifically, the following must not appear as instructions:

- Nuxt, Nitro, Vue, `server/api/*.get.ts`, `defineEventHandler`, `$fetch`, `ofetch`, `useSeoMeta`, `useHead`, `useI18n`, `useTranslate()` as an ambient composable, `defineProps`, `defineOptions`, `<script setup>`, `AnySection.vue`, `pages/[[slug]].vue`, `@nuxtjs/i18n`, `@nuxt/image`, `@nuxtjs/tailwindcss`.
- `.vue` filenames in `_orbi.component` examples.

The only permitted mentions of the Nuxt stack are: the provenance paragraph in §2.1 and the README, ADR-0001, and §2.5 itself.

---

## 3. Product definition

### 3.1 One-line description

A production-ready, zero-JavaScript-by-default Astro starter for Orbitype-powered websites, with section-driven pages composed from CMS JSON, server-rendered SEO metadata, CDN-cached rendering with tag invalidation, and an MCP-based authoring workflow.

### 3.2 What problem it solves

A Nuxt/Vue Orbitype template is well suited to application-like sites with meaningful client-side interactivity. It is heavier than necessary for the most common engagement: a landing page, a small marketing site, or a brochure site where 90% of the payload is static content. That project type pays for a client-side framework runtime it never uses.

This template targets exactly that project type. It keeps the entire Orbitype authoring experience — the same CMS, the same MCP tooling, the same Figma-to-section workflow — while shipping HTML and CSS with no framework runtime.

### 3.3 Target project profile

Use this template when:

- The deliverable is a landing page, marketing site, brochure site, campaign microsite or documentation site.
- Content is authored and maintained in Orbitype by non-developers.
- Interactivity is limited to navigation, forms, accordions, lightboxes and similar discrete widgets.
- Lighthouse / Core Web Vitals performance is an explicit requirement or selling point.

Use the Nuxt/Vue template instead when:

- The site has app-like state: dashboards, authenticated areas, multi-step flows, live filtering over large datasets, real-time updates.
- Scroll-driven or timeline animation is central to the design.
- The team needs a reactive component model across most of the page tree.

---

## 4. Scope and non-goals

### 4.1 In scope

1. Orbitype SQL API client, server-only, framework-independent.
2. Section-driven page rendering: CMS `sections` JSON array → `.astro` components, resolved by filename.
3. `pages`, `posts`, `settings`, `contacts` and `templates` table support.
4. Schema installer that creates the `uid()` function and the CMS tables from the running site, idempotently.
5. Schema migration action for evolving tables after launch.
6. Seed system: one definition of starter content serving mock mode, the welcome fallback, and a seed endpoint.
7. Welcome / onboarding fallback served whenever the CMS is unreachable, unconfigured, mocked, or empty.
8. Locale-list-driven i18n, shipping single-locale, with localized CMS fields.
9. Full SEO: title, description, keywords, canonical, hreflang, Open Graph, Twitter cards, JSON-LD.
10. Dynamic OG image generation.
11. `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`.
12. Contact form endpoint with pluggable transactional email and best-effort persistence to Orbitype.
13. Optional comments on posts, behind a feature flag.
14. CDN-cached rendering with tag-based invalidation, plus an authenticated revalidation endpoint driven by an Orbitype Workflow.
15. Mock mode for credential-free local development and CI.
16. Quality gates: ESLint, Prettier, type checking, Playwright smoke tests, Husky pre-commit hook.
17. Vercel deployment configuration.
18. Complete Cursor rule set and ADR set.
19. MCP and Figma wiring verification scripts.

### 4.2 Explicit non-goals

1. **No client-side UI framework.** No Vue, React, Svelte, Solid, Preact, Alpine. Interactivity is vanilla TypeScript in `<script>` tags, progressively enhanced. Hard constraint, recorded as ADR-0003.
2. **No CMS preview mode.** Orbitype has no draft, preview or versioning feature (verified — see §23 R-03). This template does not invent one.
3. **No design system or component library.** Sections are built per project from Figma. The template ships a minimal starter set only.
4. **No blog authoring pipeline.** `posts` come from the CMS. File-based content collections are optional per project.
5. **No scroll-animation framework.** No GSAP, no ScrollTrigger.
6. **No i18n message catalogue library.** Chrome strings live in a typed `phrases` object; content strings live in the CMS as localized objects.
7. **No authentication or user accounts.**
8. **No analytics beyond an optional GTM container id.**

---

## 5. Requirements

### 5.1 Functional requirements

| ID    | Requirement                                                                                                                                                                                                                                                                       |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | A request to `/<slug>` renders the `pages` row whose `slug` matches, composing its `sections` array in order.                                                                                                                                                                     |
| FR-02 | A request to `/` renders the page with slug `home`.                                                                                                                                                                                                                               |
| FR-03 | Locale resolution is driven by the configured locale list. With a single locale there is no URL prefix. When more than one locale is configured, `/<locale>/<slug>` resolves the same row with localized fields resolved to that locale, and the default locale stays unprefixed. |
| FR-04 | Each section object is rendered by the `.astro` component whose filename matches `_orbi.component`.                                                                                                                                                                               |
| FR-05 | All keys of a section object except `_orbi` are passed to the component as props.                                                                                                                                                                                                 |
| FR-06 | An unresolvable `_orbi.component` renders a visible debug panel showing the requested name, the payload, and the list of known section names. It never throws and never renders blank.                                                                                            |
| FR-07 | A slug with no matching row returns HTTP 404 with a styled error page. **This must hold in mock mode too** — the seed lookup returns `null` for unknown slugs rather than falling back to the welcome page.                                                                       |
| FR-08 | When `ORBITYPE_MOCK` is truthy, all CMS reads return built-in seed content without any network call.                                                                                                                                                                              |
| FR-09 | When the SQL URL or key is missing, unset, or a placeholder value, CMS reads fall back to seed content rather than erroring.                                                                                                                                                      |
| FR-10 | When the SQL API errors or returns zero rows, CMS reads fall back to seed content, and the `home` slug falls back to the welcome page.                                                                                                                                            |
| FR-11 | The welcome page explains setup step by step and links to Orbitype API-key settings.                                                                                                                                                                                              |
| FR-12 | When a valid SQL key is present, the welcome page exposes an installer that creates the `uid()` function and all CMS tables idempotently, and a seeder that populates starter content.                                                                                            |
| FR-13 | `/posts` lists published posts with pagination. Pagination must survive CDN caching, so the caching strategy must not strip query parameters.                                                                                                                                     |
| FR-14 | `/posts/<id>/<slug>` renders a single post, composing its `sections` array through the same renderer as pages.                                                                                                                                                                    |
| FR-15 | Comments render and accept submissions on post pages only when the comments flag is enabled.                                                                                                                                                                                      |
| FR-16 | The contact endpoint validates input, sends an email, and best-effort inserts into `contacts`; a failed insert does not fail the request if the email was sent.                                                                                                                   |
| FR-17 | Every page emits title, meta description, canonical URL, hreflang alternates including `x-default`, Open Graph tags, Twitter card tags, and a JSON-LD block.                                                                                                                      |
| FR-18 | `/sitemap.xml` lists every CMS page and post for every configured locale, with `lastmod` from `updated_at`.                                                                                                                                                                       |
| FR-19 | `/robots.txt` is served dynamically and references the sitemap and `llms.txt`.                                                                                                                                                                                                    |
| FR-20 | `/llms.txt` and `/llms-full.txt` are served per the llmstxt.org convention.                                                                                                                                                                                                       |
| FR-21 | An OG image endpoint generates a branded image from title, description and optional source image.                                                                                                                                                                                 |
| FR-22 | Raw HTML from the CMS is sanitised before insertion into the document.                                                                                                                                                                                                            |
| FR-23 | GTM is injected only when a container id is configured, with consent defaulting to denied.                                                                                                                                                                                        |
| FR-24 | `sections` payloads that are nested arrays or contain malformed entries are normalised to a flat array of valid sections before rendering.                                                                                                                                        |
| FR-25 | Page section composition is `[...template.sections_before, ...page.sections, ...template.sections_after]` when the page names a template.                                                                                                                                         |
| FR-26 | An authenticated `/api/revalidate` endpoint accepts `{ tags?, path? }` and invalidates the CDN cache accordingly.                                                                                                                                                                 |

### 5.2 Non-functional requirements

| ID     | Requirement                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------- |
| NFR-01 | A content-only page ships **0 bytes of framework JavaScript**. Total JS on such a page is 0 unless GTM is enabled.  |
| NFR-02 | Lighthouse Performance ≥ 95 on mobile for the default template pages.                                               |
| NFR-03 | The Orbitype API key is never present in any client bundle or HTML response. Verified by a build-output grep in CI. |
| NFR-04 | All CMS HTML passes through a sanitiser before rendering.                                                           |
| NFR-05 | No section component may exceed 150 lines; target 60–100.                                                           |
| NFR-06 | The repository type-checks with zero errors and lints with zero warnings.                                           |
| NFR-07 | `pnpm install && pnpm run setup && pnpm dev` works on a clean machine with no credentials.                          |
| NFR-08 | Playwright smoke tests pass with no credentials, using mock mode.                                                   |
| NFR-09 | Adding a section requires creating exactly one file plus one SQL statement. No registration file, no manifest edit. |
| NFR-10 | The CMS data layer contains no Astro rendering imports, so it can be unit-tested and reused.                        |
| NFR-11 | Every response carries the security headers listed in §10.3.                                                        |
| NFR-12 | A cached page response must be served from the CDN with no function invocation and no database round trip.          |
| NFR-13 | `/api/**` responses are never CDN-cached, guaranteed at runtime and asserted by a test.                             |

### 5.3 Operational requirements

| ID    | Requirement                                                                                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OR-01 | Deploys to Vercel from the default branch with no manual build step. The production Node runtime is pinned explicitly, not inherited from the build machine.       |
| OR-02 | All configuration is environment variables. No secrets in the repository.                                                                                          |
| OR-03 | One Orbitype API key maps to one connector; multiple sites are supported by multiple keys and multiple MCP server entries.                                         |
| OR-04 | Direct commits to the protected default branch are blocked locally by a pre-commit hook.                                                                           |
| OR-05 | A content edit in Orbitype becomes visible without a redeploy — within the cache TTL by default, or immediately when an Orbitype Workflow calls `/api/revalidate`. |

---

## 6. Technology stack and version verification gate

### 6.1 Pinned stack

Verified against the npm registry and against peer-dependency constraints. Pin these; do not float.

| Concern                   | Package                       | Version    | Note                                                                                       |
| ------------------------- | ----------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| Framework                 | `astro`                       | `^7.1.4`   | Pulls Vite 8, esbuild 0.28                                                                 |
| Hosting adapter           | `@astrojs/vercel`             | `11.0.3`   | **Exact pin, no caret** — its CDN cache provider is experimental                           |
| Styling                   | `tailwindcss`                 | `^4.3.3`   |                                                                                            |
| Tailwind integration      | `@tailwindcss/vite`           | `^4.3.3`   | `@astrojs/tailwind` is unusable: peers `astro ^3 \|\| ^4 \|\| ^5`                          |
| Sitemap helper (optional) | `@astrojs/sitemap`            | `^3.7.3`   |                                                                                            |
| Type checking             | `typescript`                  | `^6.0.3`   | **Not 7.x** — see below                                                                    |
| Astro diagnostics         | `@astrojs/check`              | `^0.9.10`  | Peers `typescript ^5 \|\| ^6`                                                              |
| HTML sanitisation         | `sanitize-html`               | `^2.17.6`  |                                                                                            |
| OG images                 | `@vercel/og`                  | `^0.11.1`  |                                                                                            |
| OG image types            | `@types/react`                | `^19.2.2`  | Types only, no runtime. `@vercel/og` will not typecheck without it                         |
| Schema validation         | `zod`                         | `^4.4.3`   |                                                                                            |
| Dates                     | `luxon`                       | `^3.7.2`   |                                                                                            |
| Node globals              | `@types/node`                 | `^24.10.1` | Track the runtime major, not the newest release. `astro.config.ts` reads `process.env`     |
| E2E                       | `@playwright/test`            | `^1.62.0`  |                                                                                            |
| Lint                      | `eslint`                      | `^10.8.0`  | Required by `eslint-plugin-astro@3`                                                        |
| Lint                      | `@eslint/js`                  | `^10.0.1`  | Versioned independently of `eslint`. pnpm's strict layout will not resolve it transitively |
| Lint                      | `typescript-eslint`           | `^8.65.0`  | Peers `typescript >=4.8.4 <6.1.0`                                                          |
| Lint                      | `@typescript-eslint/parser`   | `^8.65.0`  | Declared explicitly; it is a direct peer of `eslint-plugin-astro@3`                        |
| Lint                      | `eslint-plugin-astro`         | `^3.0.1`   | Needs a scoped peer override — see below                                                   |
| Lint                      | `eslint-plugin-jsx-a11y`      | `^6.10.2`  | Required peer of `eslint-plugin-astro@3`                                                   |
| Lint                      | `astro-eslint-parser`         | `^3.0.0`   |                                                                                            |
| Lint                      | `globals`                     | `^16.5.0`  | Node globals for `scripts/**/*.mjs`, which are plain JS and so subject to `no-undef`       |
| Format                    | `prettier`                    | `^3.9.6`   | Prettier 4 is alpha only                                                                   |
| Format                    | `prettier-plugin-astro`       | `^0.14.1`  |                                                                                            |
| Format                    | `prettier-plugin-tailwindcss` | `^0.8.1`   |                                                                                            |
| Hooks                     | `husky`                       | `^9.1.7`   |                                                                                            |
| Hooks                     | `pretty-quick`                | `^4.2.2`   |                                                                                            |

**Why TypeScript 6, not 7.** TypeScript 7 is the native compiler port and no longer exposes the programmatic API the Astro language server depends on. `astro check` fails outright under it — Astro issues [#17268](https://github.com/withastro/astro/issues/17268) and [#17336](https://github.com/withastro/astro/issues/17336) are both open and labelled `triage: unable to fix`. Separately, no published `typescript-eslint`, including its canary, accepts TypeScript ≥ 6.1. `typescript@6.0.3` is the single latest version satisfying both `@astrojs/check` and `typescript-eslint`, making it the maximal mutually-compatible set. Revisit when `@astrojs/check` publishes TS 7 support.

**The one unavoidable peer override.** `eslint-plugin-astro` from 2.0.0 onward requires `eslint >= 10` _and_ requires `eslint-plugin-jsx-a11y >= 6.10.2` — but 6.10.2 is the latest published release and still declares `eslint: ^3 || … || ^9`. Those two requirements cannot both be satisfied as written, so every version of the plugin from 2.0.0 on is internally contradictory. jsx-a11y is a rules-only plugin with no actual ESLint 10 incompatibility; its declared range is simply stale. `pnpm-workspace.yaml` therefore carries a `peerDependencyRules.allowedVersions` entry scoped to that single edge, leaving strict peer checking active everywhere else. The alternative — `eslint-plugin-astro@1.7.0`, the last version without the contradiction — means giving up two majors. Remove the override once jsx-a11y publishes ESLint 10 support.

**Runtime:** Node `>=22.12.0`. Odd-numbered majors (23, 25) are **not supported** by Astro. **Package manager:** pnpm `11.17.0`, with `pnpm-lock.yaml` committed.

**Deliberately absent:** any UI framework integration, `axios` (use `fetch`), `qs` (the SQL API takes a JSON body), `lodash`, any animation library.

### 6.2 Verification gate — COMPLETE

This gate ran on 2026-07-27. All fourteen items were verified against current documentation and shipped package sources. Findings are recorded in [DEVIATIONS.md](DEVIATIONS.md).

| #    | API                                   | Outcome                                                                                                                                                                  |
| ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| V-01 | `output` modes, per-route `prerender` | As documented. `static` / `server` unchanged, `static` is the default. Astro 7 additionally stabilised top-level `cache` and `routeRules`.                               |
| V-02 | `@astrojs/vercel` import, ISR options | Import path correct. `isr` correct but **not used** — see §7.4. `edgeMiddleware` deprecated in favour of `middlewareMode`. No per-route runtime option; serverless only. |
| V-03 | `astro:env` schema and helpers        | As documented and stable. Secrets _may_ have defaults. Names must match `/^[A-Z0-9_]+$/`. `client` + `secret` is rejected. Unusable inside `astro.config.*`.             |
| V-04 | `APIRoute`, context, `Response`       | As documented.                                                                                                                                                           |
| V-05 | Built-in `i18n` config                | Correct, but `routing.redirectToDefaultLocale` flipped default `true` → `false` in Astro 6. Must be set explicitly.                                                      |
| V-06 | Dynamic component from a variable     | Works. `AstroComponentFactory` is **not** exported from the `astro` root; use `AstroInstance["default"]`. No `any` cast needed.                                          |
| V-07 | `import.meta.glob` with `eager`       | As documented. Absolute patterns yield absolute-from-root keys.                                                                                                          |
| V-08 | `set:html`                            | As documented. No automatic escaping — the sanitiser is load-bearing.                                                                                                    |
| V-09 | Tailwind 4 via `@tailwindcss/vite`    | As documented. `@apply` does **not** work in `.astro` `<style>` blocks without a `@reference` line — so it is forbidden there.                                           |
| V-10 | `getStaticPaths` for a rest route     | Root path is `params: { slug: undefined }`, not `""`. Built-in i18n is folder-based and does not combine with a root catch-all; see §7.6.                                |
| V-11 | 404 signalling                        | `Astro.rewrite("/404")` forces a genuine 404 status. Confirmed in shipped source.                                                                                        |
| V-12 | `@vercel/og` from an endpoint         | Works on the Node runtime, no edge requirement. Requires `@types/react` to typecheck.                                                                                    |
| V-13 | Content collections                   | `src/content.config.ts`, `loader` API, `z` from `astro/zod`. Legacy collections fully removed.                                                                           |
| V-14 | `astro add`                           | Still recommended.                                                                                                                                                       |

### 6.3 Astro 7 behaviour changes that affect authoring

- **`compressHTML` defaults to `'jsx'`.** Whitespace between inline elements is stripped using JSX rules, so `<span>a</span> <em>b</em>` across lines renders without a space. Insert `{" "}` explicitly where a space matters.
- **The compiler is Rust-based and strict.** Unclosed tags are hard errors; invalid HTML is no longer auto-corrected.
- **`src/fetch.ts` is a reserved filename.**
- **Markdown runs through Sätteri**, not remark/rehype. `@astrojs/markdown-remark` is not installed by default.
- **`Astro.glob()` is gone.** Use `import.meta.glob()`, which no longer returns a Promise.

---

## 7. Architecture

### 7.1 System flow

```
Figma design
    │
    ├─ Figma MCP ──────────┐
    │                      │  (inside Cursor)
    ▼                      ▼
src/components/sections/Section*.astro
    │
    │  Orbitype MCP: sql_crud_execute
    ▼
PostgreSQL  ──  pages.sections / posts.sections  (JSON arrays)
    │                      │
    │                      ├── Orbitype app (visual GUI, content ops)
    │                      └── Orbitype Workflow ──► POST /api/revalidate
    ▼
Astro server route  →  src/lib/orbitype/*  →  Orbitype SQL API
    │
    ▼
normalizeSections  →  AnySection.astro  →  resolves _orbi.component
    │
    ▼
HTML (zero framework JS)  →  CDN cache, tagged
```

Two distinct planes, and keeping them distinct is the core architectural idea:

- **Authoring plane** — Figma MCP and Orbitype MCP, running inside the editor. Writes to Postgres. Never part of the deployed application.
- **Runtime plane** — Astro reading from Postgres through the Orbitype SQL API, server-side only. Writes only form submissions.

### 7.2 Request flow

1. A visitor requests a URL. If the CDN holds a fresh entry, it is served with no function invocation and the flow stops here.
2. Otherwise the Astro route `src/pages/[...slug].astro` matches and derives `{ locale, slug }`.
3. The route calls `getPage(slug)` from `src/lib/orbitype/pages.ts`.
4. That function either returns seed content (mock mode / unconfigured) or calls `orbitypeSql()`.
5. `orbitypeSql()` POSTs `{ sql, bindings }` to the Orbitype SQL API with an `X-API-KEY` header. Server only.
6. The row returns, including a `sections` JSON array.
7. `normalizeSections()` flattens and validates that array.
8. If the page names a template, `sections_before` and `sections_after` are composed around it.
9. The route renders `<Seo />`, then maps the array through `<AnySection />`, and tags the response for invalidation.
10. `AnySection` looks up `_orbi.component` in the filename-keyed registry, destructures `_orbi` off the payload, and spreads the rest as props. Unknown names render the debug panel.

### 7.3 Layer boundaries

| Layer          | Directory                  | May import                                  | May not import                   |
| -------------- | -------------------------- | ------------------------------------------- | -------------------------------- |
| Data           | `src/lib/orbitype/`        | `astro:env/server`, `zod`                   | anything Astro-rendering-related |
| Domain helpers | `src/lib/`                 | data layer, types                           | components                       |
| Sections       | `src/components/sections/` | common components, `src/lib/i18n.ts`, types | the data layer directly          |
| Routes         | `src/pages/`               | everything                                  | —                                |

The rule that matters: **section components never fetch.** They receive fully-resolved props. This keeps them trivially previewable and makes the mock path honest.

### 7.4 Rendering and caching strategy

Two render modes, selected by `RENDER_MODE`.

**`server` (default).** `output: "server"` with the Vercel adapter, plus Astro 7's native caching: `cache: { provider: cacheVercel() }` and per-route `routeRules`. A cache hit is served straight from Vercel's CDN with no function invocation, satisfying NFR-12. Entries carry cache tags, so an Orbitype Workflow can call `/api/revalidate` and make an edit visible immediately, satisfying OR-05.

**`static`.** `output: "static"`. `[...slug].astro` implements `getStaticPaths`, querying every page slug from Orbitype at build time. The cache config is inert in this mode. Content changes require a rebuild, which suits campaign sites with a deploy hook.

**Why not the adapter's ISR.** Adapter ISR was rejected for one disqualifying reason and three supporting ones. Vercel's prerender configuration allowlists only Astro's internal `x_astro_path` parameters, so **ISR strips every query parameter** — which breaks FR-13's pagination and would ship that limitation to every site built from this template. Beyond that: ISR has a single global `expiration` with no per-route TTLs; excluding `/api/**` requires a regex matched against Astro's internal route-pattern strings rather than request paths, which is easy to get silently wrong; and it offers no tag invalidation, which is the natural shape for a CMS. Recorded as ADR-0005.

**What we give up.** On a cache _miss_, ISR is genuinely stronger: a durable store, cache shielding, request collapsing, and ~300ms global purges. The native CDN cache fills lazily per region, so the SQL API is hit roughly once per region per TTL instead of once per TTL globally. That is a bounded cost, not a correctness problem, and switching to ISR later is a config-level change.

**Mandatory safeguards.** Three of these come from reading shipped source rather than documentation:

1. **`src/middleware.ts` must disable caching on `/api/**`.** Route rules are matched by Astro's router and the first match wins, so the `/[...slug]` catch-all also matches `/api/anything`. There is no declarative opt-out — a rule object with no cache fields is dropped from the compiled set rather than shadowing the catch-all — so the only reliable guard is `cache.set(false)` at runtime.
2. **Every `routeRules` entry must set `maxAge`.** A rule carrying only `swr` emits no headers at all, because the runtime gate checks `maxAge` and `tags` but never `swr`. The examples in Astro's own configuration reference and caching guide are wrong on this point.
3. **`@astrojs/vercel` is pinned exactly**, because its CDN cache provider is still labelled experimental.
4. **Two tests** assert a CDN hit on a repeat page request and the absence of cache headers on `/api/**`.

### 7.5 Interactivity model

No client framework. Interactivity is added in three escalating steps:

1. **HTML first.** `<details>`/`<summary>` for accordions, `<dialog>` for modals, native form validation, CSS `:target` and `:has()` for reveals. Most requirements stop here.
2. **A scoped `<script>` in the component.** Plain TypeScript, module-scoped, progressively enhancing markup that already works.
3. **A dedicated island module** in `src/components/islands/`, imported by `<script>`, when logic exceeds ~40 lines. Still vanilla TypeScript.

Every island must degrade gracefully with JavaScript disabled. Recorded as ADR-0003.

### 7.6 Locale architecture

The locale list lives in exactly one file, `src/config/locales.ts`, imported by both `astro.config.ts` and the type layer. Changing the shipped language is a one-line edit.

**A constraint worth understanding before adding a second locale.** Astro's built-in i18n is folder-based: it expects real `src/pages/<locale>/` directories, and `prefixDefaultLocale`, `i18n.fallback` and `fallbackType: "rewrite"` all assume that layout. There is no documented way to combine it with a root `src/pages/[...slug].astro` catch-all, which is exactly what a CMS-driven site needs.

So this template derives the locale from the URL segments itself, in `parseRoute()`, instead of relying on Astro's i18n middleware. With one locale there is no prefix and nothing to do. Adding a locale means editing `LOCALES` and setting `i18n.routing: "manual"` — no page-tree restructuring. Recorded as ADR-0006.

---

## 8. The Orbitype contract

**This section is normative and self-contained.** It is the sole authority on Orbitype behaviour for this repository. Both this template and its Nuxt/Vue predecessor read the same databases, so nothing here may drift without an ADR.

### 8.1 What Orbitype is

A managed headless CMS that attaches to data sources through connectors — SQL/Postgres and S3-compatible object storage. It exposes a REST API over those connectors and auto-generates a visual admin GUI from the schema. It also exposes an MCP server so AI editors can read and write content directly, and a Workflows engine that can react to row changes.

Consequences for this template:

- The CMS is **schema-first**. You define tables; Orbitype generates the editing UI. Section structure therefore lives in JSON columns rather than in a CMS-side content model.
- The API is **framework-agnostic HTTP**. There is no SDK, no framework plugin, no build-time coupling. Verified: no `orbitype` package exists on npm. This is why an Astro implementation is possible with no loss of capability. Recorded as ADR-0002.
- One API key is **scoped to one connector**. Multi-site setups use multiple keys.

### 8.2 Endpoints

| Purpose                       | Endpoint                                     | Auth               |
| ----------------------------- | -------------------------------------------- | ------------------ |
| SQL execution                 | `https://core.orbitype.com/api/sql/v1`       | `X-API-KEY` header |
| S3 file operations            | `https://core.orbitype.com/api/s3/v1`        | `X-API-KEY` header |
| MCP (editor tooling)          | `https://core.orbitype.com/api/mcp/v1`       | `X-API-KEY` header |
| Connector scope probe         | `OPTIONS https://core.orbitype.com/api`      | `X-API-KEY` header |
| API-key management (human UI) | `https://app.orbitype.com/settings/api-keys` | login              |

### 8.3 SQL API call shape and behaviour

A single request carrying a prepared statement and named bindings:

```
POST https://core.orbitype.com/api/sql/v1
Content-Type: application/json
X-API-KEY: <connector-scoped key>

{
  "sql": "SELECT * FROM pages WHERE slug = :slug",
  "bindings": { "slug": "home" }
}
```

Bindings use `:name` placeholders — always use them; never interpolate values into the SQL string.

**Routed methods.** `GET`, `POST`, `PATCH` and `DELETE` are routed. **`PUT` is not** — it returns `E_ROUTE_NOT_FOUND`. The method conveys intent; the endpoint accepts any valid `sql` + `bindings` combination. `OPTIONS` is not routed on `/api/sql/v1`; use `/api` for scope checks.

**SELECT responses** are a bare JSON array of row objects. There is no envelope.

**Mutation responses return only what `RETURNING` names.** There is no rowcount, no affected-rows field, and no envelope. **Every INSERT, UPDATE and DELETE this template issues must include a `RETURNING` clause**, or the response carries nothing to verify against.

**DDL is permitted**, including `CREATE TABLE` and `CREATE OR REPLACE FUNCTION`. The response body shape for DDL is unverified; treat throw-versus-no-throw as the only reliable signal.

**Error responses are inconsistent, and this matters.** Do not assume a JSON body and do not assume 401:

| Condition       | Status    | Content-Type       | Body                                                      |
| --------------- | --------- | ------------------ | --------------------------------------------------------- |
| No API key      | `400`     | `text/plain`       | `E_HTTP_EXCEPTION: connector required`                    |
| Invalid API key | **`404`** | `application/json` | `{"message":"E_ROW_NOT_FOUND: Row not found"}`            |
| Unrouted method | `404`     | `application/json` | `{"message":"E_ROUTE_NOT_FOUND: Cannot PUT:/api/sql/v1"}` |

Two consequences for `src/lib/orbitype/client.ts`: read error bodies with `.text()`, never `.json()`, because a 400 is plain text; and never classify a bad key by a 401 status, because it returns 404.

**Rate limiting** is undocumented but real. Every response carries `x-ratelimit-limit: 6000` and a decrementing `x-ratelimit-remaining`. The window length is unverified.

### 8.4 Database schema

Reproduce this exactly.

#### The `uid()` function — create this first

`uid()` is **not** provided by Orbitype. It is an ordinary Postgres function that the application must create, and every table below depends on it for its primary key default. **The installer must create it before any `CREATE TABLE`, or installation fails against an empty connector.**

```sql
CREATE OR REPLACE FUNCTION uid() RETURNS text
  LANGUAGE sql AS
$$
SELECT STRING_AGG(SUBSTRING(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  CEIL(RANDOM() * 62)::integer, 1), '')
FROM GENERATE_SERIES(1, 6)
$$;
```

`CREATE OR REPLACE` makes it idempotent. Note the keyspace is 62⁶ ≈ 5.7 × 10¹⁰, with collision probability becoming non-trivial in the low hundreds of thousands of rows. That is comfortable for `pages` and `posts`, and thin for high-volume tables. Recorded as ADR-0011.

#### `pages`

```sql
CREATE TABLE pages (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  title json DEFAULT '{ "en": "...", "de": "..." }'::json,
  slug text DEFAULT '...'::text,
  lead json DEFAULT '{ "en": "...", "de": "..." }'::json,
  img text DEFAULT ''::text,
  sections json DEFAULT '[
    { "height": 0, "_orbi": { "component": "SectionSpacer" } }
  ]'::json,
  keywords json DEFAULT '[ "..." ]'::json,
  head json DEFAULT '{ "title": "..." }'::json,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

`lead` and `img` are part of the contract. Omitting them breaks cross-stack compatibility.

#### `posts`

```sql
CREATE TABLE posts (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  title json DEFAULT '{ "en": "...", "de": "..." }'::json,
  lead json DEFAULT '{ "en": "<p>...</p>", "de": "<p>...</p>" }'::json,
  img text DEFAULT 'https://localhost.com/bucket/media/undefined.png'::text,
  status json DEFAULT '{
    "options": [ "draft", "review", "published" ],
    "value": "draft"
  }'::json,
  sections json DEFAULT '[
    {
      "title": { "en": "...", "de": "..." },
      "content": { "en": "<p>...</p>", "de": "<p>...</p>" },
      "_orbi": { "component": "SectionProse" }
    }
  ]'::json,
  keywords json DEFAULT '[ "..." ]'::json,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

`status` is application-level data. Orbitype does not interpret or enforce it — filter on `status->>'value' = 'published'` yourself.

#### `settings`

```sql
CREATE TABLE settings (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  name text DEFAULT '...'::text,
  data json DEFAULT '{ "key": "value" }'::json
);
```

#### `contacts`

```sql
CREATE TABLE contacts (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  first_name text DEFAULT '...'::text,
  last_name text DEFAULT '...'::text,
  email text DEFAULT '...'::text,
  phone text DEFAULT ''::text,
  topic text DEFAULT ''::text,
  message text DEFAULT ''::text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);
```

The predecessor defines this table but omits it from its installer's table list, so form inserts silently fail until someone creates it by hand. This template installs it. Recorded as ADR-0009.

#### `templates`

```sql
CREATE TABLE templates (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  name text DEFAULT '...'::text,
  sections_before json DEFAULT '[
    { "height": 0, "_orbi": { "component": "SectionSpacer" } }
  ]'::json,
  sections_after json DEFAULT '[
    { "height": 0, "_orbi": { "component": "SectionSpacer" } }
  ]'::json
);
```

Holds chrome sections shared across pages. Both defaults are a single zero-height `SectionSpacer`, matching the `pages.sections` default — so a freshly created template composes to a visual no-op rather than to nothing. Recorded as ADR-0013.

#### A note on `id varchar(255)`

Every table uses `varchar(255)`, not `text`. In Postgres the two are equivalent for reads, so this only matters at install time — but since both templates install into the same kind of connector, keeping the DDL identical avoids a needless divergence.

#### `comments`

Created only when the comments feature is enabled.

```sql
CREATE TABLE comments (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  post_id text DEFAULT ''::text,
  author text DEFAULT ''::text,
  text text DEFAULT ''::text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);
```

#### Idempotency and migration

Every `CREATE TABLE` is rewritten to `CREATE TABLE IF NOT EXISTS` before being sent:

```ts
function toIdempotentSql(sql: string): string {
  return sql.replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
}
```

Schema evolution after launch uses additive, idempotent statements kept alongside the DDL:

```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS topic text DEFAULT ''::text;
```

### 8.5 The sections contract

`pages.sections` and `posts.sections` are JSON **arrays of objects**. Each object is one rendered section.

**Key order is significant.** Orbitype's admin GUI renders a list of sections and uses the first key as the row label. Therefore:

1. **First key** — a human-readable field: `title`, `name`, `label`, or the best available (`height` as a number for spacers). Localized where applicable.
2. **Middle keys** — the section's props.
3. **Last key** — `_orbi`, containing `component`.

Never put `_orbi` first. Never put `img` first — a raw URL makes the admin list unreadable.

```json
{
  "title": { "en": "Feature callout", "de": "Feature-Highlight" },
  "content": { "en": "<p>...</p>", "de": "<p>...</p>" },
  "variant": "highlight",
  "_orbi": { "component": "SectionFeatureCallout" }
}
```

`_orbi.component` must equal the component filename without extension: `SectionFeatureCallout.astro` → `"SectionFeatureCallout"`. Because the predecessor resolves by the same filename-derived name, **existing CMS rows work unchanged**. Recorded as ADR-0004.

**Orbitype sometimes stores nested arrays** — `[[{...}]]` instead of `[{...}]`. Reads must therefore normalise before rendering, recursively flattening and discarding anything without a string `_orbi.component`. This is not defensive paranoia; it is observed behaviour.

```ts
// src/types/section.ts
export type Section = {
  [key: string]: unknown
  _orbi: { component: string }
}
```

### 8.6 Localized fields

```ts
// src/types/i18n.ts
export type I18nString = {
  en: string
  [locale: string]: string | undefined
}
```

`en` is required; every other locale is optional. Keeping the index signature open is what lets a row authored as `{ en, de }` for the predecessor render correctly on a single-locale site.

Resolution order: requested locale, then `en`, then empty string. Never render `undefined`, and never render a placeholder like `"..."` in production output.

**Difference from the predecessor.** There, translation reads the active locale from ambient Vue i18n context. Astro has no ambient reactive context, so locale is an **explicit argument** threaded through props:

```ts
// src/lib/i18n.ts
export function translate(
  value: I18nString | undefined,
  locale: Locale,
): string {
  if (!value) return ""
  return value[locale] ?? value.en ?? ""
}
```

Every section component receives `locale` as a prop. `AnySection` passes it down. Recorded as ADR-0006.

### 8.7 MCP tools

| Area    | Tools                                                                            | Credit cost |
| ------- | -------------------------------------------------------------------------------- | ----------- |
| Context | `orbitype_get_context`                                                           | 0           |
| SQL     | `sql_readonly_query` (1), `sql_crud_execute` (2)                                 |             |
| S3      | `s3_list` (1), `s3_put` (2), `s3_delete` (1), `s3_copy` (2), `s3_signed_url` (1) |             |

**Session discipline, mandatory.** Call `orbitype_get_context` first, every session, before any read or write. It confirms which connector the key is bound to. Skipping it is how content gets written to the wrong site.

### 8.8 Workflows and revalidation

Orbitype Workflows can react to row changes, which is what makes instant cache invalidation possible.

- A **Database (table events)** trigger fires on create, update and delete, scoped to a connector.
- For an update, the code node receives a two-element array: `[oldRow, newRow]`. Create and delete payload shapes are unverified.
- Code nodes are Node.js functions with outbound HTTP, so they can `fetch()` this site's `/api/revalidate`.
- A separate **Webhook** trigger type exists but is **inbound only** — Orbitype generates a URL you POST to. It is not a notification out.

Three constraints:

1. **The triggering statement must run through the Orbitype API and include a return value** — practically, `RETURNING *`. Direct database writes that bypass Orbitype do not fire the trigger.
2. **Admin-GUI saves appear to fire it**, but this is documented only indirectly. Verify against a live connector.
3. **Re-entrancy is real.** A workflow that writes back to the row it was triggered by will re-trigger itself. Use an atomic lock, or do not write back.

Execution bills at 0.2 credits per second.

### 8.9 Canonical SQL snippets

Append a section:

```sql
UPDATE pages
SET sections = (
  COALESCE(sections, '[]'::json)::jsonb
  || jsonb_build_array(
    jsonb_build_object(
      'title', jsonb_build_object('en', 'Why teams switch', 'de', 'Warum Teams wechseln'),
      'content', jsonb_build_object('en', '<p>Body.</p>', 'de', '<p>Text.</p>'),
      'variant', 'highlight',
      '_orbi', jsonb_build_object('component', 'SectionFeatureCallout')
    )
  )
)::json
WHERE slug = 'home'
RETURNING id, slug;
```

Insert at a specific index (second position):

```sql
UPDATE pages
SET sections = jsonb_insert(
  COALESCE(sections, '[]'::json)::jsonb,
  '{1}',
  jsonb_build_object(
    'title', jsonb_build_object('en', 'Inserted', 'de', 'Eingefuegt'),
    '_orbi', jsonb_build_object('component', 'SectionFeatureCallout')
  ),
  false
)::json
WHERE slug = 'home'
RETURNING id, slug;
```

Inspect which components a page uses:

```sql
SELECT section->'_orbi'->>'component' AS component_name
FROM pages, json_array_elements(sections) AS section
WHERE slug = 'home';
```

Find every page using a component:

```sql
SELECT p.slug
FROM pages p, json_array_elements(p.sections) AS section
WHERE section->'_orbi'->>'component' = 'SectionFeatureCallout';
```

List pages by recency:

```sql
SELECT id, slug, updated_at FROM pages ORDER BY updated_at DESC;
```

### 8.10 Safe content workflow

1. `orbitype_get_context` — confirm the connector.
2. `sql_readonly_query` — read the current row.
3. Save the current `sections` JSON as a backup in the conversation or a scratch file.
4. `sql_crud_execute` with a `RETURNING` clause — apply the change.
5. Re-read the row and confirm `sections` is still a flat array of objects.
6. Open the target URL and verify rendering, localisation and SEO output.

Never hand-edit production `sections` JSON without steps 2 and 3.

### 8.11 Pitfalls

- `_orbi` or `img` as the first key — the admin list becomes unreadable.
- `_orbi.component` not matching the component filename — debug panel instead of content.
- **Nested section arrays** — Orbitype may store `[[{...}]]`; always write flat and always normalise on read.
- Missing required props — a broken or empty section.
- Missing `en` on a localized field — empty text everywhere, since `en` is the final fallback.
- A mutation without `RETURNING` — you get no confirmation the write happened.
- Assuming a bad API key returns 401 — it returns 404.
- Parsing an error body as JSON — a missing key returns `text/plain`.
- Writing through the wrong connector — always `orbitype_get_context` first.
- Interpolating values into SQL instead of using `:bindings`.

---

## 9. Repository structure

```
orbitype-astro-template/
├── .cursor/
│   ├── mcp.json.example
│   └── rules/
│       ├── index.mdc
│       ├── 00-meta/
│       │   ├── 00-naming.mdc
│       │   ├── 01-structure.mdc
│       │   └── 02-general-principles.mdc
│       ├── 10-architecture/
│       │   ├── 01-base-stack.mdc
│       │   ├── 02-composition.mdc
│       │   ├── 03-orbitype-cms.mdc
│       │   └── 04-rendering-and-performance.mdc
│       ├── 20-principles/
│       │   ├── 01-do-not-lie.mdc
│       │   ├── 02-prefer-vanilla.mdc
│       │   ├── 03-prefer-explicit.mdc
│       │   └── 04-do-not-over-engineer.mdc
│       ├── 20-code-quality/
│       │   └── 01-code-quality-improvement.mdc
│       ├── 40-guidelines/
│       │   ├── 01-keep-it-simple.mdc
│       │   └── 02-keep-urls-flat.mdc
│       ├── 50-database/
│       │   └── 01-database-interaction.mdc
│       └── 60-ui/
│           ├── 01-section-authoring.mdc
│           └── 02-research-before-building.mdc
├── .husky/
│   └── pre-commit
├── docs/
│   ├── 00-TEMPLATE-BLUEPRINT.md        ← this document
│   ├── 01-orbitype-cms.md
│   ├── 02-sections-cookbook.md
│   ├── 03-deployment.md
│   ├── DEVIATIONS.md
│   └── adr/
│       ├── 0001-second-stack-astro.md
│       ├── 0002-no-orbitype-sdk-http-only.md
│       ├── 0003-no-client-framework.md
│       ├── 0004-filename-based-section-registry.md
│       ├── 0005-native-cdn-cache-over-isr.md
│       ├── 0006-explicit-locale-propagation.md
│       ├── 0007-server-only-secrets.md
│       ├── 0008-tailwind-v4-css-first-tokens.md
│       ├── 0009-installer-creates-contacts-table.md
│       ├── 0010-ship-sectionspacer.md
│       ├── 0011-application-owned-uid-function.md
│       ├── 0012-seed-as-single-source-of-starter-content.md
│       └── 0013-templates-driven-section-composition.md
├── public/
│   ├── favicon.svg
│   └── og-default.jpg
├── scripts/
│   ├── setup.mjs
│   ├── print-mcp-env.mjs
│   ├── verify-orbitype-mcp.mjs
│   └── verify-figma-mcp.mjs
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── SafeHtml.astro
│   │   │   ├── Prose.astro
│   │   │   └── Button.astro
│   │   ├── islands/
│   │   │   └── mobile-nav.ts
│   │   ├── layout/
│   │   │   ├── Navigation.astro
│   │   │   ├── Footer.astro
│   │   │   └── ConsentScripts.astro
│   │   ├── seo/
│   │   │   ├── Seo.astro
│   │   │   └── JsonLd.astro
│   │   └── sections/
│   │       ├── AnySection.astro
│   │       ├── DebugPanel.astro
│   │       ├── SectionSpacer.astro
│   │       ├── SectionProse.astro
│   │       ├── SectionQuote.astro
│   │       ├── SectionHero.astro
│   │       ├── SectionFeatureGrid.astro
│   │       ├── SectionCta.astro
│   │       └── SectionWelcome.astro
│   ├── config/
│   │   └── locales.ts
│   ├── layouts/
│   │   └── Base.astro
│   ├── lib/
│   │   ├── orbitype/
│   │   │   ├── client.ts
│   │   │   ├── config.ts
│   │   │   ├── schema.ts
│   │   │   ├── seed.ts
│   │   │   ├── pages.ts
│   │   │   ├── posts.ts
│   │   │   ├── settings.ts
│   │   │   ├── templates.ts
│   │   │   ├── comments.ts
│   │   │   └── contacts.ts
│   │   ├── sections.ts
│   │   ├── normalize-sections.ts
│   │   ├── i18n.ts
│   │   ├── phrases.ts
│   │   ├── seo.ts
│   │   ├── sanitize.ts
│   │   ├── email.ts
│   │   └── site.ts
│   ├── middleware.ts
│   ├── pages/
│   │   ├── [...slug].astro
│   │   ├── 404.astro
│   │   ├── posts/
│   │   │   ├── index.astro
│   │   │   └── [id]/[...slug].astro
│   │   ├── api/
│   │   │   ├── forms/contact.ts
│   │   │   ├── comments.ts
│   │   │   ├── revalidate.ts
│   │   │   ├── og/page.ts
│   │   │   ├── og/post.ts
│   │   │   └── setup/
│   │   │       ├── install-schema.ts
│   │   │       ├── migrate.ts
│   │   │       └── seed.ts
│   │   ├── sitemap.xml.ts
│   │   ├── robots.txt.ts
│   │   ├── llms.txt.ts
│   │   └── llms-full.txt.ts
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   ├── section.ts
│   │   ├── i18n.ts
│   │   ├── page.ts
│   │   ├── post.ts
│   │   └── contact.ts
│   └── env.d.ts
├── tests/
│   └── e2e/
│       ├── smoke.spec.ts
│       ├── no-client-js.spec.ts
│       └── caching.spec.ts
├── .env.example
├── .gitignore
├── .prettierrc.mjs
├── astro.config.ts
├── eslint.config.js
├── package.json
├── playwright.config.ts
├── pnpm-workspace.yaml
├── tsconfig.json
├── vercel.json
└── README.md
```

Naming conventions: `PascalCase.astro` for components, `kebab-case.ts` for modules, section components always prefixed `Section`, non-reusable local sub-components prefixed `_`.

---

## 10. Configuration files

### 10.1 `package.json`

```json
{
  "name": "orbitype-astro-template",
  "version": "0.1.0",
  "private": true,
  "license": "proprietary",
  "type": "module",
  "engines": { "node": ">=22.12.0", "pnpm": ">=11.0.0" },
  "packageManager": "pnpm@11.17.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "setup": "node scripts/setup.mjs && astro sync && husky",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "astro check",
    "format": "prettier --write .",
    "pretty-quick": "pretty-quick --staged",
    "mcp:env": "node scripts/print-mcp-env.mjs",
    "mcp:verify": "node scripts/verify-orbitype-mcp.mjs",
    "figma:verify": "node scripts/verify-figma-mcp.mjs",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "verify": "pnpm run lint && pnpm run typecheck && pnpm run test:e2e"
  }
}
```

No `author` field.

**`pnpm setup` is a built-in pnpm command**, so the `setup` script is shadowed by it. Always invoke it as `pnpm run setup`, with the explicit `run`, and document it that way everywhere — README, hook, docs, CI.

**pnpm settings do not live in `package.json`.** pnpm 11 ignores the `pnpm` field entirely, warning that the keys were dropped. Everything below goes in `pnpm-workspace.yaml` instead.

### 10.1b `pnpm-workspace.yaml`

```yaml
allowBuilds:
  esbuild: true
  sharp: true

strictPeerDependencies: true

peerDependencyRules:
  allowedVersions:
    eslint-plugin-jsx-a11y>eslint: "10"
```

**`allowBuilds` is required, not optional.** pnpm 10+ blocks dependency build scripts by default; Astro needs esbuild's, and sharp's for image optimisation. Note the key is `allowBuilds`, a map — **not** pnpm 10's `onlyBuiltDependencies`, a list. The old name still parses, and `pnpm config get onlyBuiltDependencies` will even echo it back, but it is not honoured. The only symptom is `ERR_PNPM_IGNORED_BUILDS` on every install. `pnpm approve-builds <pkg>` writes the correct key for you.

**`strictPeerDependencies: true`** is a deliberate guard. It is precisely what surfaces a problem like the TypeScript 7 incompatibility at install time rather than at first `typecheck`, and it is what caught the jsx-a11y contradiction in §6.1.

pnpm 11 also maintains a `minimumReleaseAgeExclude` list here, appending packages you install that are newer than its supply-chain quarantine window. It is generated, not hand-written; leave it alone.

### 10.2 `astro.config.ts`

TypeScript, not `.mjs`, so it can import the locale list as a single source of truth. Note `astro:env` is a virtual module and is unavailable here — this file reads `process.env` directly.

```ts
import { defineConfig, envField } from "astro/config"
import vercel from "@astrojs/vercel"
import { cacheVercel } from "@astrojs/vercel/cache"
import tailwindcss from "@tailwindcss/vite"
import { LOCALES, DEFAULT_LOCALE } from "./src/config/locales"

const renderMode = process.env.RENDER_MODE === "static" ? "static" : "server"

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "http://localhost:4321",
  output: renderMode,
  adapter: vercel(),

  // Inert under `output: "static"` — prerendered pages never enter the pipeline.
  cache: { provider: cacheVercel() },

  // Every rule sets maxAge: a rule with only `swr` emits no headers at all.
  // The `/[...slug]` catch-all also matches /api/**, which src/middleware.ts guards.
  routeRules: {
    "/": { maxAge: 60, swr: 300, tags: ["cms", "page:home"] },
    "/posts": { maxAge: 120, swr: 300, tags: ["cms", "posts"] },
    "/posts/[id]/[...slug]": { maxAge: 300, swr: 600, tags: ["cms", "posts"] },
    "/[...slug]": { maxAge: 300, swr: 600, tags: ["cms", "pages"] },
  },

  vite: { plugins: [tailwindcss()] },

  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: false,
      // Default flipped true -> false in Astro 6; set explicitly.
      redirectToDefaultLocale: false,
    },
  },

  env: {
    schema: {
      ORBITYPE_API_SQL_URL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "https://core.orbitype.com/api/sql/v1",
      }),
      ORBITYPE_API_SQL_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      ORBITYPE_MOCK: envField.boolean({
        context: "server",
        access: "public",
        optional: true,
        default: false,
      }),
      RENDER_MODE: envField.enum({
        context: "server",
        access: "public",
        values: ["server", "static"],
        default: "server",
      }),
      REVALIDATE_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MAIL_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MAIL_FROM_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MAIL_FROM_NAME: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      MAIL_TO_EMAIL: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PUBLIC_SITE_URL: envField.string({ context: "client", access: "public" }),
      PUBLIC_SITE_NAME: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_SITE_DESCRIPTION: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_ORGANIZATION_NAME: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_ORGANIZATION_LOGO: envField.string({
        context: "client",
        access: "public",
        default: "/favicon.svg",
      }),
      PUBLIC_OG_LOGO_PATH: envField.string({
        context: "client",
        access: "public",
        default: "/favicon.svg",
      }),
      PUBLIC_OG_IMAGE_ENABLED: envField.boolean({
        context: "client",
        access: "public",
        default: true,
      }),
      PUBLIC_COMMENTS_ENABLED: envField.boolean({
        context: "client",
        access: "public",
        default: false,
      }),
      PUBLIC_GTM_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "",
      }),
      PUBLIC_TWITTER_SITE: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "",
      }),
      PUBLIC_TWITTER_CREATOR: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "",
      }),
    },
  },
})
```

Environment variable names must match `/^[A-Z0-9_]+$/`. A `client` + `secret` field is rejected outright.

The predecessor uses `NUXT_PUBLIC_*`; this template uses `PUBLIC_*`, matching Astro's convention. The README carries the mapping table for anyone porting a `.env`.

### 10.3 Security headers

Set in `vercel.json`. Note the adapter cannot set arbitrary headers — its `staticHeaders` option only emits headers Astro itself generates.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        { "key": "X-Robots-Tag", "value": "index,follow" }
      ]
    }
  ]
}
```

`X-XSS-Protection` is deliberately omitted: it is deprecated and ignored by modern browsers.

Add apex-to-`www` redirects here per project.

### 10.4 `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules", "example-only"],
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": { "~/*": ["src/*"] }
  }
}
```

`noUncheckedIndexedAccess` is deliberate: the section registry is an index lookup that can miss, and the type system should force you to handle it. That is exactly FR-06.

### 10.5 `src/styles/global.css`

Tailwind 4 is CSS-first — tokens live here, not in a JS config.

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: ui-serif, Georgia, serif;

  --color-brand-50: #f0f7ff;
  --color-brand-500: #0ea5e9;
  --color-brand-900: #0e2138;

  --spacing-section: 5rem;
}

@custom-variant enter (&:hover, &:focus-visible);

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }
  body {
    @apply bg-white font-sans text-neutral-900 antialiased;
  }
  :focus-visible {
    @apply outline-brand-500 outline-2 outline-offset-2;
  }
}
```

**`@apply` is forbidden inside `.astro` `<style>` blocks.** Those are processed separately and cannot see theme tokens without a `@reference` line, which fails with "Cannot apply unknown utility class". Put shared classes here instead.

Fonts: self-host rather than loading from a CDN. A third-party font connection on every page is a direct NFR-02 risk. Use `font-display: swap` and subset to the required character range.

### 10.6 `eslint.config.js`

Flat config combining `typescript-eslint` and `eslint-plugin-astro`. Enforce, at minimum:

- No unused imports, no `any`.
- **No import of `astro:env/server` from anything under `src/components/`** — this is ADR-0007's lint layer.
- No raw hex colour values in components; use theme tokens.

### 10.7 `.prettierrc.mjs`

```js
export default {
  semi: false,
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
}
```

### 10.8 `.husky/pre-commit`

```sh
#!/usr/bin/env sh

branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" = "main" ]; then
  echo "error: tried to commit directly to main branch"
  exit 1
fi

pnpm run pretty-quick
pnpm run lint
pnpm run typecheck

echo
echo 'everything okay'
echo
```

### 10.9 `.gitignore`

Must cover `node_modules/`, `dist/`, `.astro/`, `.vercel/`, `.env` and `.env.*` (except `.env.example`), `.cursor/mcp.json`, `test-results/`, `playwright-report/`, and any local reference checkout directory.

`.cursor/mcp.json` holds live API keys and **must** be ignored. Only `.cursor/mcp.json.example` is committed.

There is no `.npmrc`. Under pnpm 11 every setting this template needs lives in `pnpm-workspace.yaml` (§10.1b), and keeping a second, partly-redundant config file only invites the two to disagree.

---

## 11. Implementation specification

### 11.1 `src/config/locales.ts`

The single source of truth for locales, imported by `astro.config.ts` and the type layer.

```ts
export const LOCALES = ["en"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"
```

To change the shipped language, edit the array. To add a locale, add it here and set `i18n.routing: "manual"` in `astro.config.ts` (§7.6).

### 11.2 `src/lib/orbitype/config.ts`

Centralises the questions the data layer asks about its own configuration.

```ts
import {
  ORBITYPE_API_SQL_URL,
  ORBITYPE_API_SQL_KEY,
  ORBITYPE_MOCK,
} from "astro:env/server"

const PLACEHOLDER_KEYS = new Set(["", "your-api-key", "changeme"])

export function isMockMode(): boolean {
  return ORBITYPE_MOCK === true
}

export function hasSqlConfigured(): boolean {
  if (!ORBITYPE_API_SQL_URL) return false
  const key = (ORBITYPE_API_SQL_KEY ?? "").trim()
  return !PLACEHOLDER_KEYS.has(key.toLowerCase())
}

export function sqlEndpoint(): string {
  return ORBITYPE_API_SQL_URL
}

export function sqlKey(): string {
  return ORBITYPE_API_SQL_KEY ?? ""
}

export const ORBITYPE_API_KEYS_URL =
  "https://app.orbitype.com/settings/api-keys"
```

Treating a literal `"your-api-key"` as unconfigured mirrors the predecessor and prevents a confusing error loop when someone copies `.env.example` without editing it.

### 11.3 `src/lib/orbitype/client.ts`

The single point of contact with Orbitype.

```ts
import { hasSqlConfigured, sqlEndpoint, sqlKey } from "./config"

export class OrbitypeError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: string,
  ) {
    super(message)
    this.name = "OrbitypeError"
  }
}

export async function orbitypeSql<T = unknown>(
  sql: string,
  bindings: Record<string, unknown> = {},
): Promise<T[]> {
  if (!hasSqlConfigured())
    throw new OrbitypeError("Orbitype SQL API is not configured.")

  const response = await fetch(sqlEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": sqlKey() },
    body: JSON.stringify({ sql, bindings }),
  })

  if (!response.ok) {
    // Error bodies are inconsistent: 400 is text/plain, 404 is JSON.
    // Always read as text. A bad key returns 404, never 401.
    const body = await response.text().catch(() => undefined)
    throw new OrbitypeError(
      `Orbitype SQL request failed with ${response.status}`,
      response.status,
      body,
    )
  }

  const data = await response.json()
  return Array.isArray(data) ? (data as T[]) : ([data] as T[])
}
```

Rules for this module: never logs the key; never called from a component; the only place `fetch` targets Orbitype.

### 11.4 `src/lib/normalize-sections.ts`

Orbitype sometimes stores nested arrays. Every `sections` read passes through here first.

```ts
import type { Section } from "~/types/section"

function isSection(value: unknown): value is Section {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as Section)._orbi?.component === "string"
  )
}

export function normalizeSections(sections: unknown): Section[] {
  if (!Array.isArray(sections)) return []

  const result: Section[] = []

  function walk(items: unknown[]): void {
    for (const item of items) {
      if (Array.isArray(item)) walk(item)
      else if (isSection(item)) result.push(item)
    }
  }

  walk(sections)
  return result
}
```

### 11.5 `src/lib/orbitype/seed.ts`

**One definition of starter content, serving three consumers:** mock mode, the unconfigured/empty fallback, and `POST /api/setup/seed`. That unification is why FR-07 holds in mock mode — a slug-aware lookup naturally returns `null` for slugs it does not know. Recorded as ADR-0012.

Requirements:

- Export a `seedPages()` builder returning an array of `Page` objects with generic, client-neutral content, and `seedPosts()` likewise.
- Export `findSeedPage(slug)` returning the matching page **or `null`**. It must never fall back to the welcome page for an arbitrary slug.
- The `home` seed is the welcome page: a single `SectionWelcome` section carrying the setup steps, the API-keys URL, whether a SQL key appears to be present (which controls installer-button visibility), and the MCP configuration snippet.
- Localized fields carry both `en` and `de`, so the shape is self-documenting even though the template ships single-locale.

The welcome steps:

1. Create a SQL connector in Orbitype and point it at your Postgres database.
2. Create a connector-scoped API key. Link to `https://app.orbitype.com/settings/api-keys`.
3. Add `ORBITYPE_API_SQL_URL` and `ORBITYPE_API_SQL_KEY` to `.env`, and set `ORBITYPE_MOCK=false`. Show the exact lines.
4. Install the CMS schema — one click, once the key is present. This creates `uid()` first, then the tables.
5. Seed starter content, or create your first page row with `slug = 'home'`.
6. Wire Orbitype MCP in `.cursor/mcp.json` from the committed example, then run `orbitype_get_context`.
7. Build your first section component and publish matching JSON.

### 11.6 `src/lib/orbitype/pages.ts`

Every reader follows the same three-branch shape: mock → try live → fall back. That shape is what makes FR-08 through FR-10 hold uniformly.

```ts
import type { Page } from "~/types/page"
import { orbitypeSql } from "./client"
import { hasSqlConfigured, isMockMode } from "./config"
import { findSeedPage } from "./seed"
import { normalizeSections } from "~/lib/normalize-sections"

function normalizePage(page: Page): Page {
  return { ...page, sections: normalizeSections(page.sections) }
}

export async function getPage(slug: string): Promise<Page | null> {
  // Returns null for unknown slugs, which is what preserves FR-07 in mock mode.
  if (isMockMode() || !hasSqlConfigured()) {
    const seeded = findSeedPage(slug)
    return seeded ? normalizePage(seeded) : null
  }

  try {
    const rows = await orbitypeSql<Page>(
      "SELECT * FROM pages WHERE slug = :slug LIMIT 1",
      { slug },
    )
    const row = rows[0]
    if (row) return normalizePage(row)
    const seeded = findSeedPage(slug)
    return seeded ? normalizePage(seeded) : null
  } catch (error) {
    console.error("[orbitype] getPage failed, serving fallback:", error)
    const seeded = findSeedPage(slug)
    return seeded ? normalizePage(seeded) : null
  }
}

export async function listPageSlugs(): Promise<
  Array<Pick<Page, "slug" | "updated_at">>
> {
  if (isMockMode() || !hasSqlConfigured())
    return seedPages().map(({ slug, updated_at }) => ({ slug, updated_at }))

  try {
    return await orbitypeSql(
      "SELECT slug, updated_at FROM pages ORDER BY updated_at DESC",
    )
  } catch (error) {
    console.error("[orbitype] listPageSlugs failed:", error)
    return []
  }
}
```

`listPageSlugs()` serves both `getStaticPaths` in static mode and the sitemap in both modes.

`posts.ts` mirrors this with `listPosts({ page, limit, status })` and `getPost(id)`, filtering on `status->>'value' = 'published'` by default. `settings.ts` exposes `getSettings(id)`. `templates.ts` exposes `getTemplate(name)`. `comments.ts` and `contacts.ts` provide read and insert paths, gated on their feature flags, and **every insert includes `RETURNING`**.

### 11.7 `src/lib/orbitype/schema.ts`

Holds the DDL from §8.4 as string constants, the `uid()` function, the migration statements, and the idempotency wrapper.

```ts
function toIdempotentSql(sql: string): string {
  return sql.replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
}

// Must run before any CREATE TABLE: every table's primary key defaults to uid().
export const CREATE_UID_FUNCTION_SQL = `...`

export const CMS_SCHEMA_SQL_SAFE = {
  pages: toIdempotentSql(CREATE_PAGES_TABLE_SQL),
  posts: toIdempotentSql(CREATE_POSTS_TABLE_SQL),
  settings: toIdempotentSql(CREATE_SETTINGS_TABLE_SQL),
  contacts: toIdempotentSql(CREATE_CONTACTS_TABLE_SQL),
  templates: toIdempotentSql(CREATE_TEMPLATES_TABLE_SQL),
} as const

export const CMS_MIGRATIONS_SQL = {
  /* ALTER TABLE ... ADD COLUMN IF NOT EXISTS */
} as const

export type CmsTable = keyof typeof CMS_SCHEMA_SQL_SAFE
```

### 11.8 `src/lib/sections.ts`

The registry. This replaces the predecessor's framework-specific resolution, which matches on a Vue compiler artefact with no `.astro` equivalent. Keying on the filename is not a workaround; it is a more direct expression of the contract in §8.5.

```ts
import type { AstroInstance } from "astro"

const modules = import.meta.glob<AstroInstance>(
  "/src/components/sections/Section*.astro",
  { eager: true },
)

function nameFromPath(path: string): string {
  return path
    .split("/")
    .pop()!
    .replace(/\.astro$/, "")
}

export const sectionRegistry: Record<string, AstroInstance["default"]> =
  Object.fromEntries(
    Object.entries(modules).map(([path, module]) => [
      nameFromPath(path),
      module.default,
    ]),
  )

export function resolveSection(
  name: string | undefined,
): AstroInstance["default"] | undefined {
  if (!name) return undefined
  return sectionRegistry[name]
}

export function knownSectionNames(): string[] {
  return Object.keys(sectionRegistry).sort()
}
```

Two notes. `AstroComponentFactory` is not exported from the `astro` root, so `AstroInstance["default"]` is the correct public type — which means no `any` cast is needed anywhere in the registry or renderer. And the debug fallback is named `DebugPanel.astro`, not `SectionDebug.astro`, so it does not match the `Section*` glob: it is not a CMS-addressable section.

`knownSectionNames()` feeds the debug panel, which turns a silent typo into a self-diagnosing error.

### 11.9 `src/components/sections/AnySection.astro`

```astro
---
import { resolveSection } from "~/lib/sections"
import DebugPanel from "./DebugPanel.astro"
import type { Section } from "~/types/section"
import type { Locale } from "~/config/locales"

interface Props {
  data: Section
  locale: Locale
}

const { data, locale } = Astro.props
const { _orbi, ...sectionProps } = data
const Component = resolveSection(_orbi?.component)
---

{
  Component ? (
    <Component {...sectionProps} locale={locale} />
  ) : (
    <DebugPanel data={data} />
  )
}
```

Contract notes: `_orbi` is destructured off so it never reaches the component as a prop; `locale` is injected so every section can call `translate()`; and the component variable must be capitalized for Astro to treat it as a component rather than an HTML tag.

### 11.10 `src/components/sections/DebugPanel.astro`

Renders a bordered card containing: a `Debug` badge; the text `Missing section component`; the requested component name in a `<code>`; the key count of the payload; a collapsed `<details>` with pretty-printed JSON; and the list of known section names for comparison.

It must never throw, even if `data` is malformed or `_orbi` is absent.

### 11.11 `src/components/common/SafeHtml.astro`

CMS content is raw HTML, and `set:html` performs no escaping. Every insertion goes through here.

```astro
---
import { sanitize } from "~/lib/sanitize"

interface Props {
  html: string | undefined
  class?: string
}

const { html, class: className } = Astro.props
---

<div class={className} set:html={sanitize(html ?? "")} />
```

```ts
// src/lib/sanitize.ts
import sanitizeHtml from "sanitize-html"

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "a",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
    "figure",
    "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    "*": ["class"],
  },
  allowedSchemes: ["https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
}

export function sanitize(html: string): string {
  return sanitizeHtml(html, OPTIONS)
}
```

The allowlist is deliberately narrower than the library default, and `target="_blank"` links get `rel="noopener noreferrer"` automatically. Sanitising server-side also means the library never reaches the client bundle.

### 11.12 `src/middleware.ts`

Mandatory. Without it, `routeRules`' `/[...slug]` catch-all causes `/api/**` responses to be CDN-cached.

```ts
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware((context, next) => {
  // The `/[...slug]` route rule also matches /api/**, and there is no
  // declarative opt-out: an empty rule object is dropped from the compiled
  // set rather than shadowing the catch-all.
  if (context.cache.enabled && context.url.pathname.startsWith("/api/")) {
    context.cache.set(false)
  }
  return next()
})
```

The `cache.enabled` guard avoids a spurious warning when no cache provider is configured, such as in dev or static mode.

### 11.13 `src/pages/[...slug].astro`

The core route.

```astro
---
import Base from "~/layouts/Base.astro"
import Seo from "~/components/seo/Seo.astro"
import AnySection from "~/components/sections/AnySection.astro"
import { getPage, listPageSlugs } from "~/lib/orbitype/pages"
import { getTemplate } from "~/lib/orbitype/templates"
import { parseRoute } from "~/lib/i18n"
import { translate } from "~/lib/i18n"
import { buildPageSeo } from "~/lib/seo"

export const prerender = import.meta.env.RENDER_MODE === "static"

export async function getStaticPaths() {
  if (import.meta.env.RENDER_MODE !== "static") return []
  const slugs = await listPageSlugs()
  // The root path is `params: { slug: undefined }`, not an empty string.
  // Params must be strings. `Astro` is unavailable here — use import.meta.env.SITE.
  return buildStaticPathEntries(slugs)
}

const { locale, slug } = parseRoute(Astro.params.slug)
const page = await getPage(slug)

if (!page) return Astro.rewrite("/404")

const template = await getTemplate(page.template ?? null)
const sections = [
  ...(template?.sections_before ?? []),
  ...page.sections,
  ...(template?.sections_after ?? []),
]

if (Astro.cache.enabled) {
  Astro.cache.set({
    tags: [`page:${page.id}`],
    lastModified: new Date(page.updated_at),
  })
}

const seo = buildPageSeo({
  page,
  locale,
  site: Astro.site,
  path: Astro.url.pathname,
})
---

<Base locale={locale}>
  <Seo slot="head" {...seo} />
  <main>
    <span class="sr-only">{translate(page.title, locale)}</span>
    {sections.map((section) => <AnySection data={section} locale={locale} />)}
  </main>
</Base>
```

Requirements the implementation must satisfy: `/` resolves to slug `home`; a missing row produces a real 404 status, not a 200 with an error page; and `sections` being absent or malformed renders an empty main rather than throwing, which `normalizeSections` guarantees.

Per-page tags accumulate on top of the config rule rather than replacing it, which is what lets `/api/revalidate` invalidate one entry instead of a whole collection.

### 11.14 SEO

`src/lib/seo.ts` is pure: it takes a row plus request context and returns a plain object. `src/components/seo/Seo.astro` renders it. No fetching, no globals.

The returned shape must cover FR-17: `title` (truncated to 60 characters), `description` (HTML stripped, truncated to 160), `keywords`, `canonical`, `alternates` (one per configured locale plus `x-default`), the Open Graph set, the Twitter set, and a JSON-LD graph.

JSON-LD: a `WebPage` node with a nested `Article`, `publisher` and `isPartOf: WebSite`. Emit an `Organization` + `WebSite` graph once in `Base.astro`.

`buildPageSeo` must handle a missing `page.head` gracefully, and merge `page.head` (a free-form JSON column) over the computed defaults so editors can override per page.

### 11.15 API endpoints

All endpoints set `export const prerender = false`.

**`src/pages/api/setup/install-schema.ts`** — POST, body `{ table?: CmsTable | "all" }`. Returns 400 with an actionable message including the API-keys URL when the SQL env is missing. **Runs `CREATE_UID_FUNCTION_SQL` first**, then each `CREATE TABLE IF NOT EXISTS`, collecting per-table `{ table, status, error? }` results and returning `{ ok, message, results }`. Never aborts the whole batch on one failure.

**`src/pages/api/setup/migrate.ts`** — POST. Applies the additive `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements, same result shape.

**`src/pages/api/setup/seed.ts`** — POST. Inserts the seed content from §11.5 with `RETURNING`, skipping rows whose slug already exists.

**`src/pages/api/revalidate.ts`** — POST, body `{ tags?: string[], path?: string }`. Requires `REVALIDATE_SECRET`, compared in constant time, and rate-limited. Calls `context.cache.invalidate()` for each. Returns 404 when no secret is configured, so an unconfigured deployment exposes nothing. Two behaviours to document: invalidation is _soft_, marking entries stale for background revalidation rather than purging them; and path matching is exact with no globs, so a trailing-slash mismatch silently does nothing.

**`src/pages/api/forms/contact.ts`** — POST. Validate with a Zod schema (required first name, last name, valid email, non-empty message). Send the email via `src/lib/email.ts`. Then best-effort insert into `contacts` with `RETURNING`; swallow insert errors because the email already succeeded. Include a honeypot field plus a per-IP rate limit.

**`src/pages/api/comments.ts`** — GET lists comments for a post, POST inserts one. Both return 404 when the comments flag is off, so a disabled feature is not merely hidden in the UI.

**`src/pages/api/og/page.ts`** and **`og/post.ts`** — generate an `ImageResponse` from `title`, `description` and optional `image` query parameters. Defaults come from `PUBLIC_SITE_NAME` and `PUBLIC_OG_LOGO_PATH` — never a third-party logo. Runs on the Node runtime; no edge runtime is available with this adapter. Requires `@types/react` to typecheck, and passing plain object element trees instead of JSX is a Satori-documented path that Vercel does not officially support.

**`src/pages/sitemap.xml.ts`** — enumerate `listPageSlugs()` and published posts, emit one `<url>` per slug per configured locale with `<lastmod>` from `updated_at` and `<xhtml:link rel="alternate">` entries.

**`src/pages/robots.txt.ts`** — allow all by default, reference `/sitemap.xml` and `/llms.txt`. If a `NOINDEX` flag is set for staging, emit `Disallow: /` instead.

**`src/pages/llms.txt.ts` / `llms-full.txt.ts`** — the llmstxt.org convention: an H1 with the site name, a blockquote summary, then sections of links. `llms-full.txt` adds a short excerpt per entry.

### 11.16 `src/lib/email.ts`

**Provider-agnostic by decision (§23.1).** Define the interface and ship a stub that throws a clear, actionable error until a provider is wired.

```ts
export interface EmailMessage {
  to: string
  from: string
  fromName?: string
  subject: string
  text: string
  html?: string
}

export interface EmailProvider {
  readonly name: string
  send(message: EmailMessage): Promise<void>
}
```

The stub throws `"No email provider configured. Implement EmailProvider in src/lib/email.ts."` Keeping the provider behind this one module means adopting one is a single-file change. Whichever provider a project picks, call its HTTP API with `fetch` — no SDK. Log the provider's status and body on failure, never the API key.

### 11.17 `src/layouts/Base.astro`

Owns `<html lang>` and `<head>`. Responsibilities: the `head` slot for `<Seo />`; the global stylesheet; self-hosted font preloads; favicon and manifest links; the `Organization` + `WebSite` JSON-LD graph; `<ConsentScripts />`; and the `Navigation` / `Footer` shell.

`ConsentScripts.astro` injects GTM **only** when `PUBLIC_GTM_ID` is non-empty, and pushes a consent-default-denied state before the container loads. With no id configured it renders nothing — zero third-party JS, which is the default state and what NFR-01 measures.

`Footer.astro` renders `© {new Date().getFullYear()} {PUBLIC_SITE_NAME}`. No hardcoded company name.

### 11.18 `src/lib/phrases.ts`

The typed chrome-string catalogue. Content strings live in the CMS; these are UI labels the CMS never supplies.

```ts
export const phrases = {
  address: { en: "Address", de: "Adresse" },
  all_rights_reserved: {
    en: "All rights reserved",
    de: "Alle Rechte vorbehalten",
  },
  company: { en: "Company", de: "Firma" },
  download: { en: "Download", de: "Herunterladen" },
  email: { en: "Email", de: "E-Mail" },
  first_name: { en: "First name", de: "Vorname" },
  homepage: { en: "Homepage", de: "Startseite" },
  last_name: { en: "Last name", de: "Nachname" },
  learn_more: { en: "Learn more", de: "Mehr erfahren" },
  load_more: { en: "Load more", de: "Mehr laden" },
  menu: { en: "Menu", de: "Menü" },
  message: { en: "Message", de: "Mitteilung" },
  page_not_found: { en: "Page not found", de: "Seite nicht gefunden" },
  save: { en: "Save", de: "Speichern" },
  search: { en: "Search", de: "Suche" },
  send: { en: "Send", de: "Senden" },
  sent_successfully: { en: "Sent successfully", de: "Erfolgreich gesendet" },
  share_content: { en: "Share content", de: "Inhalt teilen" },
  subscribe: { en: "Subscribe", de: "Abonnieren" },
  subscribed_successfully: {
    en: "Subscribed successfully",
    de: "Erfolgreich abonniert",
  },
} as const

export type PhraseKey = keyof typeof phrases
```

Resolved through the same `translate()` function as CMS content, with locale passed explicitly.

---

## 12. Section component catalogue

### 12.1 Authoring rules

1. One section per file, named `Section<Name>.astro`, in `src/components/sections/`.
2. A typed `Props` interface. Localized fields typed `I18nString`. Always accept `locale: Locale`.
3. Never fetch. Never import from `src/lib/orbitype/`.
4. Render CMS HTML only through `<SafeHtml />`.
5. 60–100 lines target, 150 hard maximum. Extract `_`-prefixed local sub-components past that.
6. Every prop must be optional-safe: a missing prop degrades, never throws.
7. Provide the matching JSON snippet in a leading comment, with correct key order, so an agent can publish it without re-deriving the shape.
8. No `@apply` in `<style>` blocks (§10.5). No hardcoded hex colours — use theme tokens.
9. Close every tag. The Astro 7 compiler treats unclosed tags as errors.

### 12.2 Starter set

| Component            | Purpose                                             | Props                                                   |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `SectionSpacer`      | Vertical space. Required by the `pages` default.    | `height: number`                                        |
| `SectionProse`       | Heading plus rich text. The workhorse.              | `title: I18nString`, `content: I18nString`              |
| `SectionQuote`       | Pull quote with attribution.                        | `quote: I18nString`, `author?: string`, `role?: string` |
| `SectionHero`        | Above-the-fold headline, lead, CTA, optional media. | `title`, `lead`, `ctaLabel?`, `ctaHref?`, `img?`        |
| `SectionFeatureGrid` | 2–4 column feature cards.                           | `title`, `items: Array<{ title, text, icon? }>`         |
| `SectionCta`         | Conversion band.                                    | `title`, `text?`, `ctaLabel`, `ctaHref`                 |
| `SectionWelcome`     | First-run onboarding, installer and seeder.         | see §12.4                                               |

### 12.3 Reference implementation of a section

```astro
---
// SectionProse.astro
//
// CMS JSON:
// {
//   "title":   { "en": "Heading", "de": "Titel" },
//   "content": { "en": "<p>Body</p>", "de": "<p>Text</p>" },
//   "_orbi":   { "component": "SectionProse" }
// }
import SafeHtml from "~/components/common/SafeHtml.astro"
import { translate } from "~/lib/i18n"
import type { I18nString } from "~/types/i18n"
import type { Locale } from "~/config/locales"

interface Props {
  title?: I18nString
  content?: I18nString
  locale: Locale
}

const { title, content, locale } = Astro.props
const heading = translate(title, locale)
---

<section class="py-section mx-auto w-full max-w-3xl px-6">
  {
    heading && (
      <h2 class="mb-4 text-2xl font-semibold tracking-tight">{heading}</h2>
    )
  }
  <SafeHtml html={translate(content, locale)} class="prose max-w-none" />
</section>
```

### 12.4 SectionWelcome

The largest section and the template's first impression. Requirements:

- Renders the ordered setup steps from §11.5, each expandable, first one expanded by default.
- Copy-to-clipboard on every code block, degrading to selectable text without JS.
- The schema-installer button appears **only** when a SQL key is present, posts to `/api/setup/install-schema`, and renders per-table results inline. A two-step confirmation before executing, since it writes DDL to a real database.
- A separate seed action posting to `/api/setup/seed`.
- A prominent link to `https://app.orbitype.com/settings/api-keys`.
- The MCP configuration snippet, matching `.cursor/mcp.json.example` exactly.
- The Figma → Cursor → Orbitype workflow, as a short ordered list.
- No third-party logo or company credit.
- Accordion via `<details>`/`<summary>`; the only scripts are clipboard, the installer fetch and the seeder fetch.

Props: `title`, `lead`, `capabilities[]`, `steps[]` (each with `title`, `text`, optional `kind: "wizard" | "seed"` and `code`), `hasSqlKeyConfigured?`, `apiKeysUrl?`, and `locale`.

---

## 13. Installation and setup flow

### 13.1 Three-minute start

```bash
corepack enable
pnpm install
pnpm run setup
pnpm dev
```

Open `http://localhost:4321/`. With no credentials you get the welcome/onboarding screen. This must work on a clean machine (NFR-07).

Note `pnpm run setup`, not `pnpm setup` — the latter is a built-in pnpm command and will not run the script.

### 13.2 What `pnpm run setup` does

`scripts/setup.mjs`, then `astro sync`, then `husky`.

```js
import fs from "node:fs"

const ENV_TEMPLATE = `HOST=localhost
PORT=4321

RENDER_MODE=server
ORBITYPE_MOCK=true

ORBITYPE_API_SQL_URL=https://core.orbitype.com/api/sql/v1
ORBITYPE_API_SQL_KEY=

PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_SITE_NAME=My Site
PUBLIC_SITE_DESCRIPTION=Describe this site in one sentence.
PUBLIC_ORGANIZATION_NAME=My Organisation
`

if (!fs.existsSync(".env")) {
  console.log("create .env file...")
  fs.writeFileSync(".env", ENV_TEMPLATE)
}

if (
  !fs.existsSync(".cursor/mcp.json") &&
  fs.existsSync(".cursor/mcp.json.example")
) {
  console.log(
    "hint: copy .cursor/mcp.json.example to .cursor/mcp.json and add your keys",
  )
}
```

It defaults `ORBITYPE_MOCK=true`, so the first `pnpm dev` after cloning always succeeds. The generated `.env` and the committed `.env.example` must agree — the predecessor's disagree, which is a needless first-run trap.

### 13.3 Local modes

**Mock mode** — frontend work, no CMS dependency:

```bash
ORBITYPE_MOCK=true pnpm dev
```

All CMS reads return built-in seed content. No network calls to Orbitype.

**Live mode** — real content:

```bash
ORBITYPE_MOCK=false
ORBITYPE_API_SQL_URL="https://core.orbitype.com/api/sql/v1"
ORBITYPE_API_SQL_KEY="<your connector key>"
PUBLIC_SITE_URL="https://www.example.com"
```

If the key is missing, invalid, or the API returns nothing, the welcome screen appears again rather than an error page.

**Caching is inert in dev.** `cache.enabled` is `false` under `astro dev`, so `set()` and `invalidate()` do nothing. Testing cache behaviour requires `astro build && astro preview` or a real deployment.

### 13.4 First-run checklist for a new project

1. Clone the template; delete `.git` and initialise fresh history.
2. Set `name` in `package.json`; confirm no author or third-party credit anywhere (§2.3).
3. Replace `public/favicon.svg` and `public/og-default.jpg`.
4. Set the `PUBLIC_*` variables.
5. Create the Orbitype SQL connector and API key.
6. Run the schema installer from the welcome screen, then the seeder.
7. Copy `.cursor/mcp.json.example` → `.cursor/mcp.json`, add keys, reload MCP in Cursor.
8. Run `pnpm run mcp:verify`, then `orbitype_get_context` in a chat, and confirm the connector.
9. Design in Figma; build sections; publish JSON.
10. Set tokens in `src/styles/global.css`; self-host the design's fonts.
11. Adjust `routeRules` TTLs for the site's editing cadence.
12. Configure the Vercel project and domain; add the apex redirect to `vercel.json`; set `REVALIDATE_SECRET` and wire the Orbitype Workflow.

### 13.5 What to edit first

1. Branding and shell — `src/components/layout/Navigation.astro`, `Footer.astro`, `src/layouts/Base.astro`.
2. Design tokens — `src/styles/global.css`.
3. Welcome and starter content — `src/lib/orbitype/seed.ts`, `src/components/sections/SectionWelcome.astro`.
4. Sections — add to `src/components/sections/`.
5. SEO defaults — `src/lib/seo.ts`, `src/lib/site.ts`.
6. Locale — `src/config/locales.ts`.

---

## 14. Environment variables reference

### 14.1 Server-only

| Variable               | Required                 | Default                                | Purpose                                                          |
| ---------------------- | ------------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| `ORBITYPE_API_SQL_URL` | for live mode            | `https://core.orbitype.com/api/sql/v1` | SQL API endpoint                                                 |
| `ORBITYPE_API_SQL_KEY` | for live mode            | —                                      | Connector-scoped key, sent as `X-API-KEY`                        |
| `ORBITYPE_MOCK`        | no                       | `false`                                | Truthy forces built-in seed content                              |
| `RENDER_MODE`          | no                       | `server`                               | `server` or `static`                                             |
| `REVALIDATE_SECRET`    | for instant invalidation | —                                      | Shared secret for `/api/revalidate`. Unset disables the endpoint |
| `MAIL_API_KEY`         | for forms                | —                                      | Transactional email provider key                                 |
| `MAIL_FROM_EMAIL`      | for forms                | —                                      | Verified sender                                                  |
| `MAIL_FROM_NAME`       | no                       | `PUBLIC_SITE_NAME`                     | Sender display name                                              |
| `MAIL_TO_EMAIL`        | for forms                | —                                      | Recipient                                                        |

**Never** prefix any of these `PUBLIC_`. Names must match `/^[A-Z0-9_]+$/`.

### 14.2 Client-exposed configuration

| Variable                   | Default                 | Purpose                                                     |
| -------------------------- | ----------------------- | ----------------------------------------------------------- |
| `PUBLIC_SITE_URL`          | `http://localhost:4321` | Canonical origin                                            |
| `PUBLIC_SITE_NAME`         | —                       | Site and organisation display name; drives footer copyright |
| `PUBLIC_SITE_DESCRIPTION`  | —                       | Default meta description                                    |
| `PUBLIC_ORGANIZATION_NAME` | —                       | JSON-LD publisher                                           |
| `PUBLIC_ORGANIZATION_LOGO` | `/favicon.svg`          | JSON-LD logo                                                |
| `PUBLIC_OG_LOGO_PATH`      | `/favicon.svg`          | Logo composited into generated OG images                    |
| `PUBLIC_OG_IMAGE_ENABLED`  | `true`                  | Toggle dynamic OG generation                                |
| `PUBLIC_COMMENTS_ENABLED`  | `false`                 | Post comments feature flag                                  |
| `PUBLIC_GTM_ID`            | `""`                    | Empty disables all GTM injection                            |
| `PUBLIC_TWITTER_SITE`      | `""`                    | Twitter card `site`                                         |
| `PUBLIC_TWITTER_CREATOR`   | `""`                    | Twitter card `creator`                                      |

The default locale is not an environment variable — it lives in `src/config/locales.ts`, because `astro.config.ts` needs it at build time and the type layer needs it statically.

### 14.3 Editor-only, never in the app's `.env`

`ORBITYPE_SQL_API_KEY_*` and `ORBITYPE_S3_API_KEY_*` are consumed by `.cursor/mcp.json` for authoring, and Figma tokens by the Figma MCP. They belong in your shell environment or the gitignored MCP file, not in the deployed application's configuration. `pnpm run mcp:env` prints the export lines.

### 14.4 Migrating a `.env` from the Nuxt template

`NUXT_PUBLIC_SITE_URL` → `PUBLIC_SITE_URL`, and so on for every `NUXT_PUBLIC_*`. Provider-specific mail variables → `MAIL_*`. `ORBITYPE_*` unchanged. `ISR_*` has no equivalent — caching is configured in `astro.config.ts` and invalidation uses `REVALIDATE_SECRET`. This table also appears in the README.

---

## 15. MCP configuration

### 15.1 Committed example

`.cursor/mcp.json.example` — the MCP layer is stack-independent, so this matches the predecessor's shape. Name entries after the connector's scope, never after a client.

```json
{
  "mcpServers": {
    "orbitype-sql": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": { "X-API-KEY": "${env:ORBITYPE_SQL_API_KEY}" }
    },
    "orbitype-s3-public": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": { "X-API-KEY": "${env:ORBITYPE_S3_PUBLIC_API_KEY}" }
    },
    "orbitype-s3-private": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": { "X-API-KEY": "${env:ORBITYPE_S3_PRIVATE_API_KEY}" }
    }
  }
}
```

MCP reads `${env:...}` from **Cursor's environment**, not from the project `.env`. `pnpm run mcp:env` prints the export lines to add to your shell profile. After editing `mcp.json`, reload MCP in Cursor (Settings → Tools & MCP).

### 15.2 Multiple sites

One key equals one connector. For several sites or environments, add one entry per scope with a descriptive suffix — `orbitype-sql-staging`, `orbitype-sql-local`. Same section components, different data.

### 15.3 Session discipline

`orbitype_get_context` → `sql_readonly_query` for reads → `sql_crud_execute` for writes. Confirm the connector before any mutation. This is the single most important operational habit in the whole workflow: the failure mode it prevents is writing content into the wrong client's database.

### 15.4 Figma MCP

Configured at the Cursor level. This repository commits no Figma MCP entry, but `pnpm run figma:verify` checks that the wiring works before you rely on it.

---

## 16. Developer workflow (Figma → Cursor → Orbitype)

```
Figma design
   │
   ├─► Figma MCP ──► inspect frames, extract specs
   │
   ├─► build src/components/sections/Section*.astro
   │
   ├─► Orbitype MCP: orbitype_get_context → sql_crud_execute
   │
   ▼
PostgreSQL sections JSON ──► rendered page
   │
   └─► Orbitype app: ongoing content operations
```

1. **Design.** Lay out pages and sections in Figma. Name frames after the section components they will become.
2. **Build, inside Cursor.** Use Figma MCP for specs. Create the `.astro` section with typed props. Verify it in mock mode with hardcoded props before touching the database.
3. **Publish.** `orbitype_get_context`, read the target row, back up its `sections`, then `sql_crud_execute` with `RETURNING` to append or insert the new section object — human-readable key first, `_orbi` last.
4. **Verify.** Re-read the row, open the URL, check the rendered output, the SEO tags and the JSON-LD.
5. **Hand over.** Content editors continue in the Orbitype app. Developers do not hand-edit production JSON.

### Add-a-section checklist

1. Create `src/components/sections/SectionName.astro` with a typed `Props`, a `locale` prop, and the JSON snippet in a leading comment.
2. Confirm the filename matches the intended `_orbi.component` exactly, including case.
3. Append the JSON to `pages.sections` via SQL, with `RETURNING`.
4. `SELECT slug, sections FROM pages WHERE slug = '...'` to verify the shape is a flat array.
5. Open the page.
6. Run `pnpm run typecheck` and `pnpm run lint`.

---

## 17. Testing specification

### 17.1 Playwright configuration

Mock mode is forced so no credentials are needed.

```ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      "ORBITYPE_MOCK=true pnpm exec astro dev --port 4173 --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
})
```

First-time browser install: `pnpm exec playwright install`.

### 17.2 Required smoke coverage

| Test                    | Assertion                                                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Home renders            | `/` returns 200 and shows the welcome heading                                                                                            |
| Welcome accordion       | The first step is expanded; clicking the second expands it                                                                               |
| Unknown section         | A page with a bogus `_orbi.component` renders the debug panel, not a blank page or a 500                                                 |
| Nested sections         | A `[[{...}]]` payload still renders, via `normalizeSections`                                                                             |
| Missing page            | An unknown slug returns HTTP 404 — **in mock mode**, which is what catches a regression of the seed-fallback defect                      |
| **Zero client JS**      | On `/`, no `<script>` with a `src` under the build asset directory is present, and an empty `PUBLIC_GTM_ID` yields no third-party script |
| **No key leakage**      | The HTML of `/` contains no substring of `ORBITYPE_API_SQL_KEY`                                                                          |
| SEO tags                | `/` emits canonical, `og:title`, `twitter:card` and at least one JSON-LD block                                                           |
| Sitemap                 | `/sitemap.xml` returns 200 and `application/xml`                                                                                         |
| Robots                  | `/robots.txt` returns 200 and references the sitemap                                                                                     |
| **Page is CDN-cached**  | A repeat request to `/` reports a CDN hit (build + preview or deployed, not dev)                                                         |
| **API is never cached** | An `/api/**` response carries no CDN cache-control header                                                                                |

The zero-JS, no-leakage and API-not-cached tests are what keep NFR-01, NFR-03 and NFR-13 from silently regressing. They are not optional.

Locale-route tests are added only when a project configures more than one locale.

### 17.3 Build-output verification

A CI step after `pnpm run build` that greps `dist/` for the SQL key value and fails the build on any hit. Cheap, and it catches the one mistake with real consequences.

---

## 18. Deployment specification

### 18.1 Vercel

- Framework preset: Astro. Build `pnpm run build`. Install `pnpm install --frozen-lockfile`.
- Set every variable from §14.1 and §14.2 per environment. `ORBITYPE_MOCK` must be `false` in production.
- **Pin the Node version explicitly** in the Vercel project settings, matching `engines`. The adapter infers the production runtime from the Node major running the build and otherwise falls back to a default, so leaving it unset means the build machine silently decides your production runtime. Only even-numbered majors ≥ 22 are supported.

### 18.2 `vercel.json`

Holds the security headers from §10.3 plus per-project redirects.

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "example.com" }],
      "destination": "https://www.example.com/:path*",
      "permanent": true
    }
  ]
}
```

### 18.3 Caching and invalidation

In `server` mode, `routeRules` set per-route `maxAge` and `swr`, and `cacheVercel()` translates them into Vercel CDN cache headers plus cache tags. A cache hit is served from the CDN with no function invocation.

An edit becomes visible either when the TTL lapses, or immediately when an Orbitype Workflow calls `POST /api/revalidate` with the affected tags. Wire that per §8.8, remembering that the triggering SQL must include `RETURNING` and that a workflow writing back to its own row needs a lock.

Recommended TTLs: 300 seconds for marketing pages, 60 for a site under active editing. `/api/**` is never cached, enforced by `src/middleware.ts`.

Two properties to document for operators: invalidation is soft, marking entries stale for background revalidation rather than purging them; and because the CDN cache is regional, a long-tail page may re-fetch from the SQL API once per region.

### 18.4 Pre-launch checklist

1. `pnpm run verify` passes.
2. `pnpm run build` succeeds; the key-leakage grep finds nothing.
3. Lighthouse mobile Performance ≥ 95 on the home page.
4. `ORBITYPE_MOCK=false` and real content renders in production.
5. `/sitemap.xml`, `/robots.txt`, `/llms.txt` all return 200.
6. OG images render for a page and a post; the logo is the project's, not a third party's.
7. Every configured locale resolves, with correct `hreflang` and `x-default`.
8. An unknown slug returns 404, not 200.
9. The contact form delivers email and the row lands in `contacts`.
10. Security headers present on a production response.
11. A repeat page request reports a CDN hit; an `/api/**` request does not.
12. The Orbitype Workflow fires `/api/revalidate` and the edit appears without a redeploy.
13. No third-party company name, individual author, or client name anywhere in the repository or rendered output (§2.3).
14. GTM absent when no container id is configured.

---

## 19. Architecture Decision Records

Format: Context, Decision, Consequences, Status. One file each under `docs/adr/`.

### ADR-0001 — Introduce a second, performance-first stack

**Context.** The existing Orbitype template is Nuxt/Vue: an excellent fit for application-like sites, heavier than necessary for landing pages and brochure sites where nearly all payload is static content.

**Decision.** Build a second, independent template on Astro, targeting content-first sites, reimplementing the identical Orbitype contract so content and workflow transfer without change.

**Consequences.** Two templates to maintain. Section components are not shared, which is acceptable because sections are per-project design work anyway. Stack selection becomes an explicit early decision, documented in §3.3. The Orbitype data contract becomes a de facto public interface between the two and must not drift.

**Status.** Accepted.

### ADR-0002 — HTTP-only Orbitype access, no SDK

**Context.** Orbitype exposes a REST API and MCP server and requires no framework plugin. Verified: no `orbitype` package exists on npm, and every official integration example uses raw HTTP.

**Decision.** Access Orbitype exclusively through `fetch` against the documented endpoints, wrapped in one module.

**Consequences.** Zero framework coupling in the data layer, which is unit-testable and portable. No generated types — row shapes are hand-written in `src/types/` and must be kept in sync with §8.4. Error handling must account for the inconsistent response shapes documented in §8.3.

**Status.** Accepted.

### ADR-0003 — No client-side UI framework

**Context.** Astro can render Vue, React and others as islands, with zero JS when no hydration directive is used. Reusing the predecessor's Vue sections was considered and would have halved the initial port effort.

**Decision.** Ship no UI framework integration. Interactivity is HTML-first, then vanilla TypeScript in scoped `<script>` blocks, then modules in `src/components/islands/`.

**Consequences.** Smallest possible payload and no hydration cost. Section components cannot be shared with the Nuxt template. Complex interactive widgets are more work — accepted, because §3.3 routes such projects to the other stack. One wrinkle: `@types/react` is still a devDependency, because `@vercel/og` will not typecheck without it. It contributes no runtime code.

**Status.** Accepted.

### ADR-0004 — Filename-based section registry

**Context.** The predecessor globs Vue SFCs eagerly and matches `_orbi.component` against compiler-injected name properties. `.astro` components expose no equivalent.

**Decision.** Glob `src/components/sections/Section*.astro` eagerly and key the registry by filename with the extension stripped.

**Consequences.** The documented contract — `_orbi.component` equals the filename — becomes the literal implementation. Existing CMS rows work unchanged. Adding a section requires no registration (NFR-09). Renaming a file is a breaking content change and must be paired with a SQL update. A component whose filename does not start with `Section` is invisible to the CMS, which is why the debug fallback is named `DebugPanel.astro`.

**Status.** Accepted.

### ADR-0005 — Native CDN caching with tag invalidation, not adapter ISR

**Context.** The predecessor renders every CMS page per request with no caching, so every visitor triggers a database round trip. Astro 7 offers two ways to fix that: the Vercel adapter's `isr` option, or Astro's newly stabilised top-level `cache` plus `routeRules`, backed on Vercel by `cacheVercel()`.

**Decision.** Use native `cache` + `routeRules` with `cacheVercel()`. Support `output: "static"` via a `RENDER_MODE` switch, in which mode the cache config is inert.

**Consequences.** Cache hits are served from the CDN with no function invocation (NFR-12), a strict improvement over the predecessor. Query parameters survive, so FR-13's pagination works — adapter ISR strips them, which is what disqualified it. Per-route TTLs become possible. `/api/**` is uncached by default rather than needing an exclusion regex, though a middleware guard is still mandatory because the `/[...slug]` catch-all rule would otherwise match it. Tag invalidation pairs naturally with Orbitype Workflows.

What we accept: `cacheVercel()` is new and labelled experimental, so the adapter is pinned exactly and two tests assert caching behaviour. On a miss we lose ISR's durable store, cache shielding and request collapsing, so the SQL API is hit about once per region per TTL rather than once globally. Switching to ISR later is a config change, not a rewrite.

**Status.** Accepted.

### ADR-0006 — Explicit locale propagation, self-derived routing

**Context.** The predecessor's translate helper reads the active locale from ambient Vue i18n context. Astro has no ambient reactive context. Separately, Astro's built-in i18n is folder-based and does not combine with the root catch-all route a CMS-driven site needs.

**Decision.** `translate(value, locale)` takes locale explicitly, and every section component accepts a `locale` prop injected by `AnySection`. Locale is derived from URL segments in `parseRoute()` rather than from Astro's i18n middleware. The locale list lives in one file.

**Consequences.** Slightly more verbose. Translation becomes a pure function — trivially testable, no hidden dependency, impossible to get wrong by rendering outside a provider. Changing the shipped language is a one-line edit; adding a locale additionally requires `i18n.routing: "manual"` but no page-tree restructuring.

**Status.** Accepted.

### ADR-0007 — Secrets are server-only, enforced by lint

**Context.** The Orbitype API key grants arbitrary SQL execution against the connector's database. Leaking it into a client bundle would be severe.

**Decision.** Secrets are declared server-only in the env schema and imported only from modules under `src/lib/orbitype/` and `src/pages/api/`. An ESLint rule forbids importing `astro:env/server` from `src/components/`. A build-output grep in CI fails on any occurrence of the key value in `dist/`.

**Consequences.** Three independent layers of protection: type-level, lint-level, and build-artefact-level. Components can never fetch CMS data directly, which reinforces §7.3. Astro additionally rejects a `client` + `secret` env field outright, so the schema itself cannot express the mistake.

**Status.** Accepted.

### ADR-0008 — Tailwind v4 with CSS-first tokens

**Context.** The predecessor uses Tailwind v3 with a JS config and most brand colours hardcoded as hex values throughout components, which defeats the point of having tokens. `@astrojs/tailwind` cannot be installed against Astro 7.

**Decision.** Tailwind v4 via the Vite plugin, with all design tokens declared in `@theme` in `src/styles/global.css`. Hardcoded colour values in components are a lint-level concern and a review-blocking issue.

**Consequences.** One place to retheme. No JS config file. Custom variants use `@custom-variant`, and there is no `darkMode` key. One sharp edge: `@apply` does not work inside `.astro` `<style>` blocks without a `@reference` line, so it is forbidden there and shared classes live in the global stylesheet.

**Status.** Accepted.

### ADR-0009 — The installer creates the `contacts` table

**Context.** The predecessor defines `contacts` DDL but omits it from its installer's hardcoded table list, so form inserts silently fail until someone creates the table manually.

**Decision.** Include `contacts` in the installer, with generic columns matching what the form submits.

**Consequences.** Forms persist correctly on first run. One more table in the default schema, which projects not using forms can ignore. The predecessor's project-specific columns are dropped in favour of a generic `topic` field.

**Status.** Accepted.

### ADR-0010 — Ship `SectionSpacer`

**Context.** The `pages.sections` column defaults to an array containing one `SectionSpacer` entry with `height: 0`. A template that omits the component would render the debug fallback on every freshly created page.

**Decision.** Ship `SectionSpacer.astro`, honouring a numeric `height` prop, and keep the schema default unchanged.

**Consequences.** A newly created page renders cleanly. The schema default stays byte-identical to the predecessor's, preserving cross-stack compatibility. `SectionSpacer` uses `height` as its first JSON key, which is the documented fallback when a section has no natural text label.

**Status.** Accepted.

### ADR-0011 — The application owns the `uid()` function

**Context.** Every CMS table defaults its primary key to `uid()`. This function is not provided by Orbitype or by Postgres — it is an ordinary user-defined function that the predecessor creates through a side-channel SQL script. A schema installer that creates tables without it fails against an empty connector.

**Decision.** Treat `uid()` as part of the schema this template owns. `CREATE OR REPLACE FUNCTION uid()` runs as the installer's first statement, before any `CREATE TABLE`.

**Consequences.** Installation works against a fresh connector with no manual preparation, which is the entire point of the welcome-screen installer. The function is idempotent, so re-running is safe. Its keyspace is 62⁶ ≈ 5.7 × 10¹⁰, comfortable for `pages` and `posts` but thin for high-volume tables — if `contacts` or `comments` ever reach six figures, switch those tables to a wider identifier and record it as a new ADR.

**Status.** Accepted.

### ADR-0012 — Seed content is the single source of starter content

**Context.** Three features need the same starter content: mock mode, the fallback shown when the CMS is unreachable or empty, and a database seeder. Defining them separately guarantees drift. The predecessor already unifies the first two, and its fallback is slug-aware.

**Decision.** `src/lib/orbitype/seed.ts` defines starter pages and posts once. Mock mode, the fallback path and `POST /api/setup/seed` all read from it. `findSeedPage(slug)` returns `null` for unknown slugs.

**Consequences.** Starter content cannot drift between local development and a seeded database. FR-07 holds in mock mode for free, because an unknown slug returns `null` rather than the welcome page — a subtle failure the earlier design would have shipped. Seed content must stay generic and client-neutral, since it is what every new project sees first.

**Status.** Accepted.

### ADR-0013 — `templates`-driven section composition

**Context.** Marketing sites repeat chrome sections — a CTA band above the footer, a trust bar below the hero — across many pages. Duplicating those objects into every page's `sections` array makes a global change an N-row edit.

**Decision.** Add a `templates` table with `sections_before` and `sections_after`. A page naming a template renders `[...sections_before, ...page.sections, ...sections_after]`.

**Consequences.** Shared chrome changes in one row. The rendered section list is no longer identical to the page's own column, so debugging must account for composition, and the section renderer stays unchanged because composition happens in the route. Pages naming no template are unaffected.

**Status.** Accepted.

---

## 20. Cursor rules to author

`.cursor/rules/` must be complete on day one. Rules use YAML frontmatter with `priority`, `applies_to`, `triggers`, `related_rules`, then Purpose, When to Apply, When Not to Apply, Guidelines, Examples, Common Pitfalls, Related Rules, Tags.

### 20.1 Rules carried over essentially unchanged

Stack-neutral principles, with `applies_to` patterns updated to `*.astro` and framework-specific examples replaced.

| Rule                                              | Change required                                                                    |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `00-meta/00-naming.mdc`                           | none beyond directory names                                                        |
| `00-meta/01-structure.mdc`                        | none                                                                               |
| `00-meta/02-general-principles.mdc`               | strip framework-specific style guidance; keep KISS, YAGNI, type safety, modularity |
| `20-principles/01-do-not-lie.mdc`                 | replace framework examples                                                         |
| `20-principles/02-prefer-vanilla.mdc`             | strengthen — this stack's central principle                                        |
| `20-principles/04-do-not-over-engineer.mdc`       | replace framework examples                                                         |
| `20-code-quality/01-code-quality-improvement.mdc` | replace directory-structure example with this repository's                         |
| `40-guidelines/01-keep-it-simple.mdc`             | none                                                                               |
| `40-guidelines/02-keep-urls-flat.mdc`             | none                                                                               |

### 20.2 Rules deliberately dropped

| Predecessor rule                            | Why                                                                                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `30-patterns/01-store-management.mdc`       | no client-side reactive state exists                                                                                                           |
| `30-patterns/02-state-machine.mdc`          | no client-side mode switching at the framework level                                                                                           |
| `30-patterns/03-strategy.mdc`               | over-engineering risk; the `RENDER_MODE` switch is a boolean, not a strategy pattern                                                           |
| `30-patterns/04-composition.mdc`            | superseded by `10-architecture/02-composition.mdc`                                                                                             |
| `20-principles/03-prefer-oop.mdc`           | replaced by `03-prefer-explicit.mdc` — this codebase is modules and pure functions, and an OOP-preference rule would actively mislead an agent |
| `60-ui/01-data-structure-visualization.mdc` | replaced by `01-section-authoring.mdc`                                                                                                         |
| `60-ui/02-research-ui-library.mdc`          | replaced by `02-research-before-building.mdc`; this template ships no UI library                                                               |

### 20.3 New rules to write in full

**`10-architecture/01-base-stack.mdc`** — the stack from §6.1 with pinned versions; Node and pnpm requirements including the odd-major exclusion; `pnpm run setup` versus `pnpm setup`; the explicit list of forbidden dependencies (any UI framework integration, animation libraries, HTTP clients, CSS-in-JS); branching model (`main` protected, `dev` integration, `feature/*` and `fix/*`); Husky gate; Vercel deployment; the Tailwind v4 CSS-first note; the TypeScript 6 constraint and why. Must not mention Nuxt, Vue or Nitro as part of this stack.

**`10-architecture/02-composition.mdc`** — file-size limits (60–100 ideal, 100–150 needs justification, 150+ needs approval); `_` prefix for local non-reusable sub-components; when to split a section; the layer-boundary table from §7.3 as a hard rule, specifically that components never import the data layer.

**`10-architecture/03-orbitype-cms.mdc`** — the most important rule. Content: purpose; when and when not to apply; the Figma → Cursor → Orbitype workflow; the request flow; the sections contract with key-order requirements and a correct `.astro` example; the nested-array normalisation requirement; the `RETURNING` requirement on every mutation; the real error shapes from §8.3; the codebase map (`AnySection.astro`, `src/lib/sections.ts`, `src/lib/orbitype/`, `src/pages/api/`); MCP setup and mandatory session discipline; the MCP tool table; the add-a-section checklist; the safe content workflow; the pitfalls list; the canonical SQL snippets. Triggers: `orbitype`, `cms`, `sections`, `mcp`, `sql_crud`, `figma`, `headless cms`, `page content`.

**`10-architecture/04-rendering-and-performance.mdc`** — the two render modes and when to use each; the caching model, the mandatory `maxAge` on every route rule, and the `/api/**` middleware guard; the escalation ladder for interactivity from §7.5; the zero-JS budget as a hard rule with the Playwright assertion that enforces it; image handling; font self-hosting; the rule that no third-party script may be added without an explicit performance-budget decision.

**`50-database/01-database-interaction.mdc`** — always use `:name` bindings, never string interpolation; always include `RETURNING` on mutations; read before write; back up `sections` before mutating; `orbitype_get_context` before any write; prefer `jsonb_insert` and `jsonb_build_object` over reconstructing whole arrays; the connector-scoping model; `CREATE TABLE IF NOT EXISTS` and `CREATE OR REPLACE FUNCTION` for idempotency; `uid()` must exist before any table is created; never run destructive DDL against a production connector without explicit human confirmation.

**`60-ui/01-section-authoring.mdc`** — the authoring rules from §12.1; the required leading JSON comment; `SafeHtml` for all CMS HTML; the `locale` prop requirement; no `@apply` in `<style>` blocks and no hardcoded hex colours; closing every tag; accessibility baseline (one `h1` per page, semantic landmarks, visible focus, alt text); the requirement that every prop be optional-safe.

**`60-ui/02-research-before-building.mdc`** — check the existing section catalogue and common components before creating anything new; prefer extending a section with a `variant` prop over cloning it; check whether a native HTML element solves the problem before writing script.

**`index.mdc`** — the navigation index listing every rule with a one-line description, the core principles, and the project conventions. It must reference only rules that exist, and it must be updated in the same commit as any new rule. The predecessor's index is a cautionary example: it is partially corrupted and points at a `50-database` rule that was never written.

---

## 21. Phased build plan with acceptance criteria

Execute in order. Do not begin a phase until the previous phase's criteria pass.

### Phase 0 — Verification gate — COMPLETE

Every row of §6.2 verified; `docs/DEVIATIONS.md` written.

**Acceptance:** `docs/DEVIATIONS.md` contains an entry for V-01 through V-14, each marked "as documented" or describing the actual API and the adaptation.

### Phase 1 — Scaffold and toolchain — COMPLETE

Initialise the project with the pinned versions. Wire the Vercel adapter, Tailwind, TypeScript, ESLint, Prettier, Husky. Write `package.json`, `pnpm-workspace.yaml`, `astro.config.ts`, `src/config/locales.ts`, `src/middleware.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.mjs`, `.gitignore`, `.env.example`, `.cursor/mcp.json.example`, `vercel.json`, `scripts/*.mjs`, `.husky/pre-commit`, `src/styles/global.css`. Fresh git history.

**Acceptance — all met:** `pnpm install && pnpm run setup && pnpm dev` starts a server on a clean machine with no credentials. `pnpm run lint` and `pnpm run typecheck` both pass with zero errors and zero warnings. `pnpm run build` completes through the Vercel adapter in `server` mode. `git log` shows only commits authored by this project.

**Verified beyond the stated criteria:** the production build emits **zero client JavaScript** — the entire browser payload is one CSS file and the favicon — so NFR-01 holds from the scaffold onward rather than becoming a Phase 8 discovery.

`src/pages/index.astro` is a deliberate placeholder. Phase 4 replaces it with the CMS-driven `[...slug].astro` catch-all.

### Phase 2 — Types and data layer

Write `src/types/*`. Write `src/lib/orbitype/{config,client,schema,seed,pages,posts,settings,templates,comments,contacts}.ts`. Write `src/lib/{i18n,normalize-sections,phrases,sanitize}.ts`. No Astro rendering imports anywhere in `src/lib/orbitype/`.

**Acceptance:** Type-checks clean. `getPage("home")` returns seed content with no credentials configured; `getPage("does-not-exist")` returns `null`. Neither throws with a deliberately invalid key. `normalizeSections([[{...}]])` returns a flat array. No file under `src/lib/orbitype/` imports from `src/components/` or `src/pages/`.

### Phase 3 — Section registry and renderer

Write `src/lib/sections.ts`, `AnySection.astro`, `DebugPanel.astro`, `SectionSpacer.astro`, `SectionProse.astro`, `SafeHtml.astro`.

**Acceptance:** A hardcoded array containing a `SectionProse` object and a bogus-component object renders, respectively, the prose section and the debug panel. `knownSectionNames()` lists exactly the `Section*` components and excludes `DebugPanel` and `AnySection`. No `any` cast appears in the registry or renderer.

### Phase 4 — Layout, SEO, and the main route

Write `Base.astro`, `Navigation.astro`, `Footer.astro`, `ConsentScripts.astro`, `Seo.astro`, `JsonLd.astro`, `src/lib/seo.ts`, `src/lib/site.ts`, `src/pages/[...slug].astro`, `src/pages/404.astro`.

**Acceptance:** `/` renders the welcome screen in mock mode. It emits canonical, hreflang including `x-default`, OG, Twitter and JSON-LD. An unknown slug returns HTTP 404. Footer copyright is env-driven. With `PUBLIC_GTM_ID` empty, the page contains no third-party script tag.

### Phase 5 — Welcome experience, installer, seeder

Write `SectionWelcome.astro`, `src/pages/api/setup/{install-schema,migrate,seed}.ts`. Complete the seed content.

**Acceptance:** The welcome screen shows all setup steps; the first is expanded and the second expands on click. The installer button is hidden without a SQL key and visible with one. Posting to the installer without configuration returns 400 with a message containing the API-keys URL. Against a real connector it creates `uid()` first, then all tables, idempotently, reporting per-table results. The seeder populates starter content and is safe to re-run. No third-party logo or company credit appears.

### Phase 6 — Posts, comments, forms

Write `src/pages/posts/index.astro`, `src/pages/posts/[id]/[...slug].astro`, `src/pages/api/comments.ts`, `src/pages/api/forms/contact.ts`, `src/lib/email.ts`, plus `SectionQuote`, `SectionHero`, `SectionFeatureGrid`, `SectionCta`.

**Acceptance:** `/posts` lists seed posts and paginates, with pagination surviving a cached response. A post detail page composes its `sections` through `AnySection`. Comment endpoints return 404 when the flag is off. The contact endpoint rejects invalid input with 400 and, when configured, sends an email and inserts a row with `RETURNING`; a failed insert does not fail the request. The unconfigured email stub throws an actionable message.

### Phase 7 — Machine-readable endpoints and revalidation

Write `sitemap.xml.ts`, `robots.txt.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `api/og/page.ts`, `api/og/post.ts`, `api/revalidate.ts`.

**Acceptance:** The sitemap validates as XML and includes every page and post for every configured locale with `lastmod` and alternates. `robots.txt` references the sitemap and `llms.txt`. Both llms files follow the convention. OG endpoints return images using the project's own logo and site name as defaults, verified on a real preview deployment rather than only locally. `/api/revalidate` returns 404 without a configured secret, 401 with a wrong one, and invalidates on a correct one.

### Phase 8 — Tests and quality gates

Write `playwright.config.ts` and the tests from §17.2, including zero-JS, no-key-leakage, mock-mode 404, and both caching assertions. Add the build-output grep.

**Acceptance:** `pnpm run verify` passes with no credentials. The zero-JS test fails if a UI framework integration is added — verify by temporarily adding one, confirming the failure, then removing it. The API-not-cached test fails if `src/middleware.ts` is removed.

### Phase 9 — Documentation and rules

Write `README.md`, `docs/01-orbitype-cms.md`, `docs/02-sections-cookbook.md`, `docs/03-deployment.md`, all thirteen ADRs, and every rule from §20.

**Acceptance:** No document, rule or comment instructs the reader to use Nuxt, Vue or Nitro. `index.mdc` references only rules that exist. The README states the provenance relationship and contains the `NUXT_PUBLIC_*` → `PUBLIC_*` migration table. A repository-wide search for forbidden author names, third-party company names, and any client or project name returns nothing (§2.3).

### Phase 10 — Deployment verification

Deploy to a Vercel preview. Configure environment variables. Verify against a real Orbitype connector, and wire the Orbitype Workflow to `/api/revalidate`.

**Acceptance:** Every item in §18.4 passes.

---

## 22. Definition of done

The template is complete when all of the following hold:

1. Every FR, NFR and OR in §5 is satisfied and demonstrably verified.
2. All phases in §21 have passed their acceptance criteria.
3. `pnpm install && pnpm run setup && pnpm dev` works on a clean machine with no credentials and shows the welcome screen.
4. `pnpm run verify` passes with no credentials.
5. A content-only page ships zero bytes of framework JavaScript, asserted by a test.
6. The Orbitype API key appears nowhere in `dist/`, asserted by a CI grep.
7. Both render modes build and serve correctly.
8. A page authored for the Nuxt template renders correctly here without any data change, proving contract compatibility.
9. Lighthouse mobile Performance ≥ 95 on the default pages.
10. A repeat page request is served from the CDN with no function invocation; `/api/**` is never cached.
11. An Orbitype Workflow can make a content edit visible without a redeploy.
12. No third-party company, individual, or client name is credited or referenced anywhere (§2.3).
13. No documentation describes the Nuxt stack as this repository's stack (§2.5).
14. `docs/DEVIATIONS.md` records every departure from this blueprint, with reasons.

---

## 23. Known risks, open questions and owner decisions

### 23.1 Owner decisions — 2026-07-27

Recorded here because they change requirements, not just implementation.

| #   | Question                            | Decision                                                                                                                                                                                     |
| --- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Repository and package name         | `orbitype-astro-template`.                                                                                                                                                                   |
| 2   | Locale set                          | Ship single-locale `["en"]`, with the list in `src/config/locales.ts` so swapping the language is a one-line edit and adding one is cheap. Localized CMS fields keep the multi-locale shape. |
| 3   | Transactional email provider        | None chosen. Ship a provider-agnostic interface plus a stub that throws until configured (§11.16).                                                                                           |
| 4   | Revalidation hook in v1             | **Yes**, conditional on Orbitype supporting row-change triggers. It does (§8.8), so `/api/revalidate` ships in v1 accepting `{ tags?, path? }`.                                              |
| 5   | Should `settings` drive site chrome | No. Navigation and footer stay code-configured; the `settings` read path exists but is unused.                                                                                               |
| 6   | Package manager                     | pnpm, replacing npm throughout.                                                                                                                                                              |
| 7   | Caching mechanism                   | Native `cache` + `routeRules` with `cacheVercel()`, not adapter ISR (ADR-0005).                                                                                                              |
| 8   | Client neutrality                   | No client, project or site name anywhere in this template. Clones are exempt (§2.3).                                                                                                         |

### 23.2 Risks

| #    | Risk / question                                                                                                                     | Impact                                                     | Mitigation                                                                                                         |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| R-01 | ~~Astro 7 APIs differ from this document~~                                                                                          | Resolved                                                   | Phase 0 complete; deviations recorded                                                                              |
| R-02 | Orbitype DDL response bodies and SQL error shapes still unverified                                                                  | Installer may misreport a partial failure                  | Needs a live key. Treat throw-versus-no-throw as the only signal; verify in Phase 5                                |
| R-03 | **No CMS preview or draft workflow.** Verified: Orbitype has none — versioning applies only to Workflows, preview only to Artifacts | Editors cannot see unpublished changes before they go live | Documented gap. Candidate v2 feature: a signed preview cookie plus a draft-aware read path                         |
| R-04 | ~~ISR delay means edits are not instant~~                                                                                           | Largely resolved                                           | Workflow-triggered `/api/revalidate` makes edits near-instant. Residual: invalidation is soft, not a purge         |
| R-05 | Filename-keyed registry makes a rename a breaking content change                                                                    | A renamed section silently shows the debug panel           | ADR-0004 and the CMS rule; the debug panel's known-names list makes the failure self-diagnosing                    |
| R-06 | Two templates diverge on the shared data contract                                                                                   | Content stops being portable between stacks                | §8 is normative; any schema change requires an ADR in both repositories                                            |
| R-07 | Tailwind v4 syntax unfamiliar to a v3-experienced team                                                                              | Slow start, hardcoded colours creeping in                  | Base-stack rule calls it out; lint against raw hex values                                                          |
| R-08 | No client framework makes a genuinely complex widget expensive                                                                      | Scope creep toward the wrong stack                         | §3.3 selection criteria; escalate to the Nuxt template when interactivity dominates                                |
| R-09 | The SQL API accepts arbitrary statements, so a key leak is severe                                                                   | Data loss or exfiltration                                  | ADR-0007's three enforcement layers; separate keys per environment; least-privilege database user on the connector |
| R-10 | `@vercel/og` needs `@types/react`, and the non-JSX element form is not officially supported by Vercel                               | OG images may break on a dependency update                 | Pin `@vercel/og`; verify on a real preview deploy in Phase 7                                                       |
| R-11 | **`cacheVercel()` is experimental and weeks old, with no field reports**                                                            | Caching could misbehave in production                      | Adapter pinned exactly; two caching tests; falling back to ISR is a config-level change                            |
| R-12 | `uid()` collisions at scale — 62⁶ keyspace                                                                                          | Duplicate primary keys on high-volume tables               | Fine for `pages` and `posts`. If `contacts` or `comments` approach six figures, widen those identifiers (ADR-0011) |
| R-13 | An Orbitype Workflow that writes back to its trigger row loops                                                                      | Runaway credit consumption                                 | §8.8 documents the atomic-lock requirement; the revalidation workflow must not write back                          |
| R-14 | Multi-locale expansion needs `i18n.routing: "manual"`, which is under-documented                                                    | Friction when a project adds a second locale               | §7.6 and ADR-0006 record the constraint and the path                                                               |

### 23.3 Remaining open questions

1. Whether Orbitype's Database trigger fires reliably on admin-GUI saves, or only on API writes with `RETURNING`. Needs a live connector.
2. The create and delete payload shapes for Workflow Database triggers — only the update shape is documented.
3. The Orbitype rate-limit window length behind `x-ratelimit-limit: 6000`.
4. Whether a `LICENSE` file should be added, and under what terms.

---

## 24. References

**Orbitype:**

- Documentation home — `https://www.orbitype.com/docs`
- API authentication, MCP endpoint and tool list — `https://www.orbitype.com/docs/oQSPNY`
- SQL API — `https://www.orbitype.com/docs/Z7BYWp/sql-api`
- S3 API — `https://www.orbitype.com/docs/aQRYBR/s3-api`
- Workflows — `https://www.orbitype.com/docs/vSzpbA/workflows`
- Developer overview, connectors and API keys — `https://www.orbitype.com/docs/8SP7lq`
- Platform introduction — `https://www.orbitype.com/docs/JGZK7A`
- Pricing and credit costs — `https://www.orbitype.com/docs/Tvr7Ho/detailed-pricing`
- API-key management — `https://app.orbitype.com/settings/api-keys`

**Framework and platform:**

- Astro documentation — `https://docs.astro.build`
- Astro route caching — `https://docs.astro.build/en/guides/caching/`
- Astro Vercel adapter — `https://docs.astro.build/en/guides/integrations-guide/vercel/`
- Astro v7 upgrade guide — `https://docs.astro.build/en/guides/upgrade-to/v7/`
- Tailwind CSS v4 — `https://tailwindcss.com/docs`
- Vercel cache-control headers — `https://vercel.com/docs/caching/cache-control-headers`
- Vercel CDN cache purge — `https://vercel.com/docs/caching/cdn-cache/purge`
- Playwright — `https://playwright.dev`
- llms.txt convention — `https://llmstxt.org`
- Schema.org — `https://schema.org`

**On the predecessor.** This template's contract originates in a Nuxt/Vue Orbitype CMS template. That implementation is not public and is deliberately not named or linked here (§2.3). Everything a build agent needs from it has been extracted into §8, which is normative and self-contained. Read §8 rather than looking for a reference repository, and treat anything Nuxt, Nitro or Vue as superseded by this document (§2.5).

---

**End of blueprint.** Changes to this document require an ADR when they alter an architectural decision, and a note in `docs/DEVIATIONS.md` when they alter an implementation detail.
