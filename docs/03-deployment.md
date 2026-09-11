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

**Deploy skew (unstyled site until hard refresh):** after a new production deploy, cached HTML can briefly reference hashed `/_astro/*.css` files that no longer exist. Vercel then serves those misses as **404 with `max-age=31536000, immutable`**, so visitors stay broken until a hard refresh. Mitigations in this repo:

1. Short `swr` on page `routeRules` (see `astro.config.ts`).
2. Middleware forces `no-store` on **404** responses that go through Astro.
3. `pnpm run cdn:revalidate` soft-invalidates tags `cms`, `pages`, `posts`, `page:home`.
4. GitHub workflow [`.github/workflows/cdn-revalidate.yml`](../.github/workflows/cdn-revalidate.yml) runs that script when a **Production** deployment succeeds (needs secrets below).

**You must also do this in the Vercel / GitHub dashboards:**

1. **Skew Protection** — already ON in the UI is good, but Astro also needs `adapter: vercel({ skewProtection: true })` (now in `astro.config.ts`). The gray banner “necessary steps… for your framework” refers to that. Redeploy after this change.
2. **Purge CDN Cache** once for Production — Skew Protection does **not** clear 404 responses already cached as `immutable` for a year. That purge is what unsticks visitors who already hit a missing CSS file.
3. Confirm `REVALIDATE_SECRET` in Vercel Production env.
4. GitHub secrets: `REVALIDATE_SECRET` + `PRODUCTION_SITE_URL` = `https://www.bistrozurlinde.ch` (for the post-deploy revalidate workflow).

Skew Protection alone cannot fix a CSS URL that already returned **404 + `max-age=31536000, immutable`** to a browser or edge; only a purge / hard refresh clears that.

After the next production deploy you can also run locally:

```bash
pnpm run cdn:revalidate https://www.bistrozurlinde.ch
```

`@astrojs/vercel` does **not** support `astro preview`, so CDN behaviour cannot be fully exercised locally. After deploy:

1. Request a page twice; the second response should show a CDN HIT (Vercel dashboard / response headers).
2. Confirm `/api/**` responses are never publicly cached (`src/middleware.ts` forces this).
3. Confirm every page’s stylesheet URL returns **HTTP 200** (not 404).
4. Set `REVALIDATE_SECRET` and `POST /api/revalidate` with `Authorization: Bearer <secret>` and body `{ "tags": ["page:home"] }` (or `{ "path": "/" }`).

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
- [ ] Stylesheet URLs on HTML pages return 200 (no sticky CSS 404)
- [ ] Skew Protection enabled; CDN purged after first rollout of this fix
- [ ] `cdn-revalidate` workflow secrets set; post-deploy invalidation works
- [ ] Workflow revalidation works (or documented as deferred)
- [ ] Schema installed via CLI only (`cms:install` / `cms:seed`)
- [ ] No client / third-party names in the template repo (clones may brand)

Also see [vercel-linking.md](vercel-linking.md) for reproducible Vercel linking without committing `.vercel/`.
