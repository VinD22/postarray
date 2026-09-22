import { expect, test, type Page } from '@playwright/test';

import { requireGoldenStack, type GoldenEnv } from './env';

/**
 * The flows a new customer actually attempts, end to end, against the real
 * API, worker and the `fake` provider. Nothing here touches demo fixtures, so
 * a broken approval gate, a draft that is not saved or a job that never runs
 * fails this suite instead of hiding behind seeded data.
 */

// A 1x1 PNG. Real bytes so the upload, format check and scan all run.
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

async function signIn(page: Page, env: GoldenEnv): Promise<void> {
  await page.goto('/sign-in');
  await page.getByLabel('Email').first().fill(env.email);
  await page.getByLabel('Password', { exact: true }).fill(env.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).not.toHaveURL(/\/sign-in/);
}

async function selectChannels(page: Page, names: readonly string[]): Promise<void> {
  for (const name of names) {
    await page.getByRole('checkbox', { name: new RegExp(name, 'i') }).check();
  }
}

test.describe.configure({ mode: 'serial' });

test('publish now to two channels and see both receipts', async ({ page }) => {
  const env = await requireGoldenStack();
  await signIn(page, env);

  // Both simulated channels are connected. The fake provider's OAuth host is
  // `fake.invalid`, so connections come from the seed, not a consent screen.
  await page.goto('/connections');
  for (const name of env.channels) {
    await expect(page.getByText(name, { exact: false }).first()).toBeVisible();
  }

  // Upload an image and declare rights before it can publish.
  await page.goto('/library');
  await page.locator('input[type="file"]').first().setInputFiles({
    name: 'golden-path.png',
    mimeType: 'image/png',
    buffer: PIXEL_PNG,
  });
  await expect(page.getByText('golden-path.png').first()).toBeVisible();
  // Media must scan before publish: wait for it to leave the pending state.
  await expect(page.getByText(/scanning|pending/i).first()).toBeHidden({ timeout: 120_000 });
  await page.getByText('golden-path.png').first().click();
  await page.getByRole('radio', { name: 'This workspace' }).check();
  await page.getByRole('button', { name: /declare|save/i }).first().click();
  await expect(page.getByText(/Declared by/)).toBeVisible();

  // Compose, target both channels, publish now.
  const body = `Golden path ${Date.now().toString(36)}`;
  await page.goto('/compose');
  await page.getByRole('textbox').first().fill(body);
  await selectChannels(page, env.channels);
  // The draft id lands in the URL once the first save happens, so a reload
  // resumes this post instead of starting a new one.
  await expect(page).toHaveURL(/contentItemId=/);
  await page.getByRole('button', { name: /^Publish to \d+ channels? now$/ }).click();
  await page.getByRole('button', { name: /publish now|confirm/i }).last().click();

  // Both receipts, from the worker, not the page.
  await page.goto('/receipts');
  const rows = page.getByRole('row').filter({ hasText: body });
  await expect(rows).toHaveCount(2, { timeout: 180_000 });
  await expect(rows.filter({ hasText: /published/i })).toHaveCount(2, { timeout: 180_000 });
});

test('a forced provider failure can be retried and the result is shown', async ({ page }) => {
  const env = await requireGoldenStack();
  // TODO(worker): depends on a failure-injection seam. The fake connector's
  // `FakeProviderState.failNext` lives inside the worker process and nothing
  // outside it can set it. It needs a dev-only control (for example an env
  // var read by the worker, or a body marker the fake connector honours only
  // when POSTARRAY_ALLOW_FAKE_CONNECTOR is on) before this flow can run.
  test.fixme(true, 'No failure-injection seam into the worker fake provider yet.');
  await signIn(page, env);
  await page.goto('/receipts');
  const failed = page.getByRole('row').filter({ hasText: /failed/i }).first();
  await failed.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(failed).toContainText(/published/i, { timeout: 180_000 });
});

test('schedule a first post on a new channel', async ({ page }) => {
  const env = await requireGoldenStack();
  await signIn(page, env);

  const [channel] = env.channels;
  const body = `First scheduled ${Date.now().toString(36)}`;
  await page.goto('/compose');
  await page.getByRole('textbox').first().fill(body);
  await selectChannels(page, [channel]);
  await expect(page).toHaveURL(/contentItemId=/);
  await page.getByRole('button', { name: 'Schedule', exact: true }).first().click();
  // Accept the suggested time in the workspace zone and confirm.
  await page.getByRole('button', { name: 'Schedule', exact: true }).last().click();

  await page.goto('/calendar');
  await expect(page.getByText(body).first()).toBeVisible({ timeout: 60_000 });
});
