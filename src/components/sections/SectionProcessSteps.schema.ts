import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionProcessStepsSchema = z.object({
  title: i18nStringSchema,
  steps: z
    .array(
      z.object({
        numeral: z.string().optional(),
        title: i18nStringSchema,
        text: i18nStringSchema,
      }),
    )
    .optional(),
  _orbi: orbiSchema,
})

export default sectionProcessStepsSchema
