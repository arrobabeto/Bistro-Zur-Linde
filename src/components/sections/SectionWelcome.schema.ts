import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionWelcomeSchema = z.object({
  title: i18nStringSchema,
  lead: i18nStringSchema,
  capabilities: z.array(z.record(z.string(), z.unknown())).optional(),
  steps: z.array(z.record(z.string(), z.unknown())).optional(),
  hasSqlKeyConfigured: z.boolean().optional(),
  apiKeysUrl: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionWelcomeSchema
