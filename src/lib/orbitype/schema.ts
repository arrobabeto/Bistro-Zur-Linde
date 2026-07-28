function toIdempotentSql(sql: string): string {
  return sql.replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
}

/**
 * Must run before any CREATE TABLE — every primary key defaults to uid().
 * Idempotent. Often already provisioned by Orbitype on connector creation.
 */
export const CREATE_UID_FUNCTION_SQL = `
CREATE OR REPLACE FUNCTION uid() RETURNS text
  LANGUAGE sql AS
$$
SELECT STRING_AGG(SUBSTRING(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  CEIL(RANDOM() * 62)::integer, 1), '')
FROM GENERATE_SERIES(1, 6)
$$;
`.trim()

export const CREATE_PAGES_TABLE_SQL = `
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
  template text DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);
`.trim()

export const CREATE_POSTS_TABLE_SQL = `
CREATE TABLE posts (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  title json DEFAULT '{ "en": "...", "de": "..." }'::json,
  lead json DEFAULT '{ "en": "<p>...</p>", "de": "<p>...</p>" }'::json,
  img text DEFAULT ''::text,
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
`.trim()

export const CREATE_SETTINGS_TABLE_SQL = `
CREATE TABLE settings (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  name text DEFAULT '...'::text,
  data json DEFAULT '{ "key": "value" }'::json
);
`.trim()

export const CREATE_CONTACTS_TABLE_SQL = `
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
`.trim()

export const CREATE_TEMPLATES_TABLE_SQL = `
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
`.trim()

export const CREATE_COMMENTS_TABLE_SQL = `
CREATE TABLE comments (
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  post_id text DEFAULT ''::text,
  author text DEFAULT ''::text,
  text text DEFAULT ''::text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);
`.trim()

export const CMS_SCHEMA_SQL_SAFE = {
  pages: toIdempotentSql(CREATE_PAGES_TABLE_SQL),
  posts: toIdempotentSql(CREATE_POSTS_TABLE_SQL),
  settings: toIdempotentSql(CREATE_SETTINGS_TABLE_SQL),
  contacts: toIdempotentSql(CREATE_CONTACTS_TABLE_SQL),
  templates: toIdempotentSql(CREATE_TEMPLATES_TABLE_SQL),
} as const

export type CmsTable = keyof typeof CMS_SCHEMA_SQL_SAFE

export const CMS_MIGRATIONS_SQL = {
  "pages.template":
    "ALTER TABLE pages ADD COLUMN IF NOT EXISTS template text DEFAULT NULL",
  "contacts.topic":
    "ALTER TABLE contacts ADD COLUMN IF NOT EXISTS topic text DEFAULT ''::text",
  "contacts.phone":
    "ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone text DEFAULT ''::text",
} as const
