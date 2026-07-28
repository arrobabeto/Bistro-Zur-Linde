---
name: orbitype-publish
description: >-
  Publish or mutate Orbitype CMS content over the SQL HTTP API with explicit
  user approval. Use when updating pages, posts, settings, or sections JSON.
  Never invoke implicitly for speculative writes.
---

# Orbitype publish (HTTP SQL)

Mutations require explicit user approval. Prefer `orbitype-read` for exploration.

```bash
node .agents/skills/orbitype-publish/scripts/orbitype-sql.mjs context
node .agents/skills/orbitype-publish/scripts/orbitype-sql.mjs query \
  'SELECT id, slug, sections FROM pages WHERE slug = :slug LIMIT 1' \
  --bind slug=home

# ONLY after user confirms — must include RETURNING
node .agents/skills/orbitype-publish/scripts/orbitype-sql.mjs mutate \
  "UPDATE pages SET sections = :sections::json WHERE slug = :slug RETURNING id, slug" \
  --bind slug=home
```

## Safe content workflow

1. `context` — confirm connector and environment.
2. `query` — backup current row.
3. Propose exact SQL + bindings.
4. After confirmation → `mutate` with `RETURNING`.
5. Re-query and verify render.
6. Run `pnpm run cms:validate`.

Hard rules: named bindings; always `RETURNING`; never DDL from agents against production without approval.
