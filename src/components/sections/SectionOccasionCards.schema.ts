import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const itemSchema = z.object({
  title: i18nStringSchema,
  text: i18nStringSchema,
  room: i18nStringSchema,
  roomHref: z.string().optional(),
  ctaLabel: i18nStringSchema,
  href: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  objectPosition: z.string().optional(),
})

export const sectionOccasionCardsSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  lead: i18nStringSchema,
  note: i18nStringSchema,
  items: z.array(itemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionOccasionCardsSchema
