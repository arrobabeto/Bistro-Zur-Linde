import { ORBITYPE_API_KEYS_URL, hasSqlConfigured } from "./config"
import type { Page } from "~/types/page"
import type { Post } from "~/types/post"

const now = () => new Date().toISOString()

/**
 * One definition of starter content serving mock mode, the unconfigured/empty
 * fallback, and POST /api/setup/seed. findSeedPage returns null for unknown
 * slugs so FR-07 holds in mock mode.
 */
export function seedPages(): Page[] {
  return [
    {
      id: "seed-home",
      slug: "home",
      title: {
        en: "Welcome",
        de: "Willkommen",
      },
      lead: {
        en: "Get your Orbitype-powered Astro site running in a few steps.",
        de: "Bringen Sie Ihre Orbitype-Astro-Site in wenigen Schritten zum Laufen.",
      },
      img: "",
      keywords: ["welcome", "setup", "orbitype"],
      head: {},
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: {
            en: "Welcome to your Astro + Orbitype site",
            de: "Willkommen bei Ihrer Astro + Orbitype Site",
          },
          lead: {
            en: "This screen appears when the CMS is empty, unconfigured, or running in mock mode. Follow the steps below to connect Orbitype and publish real content.",
            de: "Dieser Bildschirm erscheint, wenn das CMS leer, nicht konfiguriert oder im Mock-Modus ist. Folgen Sie den Schritten unten.",
          },
          capabilities: [
            {
              title: { en: "Zero client JS by default", de: "Kein Client-JS" },
              text: {
                en: "Content pages ship HTML and CSS only — no framework runtime.",
                de: "Inhaltsseiten liefern nur HTML und CSS — kein Framework-Runtime.",
              },
              badge: "perf",
            },
            {
              title: { en: "Section-driven pages", de: "Abschnittsbasiert" },
              text: {
                en: "Compose pages from CMS JSON. Each section maps to one .astro file by name.",
                de: "Seiten aus CMS-JSON zusammensetzen. Jeder Abschnitt entspricht einer .astro-Datei.",
              },
            },
            {
              title: { en: "MCP authoring", de: "MCP-Authoring" },
              text: {
                en: "Read and write content from Cursor via Orbitype MCP — never leave the editor.",
                de: "Inhalte über Orbitype MCP in Cursor lesen und schreiben.",
              },
            },
          ],
          steps: [
            {
              title: {
                en: "Create a SQL connector",
                de: "SQL-Connector erstellen",
              },
              text: {
                en: "In Orbitype, create a SQL connector and point it at your Postgres database.",
                de: "Erstellen Sie in Orbitype einen SQL-Connector und verbinden Sie Ihre Postgres-Datenbank.",
              },
            },
            {
              title: {
                en: "Create a connector-scoped API key",
                de: "API-Schlüssel erstellen",
              },
              text: {
                en: `Create a key scoped to that connector at ${ORBITYPE_API_KEYS_URL}.`,
                de: `Erstellen Sie einen Schlüssel für diesen Connector unter ${ORBITYPE_API_KEYS_URL}.`,
              },
            },
            {
              title: {
                en: "Add credentials to .env",
                de: "Zugangsdaten in .env",
              },
              text: {
                en: "Set ORBITYPE_API_SQL_URL, ORBITYPE_API_SQL_KEY, and ORBITYPE_MOCK=false.",
                de: "Setzen Sie ORBITYPE_API_SQL_URL, ORBITYPE_API_SQL_KEY und ORBITYPE_MOCK=false.",
              },
              code: `ORBITYPE_MOCK=false
ORBITYPE_API_SQL_URL=https://core.orbitype.com/api/sql/v1
ORBITYPE_API_SQL_KEY=your-connector-key`,
            },
            {
              title: {
                en: "Install the CMS schema",
                de: "CMS-Schema installieren",
              },
              text: {
                en: "Creates the uid() function and the pages, posts, settings, contacts and templates tables. Safe to re-run.",
                de: "Erstellt die uid()-Funktion und die Tabellen. Kann sicher erneut ausgeführt werden.",
              },
              kind: "wizard",
            },
            {
              title: {
                en: "Seed starter content",
                de: "Starter-Inhalte laden",
              },
              text: {
                en: "Inserts the homepage and a sample post. Skips rows that already exist.",
                de: "Fügt die Startseite und einen Beispielbeitrag ein. Vorhandene Zeilen werden übersprungen.",
              },
              kind: "seed",
            },
            {
              title: {
                en: "Wire Orbitype MCP",
                de: "Orbitype MCP einrichten",
              },
              text: {
                en: "Export ORBITYPE_SQL_API_KEY (run pnpm run mcp:env), reload MCP in Cursor, then call orbitype_get_context.",
                de: "ORBITYPE_SQL_API_KEY exportieren (pnpm run mcp:env), MCP neu laden, dann orbitype_get_context aufrufen.",
              },
              code: `{
  "mcpServers": {
    "orbitype-sql": {
      "url": "https://core.orbitype.com/api/mcp/v1",
      "headers": {
        "X-API-KEY": "\${env:ORBITYPE_SQL_API_KEY}"
      }
    }
  }
}`,
            },
            {
              title: {
                en: "Build your first section",
                de: "Ersten Abschnitt bauen",
              },
              text: {
                en: "Add src/components/sections/SectionName.astro, then append matching JSON to pages.sections via SQL.",
                de: "SectionName.astro anlegen, dann passendes JSON per SQL anhängen.",
              },
            },
          ],
          hasSqlKeyConfigured: hasSqlConfigured(),
          apiKeysUrl: ORBITYPE_API_KEYS_URL,
          _orbi: { component: "SectionWelcome" },
        },
      ],
    },
  ]
}

export function seedPosts(): Post[] {
  return [
    {
      id: "seed-post-1",
      title: {
        en: "Getting started with sections",
        de: "Erste Schritte mit Abschnitten",
      },
      lead: {
        en: "<p>How CMS JSON becomes rendered HTML.</p>",
        de: "<p>Wie CMS-JSON zu gerendertem HTML wird.</p>",
      },
      img: "",
      status: {
        options: ["draft", "review", "published"],
        value: "published",
      },
      keywords: ["sections", "orbitype"],
      created_at: now(),
      updated_at: now(),
      sections: [
        {
          title: {
            en: "One file per section",
            de: "Eine Datei pro Abschnitt",
          },
          content: {
            en: "<p>Create <code>SectionName.astro</code> in <code>src/components/sections/</code>. The filename must match <code>_orbi.component</code> exactly.</p>",
            de: "<p>Erstellen Sie <code>SectionName.astro</code>. Der Dateiname muss genau <code>_orbi.component</code> entsprechen.</p>",
          },
          _orbi: { component: "SectionProse" },
        },
      ],
    },
  ]
}

export function findSeedPage(slug: string): Page | null {
  return seedPages().find((page) => page.slug === slug) ?? null
}

export function findSeedPost(id: string): Post | null {
  return seedPosts().find((post) => post.id === id) ?? null
}
