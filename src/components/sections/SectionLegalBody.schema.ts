import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionLegalBodySchema = z.object({
  heading: i18nStringSchema.optional(),
  content: i18nStringSchema,
  /** Figma Impressum 2211:618 — mixed Inter + Cormorant blocks with 20px gaps */
  variant: z.enum(["default", "impressum"]).optional(),
  _orbi: orbiSchema,
})

export default sectionLegalBodySchema
