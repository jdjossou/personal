import { test, expect } from '@playwright/test';

// The landing / start screen — the first thing a visitor sees before the menu is
// summoned (src/components/Landing/Landing.tsx).
test.describe('landing screen', () => {
  test('shows the identity cluster and the PRESS ANY BUTTON prompt', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Juniel Djossou');
    await expect(page.getByRole('heading', { name: 'Juniel Djossou' })).toBeVisible();
    await expect(page.getByText('Software Engineer · CS @ UWATERLOO')).toBeVisible();

    const prompt = page.locator('[data-press-any-key]');
    await expect(prompt).toContainText('PRESS');
    await expect(prompt).toContainText('ANY');
    await expect(prompt).toContainText('BUTTON');
  });

  test('renders the external links pointing at the right destinations', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/jdjossou',
    );
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/juniel-djossou/',
    );
    await expect(page.getByRole('link', { name: 'Devpost' })).toHaveAttribute(
      'href',
      'https://devpost.com/jdjossou',
    );
    // The résumé opens in a new tab as a PDF served from /public.
    const resume = page.getByRole('link', { name: /Résumé/ });
    await expect(resume).toHaveAttribute('href', '/assets/docs/resume.pdf');
    await expect(resume).toHaveAttribute('target', '_blank');
  });

  test('pressing a key summons the main menu', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-press-any-key]')).toBeVisible();

    await page.keyboard.press('Enter');

    // The menu list and its (desktop) keyboard nav prompts appear; we stay on `/`.
    await expect(page.locator('[data-menu-item="PROJECTS"]')).toBeVisible();
    await expect(page.locator('[data-nav-prompts]')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('clicking the screen summons the main menu', async ({ page }) => {
    await page.goto('/');

    // Clicking the name (inside <main>, not a link) triggers the start handler.
    await page.getByRole('heading', { name: 'Juniel Djossou' }).click();

    await expect(page.locator('[data-menu-item="PROJECTS"]')).toBeVisible();
  });
});
