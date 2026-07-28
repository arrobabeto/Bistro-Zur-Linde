import { expect, test } from "@playwright/test"

test.describe("zero client JS", () => {
  test("home has no framework client bundle scripts", async ({ page }) => {
    await page.goto("/")

    const scripts = page.locator("script[src]")
    const count = await scripts.count()
    const srcs: string[] = []
    for (let i = 0; i < count; i++) {
      const src = await scripts.nth(i).getAttribute("src")
      if (src) srcs.push(src)
    }

    // Dev server injects Vite HMR clients — exclude those.
    // Production build is asserted separately via static output; here we
    // assert no third-party / GTM scripts and no framework islands.
    const thirdParty = srcs.filter(
      (src) =>
        src.includes("googletagmanager") ||
        src.includes("gtm.js") ||
        /\/_astro\/.*\.(vue|react|svelte)/.test(src),
    )
    expect(thirdParty).toEqual([])

    // Empty GTM means no noscript iframe either.
    await expect(page.locator('iframe[src*="googletagmanager"]')).toHaveCount(0)
  })
})
