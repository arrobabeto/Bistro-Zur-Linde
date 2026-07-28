# ADR-0003: No client framework

**Status:** Accepted

## Context

Marketing and CMS-driven pages rarely need reactive client state. Shipping Vue, React, or Svelte adds runtime weight, hydration cost, and framework-specific tooling that conflicts with the template's performance goals.

Some server utilities still depend on React's type system. `@vercel/og` (Satori) declares JSX element types that import from `react`, even when callers pass plain object trees.

## Decision

**No client framework** in dependencies or pages. Interactivity uses vanilla TypeScript in Astro islands only when unavoidable — and the default section set ships none.

`@types/react` is a **devDependency only** for `@vercel/og` typechecking. It has no runtime footprint and does not constitute adopting React.

## Consequences

- **Positive:** Content pages are HTML + CSS; NFR zero-JS budget is achievable by default.
- **Positive:** Simpler lint, build, and bundle analysis.
- **Negative:** Rich client widgets (maps, charts, complex forms) require deliberate island additions per project.
- **Neutral:** OG image endpoints use object-tree JSX shapes; this is an undocumented Satori contract to verify on preview deploys.
