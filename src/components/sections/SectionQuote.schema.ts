import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionQuoteSchema = z.object({
  quote: i18nStringSchema,
  attribution: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionQuoteSchema
