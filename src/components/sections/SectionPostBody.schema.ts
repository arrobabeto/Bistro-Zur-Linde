import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionPostBodySchema = z.object({
  category: i18nStringSchema.optional(),
  content: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionPostBodySchema
