import {
  PUBLIC_ORGANIZATION_LOGO,
  PUBLIC_ORGANIZATION_NAME,
  PUBLIC_SITE_DESCRIPTION,
  PUBLIC_SITE_NAME,
  PUBLIC_SITE_URL,
} from "astro:env/client"

export function siteUrl(): string {
  return PUBLIC_SITE_URL.replace(/\/$/, "")
}

export function siteName(): string {
  return PUBLIC_SITE_NAME
}

export function siteDescription(): string {
  return PUBLIC_SITE_DESCRIPTION
}

export function organizationName(): string {
  return PUBLIC_ORGANIZATION_NAME
}

export function organizationLogo(): string {
  const logo = PUBLIC_ORGANIZATION_LOGO
  if (logo.startsWith("http")) return logo
  return `${siteUrl()}${logo.startsWith("/") ? logo : `/${logo}`}`
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path
  const base = siteUrl()
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
