import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionRoomStripSchema = z.object({
  title: i18nStringSchema,
  lead: i18nStringSchema,
  items: z
    .array(
      z.object({
        name: i18nStringSchema,
        href: z.string().optional(),
        capacity: i18nStringSchema,
        img: z.string().optional(),
        imgAlt: i18nStringSchema,
      }),
    )
    .optional(),
  _orbi: orbiSchema,
})

export default sectionRoomStripSchema
