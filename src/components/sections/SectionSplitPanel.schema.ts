import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

export const sectionSplitPanelSchema = z.object({
  title: i18nStringSchema,
  text: i18nStringSchema,
  ctaLabel: i18nStringSchema,
  ctaHref: z.string().optional(),
  ctaSecondaryLabel: i18nStringSchema,
  ctaSecondaryHref: z.string().optional(),
  img: z.string().optional(),
  imgAlt: i18nStringSchema,
  mediaPosition: z.enum(["left", "right"]).optional(),
  panelTone: z.enum(["dark", "muted"]).optional(),
  anchor: z.string().optional(),
  _orbi: orbiSchema,
})

export default sectionSplitPanelSchema
