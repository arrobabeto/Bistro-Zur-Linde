import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionPromoBannerSchema = z.object({
  slides: z
    .array(
      z.object({
        img: z.string().optional(),
        imgAlt: i18nStringSchema,
        eyebrow: i18nStringSchema,
        title: i18nStringSchema,
        href: z.string().optional(),
      }),
    )
    .optional(),
  _orbi: orbiSchema,
})

export default sectionPromoBannerSchema
