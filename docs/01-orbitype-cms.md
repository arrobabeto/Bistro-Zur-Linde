# Orbitype CMS — Astro template guide

How content flows from Postgres through this Astro site, how to set up Orbitype MCP in Cursor, and how to add sections safely.

Official Orbitype API + MCP docs: [API Authentication](https://www.orbitype.com/docs/oQSPNY)

The normative contract (schema DDL, error shapes, SQL snippets) lives in [00-TEMPLATE-BLUEPRINT.md](00-TEMPLATE-BLUEPRINT.md) §8. This guide is the day-to-day operator view.

---

## 1. Big picture

This repository is an Astro marketing frontend that reads page content from PostgreSQL through the Orbitype SQL API.

### Request flow

1. Visitor opens a URL (for example `/`, `/about`, `/posts/...`).
2. `src/pages/[...slug].astro` (or a posts route) handles it.
3. The route calls `src/lib/orbitype/pages.ts` (or `posts.ts`).
4. That module POSTs `{ sql, bindings }` to Orbitype with `X-API-KEY`.
5. The row returns with a `sections` JSON array.
6. `normalizeSections()` flattens nested arrays, then `AnySection.astro` renders each entry.

### Cursor MCP vs the running site

| Layer                                         | Purpose                                           |
| --------------------------------------------- | ------------------------------------------------- |
| **Orbitype MCP** (`.cursor/mcp.json`)         | Lets Cursor read/write CMS data while you develop |
| **Astro app** (`.env` + `src/lib/orbitype/*`) | Serves the website at runtime                     |

MCP does **not** replace the Astro app. It replaces manual Orbitype UI edits and ad-hoc SQL during development.

---

## 2. Multiple websites

Orbitype scopes one API key to one connector. For several sites or environments, add one MCP entry per scope.

The committed `.cursor/mcp.json` ships a single `orbitype-sql` entry so clones do not show failed servers for unset env vars. For multi-site projects, copy patterns from `.cursor/mcp.json.example`:

- `orbitype-sql-prod-website`
- `orbitype-sql-prod-marketing`
- `orbitype-sql-local`
- `orbitype-s3-public-prod`
- `orbitype-s3-private-prod`

Same section components, different data.

---

## 3. Codebase map

| File                                       | Role                                     |
| ------------------------------------------ | ---------------------------------------- |
| `src/pages/[...slug].astro`                | Generic page route                       |
| `src/lib/orbitype/pages.ts`                | Fetches pages                            |
| `src/pages/api/setup/install-schema.ts`    | Creates `uid()` (if needed) and tables   |
| `src/pages/api/setup/seed.ts`              | Seeds homepage content                   |
| `src/components/sections/AnySection.astro` | Dynamic section renderer                 |
| `src/lib/normalize-sections.ts`            | Flattens malformed nested section arrays |
| `src/lib/sections.ts`                      | Filename-keyed registry                  |
| `src/types/section.ts`                     | Section shape with `_orbi.component`     |

### Starter section components

`SectionProse`, `SectionQuote`, `SectionWelcome`, `SectionSpacer`, `SectionHero`, `SectionFeatureGrid`, `SectionCta`, `SectionFeatureCallout`.

---

## 4. Sections system

Each page row holds metadata (`title`, `lead`, `keywords`, …) and a `sections` JSON array.

Each section object **must** include `_orbi.component`, matching the `.astro` filename without extension (`SectionProse.astro` → `"SectionProse"`).

**Key order matters.** Put a human-readable field first (`title`, `name`, `height`). Put `_orbi` **last**. Orbitype’s admin GUI labels rows by the first key — `_orbi` first makes the list unreadable.

```json
{
  "title": { "en": "Feature callout", "de": "Feature-Highlight" },
  "content": { "en": "<p>…</p>", "de": "<p>…</p>" },
  "variant": "highlight",
  "_orbi": { "component": "SectionFeatureCallout" }
}
```

Keep `sections` as a **flat** array of objects. Orbitype may store `[[{...}]]`; reads always pass through `normalizeSections()`.

---

## 5. Setup MCP in Cursor

`.cursor/mcp.json` is **committed** and uses only `${env:...}` placeholders (see ADR-0014). Clones inherit it.

1. Create a connector-scoped SQL key at [API keys](https://app.orbitype.com/settings/api-keys).
2. Put the same value in `.env` as `ORBITYPE_API_SQL_KEY` (for the app).
3. Run `pnpm run mcp:env` and add the printed `export ORBITYPE_SQL_API_KEY=...` to your shell profile (`~/.zshrc`). MCP reads Cursor’s environment, not the project `.env`.
4. Reload MCP in **Cursor Settings → Tools & MCP**.
5. In a new chat, call `orbitype_get_context`, then `sql_readonly_query` with `SELECT id, slug FROM pages LIMIT 5`.

Verify with `pnpm run mcp:verify`. The pre-commit hook runs `pnpm run mcp:safety` so a literal key can never be committed.

---

## 6. MCP tools

| Tool                                | Use for                                             |
| ----------------------------------- | --------------------------------------------------- |
| `orbitype_get_context`              | First call every session — confirms connector scope |
| `sql_readonly_query`                | Read/analyze pages, posts, settings                 |
| `sql_crud_execute`                  | INSERT/UPDATE/DELETE (always include `RETURNING`)   |
| `s3_list`, `s3_put`, `s3_delete`, … | Media (requires an S3 key entry)                    |

---

## 7. Safe workflow for content changes

1. `orbitype_get_context`
2. `sql_readonly_query` — read and back up current `sections` JSON
3. `sql_crud_execute` — apply update with `RETURNING`
4. Re-read and confirm `sections` is still a flat array
5. Open the target URL and verify rendering and SEO

### Append a section (note: `_orbi` last)

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

---

## 8. Common pitfalls

- Component name mismatch — `_orbi.component` must match the `.astro` filename
- Nested section arrays — always write flat; always normalise on read
- Missing `en` on a localized field — empty text everywhere
- Mutation without `RETURNING` — no confirmation the write happened
- Bad API key returns **404**, not 401; missing key returns plain-text **400**
- Writing through the wrong connector — always `orbitype_get_context` first
- Putting `_orbi` first — admin list becomes unreadable

---

## 9. Schema installer notes

On a fresh connector, `uid()` is often already present (Orbitype-provisioned). `CREATE OR REPLACE FUNCTION uid()` can fail with “must be owner of function uid”. The installer treats a working `SELECT uid()` as success and continues creating tables. See ADR-0011.

---

## References

- [Orbitype Docs — API Authentication](https://www.orbitype.com/docs/oQSPNY)
- [API keys](https://app.orbitype.com/settings/api-keys)
- Blueprint §8 — normative contract
- [ADR-0014](adr/0014-committed-mcp-json-with-env-placeholders.md) — committed MCP config
