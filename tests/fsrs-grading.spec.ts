import { test, expect } from '@playwright/test';

/**
 * Reproduce-test from the regression audit (2026-05-18):
 *
 *   "/memory-lab shows the four FSRS rating buttons and a working
 *    FSRS/Leitner toggle persisted to settings."
 */
test.describe('/memory-lab — FSRS v5', () => {
  test('mode toggle present, default FSRS, four rating buttons after reveal', async ({ page }) => {
    await page.goto('/memory-lab#leitner');

    // Mode toggle radiogroup should be present with both options.
    const radiogroup = page.getByRole('radiogroup', { name: /scheduler mode/i });
    await expect(radiogroup).toBeVisible({ timeout: 15_000 });
    const fsrsRadio = radiogroup.getByRole('radio', { name: /fsrs v5/i });
    const leitnerRadio = radiogroup.getByRole('radio', { name: /leitner.*classic/i });
    await expect(fsrsRadio).toBeVisible();
    await expect(leitnerRadio).toBeVisible();

    // Default is FSRS.
    await expect(fsrsRadio).toHaveAttribute('aria-checked', 'true');

    // Reveal the answer on the first due card.
    const reveal = page.getByRole('button', { name: /reveal answer/i });
    await reveal.click();

    // All four FSRS rating buttons should now be visible and enabled.
    for (const label of ['Again', 'Hard', 'Good', 'Easy']) {
      const btn = page.getByRole('button', { name: new RegExp(label, 'i') });
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
    }
  });

  test('Leitner mode is binary (2 buttons), persisted across reloads', async ({ page }) => {
    await page.goto('/memory-lab#leitner');
    const radiogroup = page.getByRole('radiogroup', { name: /scheduler mode/i });
    const leitnerRadio = radiogroup.getByRole('radio', { name: /leitner.*classic/i });
    await leitnerRadio.click();
    await expect(leitnerRadio).toHaveAttribute('aria-checked', 'true');

    // Reveal and confirm only Again + Good are shown in Leitner mode.
    const reveal = page.getByRole('button', { name: /reveal answer/i });
    await reveal.click();
    await expect(page.getByRole('button', { name: /^again/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^good/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^hard/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^easy/i })).toHaveCount(0);

    // Persist across reload.
    await page.reload();
    await expect(radiogroup.getByRole('radio', { name: /leitner.*classic/i })).toHaveAttribute('aria-checked', 'true');
  });
});
