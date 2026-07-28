import type { AstroInstance } from "astro"
import type { ZodType } from "zod"

const modules = import.meta.glob<AstroInstance>(
  "/src/components/sections/Section*.astro",
  { eager: true },
)

const schemaModules = import.meta.glob<{ default: ZodType }>(
  "/src/components/sections/Section*.schema.ts",
  { eager: true },
)

function nameFromPath(path: string): string {
  const file = path.split("/").pop() ?? path
  return file.replace(/\.astro$/, "").replace(/\.schema\.ts$/, "")
}

export const sectionRegistry: Record<string, AstroInstance["default"]> =
  Object.fromEntries(
    Object.entries(modules).map(([path, module]) => [
      nameFromPath(path),
      module.default,
    ]),
  )

export const sectionSchemas: Record<string, ZodType> = Object.fromEntries(
  Object.entries(schemaModules).map(([path, module]) => [
    nameFromPath(path),
    module.default,
  ]),
)

export function resolveSection(
  name: string | undefined,
): AstroInstance["default"] | undefined {
  if (!name) return undefined
  return sectionRegistry[name]
}

export function resolveSectionSchema(
  name: string | undefined,
): ZodType | undefined {
  if (!name) return undefined
  return sectionSchemas[name]
}

export function knownSectionNames(): string[] {
  return Object.keys(sectionRegistry).sort()
}

export type SectionValidationResult =
  { ok: true; data: Record<string, unknown> } | { ok: false; errors: string[] }

export function validateSectionPayload(
  name: string | undefined,
  data: Record<string, unknown>,
): SectionValidationResult {
  const schema = resolveSectionSchema(name)
  if (!schema) {
    return { ok: true, data }
  }
  const parsed = schema.safeParse(data)
  if (parsed.success) {
    return { ok: true, data: parsed.data as Record<string, unknown> }
  }
  return {
    ok: false,
    errors: parsed.error.issues.map(
      (issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
    ),
  }
}
