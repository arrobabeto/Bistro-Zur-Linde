# ADR-0002: Fetch-only Orbitype access — no SDK

**Status:** Accepted

## Context

Orbitype exposes a SQL HTTP API (`POST` with `{ sql, bindings }` and an `X-API-KEY` header). An SDK could wrap that surface, but it adds a dependency, versioning coupling, and opaque error handling. This template already needs `fetch` for email providers and revalidation webhooks.

The SQL API is small: one endpoint shape, JSON bindings, array responses. Most logic lives in SQL strings and TypeScript types, not in client library abstractions.

## Decision

All Orbitype communication goes through **`orbitypeSql()` in `src/lib/orbitype/client.ts`**, implemented with native `fetch` only. No Orbitype SDK, no generated client, no ORM.

Configuration reads from `astro:env/server`. Components and layouts never call the client directly.

## Consequences

- **Positive:** No SDK upgrade churn; behaviour matches live API documentation exactly.
- **Positive:** Error handling is explicit — read bodies as `.text()` because 400 responses are plain text and 404 responses are JSON.
- **Negative:** SQL strings are hand-written; typos surface at runtime or in integration tests.
- **Negative:** Each stack reimplements the thin client; contract changes require parallel updates.
