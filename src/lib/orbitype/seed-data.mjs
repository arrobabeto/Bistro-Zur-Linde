/** Starter CMS rows — single source for mock mode and `pnpm run cms:seed`. */

const now = () => new Date().toISOString()

const RESERVATION_HREF = "/kontakt"

export function buildSeedPages() {
  return [
    {
      id: "seed-home",
      slug: "home",
      title: {
        de: "Bistro zur Linde",
      },
      lead: {
        de: "Die Linde kehrt zurück — grösser, freier, an gleicher Stelle.",
      },
      img: "/images/hero.jpg",
      keywords: ["bistro", "restaurant", "oftringen", "küngoldingen"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: { de: "Ein Name mit Geschichte.\nEine Küche" },
          titleAccent: { de: "mit Ruf." },
          lead: {
            de: "Die Linde kehrt zurück — grösser, freier, an gleicher Stelle. Mit einem der profiliertesten Köche der Region und vier Räumen für jeden Ihrer Anlässe.",
          },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          img: "/images/hero.jpg",
          imgAlt: {
            de: "Gäste im hellen Gastraum des Bistro zur Linde mit Blick ins Grüne",
          },
          _orbi: { component: "SectionHero" },
        },
        {
          eyebrow: { de: "Küchenchef" },
          title: { de: "Ruedi Zünd bringt seinen Ruf mit nach Küngoldingen" },
          text: {
            de: "Langjähriger Wirt des Restaurant Federal in Zofingen — jetzt am Herd im Bistro zur Linde. Gemeinsam mit seinem gesamten Team. Bekannt für Schweizer Küche und gehobene französische Handschrift.",
          },
          stats: [
            { label: { de: "13\nGaultMillau\nPunkte" } },
            { label: { de: "Falstaff\n89 Punkte" } },
            { label: { de: "Team-Umzug\nkomplett" } },
          ],
          ctaLabel: { de: "Mehr über Ruedi Zünd" },
          ctaHref: "/news",
          img: "/images/chef.jpg",
          imgAlt: { de: "Küchenchef Ruedi Zünd in seiner Küche" },
          _orbi: { component: "SectionChefProfile" },
        },
        {
          eyebrow: { de: "Vier Räume, eine Küche" },
          title: { de: "Für jeden Anlass die richtige Tür" },
          rooms: [
            {
              name: { de: "Bistro" },
              href: "/bistro",
              img: "/images/room-bistro.jpg",
              imgAlt: { de: "Gastraum des Bistros mit grossen Fenstern" },
            },
            {
              name: { de: "Sääli" },
              href: "/saali",
              img: "/images/room-saali.jpg",
              imgAlt: { de: "Festlich gedeckte Tafel im Sääli" },
            },
            {
              name: { de: "Zigarrenlounge" },
              href: "/zigarrenlounge",
              img: "/images/room-zigarrenlounge.jpg",
              imgAlt: { de: "Ledersessel in der Zigarrenlounge" },
            },
            {
              name: { de: "Wine Room" },
              href: "/wine-room",
              img: "/images/room-wine-room.jpg",
              imgAlt: { de: "Weinregale im Wine Room" },
            },
          ],
          _orbi: { component: "SectionRooms" },
        },
        {
          slides: [
            {
              img: "/images/promo-1.jpg",
              imgAlt: { de: "Terrasse des Bistro zur Linde im Abendlicht" },
              eyebrow: { de: "Der Ort" },
              title: {
                de: "Neubau, Terrasse, Umgebung — einzigartig in der Region",
              },
              href: "/bistro",
            },
            {
              img: "/images/promo-2.jpg",
              imgAlt: { de: "Eingangsbereich des Neubaus" },
            },
            {
              img: "/images/promo-3.jpg",
              imgAlt: { de: "Gartenanlage mit Gräsern vor dem Lindenpark" },
            },
          ],
          _orbi: { component: "SectionPromoBanner" },
        },
        {
          eyebrow: { de: "Events" },
          title: {
            de: "Vier Räume. Eine Küche. Für jeden Anlass der richtige.",
          },
          items: [
            {
              date: { de: "03 FEB 2027" },
              title: { de: "Eröffnung Bistro zur Linde" },
              text: {
                de: "Feiern Sie mit uns die Eröffnung und entdecken Sie die neue Linde zum ersten Mal.",
              },
              ctaLabel: { de: "Mehr erfahren" },
              href: "/news",
              img: "/images/event-eroeffnung.jpg",
              imgAlt: { de: "Gäste vor dem Eingang des Bistro zur Linde" },
            },
            {
              date: { de: "03 FEB 2027" },
              title: { de: "Ruedi Zünd im Interview" },
              text: {
                de: "Erfahren Sie mehr über seine Philosophie, seine Küche und den Neustart in Küngoldingen.",
              },
              ctaLabel: { de: "Mehr erfahren" },
              href: "/news",
              img: "/images/event-interview.jpg",
              imgAlt: { de: "Ruedi Zünd richtet einen Teller an" },
            },
            {
              date: { de: "03 FEB 2027" },
              title: { de: "Saisonkarte Herbst" },
              text: {
                de: "Kulinarische Highlights der Saison – frisch, regional und mit viel Leidenschaft gekocht.",
              },
              ctaLabel: { de: "Jetzt entdecken" },
              href: "/news",
              img: "/images/event-saisonkarte.jpg",
              imgAlt: { de: "Herbstlich angerichteter Teller mit Weinglas" },
            },
          ],
          _orbi: { component: "SectionEvents" },
        },
        {
          title: { de: "Wir freuen uns" },
          titleAccent: { de: "auf Sie." },
          text: {
            de: "Reservieren Sie Ihren Tisch — im Bistro, Sääli, der Zigarrenlounge oder im Wine Room.",
          },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          mark: "/images/logo.svg",
          _orbi: { component: "SectionReservation" },
        },
      ],
    },
  ]
}

export function buildSeedPosts() {
  return [
    {
      id: "seed-post-1",
      title: {
        de: "Eröffnung Bistro zur Linde",
      },
      lead: {
        de: "<p>Feiern Sie mit uns die Eröffnung und entdecken Sie die neue Linde zum ersten Mal.</p>",
      },
      img: "/images/event-eroeffnung.jpg",
      status: {
        options: ["draft", "review", "published"],
        value: "published",
      },
      keywords: ["eröffnung", "events"],
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: { de: "Ein Abend für die Nachbarschaft" },
          content: {
            de: "<p>Die Türen der neuen Linde öffnen sich zum ersten Mal. Lernen Sie das Team kennen, entdecken Sie die vier Räume und geniessen Sie einen ersten Vorgeschmack auf die Küche von Ruedi Zünd.</p>",
          },
          _orbi: { component: "SectionProse" },
        },
      ],
    },
  ]
}
