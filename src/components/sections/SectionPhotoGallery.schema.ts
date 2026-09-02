import { z } from "zod"
import { i18nStringSchema, orbiSchema } from "~/lib/section-schema-base"

const galleryTileSchema = z.object({
  img: z.string().optional(),
  imgAlt: i18nStringSchema.optional(),
  play: z.boolean().optional(),
})

export const sectionPhotoGallerySchema = z.object({
  eyebrow: i18nStringSchema.optional(),
  title: i18nStringSchema.optional(),
  tiles: z.array(galleryTileSchema).optional(),
  _orbi: orbiSchema,
})

export default sectionPhotoGallerySchema
