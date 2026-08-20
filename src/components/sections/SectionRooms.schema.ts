import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionRoomsSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  rooms: z
    .array(
      z.object({
        name: i18nStringSchema,
        href: z.string().optional(),
        img: z.string().optional(),
        imgAlt: i18nStringSchema,
      }),
    )
    .optional(),
  _orbi: orbiSchema,
})

export default sectionRoomsSchema
