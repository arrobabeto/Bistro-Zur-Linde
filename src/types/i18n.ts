import type { Locale } from "~/config/locales"

/**
 * Localized string. Every configured locale is required so a row cannot ship
 * without the language the site actually renders. Extra locales stay optional,
 * which keeps rows authored as `{ en, de }` valid on a single-locale site.
 */
export type I18nString = {
  [K in Locale]: string
} & {
  [locale: string]: string | undefined
}
