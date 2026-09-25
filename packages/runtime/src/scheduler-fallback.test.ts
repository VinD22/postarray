import { describe, expect, it } from 'vitest';

import { schedulerFallbackAllowed, schedulerFallbackRefused } from './scheduler-fallback';

import type { RelayConfig } from '@relay/config';

type Profile = RelayConfig['core']['runtimeProfile'];

function configWith(profile: Profile, databaseUrl: string | undefined): RelayConfig {
  return {
    core: { runtimeProfile: profile },
    database: { url: databaseUrl },
  } as unknown as RelayConfig;
}

const NEON = 'postgresql://user:pw@ep-cool-name-123.us-east-2.aws.neon.tech/relay?sslmode=require';
const LOCAL = 'postgresql://postgres:postgres@localhost:5432/relay';
const COMPOSE = 'postgresql://postgres:postgres@postgres:5432/relay';

describe('schedulerFallbackAllowed', () => {
  it('permits a test process whatever it is pointed at', () => {
    expect(schedulerFallbackAllowed(configWith('test', NEON))).toBe(true);
    expect(schedulerFallbackAllowed(configWith('test', undefined))).toBe(true);
  });

  it('permits a local process against a local database', () => {
    expect(schedulerFallbackAllowed(configWith('local', LOCAL))).toBe(true);
    expect(schedulerFallbackAllowed(configWith('local', COMPOSE))).toBe(true);
  });

  it('refuses a local process pointed at a remote database', () => {
    // This is the case the old `NODE_ENV === production` guard let through:
    // a developer or a deploy script running against real customer data with
    // no Temporal, silently accepting schedules that never fire.
    expect(schedulerFallbackAllowed(configWith('local', NEON))).toBe(false);
  });

  it('refuses staging and production outright', () => {
    expect(schedulerFallbackAllowed(configWith('staging', LOCAL))).toBe(false);
    expect(schedulerFallbackAllowed(configWith('production', LOCAL))).toBe(false);
  });

  it('names the profile and the remedy when it refuses', () => {
    const error = schedulerFallbackRefused(configWith('staging', NEON));
    expect(error.details).toMatchObject({
      reason: 'scheduler_fallback_refused',
      profile: 'staging',
      databaseIsLocal: false,
    });
    expect(String(error.details?.remedy)).toContain('TEMPORAL_ADDRESS');
  });
});
