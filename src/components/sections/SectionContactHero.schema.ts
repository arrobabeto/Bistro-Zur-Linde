import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionContactHeroSchema = z.object({
  title: i18nStringSchema,
  titleAccent: i18nStringSchema,
  lead: i18nStringSchema,
  leftLabel: i18nStringSchema,
  leftText: i18nStringSchema,
  rightLabel: i18nStringSchema,
  rightText: i18nStringSchema,
  _orbi: orbiSchema,
})

export default sectionContactHeroSchema
