import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionProseSchema = z.object({
  title: i18nStringSchema,
  content: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionProseSchema
