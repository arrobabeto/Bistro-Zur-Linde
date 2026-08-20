import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionChefProfileSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  text: i18nStringSchema,
  stats: z.array(z.object({ label: i18nStringSchema })).optional(),
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionChefProfileSchema
