export const phrases = {
  address: { en: "Address", de: "Adresse" },
  all_rights_reserved: {
    en: "All rights reserved",
    de: "Alle Rechte vorbehalten",
  },
  company: { en: "Company", de: "Firma" },
  download: { en: "Download", de: "Herunterladen" },
  email: { en: "Email", de: "E-Mail" },
  first_name: { en: "First name", de: "Vorname" },
  homepage: { en: "Homepage", de: "Startseite" },
  last_name: { en: "Last name", de: "Nachname" },
  learn_more: { en: "Learn more", de: "Mehr erfahren" },
  load_more: { en: "Load more", de: "Mehr laden" },
  menu: { en: "Menu", de: "Menü" },
  message: { en: "Message", de: "Mitteilung" },
  page_not_found: { en: "Page not found", de: "Seite nicht gefunden" },
  page_not_found_description: {
    en: "The page you requested does not exist.",
    de: "Die angeforderte Seite existiert nicht.",
  },
  save: { en: "Save", de: "Speichern" },
  search: { en: "Search", de: "Suche" },
  send: { en: "Send", de: "Senden" },
  sent_successfully: {
    en: "Sent successfully",
    de: "Erfolgreich gesendet",
  },
  share_content: { en: "Share content", de: "Inhalt teilen" },
  subscribe: { en: "Subscribe", de: "Abonnieren" },
  subscribed_successfully: {
    en: "Subscribed successfully",
    de: "Erfolgreich abonniert",
  },
  posts: { en: "Posts", de: "Beiträge" },
  read_more: { en: "Read more", de: "Weiterlesen" },
  topic: { en: "Topic", de: "Thema" },
  phone: { en: "Phone", de: "Telefon" },
  reserve_now: { en: "Book now", de: "Jetzt reservieren" },
} as const

export type PhraseKey = keyof typeof phrases
