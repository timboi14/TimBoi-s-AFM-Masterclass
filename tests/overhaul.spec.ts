import { test, expect } from '@playwright/test';

/**
 * November 2026 overhaul: selectable sitting, study event log, Momentum
 * board, backup restore and the phone tab bar.
 */

const skipOnboarding = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('tba_onboarding_v1', JSON.stringify({ distance: 'month', dismissed: true }));
  });
};

test.describe('Sitting', () => {
  test('defaults to a sitting that can still be entered and can be switched', async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/settings');
    const active = page.locator('.st-sitting.is-active');
    // Settings is a lazy route; allow for a cold dev-server compile.
    await expect(active).toHaveCount(1, { timeout: 20_000 });
    await expect(active).not.toContainText('Closed');

    const other = page.locator('.st-sitting:not(.is-active):not([disabled])').first();
    if (await other.count()) {
      const label = (await other.locator('strong').innerText()).trim();
      await other.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('.st-sitting.is-active strong')).toHaveText(new RegExp(label, 'i'));
      await expect(page.locator('.st-sitting.is-active .st-sitting__badge')).toHaveText(/your sitting/i);
      await page.goto('/');
      await expect(page.locator('.home-v3__sitting-link')).toContainText(new RegExp(label, 'i'));
    }
  });
});

test.describe('Momentum and the event log', () => {
  test('a graded card becomes a study day, a streak and a weekly-goal tick', async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/');
    const board = page.getByTestId('momentum');
    await expect(board).toBeVisible();
    await expect(board.locator('.mo__streak-num')).toHaveText('0');

    await page.goto('/memory-lab');
    await page.getByRole('button', { name: /reveal|show answer|flip/i }).first().click();
    await page.getByRole('button', { name: /good/i }).first().click();

    await page.goto('/');
    await expect(page.getByTestId('momentum').locator('.mo__streak-num')).toHaveText('1');
    await expect(page.getByTestId('momentum').locator('.mo__dots .is-today.is-active')).toHaveCount(1);

    // The log is durable: it survives a reload because it lives in IndexedDB.
    await page.reload();
    await expect(page.getByTestId('momentum').locator('.mo__streak-num')).toHaveText('1');
  });

  test('weekly goal is adjustable and persists', async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/settings#goal');
    await page.locator('.st-goal button', { hasText: '6' }).click();
    await page.goto('/');
    await expect(page.getByTestId('momentum').locator('.mo__ring-of')).toHaveText(/of 6 days/i);
  });
});

test.describe('Backup and restore', () => {
  test('a downloaded backup restores progress into an empty browser', async ({ page, browser }) => {
    await skipOnboarding(page);
    await page.addInitScript(() => {
      if (!localStorage.getItem('tba_points')) {
        localStorage.setItem('tba_points', '777');
        localStorage.setItem('tba_fanName', 'RoundTrip');
      }
    });
    await page.goto('/settings#data');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Download backup' }).click(),
    ]);
    const file = await download.path();
    expect(file).toBeTruthy();

    const fresh = await browser.newContext();
    const page2 = await fresh.newPage();
    await page2.addInitScript(() => {
      localStorage.setItem('tba_onboarding_v1', JSON.stringify({ distance: 'month', dismissed: true }));
    });
    await page2.goto('/settings#data');
    await page2.locator('input[type=file]').setInputFiles(file!);
    await expect(page2.locator('.st-confirm')).toContainText(/replace everything/i);
    await Promise.all([
      page2.waitForEvent('load'),
      page2.getByRole('button', { name: 'Replace and reload' }).click(),
    ]);
    await expect.poll(() => page2.evaluate(() => localStorage.getItem('tba_points'))).toBe('777');
    await expect(page2.locator('input[aria-label="Fan name"]')).toHaveValue('RoundTrip');
    await fresh.close();
  });

  test('a file that is not a backup is refused', async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/settings#data');
    await page.locator('input[type=file]').setInputFiles({ name: 'notes.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":"world"}') });
    await expect(page.locator('.st-alert--bad')).toContainText(/not an academy backup/i);
    await expect(page.locator('.st-confirm')).toHaveCount(0);
  });
});

test.describe('Phone shell', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('tab bar is present, navigates, and nothing overflows sideways', async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/');
    const bar = page.locator('nav.bt');
    await expect(bar).toBeVisible();
    await bar.getByRole('link', { name: /papers/i }).click();
    await expect(page).toHaveURL(/\/past-papers/);
    await expect(bar.locator('.bt__tab.is-active')).toContainText(/papers/i);
    for (const route of ['/', '/settings']) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });
});
