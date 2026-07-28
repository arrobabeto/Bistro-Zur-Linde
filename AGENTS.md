# Astro + Orbitype repository instructions

## Required workflows

- For Figma inspection, use `.agents/skills/figma-rest-design-reader`.
- For CMS reads, use `.agents/skills/orbitype-read`.
- For CMS writes, use `.agents/skills/orbitype-publish` (never implicit).
- For Figma-to-site work, use `.agents/skills/astro-cms-build-from-figma`.
- Never treat a locally hardcoded prototype as a completed CMS implementation.

## CMS boundaries

- Editorial pages must use `src/pages/[...slug].astro`.
- Do not create physical marketing routes that bypass Orbitype.
- Content editable by a client belongs in Orbitype.
- Components receive content through typed props (+ Zod sidecars).
- A CMS section containing only `_orbi.component` is incomplete.
- Section components should stay under the documented size limit.

## Safety

- Never run DDL from an E2E test or from a deployed HTTP route.
- Use `pnpm run cms:install` / `cms:migrate` / `cms:seed` from an authorized machine.
- Never mutate Orbitype before confirming `projectId` and `connectorId`.
- Read and back up content before mutations.
- Every mutation requires `RETURNING` and explicit approval.
- Figma and Orbitype authoring credentials are local-only and must never be deployed.

## Surfaces

| Surface         | Skills                    | Connections                              |
| --------------- | ------------------------- | ---------------------------------------- |
| Cursor          | `.cursor/skills` symlinks | `.cursor/mcp.json`                       |
| Codex CLI/IDE   | `.agents/skills`          | scripts REST + `.env`                    |
| ChatGPT desktop | `.agents/skills`          | plugin/connector or local scripts        |
| ChatGPT web     | installed plugin/skills   | managed MCP/connector — not `.env` alone |
| CI              | scripts                   | preview keys only                        |

## Required verification

```bash
pnpm run verify
```
