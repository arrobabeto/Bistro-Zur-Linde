import { expect, test } from "@playwright/test"

/**
 * Below `lg` the primary nav collapses into a native <details> disclosure.
 * These tests pin the two things that silently broke before: unreachable
 * navigation and horizontal page scroll from unbreakable display headings.
 */
test.describe("mobile home", () => {
  test("primary navigation is reachable through the disclosure", async ({
    page,
  }) => {
    await page.goto("/")

    const menu = page.locator("body > header details")
    const links = menu.locator("ul a")

    await expect(links.first()).toBeHidden()

    await menu.locator("summary").click()

    await expect(links).toHaveCount(6)
    for (const link of await links.all()) {
      await expect(link).toBeVisible()
      await expect(link).toHaveAttribute("href", /^\//)
    }
  })

  test("the reservation call to action stays visible without opening the menu", async ({
    page,
  }) => {
    await page.goto("/")
    // Direct child of nav: the logo and the reserve CTA, not the menu links
    await expect(
      page.locator('body > header nav > a[href="/kontakt"]'),
    ).toBeVisible()
  })

  for (const width of [320, 375, 390, 430, 768]) {
    test(`home does not scroll horizontally at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto("/")

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }
})
