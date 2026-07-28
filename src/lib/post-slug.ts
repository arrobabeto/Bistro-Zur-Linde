import type { I18nString } from "~/types/i18n"
import { DEFAULT_LOCALE } from "~/config/locales"
import { translate } from "~/lib/i18n"

/** Canonical URL slug segment derived from a localized post title. */
export function postTitleSlug(
  title: I18nString | string | undefined,
  locale = DEFAULT_LOCALE,
): string {
  return translate(title, locale)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function postPath(id: string, titleSlug: string): string {
  return titleSlug ? `/posts/${id}/${titleSlug}` : `/posts/${id}`
}
