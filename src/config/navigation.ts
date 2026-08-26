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
  { label: "News", href: "/news" },
  { label: "Kontakt", href: "/kontakt" },
]

/** Primary footer link list (Figma 2128:480). */
export const FOOTER_MENU: readonly NavItem[] = [
  { label: "Bistro", href: "/bistro" },
  { label: "Sääli", href: "/saali" },
  { label: "Zigarrenlounge", href: "/zigarrenlounge" },
  { label: "Wine Room", href: "/wine-room" },
  { label: "Gutschein bestellen", href: "/gutschein" },
]

export const FOOTER_LEGAL: readonly NavItem[] = [
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Impressum", href: "/impressum" },
]

export const RESERVATION_HREF = "/kontakt"

export const SOCIAL_LINKS: readonly NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
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
