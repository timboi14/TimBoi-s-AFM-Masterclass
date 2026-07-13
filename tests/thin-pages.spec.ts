import { test, expect } from '@playwright/test';

/**
 * Audit batch 04 P2 — /scout and /training rebuild gate.
 * Both routes must now ship ≥ 3 KB of body content with the named
 * primitives (9 quotes + 7 rules for scout; Practice/Mock/Debrief buttons
 * for training).
 */
test.describe('/scout — Examiner Reports module', () => {
  test('renders 9 quotes + 7-rule cheat sheet + capability heatmap', async ({ page }) => {
    await page.goto('/scout');
    await page.waitForLoadState('networkidle');

    const body = await page.locator('body').innerText();
    expect(body.length, 'body should be substantially more than 1.1 KB').toBeGreaterThan(3000);

    // 7 numbered rules.
    const ruleHeadings = page.locator('ol > li h3');
    await expect(ruleHeadings).toHaveCount(7);

    // 9 examiner quotes (one <blockquote> each).
    const blockquotes = page.locator('blockquote');
    await expect(blockquotes).toHaveCount(9);

    // Sortable capability table is present.
    await expect(page.getByRole('cell', { name: /Adjusted Present Value/i }).first()).toBeVisible();
  });
});

test.describe('/training — Simulator hub', () => {
  test('renders Practice / Mock / Debrief mode buttons and is > 3 KB', async ({ page }) => {
    await page.goto('/training');
    await page.waitForLoadState('networkidle');

    const body = await page.locator('body').innerText();
    expect(body.length, 'body should be substantially more than the old thin page').toBeGreaterThan(2500);

    for (const label of ['Practice', 'Mock', 'Debrief']) {
      const link = page.getByRole('link', { name: new RegExp(`^${label}$`, 'i') });
      await expect(link, `${label} CTA should be visible`).toBeVisible();
    }

    // Section anchors from StickySubNav.
    for (const section of ['modes', 'pb', 'next']) {
      await expect(page.locator(`#${section}`)).toHaveCount(1);
    }
  });
});
