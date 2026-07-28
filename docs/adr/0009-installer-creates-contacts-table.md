# ADR-0009: Installer creates contacts table

**Status:** Accepted

## Context

The Orbitype schema defines a `contacts` table for form submissions with generic columns: `first_name`, `last_name`, `email`, `phone`, `topic`, `message`, and timestamps. The DDL exists in shared schema documentation, but the default installer table list historically included only `pages`, `posts`, and `settings` — leaving `contacts` defined but never created on first run.

The contact form endpoint expects the table to exist after setup.

## Decision

The **`POST /api/setup/install-schema`** installer creates `contacts` alongside `pages`, `posts`, `settings`, `templates`, and `comments`. Column names stay **generic** — no project-specific fields in the template DDL.

Projects that need extra columns add them via `/api/setup/migrate` or custom migration SQL.

## Consequences

- **Positive:** Contact form works immediately after a full schema install.
- **Positive:** Generic columns keep the template clone-neutral.
- **Negative:** Projects with bespoke CRM fields must extend the table themselves.
- **Neutral:** Re-running the installer is idempotent (`CREATE TABLE IF NOT EXISTS`).
