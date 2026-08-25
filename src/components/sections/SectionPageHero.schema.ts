import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionPageHeroSchema = z.object({
  title: i18nStringSchema,
  titleAccent: i18nStringSchema,
  lead: i18nStringSchema,
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  ctaSecondaryLabel: i18nStringSchema,
  ctaSecondaryHref: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionPageHeroSchema
