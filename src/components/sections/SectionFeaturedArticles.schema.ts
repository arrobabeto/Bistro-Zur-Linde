import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionFeaturedArticlesSchema = z.object({
  eyebrow: i18nStringSchema,
  eyebrowHref: z.string().optional(),
  slides: z
    .array(
      z.object({
        title: i18nStringSchema,
        author: i18nStringSchema,
        date: i18nStringSchema,
        href: z.string().optional(),
        img: z.string().optional(),
        imgAlt: i18nStringSchema,
      }),
    )
    .optional(),
  mediaSize: z.enum(["default", "tall"]).optional(),
  _orbi: orbiSchema,
})

export default sectionFeaturedArticlesSchema
