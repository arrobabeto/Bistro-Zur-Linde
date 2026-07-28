---
name: orbitype-read
description: >-
  Read-only Orbitype CMS access over the SQL HTTP API. Use when probing
  connector scope, listing pages/posts/settings, or inspecting sections JSON
  without mutating content.
---

# Orbitype read (HTTP SQL)

```bash
node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs context
node .agents/skills/orbitype-read/scripts/orbitype-sql.mjs query \
  'SELECT id, slug, updated_at FROM pages ORDER BY updated_at DESC'
```

Confirm `projectId` + `connectorId` before any write (hand off to `orbitype-publish`).

Hard rules: named bindings only; never log the API key; bad key returns **404**.
