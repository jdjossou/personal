import { type Page, expect } from '@playwright/test';

/**
 * The five main-menu items, paired with the route each one opens and the URL the
 * section settles on. Order matches MENU_ITEMS / MENU_ROUTES in the app
 * (src/components/MainMenu/constants.ts).
 */
export const MENU = [
  { item: 'PROJECTS', route: '/projects' },
  { item: 'EDUCATION', route: '/education' },
  { item: 'EXPERIENCE', route: '/experience' },
  { item: 'STACK', route: '/stack' },
  { item: 'ABOUT', route: '/about' },
] as const;

/** The back control every section renders. */
export const BACK_TO_MENU = '← Back to menu';

/**
 * Drive the landing screen into the main menu the way a visitor does: load `/`,
 * confirm the PRESS ANY BUTTON prompt is up, then press a key. Returns once the
 * menu list has rendered. The app stays on `/` — entering the menu is an in-page
 * state swap, not a navigation.
 */
export async function enterMenu(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Juniel Djossou' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-menu-item="PROJECTS"]')).toBeVisible();
}
