---
name: astro-cms-build-from-figma
description: >-
  End-to-end workflow: read a Figma frame via REST, implement Astro Section*.astro
  components with Zod sidecars, then publish sections JSON through Orbitype SQL
  after approval. Use when building CMS-driven pages from Figma without MCP.
---

# Build from Figma → Astro → Orbitype

Orchestrates `figma-rest-design-reader`, local section authoring, and `orbitype-publish`.

## State machine (mandatory)

```
DESIGN_READ
→ LOCAL_PROTOTYPE
→ COMPONENT_SCHEMA
→ CMS_PAYLOAD_READY
→ AWAITING_MUTATION_APPROVAL
→ CMS_PUBLISHED
→ ROUNDTRIP_VERIFIED
→ DEPLOY_VERIFIED
→ DONE
```

A hardcoded local prototype is **never** `DONE`. Do not skip from `LOCAL_PROTOTYPE` to `DONE`.

## Checklist

```
- [ ] Classify data: CMS vs code vs transactional system
- [ ] Figma: me + file (correct account + file)
- [ ] Figma: tree/nodes/export for the target frame
- [ ] Code: reuse or add Section*.astro (+ Section*.schema.ts)
- [ ] No commercial copy hardcoded as the final source of truth
- [ ] Local: lint + typecheck; visual check on pnpm dev
- [ ] Orbitype: context (confirm connector / environment)
- [ ] Orbitype: read + backup sections
- [ ] User confirms mutate SQL
- [ ] Mutate + re-read + browser verify
- [ ] cms:validate + verify
```

## Done when

- Components render without DebugPanel.
- CMS row `_orbi.component` matches filenames and includes editorial props.
- A CMS value change is visible without a code redeploy (roundtrip).
- `pnpm run verify` is green.
