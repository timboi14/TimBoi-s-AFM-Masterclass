import { expect, test } from '@playwright/test';

test.describe('Leave It To Us + Ke Finesse operating system', () => {
  test('Leave It To Us explains the merit and hands off to Ke Finesse', async ({ page }) => {
    await page.goto('/leave-it-to-us');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /We take ownership of the sequence/i })).toBeVisible();
    await expect(page.getByText(/Decision fatigue goes first/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Open ke finesse/i })).toHaveAttribute('href', '/ke-finesse');
  });

  test('Ke Finesse exposes a searchable five-stage tool stack', async ({ page }) => {
    await page.goto('/ke-finesse');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { level: 1, name: /ke finesse/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Five moves\. One closed pass loop/i })).toBeVisible();
    await expect(page.getByText(/Showing 16 of 16 tools/i)).toBeVisible();

    await page.getByRole('button', { name: 'Pressure', exact: true }).click();
    await expect(page.getByText(/Showing 4 of 16 tools/i)).toBeVisible();

    await page.getByRole('button', { name: 'All tools', exact: true }).click();
    await page.getByRole('searchbox', { name: /Search the vault/i }).fill('formula');
    await expect(page.getByText(/Showing 1 of 16 tools/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Formula wall' })).toBeVisible();
  });

  test('Ke Finesse stays usable at a 390px phone width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/ke-finesse');
    await expect(page.getByRole('heading', { level: 1, name: /ke finesse/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Choose the move for me/i })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'the Ke Finesse route should not overflow horizontally').toBeLessThanOrEqual(1);
  });
});
