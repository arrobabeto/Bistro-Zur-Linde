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
7. Apex `bistrozurlinde.ch` **308**s to `www` in `vercel.json` (one browser origin).

## Caching

**HTML pages are `no-store`** (`src/middleware.ts`). A normal refresh must fetch HTML that points at the **current** hashed `/_astro/*.css`. That is what the client/PM asked for; a CDN purge does not clear Chrome’s copy of an old document or a CSS **404 + immutable**.

Hashed CSS **200** responses are still cached by Vercel (they never pass through Astro middleware). Do not disable that.

`cacheVercel()` stays in `astro.config.ts` only so `/api/revalidate` can still run; there are **no** HTML `routeRules` TTLs on this site (see [ADR-0005](adr/0005-native-cdn-cache-over-isr.md)).

After this change is deployed, tabs that were already unstyled need **one normal refresh** (not hard refresh). Tabs that are never reloaded keep the old DOM in memory.

### Why a Purge CDN alone was not enough

Purge empties the **edge**. It does not empty the **browser**. F5 will reuse:

- cached HTML whose `<link>` names a dead CSS hash, or
- that CSS URL stored as **404 immutable** (~1 year)

Hard refresh bypasses local cache. HTML `no-store` makes F5 behave like “get current HTML”.

### Emergency (sticky `/_astro` 404 still on the edge)

```bash
npx vercel cache purge --type cdn --yes
```

Dashboard: project → Caches → Purge CDN (Production). Then F5, not only incognito.

### Checks

```bash
pnpm run check:asset-links -- --fixture tests/fixtures/asset-links
pnpm run check:asset-links -- https://www.bistrozurlinde.ch / /bistro /saali
```

Optional CMS tag invalidate (not the CSS fix):

```bash
pnpm run cdn:revalidate https://www.bistrozurlinde.ch
```

GitHub secrets for that workflow: `REVALIDATE_SECRET`, `PRODUCTION_SITE_URL`.

`@astrojs/vercel` does **not** support `astro preview`. After deploy:

1. HTML `Cache-Control: no-store`.
2. `/api/**` `no-store`.
3. Stylesheet href on the page returns **HTTP 200**.
4. Apex redirects to www.

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
- [ ] HTML pages send `Cache-Control: no-store` (normal refresh after deploy)
- [ ] `/api/**` not cached
- [ ] Stylesheet URLs on HTML pages return 200
- [ ] Apex redirects to `www`
- [ ] `pnpm run check:asset-links -- --fixture tests/fixtures/asset-links` in CI
- [ ] Skew Protection enabled in UI + `skewProtection: true` in adapter
- [ ] Emergency path known: **Purge CDN** if a CSS 404 is already immutable on the edge
- [ ] Workflow revalidation works (or documented as deferred)
- [ ] Schema installed via CLI only (`cms:install` / `cms:seed`)
- [ ] No client / third-party names in the template repo (clones may brand)

Also see [vercel-linking.md](vercel-linking.md) for reproducible Vercel linking without committing `.vercel/`.
