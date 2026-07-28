import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const itemSchema = z.object({
  title: i18nStringSchema,
  text: i18nStringSchema,
  icon: z.string().optional(),
})

export const sectionFeatureGridSchema = z.object({
  title: i18nStringSchema,
  lead: i18nStringSchema,
  items: z.array(itemSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionFeatureGridSchema
