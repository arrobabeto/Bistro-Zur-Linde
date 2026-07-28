/**
 * Localized string. `en` is required and is the terminal fallback.
 * Other locales are optional so a row authored as `{ en, de }` still
 * renders on a single-locale site.
 */
export type I18nString = {
  en: string
  [locale: string]: string | undefined
}
