import { z } from "zod"

/** Localized string map; `en` is the documented terminal fallback. */
export const i18nStringSchema = z
  .union([
    z.string(),
    z.object({ en: z.string().optional() }).catchall(z.string().optional()),
  ])
  .optional()

export const orbiSchema = z.object({
  component: z.string().min(1),
})
