import { expect, test } from '@playwright/test';
import { expectNoHorizontalPageOverflow, openReadyPage } from './navigation';

test('public scheduler is discoverable and sample moves are reversible', async ({ page }) => {
  await openReadyPage(page, '/');
  await page.getByRole('link', { name: 'Try the scheduler', exact: true }).first().click();
  await expect(page).toHaveURL(/\/scheduler$/);
  const post = page.locator('article').filter({ hasText: 'Meet your morning ritual' });
  await expect(post).toBeVisible();
  const initialDay = await post.locator('..').locator('..').getAttribute('data-drop-instant');
  // The route may still be hydrating under a loaded dev server, so a first click can land on
  // server-rendered markup. Retry the click until the move is observed.
  await expect(async () => {
    await post.getByRole('button', { name: 'Move to tomorrow' }).click();
    expect(await post.locator('..').locator('..').getAttribute('data-drop-instant')).not.toBe(
      initialDay,
    );
  }).toPass({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Reset sample' }).click();
  await expect
    .poll(() => post.locator('..').locator('..').getAttribute('data-drop-instant'))
    .toBe(initialDay);
  await page.getByRole('button', { name: 'Northbound Studio', exact: true }).click();
  await expect(post).toHaveCount(0);
  await expect(
    page.locator('article').filter({ hasText: 'A first look at our new collection' }),
  ).toBeVisible();
});

test('public scheduler fits a phone and names every platform', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openReadyPage(page, '/scheduler');
  await expectNoHorizontalPageOverflow(page);
  await expect(
    page.locator('article').first().getByText('Instagram', { exact: true }),
  ).toBeVisible();
});
