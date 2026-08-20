import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionReservationSchema = z.object({
  title: i18nStringSchema,
  titleAccent: i18nStringSchema,
  text: i18nStringSchema,
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  mark: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionReservationSchema
