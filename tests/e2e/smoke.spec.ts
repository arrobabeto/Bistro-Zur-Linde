import { expect, test } from "@playwright/test"

test.describe("smoke", () => {
  test("home renders the hero section", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
    await expect(page.getByTestId("section-hero")).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("home renders every CMS section from the manifest", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("main > section")).toHaveCount(6)
  })

  test("unknown slug returns HTTP 404 in mock mode", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-real-page-xyz")
    expect(response?.status()).toBe(404)
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /not found|nicht gefunden/i,
    )
  })

  test("home does not show the debug panel", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("Missing section component")).toHaveCount(0)
  })

  test("SEO tags are present on home", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /./,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /./,
    )
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      /./,
    )
    expect(
      await page.locator('script[type="application/ld+json"]').count(),
    ).toBeGreaterThan(0)
  })

  test("JSON-LD escapes script-breaking sequences", async ({ page }) => {
    await page.goto("/")
    const scripts = page.locator('script[type="application/ld+json"]')
    const count = await scripts.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const raw = await scripts.nth(i).innerHTML()
      expect(raw).not.toMatch(/<\/script/i)
      // Hostile closers must be unicode-escaped if present in data
      expect(raw.includes("<")).toBe(false)
    }
  })

  test("sitemap and robots respond", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml")
    expect(sitemap.status()).toBe(200)
    expect(sitemap.headers()["content-type"]).toMatch(/xml/)

    const robots = await request.get("/robots.txt")
    expect(robots.status()).toBe(200)
    const text = await robots.text()
    expect(text).toMatch(/sitemap/i)
  })

  test("HTML does not leak secret key material", async ({ page }) => {
    await page.goto("/")
    const html = await page.content()
    expect(html).not.toMatch(/X-API-KEY["']?\s*[:=]\s*["'][A-Za-z0-9+/=]{20,}/)
    expect(html).not.toMatch(/figd_[A-Za-z0-9]{10,}/)
  })
})
