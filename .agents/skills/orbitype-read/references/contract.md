# Orbitype SQL contract (Zima)

## HTTP

```
POST https://core.orbitype.com/api/sql/v1
Content-Type: application/json
X-API-KEY: <ORBITYPE_API_SQL_KEY>

{ "sql": "SELECT ... WHERE slug = :slug", "bindings": { "slug": "home" } }
```

Scope probe (not SQL):

```
OPTIONS https://core.orbitype.com/api
X-API-KEY: <key>
→ { "projectId", "connectorId" }
```

## Rules

1. Named bindings only (`:name`) — never string-interpolate values.
2. Every mutation includes `RETURNING`.
3. Read error bodies as text. Missing key → 400 plain text. Bad key → **404** JSON (not 401).
4. Never log or echo the API key.
5. Confirm connector with `context` before writes.
6. Back up `sections` JSON before mutating a page.

## Sections JSON

```json
{
  "title": { "en": "Headline" },
  "content": { "en": "<p>Body</p>" },
  "_orbi": { "component": "SectionFeatureCallout" }
}
```

- First key: human-readable (`title` / `name` / `label` / `height`).
- Last key: `_orbi`.
- `_orbi.component` === `Section*.astro` filename stem.
- Locale fields need `en`. Site locale today: `en` only (`src/config/locales.ts`).
- Nested `[[{...}]]` may appear on read — app normalizes; always write a flat array.

## Canonical SQL

List pages:

```sql
SELECT id, slug, updated_at FROM pages ORDER BY updated_at DESC;
```

Read one page:

```sql
SELECT id, slug, title, sections FROM pages WHERE slug = :slug LIMIT 1;
```

Append section:

```sql
UPDATE pages
SET sections = (
  COALESCE(sections, '[]'::json)::jsonb
  || jsonb_build_array(
    jsonb_build_object(
      'title', jsonb_build_object('en', 'Why teams switch'),
      'content', jsonb_build_object('en', '<p>Body.</p>'),
      '_orbi', jsonb_build_object('component', 'SectionFeatureCallout')
    )
  )
)::json
WHERE slug = :slug
RETURNING id, slug;
```

Components on a page:

```sql
SELECT section->'_orbi'->>'component' AS component_name
FROM pages, json_array_elements(sections) AS section
WHERE slug = :slug;
```

## Codebase map

| Concern          | Path                                       |
| ---------------- | ------------------------------------------ |
| SQL client       | `src/lib/orbitype/client.ts`               |
| Schema / seed    | `src/lib/orbitype/schema.ts`, `seed.ts`    |
| Section registry | `src/components/sections/Section*.astro`   |
| Router           | `src/components/sections/AnySection.astro` |
| Normalize        | `src/lib/sections.ts`                      |

Sections must not import `~/lib/orbitype/*`.
