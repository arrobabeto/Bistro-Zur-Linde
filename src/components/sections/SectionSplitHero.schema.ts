import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionSplitHeroSchema = z.object({
  title: i18nStringSchema,
  lead: i18nStringSchema,
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionSplitHeroSchema
