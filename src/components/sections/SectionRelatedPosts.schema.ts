import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const relatedCardSchema = z.object({
  category: i18nStringSchema.optional(),
  date: i18nStringSchema.optional(),
  title: i18nStringSchema.optional(),
  excerpt: i18nStringSchema.optional(),
  href: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema.optional(),
})

export const sectionRelatedPostsSchema = z.object({
  eyebrow: i18nStringSchema.optional(),
  title: i18nStringSchema.optional(),
  cards: z.array(relatedCardSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionRelatedPostsSchema
