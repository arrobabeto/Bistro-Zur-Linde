import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionImpressionGallerySchema = z.object({
  title: i18nStringSchema,
  lead: i18nStringSchema,
  images: z
    .array(
      z.object({
        img: z.string().optional(),
        imgAlt: i18nStringSchema,
        caption: i18nStringSchema,
      }),
    )
    .optional(),
  videoTitle: i18nStringSchema,
  videoLabel: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionImpressionGallerySchema
