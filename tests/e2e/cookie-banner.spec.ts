import { expect, test, type Page } from "@playwright/test"

const STORAGE_KEY = "bistro-cookie-banner-dismissed-on"
const COOKIE_NAME = "bistro_cookie_banner_day"

async function clearDismissFlag(page: Page): Promise<void> {
  await page.goto("/")
  await page.evaluate(
    ({ storageKey, cookieName }) => {
      localStorage.removeItem(storageKey)
      document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax`
      document.documentElement.removeAttribute("data-cookie-banner-dismissed")
    },
    { storageKey: STORAGE_KEY, cookieName: COOKIE_NAME },
  )
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
    await expect(banner).toHaveCount(0)

    const stored = await page.evaluate(
      ({ storageKey, cookieName }) => ({
        ls: localStorage.getItem(storageKey),
        cookie: document.cookie.includes(cookieName),
      }),
      { storageKey: STORAGE_KEY, cookieName: COOKIE_NAME },
    )
    expect(stored.ls).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(stored.cookie).toBe(true)

    await page.reload()
    await page.waitForTimeout(2100)
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0)
  })

  test("dismisses with Escape and persists for the day", async ({ page }) => {
    await clearDismissFlag(page)
    const banner = page.getByTestId("cookie-banner")

    await page.waitForTimeout(2100)
    await expect(banner).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(banner).toHaveCount(0)

    await page.reload()
    await page.waitForTimeout(2100)
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0)
  })

  test("persists via cookie when localStorage is unavailable", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const proto = Storage.prototype
      proto.setItem = () => {
        throw new Error("blocked")
      }
      proto.getItem = () => {
        throw new Error("blocked")
      }
      proto.removeItem = () => {
        throw new Error("blocked")
      }
    })

    await page.goto("/")
    await page.evaluate((cookieName) => {
      document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax`
    }, COOKIE_NAME)
    await page.reload()

    const banner = page.getByTestId("cookie-banner")
    await page.waitForTimeout(2100)
    await expect(banner).toBeVisible()

    await banner.getByRole("button", { name: "Verstanden" }).click()
    await expect(banner).toHaveCount(0)

    await page.reload()
    await page.waitForTimeout(2100)
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0)
  })

  test("does not render on non-home pages", async ({ page }) => {
    await page.goto("/bistro")
    await page.waitForTimeout(2100)
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0)
  })
})
