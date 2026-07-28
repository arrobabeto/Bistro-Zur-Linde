import type { APIRoute } from "astro"
import type { ReactElement } from "react"
import { ImageResponse } from "@vercel/og"
import {
  PUBLIC_OG_IMAGE_ENABLED,
  PUBLIC_OG_LOGO_PATH,
  PUBLIC_SITE_NAME,
} from "astro:env/client"

export const prerender = false

// OG canvas colours — not component UI tokens. Brand values mirrored from
// src/styles/global.css --color-brand-*.
const BRAND_900 = "#0e2138"
const BRAND_300 = "#7cc4fa"
const SLATE_300 = "#cbd5e1"
const SLATE_400 = "#94a3b8"
const WHITE = "#ffffff"

export const GET: APIRoute = async ({ url }) => {
  if (!PUBLIC_OG_IMAGE_ENABLED) {
    return new Response(null, { status: 404 })
  }

  const title = url.searchParams.get("title") || PUBLIC_SITE_NAME
  const description = url.searchParams.get("description") || ""

  const element = {
    type: "div",
    key: null,
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BRAND_900,
        color: WHITE,
        padding: "64px",
        fontFamily: "sans-serif",
      },
      children: [
        {
          type: "div",
          key: null,
          props: {
            style: {
              display: "flex",
              fontSize: 28,
              color: BRAND_300,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            },
            children: PUBLIC_SITE_NAME,
          },
        },
        {
          type: "div",
          key: null,
          props: {
            style: { display: "flex", flexDirection: "column", gap: 24 },
            children: [
              {
                type: "div",
                key: null,
                props: {
                  style: {
                    display: "flex",
                    fontSize: 64,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    maxWidth: "90%",
                  },
                  children: title.slice(0, 80),
                },
              },
              description
                ? {
                    type: "div",
                    key: null,
                    props: {
                      style: {
                        display: "flex",
                        fontSize: 28,
                        color: SLATE_300,
                        maxWidth: "85%",
                      },
                      children: description.slice(0, 160),
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        {
          type: "div",
          key: null,
          props: {
            style: {
              display: "flex",
              fontSize: 22,
              color: SLATE_400,
            },
            children: PUBLIC_OG_LOGO_PATH,
          },
        },
      ],
    },
  } as unknown as ReactElement

  return new ImageResponse(element, { width: 1200, height: 630 })
}
