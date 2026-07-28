# ADR-0001: Second stack — Astro template

**Status:** Accepted

## Context

Orbitype sites share a CMS contract: SQL tables, a sections JSON schema with `_orbi.component`, i18n-shaped JSON fields, and HTTP access to the SQL API. An earlier stack served the same contract with a client framework and a different meta-framework.

Content-first marketing and documentation sites benefit from minimal client JavaScript, static-friendly output, and server-rendered HTML. Astro fits that profile while remaining deployable on Vercel with on-demand routes where needed.

## Decision

Maintain this repository as an **independent Astro template** for content-first sites. It implements the same Orbitype contract — schema, sections, seed content, installer, MCP workflow — without sharing runtime code with other stacks.

Each project clones this template, configures env vars, and owns its design tokens and section components. Cross-stack compatibility is measured at the database and JSON payload level, not at shared application code.

## Consequences

- **Positive:** Zero-framework pages by default; smaller bundles; clear separation between CMS data and presentation.
- **Positive:** Teams can choose Astro for content sites without forking CMS logic.
- **Negative:** Section components and layout patterns are not shared as npm packages; parity is maintained by convention and ADRs.
- **Negative:** Two stacks must stay aligned when the Orbitype schema evolves — changes belong in both templates or in documented contract updates.
