import { test, expect, type Page } from '@playwright/test';
import { BACK_TO_MENU } from './helpers';

// Each section is reachable directly (deep-loadable) and renders the shared
// "← Back to menu" control. A plain load arms no transition, so the screen shows
// immediately with no reveal mask.
const SECTIONS: { route: string; name: string; loaded: (page: Page) => Promise<void> }[] = [
  {
    route: '/projects',
    name: 'PROJECTS',
    loaded: async (page) => {
      await expect(page.getByRole('heading', { name: 'PROJECTS' })).toBeVisible();
    },
  },
  {
    route: '/education',
    name: 'EDUCATION',
    loaded: async (page) => {
      await expect(page.getByText('ACADEMIC STATUS')).toBeVisible();
      await expect(page.getByRole('listbox', { name: 'Study terms' })).toBeVisible();
    },
  },
  {
    route: '/experience',
    name: 'EXPERIENCE',
    loaded: async (page) => {
      await expect(page.getByRole('listbox', { name: 'Experience' }).first()).toBeVisible();
    },
  },
  {
    route: '/stack',
    name: 'STACK',
    loaded: async (page) => {
      await expect(
        page.getByRole('listbox', { name: 'Technology categories' }).first(),
      ).toBeVisible();
    },
  },
  {
    route: '/about',
    name: 'ABOUT',
    loaded: async (page) => {
      await expect(page.getByRole('heading', { name: 'ABOUT' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Ask about Juniel' })).toBeVisible();
    },
  },
];

for (const { route, name, loaded } of SECTIONS) {
  test.describe(`${name} section`, () => {
    test('loads when opened directly', async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(route);
      await loaded(page);
      await expect(page.getByRole('button', { name: BACK_TO_MENU })).toBeVisible();
    });

    test('Back to menu returns to the main menu', async ({ page }) => {
      await page.goto(route);
      await page.getByRole('button', { name: BACK_TO_MENU }).click();

      // The back control sends the visitor straight to the menu (not the landing
      // screen): the URL returns to `/` and the menu list is shown.
      await expect(page).toHaveURL('/');
      await expect(page.locator('[data-menu-item="PROJECTS"]')).toBeVisible();
    });
  });
}
