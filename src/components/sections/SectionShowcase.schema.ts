import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionShowcaseSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  text: i18nStringSchema,
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionShowcaseSchema
