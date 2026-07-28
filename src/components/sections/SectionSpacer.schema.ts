import { z } from "zod"
import { orbiSchema } from "~/lib/section-schema-base"

export const sectionSpacerSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  _orbi: orbiSchema,
})

export default sectionSpacerSchema
