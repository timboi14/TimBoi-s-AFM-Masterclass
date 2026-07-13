import { test, expect } from '@playwright/test';

/**
 * Audit batch 04 — gate the Home hero from regressing to "TIMBOI".
 *
 *   "Home hero shows demo handle pre-auth, never 'TIMBOI'"
 *
 * The Demo handle is shaped `Demo · ABC123` (6 readable chars).
 */
test.describe('Identity — Home hero', () => {
  test('hero never leaks the legacy fan name and leads with the training outcome', async ({ page }) => {
    // Seed the legacy fanName to make the bug reproducible if it returns.
    await page.goto('/');
    await page.evaluate(() => {
      try { localStorage.setItem('tba_fanName', 'timboi'); } catch { /* ignore */ }
    });
    await page.reload();

    const h1 = await page.locator('h1').first().textContent();
    expect(h1, 'hero h1 should not display the legacy fanName').not.toBeNull();
    expect(h1!.toLowerCase()).not.toContain('timboi');

    expect(h1!).toMatch(/know what to do next.*do it under pressure/i);
  });
});
