import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionStorySchema = z.object({
  title: i18nStringSchema,
  titleAccent: i18nStringSchema,
  text: i18nStringSchema,
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  mediaPosition: z.enum(["left", "right"]).optional(),
  _orbi: orbiSchema,
})

export default sectionStorySchema
