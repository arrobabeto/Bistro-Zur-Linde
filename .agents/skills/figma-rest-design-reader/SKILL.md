---
name: figma-rest-design-reader
description: >-
  Reads a Figma file via the Figma REST API using FIGMA_API_KEY and
  FIGMA_FILE_KEY (no Figma MCP required). Use when inspecting designs,
  listing pages/frames, exporting node images, extracting typography/layout
  specs, or design-to-code from Figma without MCP.
---

# Figma REST design reader

Do **not** assume Figma MCP is available. Use `FIGMA_API_KEY` + `FIGMA_FILE_KEY` from the shell or project `.env`.

## Prerequisites

```bash
FIGMA_API_KEY=figd_...
FIGMA_FILE_KEY=...
```

Verify:

```bash
pnpm run figma:verify
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs me
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs file
```

## Commands

```bash
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs me
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs file
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs pages
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs tree "<page name>" 2
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs nodes 7:2
node .agents/skills/figma-rest-design-reader/scripts/figma.mjs export 7:2 png 2
```

## Hard rules

- Never print or commit `FIGMA_API_KEY`.
- Export URLs from `/v1/images` are temporary — do not store them as production media URLs.
- Map colors to tokens in `src/styles/global.css`.
- Prefer existing `Section*.astro` components before creating new ones.
- Treat frames/pages named like "Content pending" as unapproved copy.
