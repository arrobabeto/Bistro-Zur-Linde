# Vercel linking runbook

`.vercel/` is gitignored. Do not commit `project.json`.

## One-time link (local)

```bash
pnpm dlx vercel@latest login
pnpm dlx vercel@latest link
```

Record org id and project id as CI secrets (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`), never in the public repo.

## CI pattern (optional deploy job)

1. `vercel pull --yes --environment=preview`
2. `vercel build`
3. `vercel deploy --prebuilt`

Pin the Vercel CLI version in CI (`pnpm dlx vercel@x.y.z`). Protect `main` (and the production branch) so the GitHub Actions `CI` workflow is required.

## Branch protection checklist

- [ ] Require `quality`, `e2e-mock`, `build-server`, `build-static`
- [ ] Disallow force pushes to production branch
- [ ] Require PR reviews for production
