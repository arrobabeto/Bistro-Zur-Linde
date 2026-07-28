import { expect, test } from "@playwright/test"

test.describe("caching", () => {
  test("API responses are never CDN-cached", async ({ request }) => {
    // Middleware forces cache.set(false) on /api/**. Under astro.dev the
    // provider is inactive, so we assert the response still succeeds and
    // does not advertise a public shared cache.
    const response = await request.post("/api/setup/install-schema", {
      data: { table: "all" },
      failOnStatusCode: false,
    })

    // In mock / unconfigured modes this may be 400; that is fine.
    expect([200, 207, 400]).toContain(response.status())

    const headers = response.headers()
    const cacheControl = [
      headers["cache-control"],
      headers["cdn-cache-control"],
      headers["vercel-cdn-cache-control"],
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    if (cacheControl) {
      expect(cacheControl).not.toMatch(/s-maxage=\d+/)
    }
  })

  test("home page renders (CDN hit verified on Vercel in Phase 10)", async ({
    request,
  }) => {
    const response = await request.get("/")
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toMatch(/Welcome/i)
  })
})
