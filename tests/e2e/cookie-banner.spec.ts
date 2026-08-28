import { expect, test } from "@playwright/test"

test.describe("cookie banner", () => {
  test("shows on home after 2s and dismisses with button or Escape", async ({
    page,
  }) => {
    await page.goto("/")
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
    await expect(banner).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(banner).toBeHidden()
  })

  test("does not render on non-home pages", async ({ page }) => {
    await page.goto("/bistro")
    await page.waitForTimeout(2100)
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0)
  })
})
