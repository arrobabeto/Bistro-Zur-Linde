import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionLocationMapSchema = z.object({
  title: i18nStringSchema,
  leftLabel: i18nStringSchema,
  leftText: i18nStringSchema,
  rightLabel: i18nStringSchema,
  rightText: i18nStringSchema,
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  mapEmbedSrc: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionLocationMapSchema
