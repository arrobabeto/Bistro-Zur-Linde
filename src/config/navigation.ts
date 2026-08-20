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

export const FOOTER_ROOMS: readonly NavItem[] = [
  { label: "Bistro", href: "/bistro" },
  { label: "Sääli", href: "/saali" },
  { label: "Zigarrenlounge", href: "/zigarrenlounge" },
  { label: "Wine Room", href: "/wine-room" },
]

export const FOOTER_SERVICE: readonly NavItem[] = [
  { label: "Reservation", href: "/kontakt" },
  { label: "Gutschein bestellen", href: "/gutschein" },
  { label: "Kontakt", href: "/kontakt" },
]

export const FOOTER_LEGAL: readonly NavItem[] = [
  { label: "Legal Notice", href: "/impressum" },
  { label: "Privacy Policy", href: "/datenschutz" },
  { label: "Terms & Conditions", href: "/agb" },
]

export const RESERVATION_HREF = "/kontakt"

export const SOCIAL_LINKS: readonly NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
]

export const CONTACT_ADDRESS = ["Untere Hauptstrasse 15B", "4665 Oftringen"]
