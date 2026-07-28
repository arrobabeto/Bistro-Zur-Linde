# ADR-0004: Filename-based section registry

**Status:** Accepted

## Context

CMS pages store sections as JSON arrays. Each object includes `_orbi.component`, a string naming the Astro section that should render it. The renderer must map that string to a component without manual registration lists that drift from the filesystem.

Astro supports dynamic components via a capitalized variable (`<Component {...props} />`). TypeScript typing uses `AstroInstance["default"]`, not the non-exported `AstroComponentFactory`.

## Decision

Section components live in `src/components/sections/` and **must be named `Section*.astro`**. The registry is built at build time with:

```ts
import.meta.glob("/src/components/sections/Section*.astro", { eager: true })
```

The registry key is the filename without extension (e.g. `SectionHero.astro` → `"SectionHero"`). CMS JSON must set `"_orbi": { "component": "SectionHero" }`.

`AnySection.astro` strips `_orbi`, spreads remaining props, and passes `locale`.

## Consequences

- **Positive:** Adding a section is one new file — no central registry edit.
- **Positive:** `knownSectionNames()` supports debug panels and installer validation.
- **Negative:** Renaming a file is a breaking CMS migration unless aliases are added.
- **Negative:** Typos in `_orbi.component` render `DebugPanel`, not a build error.
