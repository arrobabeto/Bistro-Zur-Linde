# Section authoring rules

- File name `SectionName.astro` must match `_orbi.component`.
- Ship `SectionName.schema.ts` (Zod) beside the component.
- `interface Props` must include `locale: Locale` and CMS fields (not locale-only).
- Use `translate()` for strings and `SafeHtml` for HTML bodies.
- No imports from `~/lib/orbitype/*` or `astro:env/server`.
- No commercial copy hardcoded as the long-term source of truth.
- Prefer <100 lines; hard fail above 200 (see `pnpm run check:section-contracts`).
