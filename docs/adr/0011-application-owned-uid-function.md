# ADR-0011: Application-owned uid() function

**Status:** Accepted

## Context

Every CMS table uses `id varchar(255) DEFAULT uid() PRIMARY KEY`. Schema installation must succeed on a **fresh connector** where no tables exist yet.

Investigation showed `uid()` is often **already provisioned** on connector creation — an identical 6-character random alphanumeric function. It is not guaranteed documentation-only; it is a real Postgres function the connector may own.

`CREATE OR REPLACE FUNCTION uid()` frequently fails with **"must be owner of function uid"** when Orbitype created the function first. The installer cannot assume create always succeeds.

## Decision

The installer **attempts `CREATE OR REPLACE FUNCTION uid()` first**, before any `CREATE TABLE`. On failure, it **falls back to `SELECT uid()`** to verify the function works and treats that as success.

The SQL definition lives in `src/lib/orbitype/schema.ts` as idempotent insurance — not because Orbitype never provides it.

## Consequences

- **Positive:** First-run install succeeds whether or not the connector pre-provisioned `uid()`.
- **Positive:** Tables with `DEFAULT uid()` never fail for a missing function.
- **Negative:** If both create and verify fail, installation stops with an explicit error.
- **Neutral:** 62⁶ keyspace is sufficient for CMS IDs but is not UUID-grade entropy — acceptable for primary keys here.
