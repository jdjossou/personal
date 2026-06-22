import { test, expect } from '@playwright/test';
import { BACK_TO_MENU } from './helpers';

// Shareable per-item URLs. The slug routes render the very same list screen as the
// bare section and select the matching entry from the URL. An unknown slug is NOT
// a 404 — the screen falls back to its default selection and still renders.
test.describe('deep links', () => {
  test('a project slug selects that project', async ({ page }) => {
    await page.goto('/projects/clashroom');

    await expect(page).toHaveURL('/projects/clashroom');
    await expect(page.getByRole('heading', { name: 'PROJECTS' })).toBeVisible();
    // The detail readout reflects the deep-linked project.
    await expect(page.getByRole('heading', { name: /Clashroom/ })).toBeVisible();
  });

  test('an experience slug renders the role detail screen', async ({ page }) => {
    await page.goto('/experience/intact-fullstack-2026');

    await expect(page).toHaveURL('/experience/intact-fullstack-2026');
    // The detail screen is one level below the list, so its back control returns
    // to the list rather than the menu.
    await expect(page.getByRole('button', { name: '← Back to list' })).toBeVisible();
  });

  test('an unknown project slug degrades gracefully (no 404)', async ({ page }) => {
    const response = await page.goto('/projects/this-slug-does-not-exist');

    expect(response?.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'PROJECTS' })).toBeVisible();
    await expect(page.getByRole('button', { name: BACK_TO_MENU })).toBeVisible();
  });
});
