import { defineConfig, devices } from "@playwright/test"

/**
 * Mock-mode astro dev covers smoke, zero-JS and the API-not-cached middleware
 * guard. A true CDN cache hit requires a Vercel deployment (Phase 10) —
 * `@astrojs/vercel` does not support `astro preview`.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command:
      "ORBITYPE_MOCK=true pnpm exec astro dev --port 4173 --host 127.0.0.1 --force",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium" }],
})
