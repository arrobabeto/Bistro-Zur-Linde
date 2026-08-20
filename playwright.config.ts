import { defineConfig, devices } from "@playwright/test"

/**
 * Mock-mode astro dev covers smoke, zero-JS and the API-not-cached middleware
 * guard. A true CDN cache hit requires a Vercel deployment —
 * `@astrojs/vercel` does not support `astro preview`.
 *
 * Secrets are cleared for the webServer so ORBITYPE_MOCK cannot reach a live
 * connector even if .env contains a real key.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "pnpm exec astro dev --port 4173 --host 127.0.0.1 --force",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      ORBITYPE_MOCK: "true",
      ORBITYPE_API_SQL_KEY: "",
      ORBITYPE_API_SQL_URL: "",
      ORBITYPE_SQL_API_KEY: "",
      ORBITYPE_S3_PUBLIC_API_KEY: "",
      ORBITYPE_S3_PRIVATE_API_KEY: "",
      FIGMA_API_KEY: "",
      MAIL_API_KEY: "",
      REVALIDATE_SECRET: "",
      PUBLIC_SITE_URL: "http://127.0.0.1:4173",
      PUBLIC_SITE_NAME: "E2E Site",
      PUBLIC_SITE_DESCRIPTION: "Playwright mock-mode site",
      PUBLIC_ORGANIZATION_NAME: "E2E Org",
    },
  },
  projects: [
    { name: "chromium", testIgnore: /mobile\.spec\.ts/ },
    {
      // Hand-rolled instead of devices["iPhone 13"]: that profile defaults to
      // webkit, which is not part of the installed browser set.
      name: "mobile",
      testMatch: /mobile\.spec\.ts/,
      use: { viewport: { width: 390, height: 844 }, hasTouch: true },
    },
  ],
})
