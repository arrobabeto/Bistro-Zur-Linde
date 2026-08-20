import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionPromoBannerSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  href: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionPromoBannerSchema
