import type { I18nString } from "./i18n"
import type { Section } from "./section"

export type PostStatus = {
  options?: string[]
  value: string
}

export type Post = {
  id: string
  title: I18nString
  lead?: I18nString
  img?: string
  status?: PostStatus
  sections: Section[]
  keywords?: string[]
  created_at?: string
  updated_at?: string
}
