import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const wineOfferItemSchema = z.object({
  index: i18nStringSchema.optional(),
  title: i18nStringSchema.optional(),
  text: i18nStringSchema.optional(),
})

export const sectionWineOfferSchema = z.object({
  eyebrow: i18nStringSchema.optional(),
  title: i18nStringSchema.optional(),
  items: z.array(wineOfferItemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionWineOfferSchema
