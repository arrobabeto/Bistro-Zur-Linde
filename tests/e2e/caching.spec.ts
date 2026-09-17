import { expect, test } from "@playwright/test"

test.describe("caching", () => {
  test("API probe is never CDN-cached", async ({ request }) => {
    // Side-effect-free endpoint. Middleware forces no-store on HTML and /api/**.
    const response = await request.get("/api/health/cache-probe", {
      failOnStatusCode: false,
    })

    expect(response.status()).toBe(204)

    const headers = response.headers()
    const cacheControl = [
      headers["cache-control"],
      headers["cdn-cache-control"],
      headers["vercel-cdn-cache-control"],
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    expect(cacheControl).toMatch(/no-store/)
    expect(cacheControl).not.toMatch(/s-maxage=\d+/)
  })

  test("home HTML is no-store so a normal refresh can pick up new CSS hashes", async ({
    request,
  }) => {
    const response = await request.get("/")
    expect(response.status()).toBe(200)
    const cacheControl = (
      response.headers()["cache-control"] ?? ""
    ).toLowerCase()
    expect(cacheControl).toMatch(/no-store/)
  })

  test("home page renders", async ({ request }) => {
    const response = await request.get("/")
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('data-testid="section-hero"')
  })
})
