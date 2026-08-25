import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionContactFormSchema = z.object({
  title: i18nStringSchema,
  submitLabel: i18nStringSchema,
  privacyLabel: i18nStringSchema,
  privacyHref: z.string().optional(),
  enabled: z.boolean().optional(),
  _orbi: orbiSchema,
})

export default sectionContactFormSchema
