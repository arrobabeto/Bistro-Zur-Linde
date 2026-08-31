import sanitizeHtml from "sanitize-html"

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "a",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "img",
    "figure",
    "figcaption",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
    span: ["style", "class", "data-binflow-style"],
    "*": ["class"],
  },
  allowedStyles: {
    span: {
      "font-weight": [/^\d{3}$/],
      "font-size": [/^\d+px$/],
      color: [/^#[0-9A-Fa-f]{6}$/],
    },
  },
  allowedSchemes: ["https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
}

export function sanitize(html: string): string {
  return sanitizeHtml(html, OPTIONS)
}

/** Strip HTML tags for meta descriptions and plain-text excerpts. */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim()
}
