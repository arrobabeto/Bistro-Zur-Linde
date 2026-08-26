import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionLegalHeroSchema = z.object({
  eyebrow: i18nStringSchema.optional(),
  title: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionLegalHeroSchema
