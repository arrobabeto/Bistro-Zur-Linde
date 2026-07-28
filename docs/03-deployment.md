# Deployment

## Render modes

| Mode               | Command                 | Pages                      | APIs                                                                                            |
| ------------------ | ----------------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| `server` (default) | `pnpm run build:server` | On-demand + CDN cache tags | Node serverless functions                                                                       |
| `static`           | `pnpm run build:static` | Fully prerendered at build | Still emitted as serverless functions by the Vercel adapter when present under `src/pages/api/` |

`RENDER_MODE=static` does **not** mean “no server”. Forms, OG, revalidate, and health probes remain server endpoints. Campaign sites that want zero runtime should remove or relocate APIs separately.

Both modes must pass in CI (`pnpm run build:server` and `pnpm run build:static`).

## Vercel

1. Import the repository. Framework preset: **Astro**.
2. Install command: `pnpm install --frozen-lockfile`
3. Build command: `pnpm run build` (or `pnpm run build:server`)
4. **Pin the Node.js version** in Project Settings to the same major as `.nvmrc` / `engines` in `package.json`.
5. Set environment variables from `.env.example` for Production / Preview / Development:
   - `ORBITYPE_MOCK=false` in production
   - `ORBITYPE_API_SQL_URL`, `ORBITYPE_API_SQL_KEY`
   - All required `PUBLIC_*` fields — **never** `http://localhost` in production
   - `REVALIDATE_SECRET` if you wire Orbitype Workflows
   - `MAIL_*` once an email provider is implemented in `src/lib/email.ts`
6. Schema install and seed are **CLI-only**: `pnpm run cms:install` / `pnpm run cms:seed` from an authorized machine. They are not HTTP endpoints.
7. Optional: add apex → `www` redirects in `vercel.json`.

## Caching

`cache: { provider: cacheVercel() }` plus `routeRules` in `astro.config.ts` emit CDN cache headers and tags at **runtime**. A cache hit is served with no function invocation.

`@astrojs/vercel` does **not** support `astro preview`, so CDN behaviour cannot be fully exercised locally. After deploy:

1. Request a page twice; the second response should show a CDN HIT (Vercel dashboard / response headers).
2. Confirm `/api/**` responses are never publicly cached (`src/middleware.ts` forces this).
3. Set `REVALIDATE_SECRET` and `POST /api/revalidate` with `Authorization: Bearer <secret>` and body `{ "tags": ["page:home"] }` (or `{ "path": "/" }`).

## Orbitype Workflow → revalidate

1. In Orbitype, create a Workflow with a **Database (table events)** trigger on `pages` (and/or `posts`).
2. Add a code node that `fetch`es your site:

```js
export default async function (payload) {
  const secret = process.env.REVALIDATE_SECRET // or hardcode via Workflow secrets
  const site = "https://www.example.com"
  const row = Array.isArray(payload) ? (payload[1] ?? payload[0]) : payload
  const tags = ["cms"]
  if (row?.id) tags.push(`page:${row.id}`)
  if (row?.slug) tags.push(`page-slug:${row.slug}`)

  await fetch(`${site}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ tags }),
  })
}
```

3. The triggering SQL must run through the Orbitype API with `RETURNING`. Do **not** write back to the same row without a lock — re-entrancy will loop.

## Pre-launch checklist

See blueprint §18.4 and [preview-promote.md](preview-promote.md). Minimum:

- [ ] `pnpm run verify` passes
- [ ] Node pin matches `.nvmrc` / Vercel Project Settings
- [ ] Unknown slug returns 404; CMS outage returns 503 (not a cached 404)
- [ ] Sitemap / robots / llms return 200; no localhost in production canonicals
- [ ] Security headers present; previews are `noindex`
- [ ] CDN hit on a repeat page request
- [ ] `/api/**` not cached
- [ ] Workflow revalidation works (or documented as deferred)
- [ ] Schema installed via CLI only (`cms:install` / `cms:seed`)
- [ ] No client / third-party names in the template repo (clones may brand)

Also see [vercel-linking.md](vercel-linking.md) for reproducible Vercel linking without committing `.vercel/`.
