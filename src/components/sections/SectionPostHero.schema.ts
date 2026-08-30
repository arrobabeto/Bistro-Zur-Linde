import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionPostHeroSchema = z.object({
  category: i18nStringSchema.optional(),
  date: i18nStringSchema.optional(),
  title: i18nStringSchema.optional(),
  author: i18nStringSchema.optional(),
  readingTime: i18nStringSchema.optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionPostHeroSchema
