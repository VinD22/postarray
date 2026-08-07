import { defineConfig, devices } from '@playwright/test';

const e2ePort = process.env.RELAY_E2E_PORT ?? '3000';
const baseURL = `http://localhost:${e2ePort}`;

export default defineConfig({
  testDir: './e2e',
  outputDir: 'test-results/playwright',
  fullyParallel: false,
  forbidOnly: process.env.CI === 'true',
  retries: process.env.CI === 'true' ? 1 : 0,
  workers: 1,
  reporter:
    process.env.CI === 'true'
      ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
      : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev:e2e',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      ...process.env,
      NEXT_PUBLIC_APP_URL: baseURL,
      NEXT_PUBLIC_SITE_ORIGIN: baseURL,
      NEXT_PUBLIC_RELAY_DEMO_MODE: 'true',
      NEXT_PUBLIC_ENABLE_PSEUDO_LOCALES: 'true',
    },
  },
});
