import type { Locale } from "~/config/locales"
import { DEFAULT_LOCALE, isLocale } from "~/config/locales"
import type { I18nString } from "~/types/i18n"

/**
 * Resolve a localized field. Order: requested locale → en → empty string.
 * Never returns undefined or a placeholder like "...".
 */
export function translate(
  value: I18nString | string | undefined,
  locale: Locale,
): string {
  if (!value) return ""
  if (typeof value === "string") return value
  return value[locale] ?? value.en ?? ""
}

export type ParsedRoute = {
  locale: Locale
  slug: string
}

/**
 * Derive locale and slug from a catch-all rest param.
 * With a single locale there is no prefix. When more than one locale is
 * configured, `/<locale>/<slug>` uses that locale; the default stays unprefixed.
 */
export function parseRoute(
  slugParam: string | string[] | undefined,
): ParsedRoute {
  const parts = Array.isArray(slugParam)
    ? slugParam
    : slugParam
      ? slugParam.split("/").filter(Boolean)
      : []

  if (parts.length === 0) {
    return { locale: DEFAULT_LOCALE, slug: "home" }
  }

  const first = parts[0]
  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    const rest = parts.slice(1)
    return {
      locale: first,
      slug: rest.length === 0 ? "home" : rest.join("/"),
    }
  }

  return { locale: DEFAULT_LOCALE, slug: parts.join("/") }
}

export function localePath(locale: Locale, slug: string): string {
  const clean = slug === "home" ? "" : slug
  if (locale === DEFAULT_LOCALE) {
    return clean ? `/${clean}` : "/"
  }
  return clean ? `/${locale}/${clean}` : `/${locale}`
}
