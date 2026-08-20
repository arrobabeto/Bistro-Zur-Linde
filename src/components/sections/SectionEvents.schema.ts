import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionEventsSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  items: z
    .array(
      z.object({
        date: i18nStringSchema,
        title: i18nStringSchema,
        text: i18nStringSchema,
        ctaLabel: i18nStringSchema,
        href: z.string().optional(),
        img: z.string().optional(),
        imgAlt: i18nStringSchema,
      }),
    )
    .optional(),
  _orbi: orbiSchema,
})

export default sectionEventsSchema
