import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — reproduce-tests for the audit gate.
 *
 * Run locally:
 *   cd c:/Users/Timuhwe/Program
 *   npm i -D @playwright/test
 *   npx playwright install chromium
 *   npx playwright test -c tests/playwright.config.ts
 *
 * CI: invoke after the Vercel preview build is up.
 *   PLAYWRIGHT_BASE_URL=https://<preview-url> npx playwright test
 *
 * The two reproduce-tests below are non-negotiable for marking Sprints 6
 * (FSRS) and 7b (CBE) "live" per the regression audit:
 *
 *   1. tests/cbe-formula-eval.spec.ts — types =1+1 / =NPV(0.1,B2:B6)+B1
 *      / =AFM_NPV(0.1,B1:B6) and asserts numeric display.
 *   2. tests/fsrs-grading.spec.ts — visits /memory-lab, asserts FSRS/
 *      Leitner toggle exists and the four FSRS rating buttons render.
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
