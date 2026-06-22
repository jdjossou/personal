import { test, expect } from '@playwright/test';
import { MENU, enterMenu } from './helpers';

// The main menu — selection system + keyboard / pointer navigation into the
// section routes (src/components/MainMenu/MainMenu.tsx).
test.describe('main menu', () => {
  test('PROJECTS is selected by default', async ({ page }) => {
    await enterMenu(page);
    await expect(page.locator('[data-menu-item="PROJECTS"]')).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  test('arrow keys move the selection (and wrap)', async ({ page }) => {
    await enterMenu(page);

    await page.keyboard.press('ArrowDown');
    await expect(page.locator('[data-menu-item="EDUCATION"]')).toHaveAttribute(
      'data-selected',
      'true',
    );

    // Wrap upward past the first item to the last one (ABOUT).
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('[data-menu-item="ABOUT"]')).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  test('hovering an item selects it', async ({ page }) => {
    await enterMenu(page);

    await page.locator('[data-menu-item="STACK"]').hover();
    await expect(page.locator('[data-menu-item="STACK"]')).toHaveAttribute(
      'data-selected',
      'true',
    );
  });

  test('Enter opens the selected section', async ({ page }) => {
    await enterMenu(page);

    await page.keyboard.press('ArrowDown'); // PROJECTS -> EDUCATION
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/education');
  });

  test('Escape returns to the landing screen', async ({ page }) => {
    await enterMenu(page);

    await page.keyboard.press('Escape');

    await expect(page.locator('[data-press-any-key]')).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('clicking the front item opens it', async ({ page }) => {
    await enterMenu(page);

    // PROJECTS is the front-most item in the stack, so a pointer click lands on
    // it cleanly. (The other items overlap under tilted neighbours, so they're
    // exercised via the keyboard below instead.)
    await page.locator('[data-menu-item="PROJECTS"]').click();

    await expect(page).toHaveURL('/projects');
  });

  for (const [index, { item, route }] of MENU.entries()) {
    test(`selecting ${item} with the keyboard opens ${route}`, async ({ page }) => {
      await enterMenu(page);

      // PROJECTS (index 0) is selected on open; step down to the wanted item.
      for (let i = 0; i < index; i++) await page.keyboard.press('ArrowDown');
      await expect(page.locator(`[data-menu-item="${item}"]`)).toHaveAttribute(
        'data-selected',
        'true',
      );

      await page.keyboard.press('Enter');

      await expect(page).toHaveURL(route);
    });
  }
});
