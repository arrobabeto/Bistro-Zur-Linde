import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionEventsSchema = z.object({
  eyebrow: i18nStringSchema,
  title: i18nStringSchema,
  items: z
    .array(
      z.object({
        date: i18nStringSchema.optional(),
        title: i18nStringSchema,
        text: i18nStringSchema,
        ctaLabel: i18nStringSchema.optional(),
        href: z.string().optional(),
        img: z.string().optional(),
        /** Optional desktop-only image (`lg` and up). Falls back to `img`. */
        imgDesktop: z.string().optional(),
        imgAlt: i18nStringSchema.optional(),
      }),
    )
    .optional(),
  columns: z.union([z.literal(2), z.literal(3)]).optional(),
  _orbi: orbiSchema,
})

export default sectionEventsSchema
