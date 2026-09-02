import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionTaglineRibbonSchema = z.object({
  text: i18nStringSchema.optional(),
  _orbi: orbiSchema,
})

export default sectionTaglineRibbonSchema
