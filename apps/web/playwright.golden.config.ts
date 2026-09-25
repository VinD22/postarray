import { defineConfig, devices } from '@playwright/test';

/**
 * Golden path: the real stack, not demo mode.
 *
 * `playwright.config.ts` runs the web app with
 * `NEXT_PUBLIC_POSTARRAY_DEMO_MODE=true`, where every API call is answered by
 * in-memory fixtures. That suite cannot see a broken approval gate, a lost
 * draft or a publish that never reaches a provider, because none of those
 * exist in demo mode. This project drives the same screens against a running
 * API and worker whose only provider is the in-repo `fake` connector.
 *
 * What has to be running before `pnpm --filter @relay/web test:e2e:golden`:
 *
 *   1. PostgreSQL with migrations applied and `pnpm --filter @relay/database
 *      seed` run. The seed creates the workspace, the owner and the `fake`
 *      connections this suite publishes to.
 *   2. `apps/api` on `API_URL` (default http://localhost:3001) with
 *      `NODE_ENV=development` and `POSTARRAY_ALLOW_FAKE_CONNECTOR=true`, and
 *      auth configured for the seeded owner.
 *   3. Temporal (`temporal server start-dev`) and `apps/worker` with the same
 *      two variables, so a scheduled or published job actually executes.
 *   4. Object storage and the media scanner configured for local use, so an
 *      upload moves from pending to ready. Media must scan before publish.
 *
 * Environment read by the suite (see `e2e/golden/env.ts`):
 *   GOLDEN_E2E_API_URL        API origin, checked with `/healthz` first
 *   GOLDEN_E2E_EMAIL          seeded owner's email
 *   GOLDEN_E2E_PASSWORD       seeded owner's password
 *   GOLDEN_E2E_CHANNELS       two connection display names, comma separated
 *
 * When any of these is missing, or the API does not answer, every test is
 * skipped with the reason, so a laptop without the stack reports "skipped"
 * rather than a false failure, and CI (which provides the stack) runs it.
 */
const port = process.env.RELAY_E2E_PORT ?? '3100';
const baseURL = `http://localhost:${port}`;
const apiUrl = process.env.GOLDEN_E2E_API_URL ?? 'http://localhost:3001';

export default defineConfig({
  testDir: './e2e/golden',
  outputDir: 'test-results/playwright-golden',
  timeout: 240_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  forbidOnly: process.env.CI === 'true',
  retries: 0,
  workers: 1,
  reporter:
    process.env.CI === 'true'
      ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report-golden' }]]
      : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'golden-path', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev:e2e',
    url: baseURL,
    reuseExistingServer: process.env.CI !== 'true',
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      ...process.env,
      RELAY_E2E_PORT: port,
      NEXT_PUBLIC_APP_URL: baseURL,
      NEXT_PUBLIC_SITE_ORIGIN: baseURL,
      NEXT_PUBLIC_POSTARRAY_API_URL: apiUrl,
      // The whole point of this project: never the fixture transport.
      NEXT_PUBLIC_POSTARRAY_DEMO_MODE: 'false',
    },
  },
});
