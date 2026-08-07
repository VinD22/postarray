import { expect, test } from '@playwright/test';

import { expectNoHorizontalPageOverflow, openReadyPage } from './navigation';

const PRODUCT_ROUTES = [
  '/home',
  '/compose',
  '/calendar',
  '/connections',
  '/library',
  '/settings',
] as const;

test.describe('critical product routes', () => {
  for (const route of PRODUCT_ROUTES) {
    test(`${route} renders one usable main landmark`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await openReadyPage(page, route);
      await expectNoHorizontalPageOverflow(page);
      expect(pageErrors).toEqual([]);
    });
  }

  test('the skip link is the first keyboard stop and moves focus to content', async ({ page }) => {
    await openReadyPage(page, '/compose');

    await page.keyboard.press('Tab');
    const skipLink = page.locator('.relay-skip-link');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });

  test('reduced-motion preference reaches the product document', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openReadyPage(page, '/compose');

    await expect
      .poll(() =>
        page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches),
      )
      .toBe(true);
  });

  test('calendar view choices use one keyboard-operable radio group', async ({ page }) => {
    await openReadyPage(page, '/calendar');

    const group = page.getByRole('radiogroup').first();
    const choices = group.getByRole('radio');
    await expect(choices).toHaveCount(4);

    const checkedBefore = await choices.evaluateAll((nodes) =>
      nodes.findIndex((node) => node.getAttribute('aria-checked') === 'true'),
    );
    expect(checkedBefore).toBeGreaterThanOrEqual(0);

    await choices.nth(checkedBefore).focus();
    await page.keyboard.press('ArrowRight');

    const expectedAfter = (checkedBefore + 1) % 4;
    await expect
      .poll(
        () =>
          choices.evaluateAll((nodes) =>
            nodes.findIndex((node) => node.getAttribute('aria-checked') === 'true'),
          ),
        { message: 'calendar view selection should settle after keyboard navigation' },
      )
      .toBe(expectedAfter);
    const checkedAfter = expectedAfter;
    expect(checkedAfter).toBe((checkedBefore + 1) % 4);
    await expect(choices.nth(checkedAfter)).toBeFocused();
  });
});

test.describe('pseudo locales', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('expanded copy remains usable on a narrow screen', async ({ page }) => {
    await openReadyPage(page, '/en-XA/compose');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-XA');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expectNoHorizontalPageOverflow(page);
  });

  test('bidi pseudo copy renders the application in RTL', async ({ page }) => {
    await openReadyPage(page, '/en-XB/compose');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en-XB');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expectNoHorizontalPageOverflow(page);
  });
});
