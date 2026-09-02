/** Starter CMS rows — single source for mock mode and `pnpm run cms:seed`. */

import { DATENSCHUTZ_BODY_DE } from "./legal/datenschutz-body.mjs"
import { IMPRESSUM_BODY_DE } from "./legal/impressum-body.mjs"
import { BLOG_HERBSTKARTE_BODY_DE } from "./blog/herbstkarte-body.mjs"

const now = () => new Date().toISOString()

const RESERVATION_HREF = "#reservieren"

/** Both "Speisekarte" buttons on /bistro scroll to the menu panel. */
const MENU_ANCHOR = "speisekarte"
const MENU_HREF = `#${MENU_ANCHOR}`

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
      head: {
        title: {
          de: "Bistro zur Linde | Restaurant & Eventlocation Oftringen",
        },
        description: {
          de: "Bistro zur Linde in Oftringen — Schweizer Küche, Eventlocation mit Sääli und Zigarrenlounge. Vier Räume für jeden Anlass. Jetzt Tisch reservieren.",
        },
      },
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
            { label: { de: "14\nGaultMillau\nPunkte" } },
            { label: { de: "Falstaff\n89 Punkte" } },
            { label: { de: "Team-Umzug\nkomplett" } },
          ],
          ctaLabel: { de: "Mehr über Ruedi Zünd" },
          ctaHref:
            "https://www.zofingertagblatt.ch/aargau/zofingen/rudolf-zuend-startet-im-bistro-zur-linde-neu-durch-ld.4215998",
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
              imgAlt: { de: "Gedeckte Tische im Gastraum des Bistros" },
            },
            {
              name: { de: "Sääli" },
              href: "/saali",
              img: "/images/room-saali.jpg",
              imgAlt: {
                de: "Gedeckter Tisch im Sääli mit Blick auf die Terrasse",
              },
            },
            {
              name: { de: "Zigarrenlounge" },
              img: "/images/room-zigarrenlounge.jpg",
              imgAlt: {
                de: "Leder-Sofas und Ledertisch in der Zigarrenlounge",
              },
            },
            {
              name: { de: "Wine Room" },
              img: "/images/room-wine-room.jpg",
              imgAlt: {
                de: "Weinraum mit Holztisch und Weinregalen",
              },
            },
          ],
          _orbi: { component: "SectionRooms" },
        },
        {
          slides: [
            {
              img: "/images/promo-1-mobile.jpg",
              imgDesktop: "/images/promo-1.jpg",
              imgAlt: { de: "Dachterrasse mit Lounge und Pergola" },
              eyebrow: { de: "Der Ort" },
              title: {
                de: "Neubau, Terrasse, Umgebung — einzigartig in der Region",
              },
              href: "/bistro",
            },
            {
              img: "/images/promo-2.jpg",
              imgAlt: {
                de: "Aussenansicht des Neubaus mit Eingang und Fassade",
              },
            },
            {
              img: "/images/promo-3.jpg",
              imgAlt: {
                de: "Linde-Schild mit Farnen und Öffnungszeiten am Eingang",
              },
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
              date: { de: "27 - August - 2026" },
              title: { de: "Neueröffnung Bistro zur Linde" },
              text: {
                de: "Am 27. August 2026 öffnet das Bistro zur Linde seine Türen und heisst seine Gäste in Küngoldingen herzlich willkommen.",
              },
              img: "/images/event-eroeffnung-mobile.jpg",
              imgDesktop: "/images/event-eroeffnung-desktop.jpg",
              imgAlt: {
                de: "Lindenpark-Gebäude bei der Neueröffnung mit Logo und Datum",
              },
            },
            {
              date: { de: "August 2026" },
              title: { de: "Ein Blick hinter die Kulissen des Lindenparks" },
              text: {
                de: "Von der Baustelle zum neuen Treffpunkt: Die Baureportage zeigt, wie der Lindenpark und das Bistro zur Linde Schritt für Schritt entstanden sind.",
              },
              ctaLabel: { de: "Mehr erfahren" },
              href: "https://www.zofingertagblatt.ch/aargau/zofingen/rudolf-zuend-startet-im-bistro-zur-linde-neu-durch-ld.4215998",
              img: "/images/event-interview.jpg",
              imgAlt: {
                de: "Zeitungsseite zur Baureportage des Lindenparks",
              },
            },
            {
              date: { de: "22- August -2026" },
              title: { de: "Bistro zur Linde im Zofinger Tagblatt" },
              text: {
                de: "Das Zofinger Tagblatt berichtet über das Bistro zur Linde und die Neueröffnung in Küngoldingen.",
              },
              ctaLabel: { de: "Mehr erfahren" },
              href: "/news",
              img: "/images/event-saisonkarte-mobile.jpg",
              imgDesktop: "/images/event-saisonkarte.jpg",
              imgAlt: {
                de: "Zeitungsartikel über Rudolf Zünd und das Bistro zur Linde",
              },
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
    {
      id: "seed-bistro",
      slug: "bistro",
      title: {
        de: "Bistro",
      },
      lead: {
        de: "Gut essen und sich einfach wohlfühlen — im Bistro zur Linde in Oftringen.",
      },
      img: "/images/bistro-hero.jpg",
      keywords: ["bistro", "restaurant", "oftringen", "mittagsmenü"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: { de: "Gut essen und sich\neinfach" },
          titleAccent: { de: "wohlfühlen." },
          lead: {
            de: "Mittagessen zwischen zwei Terminen, ein Abendessen zu zweit, ein Tisch für die ganze Familie — im Bistro zur Linde kocht Ruedi Zünd mit der Erfahrung vieler Jahre Gastronomie, serviert für jeden Tag in Oftringen.",
          },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          ctaSecondaryLabel: { de: "Speisekarte ansehen" },
          ctaSecondaryHref: MENU_HREF,
          img: "/images/bistro-hero.jpg",
          imgAlt: {
            de: "Gedeckte Tische vor dem beleuchteten Weinregal im Bistro zur Linde",
          },
          _orbi: { component: "SectionPageHero" },
        },
        {
          title: { de: "Für jeden" },
          titleAccent: { de: "Tag" },
          text: {
            de: "Handwerker beim Mittagessen. Geschäftsleute zwischen zwei Meetings. Freunde am Feierabend. Familien am Samstag. Vereine, die ihren Ausflug hier ausklingen lassen. Gäste, die einfach vorbeikommen, weil sie Lust auf ein gutes Essen haben.\nDas Bistro ist an jedem dieser Tische zu Hause.",
          },
          img: "/images/bistro-story.jpg",
          imgAlt: {
            de: "Gedeckte Tische im Gastraum mit Bar und Weinregal",
          },
          mediaPosition: "right",
          _orbi: { component: "SectionStory" },
        },
        {
          eyebrow: { de: "Küchenchef" },
          title: { de: "Die Küche" },
          text: {
            de: "Ruedi Zünd bringt sein Handwerk aus vielen Jahren Gastronomie ins Bistro zur Linde — Schweizer Küche mit einer feinen Handschrift, ehrlich gekocht und ohne Umwege auf den Teller gebracht.",
          },
          ctaLabel: { de: "Mehr über Ruedi Zünd" },
          ctaHref:
            "https://www.zofingertagblatt.ch/aargau/zofingen/rudolf-zuend-startet-im-bistro-zur-linde-neu-durch-ld.4215998",
          img: "/images/bistro-kueche.jpg",
          imgAlt: { de: "Professionelle Edelstahlküche im Bistro zur Linde" },
          _orbi: { component: "SectionShowcase" },
        },
        {
          title: { de: "Mittag- und\nAbendkarte" },
          text: {
            de: "Saisonal, mit frischen Produkten, vom Tagesmenü bis zum sorgfältig komponierten Abendessen. Die Speisekarte inklusive Preisen finden Sie direkt hier.",
          },
          ctaLabel: { de: "Speisekarte entdecken" },
          ctaHref: MENU_HREF,
          ctaSecondaryLabel: { de: "Getränkekarte ansehen" },
          img: "/images/bistro-menu.jpg",
          imgAlt: { de: "Angerichteter Teller mit Fleisch, Gemüse und Jus" },
          mediaPosition: "left",
          anchor: MENU_ANCHOR,
          _orbi: { component: "SectionSplitPanel" },
        },
        {
          title: { de: "Terrasse" },
          text: {
            de: "Idyllisch gelegen, mit einem weiten Blick, der sich grosszügig über die Umgebung öffnet — die Terrasse ist der ideale Platz für ein Mittagessen in der Sonne oder ein Glas Wein am Abend.",
          },
          img: "/images/bistro-terrasse.jpg",
          imgAlt: {
            de: "Dachterrasse mit Lounge-Sofas und Sitzbereich",
          },
          _orbi: { component: "SectionImageBanner" },
        },
        {
          title: { de: "Kommen Sie, wie Sie sind." },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          mark: "/images/logo.svg",
          _orbi: { component: "SectionReservation" },
        },
      ],
    },
    {
      id: "seed-news",
      slug: "news",
      title: {
        de: "News",
      },
      lead: {
        de: "Neuigkeiten, Eindrücke aus der Küche und alles, was sich im Bistro zur Linde gerade tut.",
      },
      img: "/images/news-hero.jpg",
      keywords: ["news", "bistro", "events", "oftringen"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: { de: "Was in der Linde passiert." },
          lead: {
            de: "Neuigkeiten, Eindrücke aus der Küche und alles, was sich im Bistro zur Linde gerade tut.",
          },
          img: "/images/news-hero.jpg",
          imgAlt: {
            de: "Küchenchef richtet einen frischen Salat in einer Edelstahlschüssel an",
          },
          _orbi: { component: "SectionSplitHero" },
        },
        {
          title: {
            de: "Aktuelles aus dem Bistro zur Linde",
          },
          columns: 2,
          items: [
            {
              date: { de: "27- August -2026" },
              title: { de: "Neueröffnung Bistro zur Linde" },
              text: {
                de: "Am 27. August 2026 öffnet das Bistro zur Linde seine Türen und heisst seine Gäste in Küngoldingen herzlich willkommen.",
              },
              img: "/images/event-eroeffnung-mobile.jpg",
              imgDesktop: "/images/news-card-1.jpg",
              imgAlt: {
                de: "Ankündigung der Neueröffnung vor dem Gebäude des Lindenparks",
              },
            },
            {
              date: { de: "27- August -2026" },
              title: { de: "Ein Blick hinter die Kulissen des Lindenparks" },
              text: {
                de: "Von der Baustelle zum neuen Treffpunkt: Die Baureportage zeigt, wie der Lindenpark und das Bistro zur Linde Schritt für Schritt entstanden sind.",
              },
              ctaLabel: { de: "Mehr erfahren" },
              href: "https://www.zofingertagblatt.ch/aargau/zofingen/rudolf-zuend-startet-im-bistro-zur-linde-neu-durch-ld.4215998",
              img: "/images/news-card-2.jpg",
              imgAlt: {
                de: "Zeitungsseite zur Baureportage des Lindenparks",
              },
            },
            {
              date: { de: "22- August -2026" },
              title: { de: "Bistro zur Linde im Zofinger Tagblatt" },
              text: {
                de: "Das Zofinger Tagblatt berichtet über das Bistro zur Linde und die Neueröffnung in Küngoldingen.",
              },
              ctaLabel: { de: "Mehr erfahren" },
              href: "https://www.zofingertagblatt.ch/aargau/zofingen/rudolf-zuend-startet-im-bistro-zur-linde-neu-durch-ld.4215998",
              img: "/images/news-card-3.jpg",
              imgAlt: {
                de: "Zeitungsartikel über Rudolf Zünd und das Bistro zur Linde",
              },
            },
            {
              title: { de: "Ein Raum für besondere Momente" },
              text: {
                de: "Geburtstag, Firmenessen oder Familienfeier: Im Sääli wird aus einem gemeinsamen Essen ein Anlass, bei dem Ihre Gesellschaft ganz unter sich bleiben kann.",
              },
              ctaLabel: { de: "Kontakt aufnehmen" },
              href: "/kontakt",
              img: "/images/news-card-4.jpg",
              imgAlt: {
                de: "Gäste an einer festlich gedeckten Tafel im Sääli",
              },
            },
          ],
          _orbi: { component: "SectionEvents" },
        },
        {
          eyebrow: { de: "Speisekarte ansehen" },
          eyebrowHref: "/documents/menu-2026-08-31-dc98112b.pdf",
          slides: [
            {
              title: { de: "Wo Geschmack entsteht" },
              author: { de: "Bistro zur Linde" },
              date: { de: "Untere Hauptstrasse 15B\n4665 Oftringen" },
              href: "/posts",
              img: "/images/news-featured.jpg",
              imgAlt: {
                de: "Küchenchef träufelt Dressing über einen frischen Salat",
              },
            },
          ],
          _orbi: { component: "SectionFeaturedArticles" },
        },
        {
          title: { de: "Kommen Sie, wie Sie sind." },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          mark: "/images/logo.svg",
          _orbi: { component: "SectionReservation" },
        },
      ],
    },
    {
      id: "seed-saali",
      slug: "saali",
      title: {
        de: "Sääli",
      },
      lead: {
        de: "Feiern und sich ganz unter sich fühlen — im Sääli der Linde.",
      },
      img: "/images/saali-hero.jpg",
      keywords: ["sääli", "feier", "anlass", "oftringen"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: { de: "Feiern und sich ganz\nunter sich fühlen." },
          lead: {
            de: "Ob runder Geburtstag, Firmenessen, Vereinsanlass oder Familienfeier — das Sääli ist Ihr eigener Raum in der Linde, ganz für Ihre Gesellschaft.",
          },
          ctaLabel: { de: "Sääli anfragen" },
          ctaHref: RESERVATION_HREF,
          align: "start",
          img: "/images/saali-hero.jpg",
          imgAlt: {
            de: "Gedeckte Tafeln im Sääli mit Blick durch die Fenster",
          },
          _orbi: { component: "SectionPageHero" },
        },
        {
          title: { de: "Für besondere anlässe" },
          text: {
            de: "Runde Geburtstage. Firmenessen und Weihnachtsfeiern. Vereinsanlässe. Familienfeiern und Apéros.\nDas Sääli macht daraus einen eigenen Rahmen, abseits vom Bistro-Trubel.",
          },
          img: "/images/saali-story.jpg",
          imgAlt: { de: "Weinregal im Sääli" },
          mediaPosition: "right",
          _orbi: { component: "SectionStory" },
        },
        {
          eyebrow: { de: "Der Rahmen" },
          mediaSize: "tall",
          slides: [
            {
              title: {
                de: "Ein eigener Raum mit Platz für Ihre Gesellschaft und einer Menüauswahl, die wir gemeinsam auf Ihren Anlass abstimmen.",
              },
              img: "/images/saali-rahmen.jpg",
              imgAlt: {
                de: "Gedeckte Tische im Sääli mit Blick auf den Weinkeller",
              },
            },
          ],
          _orbi: { component: "SectionFeaturedArticles" },
        },
        {
          title: { de: "Ihr Anlass,\nunser Rahmen." },
          ctaLabel: { de: "Sääli anfragen" },
          ctaHref: RESERVATION_HREF,
          img: "/images/saali-split.jpg",
          imgAlt: { de: "Ausgewählte Weine vor dem Weinregal" },
          mediaPosition: "left",
          panelTone: "muted",
          _orbi: { component: "SectionSplitPanel" },
        },
        {
          title: { de: "Kommen Sie, wie Sie sind." },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          mark: "/images/logo.svg",
          _orbi: { component: "SectionReservation" },
        },
      ],
    },
    {
      id: "seed-wine-room",
      slug: "wine-room",
      title: {
        de: "Wine Room",
      },
      lead: {
        de: "Direkt aus dem Wine Room ausgewählt, für Glas, Degustation oder Abend.",
      },
      img: "/images/wineroom-hero.jpg",
      keywords: ["wine room", "wein", "degustation", "oftringen"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: { de: "Wein entdecken und\nsich verwöhnen lassen." },
          lead: {
            de: "Direkt aus dem Wine Room ausgewählt, für Glas, Degustation oder Abend.",
          },
          ctaLabel: { de: "Wine Room anfragen" },
          ctaHref: RESERVATION_HREF,
          img: "/images/wineroom-hero.jpg",
          imgAlt: {
            de: "Gedeckter Tisch im Wine Room der Linde",
          },
          overlayImg: "/images/wineroom-goblet.png",
          titleWidth: "wide",
          _orbi: { component: "SectionPageHero" },
        },
        {
          eyebrow: { de: "Für Weinliebhaber" },
          title: { de: "Wein erleben, ungezwungen und echt." },
          items: [
            {
              index: { de: "I" },
              title: { de: "Glas zum Essen" },
              text: {
                de: "Entdecken Sie unsere monatlich wechselnden Raritäten im offenen Ausschank, die perfekt auf Ruedi Zünds ehrliche Küche abgestimmt sind.",
              },
            },
            {
              index: { de: "II" },
              title: { de: "Eine Degustation mit Freunden" },
              text: {
                de: "Erleben Sie eine geführte Reise durch ausgewählte Schweizer Winzer und europäische Spitzenweine in der intimen Runde unseres Wine Rooms.",
              },
            },
            {
              index: { de: "III" },
              title: { de: "Ein besonderer Tropfen für den Anlass" },
              text: {
                de: "Ob Jahrgangswein, Champagner oder Entdeckungstipp — wir verwahren den passenden Schatz in unserem klimatisierten Weinlager für Sie.",
              },
            },
            {
              index: { de: "IV" },
              title: { de: "Beratung, wenn Sie Hilfe brauchen" },
              text: {
                de: "Unser Team begleitet Sie persönlich und unkompliziert bei der Auswahl Ihrer Flasche — verständlich, leidenschaftlich und ohne Fachjargon.",
              },
            },
          ],
          _orbi: { component: "SectionWineOffer" },
        },
        {
          title: { de: "Im Wine Room" },
          text: {
            de: "Von Schweizer Tropfen aus dem Aargau, Luzern und Wallis bis zu grossen Namen aus Italien, Frankreich und Spanien — dazu Champagner für den besonderen Moment.\nIm offenen Ausschank geniessen Sie auch mal nur ein Glas, ganz ohne gleich eine Flasche zu bestellen.",
          },
          ctaLabel: { de: "Weinkarte ansehen" },
          ctaHref: RESERVATION_HREF,
          img: "/images/wineroom-interior.jpg",
          imgAlt: {
            de: "Innenraum des Wine Rooms mit Holztisch und Weinregalen",
          },
          _orbi: { component: "SectionWineDetail" },
        },
        {
          text: { de: "Auswählen   ·   Entkorken   ·   Erleben" },
          _orbi: { component: "SectionTaglineRibbon" },
        },
        {
          eyebrow: { de: "Eindrücke" },
          title: { de: "Eindrücke aus der Linde" },
          tiles: [
            {
              img: "/images/wineroom-gallery-1.jpg",
              imgAlt: { de: "Gedeckter Tisch im Wine Room" },
            },
            {
              img: "/images/wineroom-gallery-2.jpg",
              imgAlt: { de: "Weingläser und Flaschen" },
            },
            {
              img: "/images/wineroom-gallery-3.jpg",
              imgAlt: { de: "Atmosphäre im Wine Room" },
            },
            {
              img: "/images/wineroom-gallery-4.jpg",
              imgAlt: { de: "Impression aus der Linde" },
              play: true,
            },
          ],
          _orbi: { component: "SectionPhotoGallery" },
        },
        {
          title: { de: "Ihr Wein, unsere Auswahl." },
          ctaLabel: { de: "Wine Room anfragen" },
          ctaHref: RESERVATION_HREF,
          mark: "/images/logo.svg",
          _orbi: { component: "SectionReservation" },
        },
      ],
    },
    {
      id: "seed-zigarrenlounge",
      slug: "zigarrenlounge",
      title: {
        de: "Zigarrenlounge",
      },
      lead: {
        de: "Nach dem Essen noch bleiben — mit einer feinen Zigarre, einem Digestif oder einem Glas Wein.",
      },
      img: "/images/zigarren-hero.jpg",
      keywords: ["zigarrenlounge", "zigarre", "digestif", "oftringen"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          eyebrow: { de: "DIE ZIGARRENLOUNGE" },
          title: { de: "Verweilen und sich Zeit nehmen." },
          lead: {
            de: "Nach dem Essen noch bleiben — mit einer feinen Zigarre, einem Digestif oder einem Glas Wein, in der Zigarrenlounge des Bistro zur Linde.",
          },
          ctaLabel: { de: "Platz anfragen" },
          ctaHref: RESERVATION_HREF,
          img: "/images/zigarren-hero.jpg",
          imgAlt: {
            de: "Zigarrenlounge des Bistro zur Linde mit Ledersesseln",
          },
          titleWidth: "xl",
          _orbi: { component: "SectionPageHero" },
        },
        {
          eyebrow: { de: "FÜR DEN ABEND DANACH" },
          title: { de: "Vier Gründe, noch zu bleiben." },
          items: [
            {
              index: { de: "I" },
              title: { de: "Ein Digestif nach dem Essen" },
            },
            {
              index: { de: "II" },
              title: { de: "Ein Glas Wein mit Freunden" },
            },
            {
              index: { de: "III" },
              title: { de: "Eine Zigarre in Ruhe geniessen" },
            },
            {
              index: { de: "IV" },
              title: {
                de: "Ein Treffen unter Geschäftspartnern, das noch nicht enden muss",
              },
            },
          ],
          _orbi: { component: "SectionWineOffer" },
        },
        {
          eyebrow: { de: "DIE AUSWAHL" },
          title: { de: "Handwerkskunst & Leidenschaft" },
          titleSize: "md",
          text: {
            de: "Drei Marken, drei unterschiedliche Handschriften — eine gemeinsame Leidenschaft für traditionelle Handwerkskunst und ausgewählte Zigarren. Von Mitscho's Cigars aus Nicaragua über die Schweizer Prima Cigars bis zu Presidente Cigars aus der Dominikanischen Republik — mild bis kräftig, für jeden Geschmack.",
          },
          ctaLabel: { de: "Zigarrenkarte ansehen" },
          ctaHref: RESERVATION_HREF,
          img: "/images/zigarren-interior.jpg",
          imgAlt: {
            de: "Auswahl an Zigarren und Atmosphäre in der Lounge",
          },
          _orbi: { component: "SectionWineDetail" },
        },
        {
          text: { de: "Zünden   ·   Ziehen   ·   Geniessen" },
          _orbi: { component: "SectionTaglineRibbon" },
        },
        {
          eyebrow: { de: "EINDRÜCKE" },
          title: { de: "Stunden voller Ruhe und Genuss" },
          tiles: [
            {
              img: "/images/zigarren-gallery-1.jpg",
              imgAlt: { de: "Sitzecke in der Zigarrenlounge" },
            },
            {
              img: "/images/zigarren-gallery-2.jpg",
              imgAlt: { de: "Zigarren und Accessoires" },
            },
            {
              img: "/images/zigarren-gallery-3.jpg",
              imgAlt: { de: "Atmosphäre der Lounge" },
            },
            {
              img: "/images/zigarren-gallery-4.jpg",
              imgAlt: { de: "Impression aus der Zigarrenlounge" },
              play: true,
            },
          ],
          _orbi: { component: "SectionPhotoGallery" },
        },
        {
          title: { de: "Der Abend muss noch nicht enden." },
          ctaLabel: { de: "Platz anfragen" },
          ctaHref: RESERVATION_HREF,
          mark: "/images/logo.svg",
          _orbi: { component: "SectionReservation" },
        },
      ],
    },
    {
      id: "seed-kontakt",
      slug: "kontakt",
      title: {
        de: "Kontakt",
      },
      lead: {
        de: "Für Fragen, Anregungen oder alles, was sonst noch auf dem Herzen liegt — schreiben Sie uns.",
      },
      img: "/images/kontakt-banner.jpg",
      keywords: ["kontakt", "reservation", "oftringen"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: { de: "Wir sind" },
          titleAccent: { de: "für Sie da." },
          lead: {
            de: "Für Fragen, Anregungen oder alles, was sonst noch auf dem Herzen liegt — schreiben Sie uns.",
          },
          leftLabel: { de: "Adresse" },
          leftText: {
            de: "Bistro zur Linde\nUntere Hauptstrasse 15B",
          },
          middleLabel: { de: "Öffnungszeiten" },
          middleText: {
            de: "Mo–Fr: 11:00–14:00 & 18:00–23:30\nSa: 18:00–23:30\nSo: Geschlossen",
          },
          rightLabel: { de: "Küche" },
          rightText: {
            de: "Mo–Fr: 11:30–13:30 & 18:00–22:00\nSa: 18:00–22:00\nSo: Geschlossen",
          },
          _orbi: { component: "SectionContactHero" },
        },
        {
          title: { de: "Möchten Sie einen" },
          titleAccent: { de: "Tisch reservieren?" },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          img: "/images/kontakt-banner.jpg",
          imgAlt: {
            de: "Küchenchef richtet mit einer Pinzette einen Teller an",
          },
          _orbi: { component: "SectionMediaCta" },
        },
        {
          title: { de: "Schreiben Sie uns" },
          submitLabel: { de: "Nachricht senden" },
          privacyLabel: { de: "Ich akzeptiere die" },
          privacyHref: "/datenschutz",
          _orbi: { component: "SectionContactForm" },
        },
        {
          title: { de: "Adresse & Erreichbarkeit" },
          leftLabel: { de: "Adresse" },
          leftText: {
            de: "Bistro zur Linde\nUntere Hauptstrasse 15B",
          },
          rightLabel: { de: "Erreichbarkeit" },
          rightText: {
            de: "+41 62 788 60 69\nreservation@bistrozurlinde.ch",
          },
          ctaLabel: { de: "Route anzeigen" },
          ctaHref:
            "https://www.google.com/maps/search/?api=1&query=Untere+Hauptstrasse+15B,+4665+Oftringen",
          mapEmbedSrc:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2705.392567757981!2d7.940544176604083!3d47.30666890864074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479025e9d6c4f927%3A0xdad824867b2c5044!2sBistro%20zur%20Linde!5e0!3m2!1sen!2smx!4v1787735412311!5m2!1sen!2smx",
          imgAlt: {
            de: "Kartenausschnitt mit dem Standort des Bistro zur Linde",
          },
          _orbi: { component: "SectionLocationMap" },
        },
        {
          title: { de: "Kommen Sie, wie Sie sind." },
          ctaLabel: { de: "Tisch reservieren" },
          ctaHref: RESERVATION_HREF,
          mark: "/images/logo.svg",
          _orbi: { component: "SectionReservation" },
        },
      ],
    },
    {
      id: "seed-datenschutz",
      slug: "datenschutz",
      title: {
        de: "Datenschutz",
      },
      lead: {
        de: "Datenschutzerklärung der Bistro zur Linde GmbH.",
      },
      keywords: ["datenschutz", "privacy", "rechtliches"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          eyebrow: { de: "RECHTLICHES" },
          title: { de: "Datenschutz" },
          _orbi: { component: "SectionLegalHero" },
        },
        {
          heading: { de: "Allgemeine Datenschutzerklärung" },
          content: { de: DATENSCHUTZ_BODY_DE },
          _orbi: { component: "SectionLegalBody" },
        },
      ],
    },
    {
      id: "seed-impressum",
      slug: "impressum",
      title: {
        de: "Impressum",
      },
      lead: {
        de: "Impressum der Bistro zur Linde GmbH.",
      },
      keywords: ["impressum", "rechtliches", "legal"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          eyebrow: { de: "RECHTLICHES" },
          title: { de: "Impressum" },
          _orbi: { component: "SectionLegalHero" },
        },
        {
          heading: { de: "Impressum" },
          content: { de: IMPRESSUM_BODY_DE },
          variant: "impressum",
          _orbi: { component: "SectionLegalBody" },
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
        de: "Saisonale Menükarte: Herbstgenuss in der Linde",
      },
      lead: {
        de: "Wenn die Blätter im Lindenpark goldgelb tanzen, erwacht in unserer Küche eine ganz besondere kreative Energie — die neue Herbstkarte ist da.",
      },
      img: "/images/blog-hero-herbstkarte.jpg",
      status: {
        options: ["draft", "review", "published"],
        value: "published",
      },
      keywords: ["herbst", "menükarte", "gastronomie"],
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          category: { de: "Gastronomie" },
          date: { de: "27. August 2026" },
          title: { de: "Saisonale Menükarte: Herbstgenuss in der Linde" },
          author: { de: "Von Ruedi Zünd" },
          readingTime: { de: "Lesezeit: ca. 5 Min." },
          img: "/images/blog-hero-herbstkarte.jpg",
          imgAlt: {
            de: "Herbstliche Gerichte der saisonalen Menükarte in der Linde",
          },
          _orbi: { component: "SectionPostHero" },
        },
        {
          category: { de: "Gastronomie" },
          content: { de: BLOG_HERBSTKARTE_BODY_DE },
          _orbi: { component: "SectionPostBody" },
        },
        {
          eyebrow: { de: "Lesenswerte Geschichten" },
          title: { de: "Weitere Artikel aus dem Journal" },
          cards: [
            {
              category: { de: "Der Ort" },
              date: { de: "15. August 2026" },
              title: {
                de: "Ein Blick hinter die Kulissen des Lindenparks",
              },
              excerpt: {
                de: "Vom Fundament bis zum gedeckten Tisch: Erfahren Sie mehr über die Entstehung unseres neuen Begegnungsortes in Küngoldingen.",
              },
              href: "/news",
              img: "/images/blog-related-1.jpg",
              imgAlt: { de: "Lindenpark und Umgebung" },
              ctaLabel: { de: "Weiterlesen" },
            },
            {
              category: { de: "Weinkultur" },
              date: { de: "03. August 2026" },
              title: {
                de: "Die Schätze aus unserem historischen Wine Room",
              },
              excerpt: {
                de: "Unser Sommelier nimmt Sie mit auf eine Reise durch handverlesene europäische Weingüter und zeigt exklusive Raritäten.",
              },
              href: "/news",
              img: "/images/blog-related-2.jpg",
              imgAlt: { de: "Wine Room der Linde" },
              ctaLabel: { de: "Weiterlesen" },
            },
            {
              category: { de: "Events" },
              date: { de: "28. Juli 2026" },
              title: {
                de: "Feste feiern im gemütlichen Linde-Sääli",
              },
              excerpt: {
                de: "Ob runder Geburtstag, Familienfeier oder Firmenanlass — so planen Sie Ihren perfekten, privaten Event in unseren historischen Räumen.",
              },
              href: "/saali",
              img: "/images/blog-related-3.jpg",
              imgAlt: { de: "Sääli der Linde" },
              ctaLabel: { de: "Weiterlesen" },
            },
          ],
          _orbi: { component: "SectionRelatedPosts" },
        },
      ],
    },
  ]
}
