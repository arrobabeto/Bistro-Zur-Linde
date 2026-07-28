# ADR-0013: Templates-driven section composition

**Status:** Accepted

## Context

Many sites repeat chrome sections — header spacers, footers, disclaimers — across multiple CMS pages. Duplicating those sections in every `pages.sections` array is error-prone and complicates global layout changes.

Orbitype supports a `templates` table with `sections_before` and `sections_after` JSON arrays, and pages reference a template by name.

## Decision

Page rendering composes sections as:

```
[...template.sections_before, ...page.sections, ...template.sections_after]
```

Each array passes through **`normalizeSections()`** after fetch. Template lookup is optional — pages without `template` render only their own sections.

Default template DDL includes zero-height `SectionSpacer` entries in both before and after arrays.

## Consequences

- **Positive:** Shared chrome lives in one CMS row; page bodies stay focused.
- **Positive:** Matches cross-stack database shape for template compatibility.
- **Negative:** Editors must understand before/page/after ordering when debugging layout.
- **Negative:** Wrong template assignment affects every linked page silently.
