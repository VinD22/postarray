import { expect, type Page } from '@playwright/test';

export async function openReadyPage(page: Page, path: string): Promise<void> {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });

  expect(response, `Navigation to ${path} should return a response`).not.toBeNull();
  expect(response?.ok(), `Navigation to ${path} should succeed`).toBe(true);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('main')).toBeVisible();
}

export async function expectNoHorizontalPageOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    contentWidth: document.documentElement.scrollWidth,
  }));

  expect(overflow.contentWidth, 'The document should fit within the viewport').toBeLessThanOrEqual(
    overflow.viewportWidth + 1,
  );
}
