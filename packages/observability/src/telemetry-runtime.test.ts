import { afterEach, describe, expect, it } from 'vitest';

import {
  initErrorReporting,
  isErrorReportingEnabled,
  shutdownErrorReporting,
} from './errors';
import { isTracingEnabled, shutdownTracing, startTracing } from './tracing';

afterEach(async () => {
  await shutdownTracing();
  await shutdownErrorReporting(10);
});

describe('telemetry runtime dependencies', () => {
  it('initializes and shuts down the configured SDKs', async () => {
    await expect(
      initErrorReporting({
        dsn: 'https://public@example.invalid/1',
        environment: 'test',
        tracesSampleRate: 0,
      }),
    ).resolves.toBe(true);
    await expect(
      startTracing('relay-observability-test', { endpoint: 'http://127.0.0.1:4318' }),
    ).resolves.toBe(true);

    expect(isErrorReportingEnabled()).toBe(true);
    expect(isTracingEnabled()).toBe(true);
  });
});
