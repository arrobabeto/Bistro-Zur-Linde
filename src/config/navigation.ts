/**
 * Site navigation. Room and legal links are structural (they exist as routes),
 * so they live in code rather than in CMS section JSON.
 */
export interface NavItem {
  label: string
  href: string
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Bistro", href: "/bistro" },
  { label: "Sääli", href: "/saali" },
  { label: "Zigarrenlounge", href: "/zigarrenlounge" },
  { label: "Wine Room", href: "/wine-room" },
  { label: "News", href: "/news" },
  { label: "Kontakt", href: "/kontakt" },
]

/** Footer menu mirrors the primary nav. */
export const FOOTER_MENU: readonly NavItem[] = PRIMARY_NAV

export const FOOTER_LEGAL: readonly NavItem[] = [
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Impressum", href: "/impressum" },
]

import { RESERVATION_HASH } from "~/config/opentable"

/** Opens the OpenTable reservation dialog (see ReservationDialog). */
export const RESERVATION_HREF = `#${RESERVATION_HASH}`

export const SOCIAL_LINKS: readonly NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/bistrozurlinde" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bistrozurlinde/home/",
  },
  {
    label: "Google Maps",
    href: "https://maps.google.com/?q=Untere+Hauptstrasse+15B,+4665+Oftringen",
  },
]

export const CONTACT_COMPANY = "Bistro zur Linde GmbH"
export const CONTACT_ADDRESS = ["Untere Hauptstrasse 15B", "4665 Oftringen"]
export const CONTACT_PHONE = "+41 62 788 60 69"
export const CONTACT_EMAIL = "reservation@bistrozurlinde.ch"

export const OPENING_HOURS = [
  "Mo–Fr: 11:00–14:00 & 18:00–23:30",
  "Sa: 18:00–23:30",
  "So: Geschlossen",
]

export const KITCHEN_HOURS = [
  "Mo–Fr: 11:30–13:30 & 18:00–22:00",
  "Sa: 18:00–22:00",
  "So: Geschlossen",
]
