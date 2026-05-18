import { test, expect } from '@playwright/test';

/**
 * Audit batch 04 P3 — F2 must place caret at end without select-all.
 *
 * Regression scenario:
 *   1. Cell A1 holds "=1+1" (computed display: 2).
 *   2. User selects A1, presses F2.
 *   3. User types "23".
 *   4. Expected: cell now reads "=1+123" → 124 (caret was at end).
 *      Previous bug: select-all on mount → "23" replaced the entire formula
 *      → cell became "23".
 */
test.describe('CBE spreadsheet — F2 caret-at-end (Excel parity)', () => {
  test('F2 does not select-all; subsequent typing appends to the existing formula', async ({ page }) => {
    await page.goto('/past-papers?p=robson&tab=practice');

    const sheetTab = page.getByRole('tab', { name: /spreadsheet/i });
    await sheetTab.click();

    const grid = page.getByRole('grid', { name: /spreadsheet grid/i });
    await grid.click();

    // Seed A1 = "=1+1" → display "2".
    await page.keyboard.type('=1+1');
    await page.keyboard.press('Enter');
    await expect(page.locator('.cbe-sheet__cell').nth(0).locator('.cbe-sheet__display'))
      .toHaveText('2');

    // Move back to A1 (Enter advanced down one row).
    await page.keyboard.press('ArrowUp');

    // F2 to enter edit mode with the existing formula loaded, caret at end.
    await page.keyboard.press('F2');
    // Type "23" — should append to the end of "=1+1", giving "=1+123".
    await page.keyboard.type('23');
    await page.keyboard.press('Enter');

    await expect(page.locator('.cbe-sheet__cell').nth(0).locator('.cbe-sheet__display'))
      .toHaveText('124');
  });
});
