import type { Section } from "~/types/section"

export type NormalizeSectionsResult = {
  sections: Section[]
  errors: Array<{ index: number; reason: string }>
}

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
 * Recursively flatten. Invalid entries are reported instead of silent drops.
 */
export function normalizeSectionsDetailed(
  sections: unknown,
): NormalizeSectionsResult {
  if (!Array.isArray(sections)) {
    return {
      sections: [],
      errors: [{ index: -1, reason: "sections is not an array" }],
    }
  }

  const result: Section[] = []
  const errors: NormalizeSectionsResult["errors"] = []
  let index = 0

  function walk(items: unknown[]): void {
    for (const item of items) {
      const current = index
      index += 1
      if (Array.isArray(item)) {
        walk(item)
      } else if (isSection(item)) {
        result.push(item)
      } else {
        errors.push({
          index: current,
          reason: "missing or invalid _orbi.component",
        })
      }
    }
  }

  walk(sections)
  return { sections: result, errors }
}

/** Back-compat: returns only valid sections. Prefer normalizeSectionsDetailed. */
export function normalizeSections(sections: unknown): Section[] {
  return normalizeSectionsDetailed(sections).sections
}
