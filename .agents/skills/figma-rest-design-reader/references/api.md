# Figma REST reference (Zima)

## Auth

- Header: `X-Figma-Token: $FIGMA_API_KEY`
- Default file: `$FIGMA_FILE_KEY` (`VHmdNXMthrm7hlsRjMg20m` for ZIMA Coffee + Cowork)

## Endpoints used by this skill

| Action         | Method | Path                                               |
| -------------- | ------ | -------------------------------------------------- |
| Who am I       | GET    | `/v1/me`                                           |
| File + pages   | GET    | `/v1/files/{file_key}?depth=1`                     |
| Deep tree      | GET    | `/v1/files/{file_key}?depth=N`                     |
| Specific nodes | GET    | `/v1/files/{file_key}/nodes?ids=1:2,1:3`           |
| Export image   | GET    | `/v1/images/{file_key}?ids=1:2&format=png&scale=2` |

## Node IDs

- URL `node-id=7-2` → API id `7:2` (replace `-` with `:`).
- Prefer `scripts/figma.mjs` — it normalizes IDs.

## Zima file pages (canonical)

| Page                     | Typical use                         |
| ------------------------ | ----------------------------------- |
| 00 — Cover & brief       | Project brief                       |
| 01 — Foundations         | Colors, type, spacing tokens        |
| 02 — Components          | UI kit                              |
| 03 — Desktop pages       | Desktop frames → section components |
| 04 — Mobile pages        | Mobile adaptations                  |
| 05 — Responsive behavior | Breakpoint notes                    |
| 06 — Prototype & flows   | Navigation                          |
| 07 — Content pending     | Copy gaps                           |

## Mapping design → Astro

- Frame / section name → `SectionName.astro` / `_orbi.component`
- Localized copy → `{ "en": "..." }` (`en` required)
- Colors → `@theme` tokens in `src/styles/global.css` (no raw hex in components)
- HTML body copy → `SafeHtml`, never raw `set:html`
