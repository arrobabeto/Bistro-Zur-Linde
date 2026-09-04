import { expect, test, type Page } from "@playwright/test"

const STORAGE_KEY = "bistro-cookie-banner-dismissed-on"

async function clearDismissFlag(page: Page): Promise<void> {
  await page.goto("/")
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY)
  await page.reload()
}

test.describe("cookie banner", () => {
  test("shows on home after 2s and stays dismissed for the day", async ({
    page,
  }) => {
    await clearDismissFlag(page)
    const banner = page.getByTestId("cookie-banner")
    await expect(banner).toBeHidden()

    await page.waitForTimeout(2100)
    await expect(banner).toBeVisible()
    await expect(banner.getByRole("heading", { level: 2 })).toHaveText(
      "Diese Website verwendet Cookies",
    )
    await expect(
      banner.getByRole("button", { name: "Verstanden" }),
    ).toBeVisible()

    await banner.getByRole("button", { name: "Verstanden" }).click()
    await expect(banner).toBeHidden()

    await page.reload()
    await page.waitForTimeout(2100)
    await expect(banner).toBeHidden()
  })

  test("dismisses with Escape and persists for the day", async ({ page }) => {
    await clearDismissFlag(page)
    const banner = page.getByTestId("cookie-banner")

    await page.waitForTimeout(2100)
    await expect(banner).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(banner).toBeHidden()

    await page.reload()
    await page.waitForTimeout(2100)
    await expect(banner).toBeHidden()
  })

  test("does not render on non-home pages", async ({ page }) => {
    await page.goto("/bistro")
    await page.waitForTimeout(2100)
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0)
  })
})
