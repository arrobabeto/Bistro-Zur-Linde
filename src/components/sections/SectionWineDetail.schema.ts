import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionWineDetailSchema = z.object({
  eyebrow: i18nStringSchema.optional(),
  title: i18nStringSchema.optional(),
  text: i18nStringSchema.optional(),
  ctaLabel: i18nStringSchema.optional(),
  ctaHref: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema.optional(),
  titleSize: z.enum(["default", "md"]).optional(),
  _orbi: orbiSchema,
})

export default sectionWineDetailSchema
