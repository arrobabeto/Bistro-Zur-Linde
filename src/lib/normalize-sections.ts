import type { Section } from "~/types/section"

function isSection(value: unknown): value is Section {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as Section)._orbi?.component === "string"
  )
}

/**
 * Orbitype sometimes stores sections as nested arrays — `[[{...}]]`.
 * Recursively flatten and discard anything without a string `_orbi.component`.
 */
export function normalizeSections(sections: unknown): Section[] {
  if (!Array.isArray(sections)) return []

  const result: Section[] = []

  function walk(items: unknown[]): void {
    for (const item of items) {
      if (Array.isArray(item)) walk(item)
      else if (isSection(item)) result.push(item)
    }
  }

  walk(sections)
  return result
}
