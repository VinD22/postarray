import { ERROR_CODES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  ACTIVITY_OPTIONS,
  isNonRetryable,
  toTemporalActivityOptions,
} from './retry-policies.js';

describe('activity retry policies', () => {
  it('never lets Temporal retry the provider create call', () => {
    expect(ACTIVITY_OPTIONS.publish.retry.maximumAttempts).toBe(1);
  });

  it('classifies invalid content as non retryable everywhere it can appear', () => {
    expect(isNonRetryable('publish', ERROR_CODES.CONTENT_INVALID)).toBe(true);
    expect(isNonRetryable('prepareMedia', ERROR_CODES.CONTENT_INVALID)).toBe(true);
    expect(isNonRetryable('pollStatus', ERROR_CODES.CONTENT_INVALID)).toBe(true);
  });

  it('keeps transient provider failures retryable for polling and media', () => {
    expect(isNonRetryable('pollStatus', ERROR_CODES.PROVIDER_TRANSIENT)).toBe(false);
    expect(isNonRetryable('prepareMedia', ERROR_CODES.PROVIDER_TRANSIENT)).toBe(false);
  });

  it('refuses to retry an SSRF block on an external fetch', () => {
    expect(isNonRetryable('fetchExternal', ERROR_CODES.SSRF_BLOCKED)).toBe(true);
  });

  it('lets persistence retry forever and classifies nothing as fatal', () => {
    expect(ACTIVITY_OPTIONS.persistence.retry.maximumAttempts).toBe(0);
    expect(ACTIVITY_OPTIONS.persistence.retry.nonRetryableErrorTypes).toHaveLength(0);
  });

  it('gives every activity class a positive start to close timeout', () => {
    for (const options of Object.values(ACTIVITY_OPTIONS)) {
      expect(options.startToCloseTimeoutMs).toBeGreaterThan(0);
    }
  });

  it('caps every retrying policy so a backoff cannot grow without bound', () => {
    for (const [name, options] of Object.entries(ACTIVITY_OPTIONS)) {
      if (options.retry.maximumAttempts === 1) {
        continue;
      }
      expect(options.retry.maximumIntervalMs, name).toBeGreaterThan(0);
    }
  });
});

describe('toTemporalActivityOptions', () => {
  it('maps milliseconds through unchanged', () => {
    const mapped = toTemporalActivityOptions(ACTIVITY_OPTIONS.prepareMedia);
    expect(mapped.startToCloseTimeout).toBe(600_000);
    expect(mapped.heartbeatTimeout).toBe(60_000);
    expect(mapped.retry.initialInterval).toBe(5_000);
    expect(mapped.retry.backoffCoefficient).toBe(2);
    expect(mapped.retry.maximumAttempts).toBe(5);
  });

  it('omits optional timeouts that were not configured', () => {
    const mapped = toTemporalActivityOptions(ACTIVITY_OPTIONS.webhook);
    expect('heartbeatTimeout' in mapped).toBe(false);
    expect('scheduleToCloseTimeout' in mapped).toBe(false);
  });

  it('copies the non retryable list rather than sharing it', () => {
    const mapped = toTemporalActivityOptions(ACTIVITY_OPTIONS.publish);
    mapped.retry.nonRetryableErrorTypes.push('MUTATED');
    expect(ACTIVITY_OPTIONS.publish.retry.nonRetryableErrorTypes).not.toContain('MUTATED');
  });
});
