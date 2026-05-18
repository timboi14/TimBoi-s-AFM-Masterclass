import { test, expect } from '@playwright/test';

/**
 * Audit batch 04 — gate the Home hero from regressing to "TIMBOI".
 *
 *   "Home hero shows demo handle pre-auth, never 'TIMBOI'"
 *
 * The Demo handle is shaped `Demo · ABC123` (6 readable chars).
 */
test.describe('Identity — Home hero', () => {
  test('hero greeting never contains "timboi" and matches the demo shape', async ({ page }) => {
    // Seed the legacy fanName to make the bug reproducible if it returns.
    await page.goto('/');
    await page.evaluate(() => {
      try { localStorage.setItem('tba_fanName', 'timboi'); } catch { /* ignore */ }
    });
    await page.reload();

    const h1 = await page.locator('h1').first().textContent();
    expect(h1, 'hero h1 should not display the legacy fanName').not.toBeNull();
    expect(h1!.toLowerCase()).not.toContain('timboi');

    // The render path should be resolveIdentity().displayLabel — accept any
    // demo-shaped handle ("DEMO · XXXXXX") in case-insensitive form.
    expect(h1!).toMatch(/welcome back,\s*demo\s*·\s*[A-Z0-9]{4,8}/i);
  });
});
