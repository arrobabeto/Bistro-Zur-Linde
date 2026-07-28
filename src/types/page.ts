import type { I18nString } from "./i18n"
import type { Section } from "./section"

export type Page = {
  id: string
  title: I18nString
  slug: string
  lead?: I18nString
  img?: string
  sections: Section[]
  keywords?: string[]
  head?: Record<string, unknown>
  template?: string | null
  created_at?: string
  updated_at?: string
}
