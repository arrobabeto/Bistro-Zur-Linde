import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionEventsHeroSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  titleAccent: i18nStringSchema,
  lead: i18nStringSchema,
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  img: z.string().optional(),
  imgMobile: z.string().optional(),
  imgAlt: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionEventsHeroSchema
