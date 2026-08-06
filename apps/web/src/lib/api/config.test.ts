import { describe, expect, it } from 'vitest';

import { readApiConfig } from './config';

describe('readApiConfig', () => {
  it('uses the configured API and normalizes trailing slashes', () => {
    expect(
      readApiConfig({
        apiUrl: ' https://api.example.test/// ',
        demoMode: 'true',
        nodeEnv: 'production',
      }),
    ).toMatchObject({
      baseUrl: 'https://api.example.test',
      mode: 'live',
    });
  });

  it('allows seeded fixtures only after an explicit non-production opt in', () => {
    expect(readApiConfig({ demoMode: 'true', nodeEnv: 'development' }).mode).toBe('demo');
    expect(readApiConfig({ nodeEnv: 'development' }).mode).toBe('unconfigured');
  });

  it('fails closed when production is missing an API URL', () => {
    expect(readApiConfig({ demoMode: 'true', nodeEnv: 'production' })).toMatchObject({
      baseUrl: null,
      mode: 'unconfigured',
    });
  });
});
