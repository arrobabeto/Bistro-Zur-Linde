import {
  CONTACT_ADDRESS,
  CONTACT_COMPANY,
  CONTACT_PHONE,
  OPENING_HOURS,
  SOCIAL_LINKS,
} from "~/config/navigation"
import { siteUrl } from "~/lib/site"

type OpeningHoursSpec = {
  "@type": "OpeningHoursSpecification"
  dayOfWeek: string[]
  opens: string
  closes: string
}

/** Schema.org opening hours derived from footer copy in `navigation.ts`. */
function openingHoursSpecification(): OpeningHoursSpec[] {
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "11:00",
      closes: "14:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "18:00",
      closes: "23:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "18:00",
      closes: "23:30",
    },
  ]
}

function schemaTelephone(phone: string): string {
  return phone.replace(/\s/g, "")
}

function schemaAddress(): {
  "@type": "PostalAddress"
  streetAddress: string
  postalCode: string
  addressLocality: string
  addressCountry: string
} {
  const [streetAddress, localityLine] = CONTACT_ADDRESS
  const postalMatch = localityLine?.match(/^(\d{4})\s+(.+)$/)
  return {
    "@type": "PostalAddress",
    streetAddress: streetAddress ?? "",
    postalCode: postalMatch?.[1] ?? "",
    addressLocality: postalMatch?.[2] ?? localityLine ?? "",
    addressCountry: "CH",
  }
}

export function buildRestaurantJsonLd(): Record<string, unknown> {
  const instagram = SOCIAL_LINKS.find((link) => link.label === "Instagram")

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: CONTACT_COMPANY.replace(/ GmbH$/, ""),
    url: siteUrl(),
    telephone: schemaTelephone(CONTACT_PHONE),
    address: schemaAddress(),
    servesCuisine: "Schweizer Küche, Saisonküche",
    priceRange: "€€",
    openingHoursSpecification: openingHoursSpecification(),
    ...(instagram ? { sameAs: [instagram.href] } : {}),
    // Human-readable hours mirror the footer for validators that read description.
    description: OPENING_HOURS.join("; "),
  }
}
