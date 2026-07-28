# ADR-0015: Zod sidecar schemas for CMS sections

**Status:** Accepted

## Context

Section payloads were typed as `{ [key: string]: unknown; _orbi: { component: string } }`. Typecheck could not catch missing required fields or wrong shapes. A fully explicit `sectionDefinitions` map would duplicate the filename registry (ADR-0004).

## Decision

Each `SectionName.astro` may ship a sibling `SectionName.schema.ts` exporting a Zod schema as `default`. A second `import.meta.glob` in `src/lib/sections.ts` discovers schemas by filename. Runtime validation runs in `AnySection` before props are spread. The same schemas feed `cms:validate` and authoring tools.

ADR-0004 remains: CMS `_orbi.component` still equals the `.astro` filename stem. No manual registry map.

## Consequences

- **Positive:** Invalid CMS JSON fails loudly in development and is logged in production without dumping payloads.
- **Positive:** Filename discovery stays the single naming convention.
- **Negative:** Authors must keep schema files aligned with `interface Props`.
- **Neutral:** Sections without a sidecar skip validation (valid during migration).
