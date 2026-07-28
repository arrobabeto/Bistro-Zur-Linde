# ADR-0014: Committed MCP config with env placeholders

**Status:** Accepted

## Context

Cursor MCP connects agents to Orbitype SQL and storage APIs. Developers need MCP configured on every clone without copying keys into chat or duplicating setup steps. Committing literal API keys is unacceptable; ignoring MCP config forces rediscovery per machine.

Cursor supports `${env:VAR}` placeholders in `.cursor/mcp.json` headers, resolved from the developer's environment at runtime.

## Decision

**Commit `.cursor/mcp.json`** with only `${env:VAR}` values for every `X-API-KEY` header — never literal keys.

Provide **`.cursor/mcp.json.example`** showing multi-connector scope suffixes (e.g. `-prod-website`, `-local`, S3 public/private keys).

Guard with **`scripts/check-mcp-safety.mjs`**, wired into the Husky pre-commit hook via `pnpm run mcp:safety`. The script rejects any header that is not a bare `${env:NAME}` reference.

Use **`pnpm run mcp:env`** to print export commands for local shell setup.

## Consequences

- **Positive:** Clones inherit MCP structure; each developer supplies keys via env.
- **Positive:** Pre-commit blocks accidental key commits.
- **Negative:** Developers must export env vars before MCP tools work — documented in seed welcome steps.
- **Neutral:** Example file lists more connectors than the minimal committed config; projects trim to their scopes.
