import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionCtaSchema = z.object({
  title: i18nStringSchema,
  lead: i18nStringSchema,
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionCtaSchema
