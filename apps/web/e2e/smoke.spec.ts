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
  /**
   * The suite runs against seeded demo data. If the demo-mode environment
   * variable and the name the app actually reads ever diverge again, every
   * product route falls back to the error boundary, which still returns 200
   * and still contains exactly one `<main>` element. Every other assertion in
   * this file, and all 42 accessibility audits, would keep passing while
   * auditing error pages. This test is the guard: it fails the moment the
   * product screens stop being the thing under test.
   */
  test('the suite is auditing the product, not the error boundary', async ({ page }) => {
    await openReadyPage(page, '/home');

    await expect(
      page.getByText('Sample workspace. Explore freely. Nothing publishes.'),
    ).toBeVisible();
  });

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

test.describe('marketing interactions', () => {
  test('the expanded custom cursor stays centered on the pointer', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await openReadyPage(page, '/for-creators');

    const ring = page.locator('.relay-cursor-ring');
    await expect(ring).toBeVisible();

    const resources = page.getByRole('link', { name: 'Resources', exact: true }).first();
    const bounds = await resources.boundingBox();
    expect(bounds).not.toBeNull();
    if (!bounds) return;

    const pointer = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    };
    await page.mouse.move(pointer.x, pointer.y);

    await expect(ring).toHaveAttribute('data-cursor-hover', 'true');
    // Measure the unscaled track: the ring's hover scale is a transition, so
    // its own box is mid-animation for a few frames. Both share one centre.
    const ringTrack = page.locator('.relay-cursor-ring-track');
    await expect
      .poll(async () => {
        const ringBounds = await ringTrack.boundingBox();
        if (!ringBounds) return Number.POSITIVE_INFINITY;

        const ringCenter = {
          x: ringBounds.x + ringBounds.width / 2,
          y: ringBounds.y + ringBounds.height / 2,
        };
        return Math.hypot(ringCenter.x - pointer.x, ringCenter.y - pointer.y);
      })
      .toBeLessThan(2);
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
