# ADR-0010: Ship SectionSpacer

**Status:** Accepted

## Context

The default `pages.sections` JSON in the schema DDL references `"_orbi": { "component": "SectionSpacer" }`. Templates also default `sections_before` and `sections_after` to a zero-height spacer.

Without a matching Astro component, freshly installed or seeded pages would render the debug fallback for every default section payload — even though the component name is intentional, not a typo.

## Decision

Ship **`SectionSpacer.astro`** in the template section set. It accepts an optional `height` prop (default `0`), renders an aria-hidden block element, and clamps negative values to zero.

This is **schema parity**, not a workaround for a missing upstream component. The same component exists in the shared Orbitype section vocabulary.

## Consequences

- **Positive:** Default schema and seed content render cleanly out of the box.
- **Positive:** Editors can add vertical rhythm between sections via CMS without new components.
- **Negative:** Another file to maintain when renaming section conventions.
- **Neutral:** `locale` is accepted for prop consistency but unused in markup.
