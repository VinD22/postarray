import { test } from '@playwright/test';

import { expectNoBlockingAccessibilityViolations } from './accessibility';
import { openReadyPage } from './navigation';

const ROUTES = [
  '/',
  '/pricing',
  '/tools',
  '/tools/post-preflight',
  '/tools/utm-builder',
  '/tools/youtube-title-length',
  '/tools/time-zone-planner',
  // One generated character counter stands for all nine: they are the same
  // page with different numbers in it. The media table is its own shape, so it
  // is audited separately.
  '/tools/character-counter/x',
  '/tools/social-media-image-sizes',
  '/sign-in',
  '/home',
  '/compose',
  '/calendar',
  '/connections',
  '/approvals/approval_demo000000000001',
] as const;

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme accessibility`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((preference) => {
        window.localStorage.setItem('relay.theme', preference);
      }, theme);
    });

    for (const route of ROUTES) {
      test(`${route} has no serious or critical WCAG A/AA violation`, async ({
        page,
      }, testInfo) => {
        await openReadyPage(page, route);
        // Marketing motion intentionally starts from opacity 0. Wait for the
        // expressive entrance tier before asking axe to inspect contrast, so
        // the report describes the settled interface rather than a transient
        // animation frame.
        await page.waitForTimeout(2_000);
        await expectNoBlockingAccessibilityViolations(page, testInfo);
      });
    }
  });
}
