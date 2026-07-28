import type { AstroInstance } from "astro"

const modules = import.meta.glob<AstroInstance>(
  "/src/components/sections/Section*.astro",
  { eager: true },
)

function nameFromPath(path: string): string {
  const file = path.split("/").pop() ?? path
  return file.replace(/\.astro$/, "")
}

export const sectionRegistry: Record<string, AstroInstance["default"]> =
  Object.fromEntries(
    Object.entries(modules).map(([path, module]) => [
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

export function knownSectionNames(): string[] {
  return Object.keys(sectionRegistry).sort()
}
