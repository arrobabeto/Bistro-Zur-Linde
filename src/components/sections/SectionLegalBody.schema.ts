import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionLegalBodySchema = z.object({
  heading: i18nStringSchema.optional(),
  content: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionLegalBodySchema
