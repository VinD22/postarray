import { describe, expect, it } from 'vitest';

import {
  PROVIDER_ERROR_CLASSES,
  REMEDIATIONS,
  REMEDIATION_CODES,
  ProviderCallError,
  classifyProviderError,
  isRetryableProviderClass,
  parseRetryAfterSeconds,
  remediationFor,
  toContractErrorClass,
  toRelayError,
} from './errors.js';
import { fixedClock } from './ports.js';

const clock = fixedClock('2026-08-04T12:00:00.000Z');

describe('the taxonomy', () => {
  it('has exactly the six classes from the handoff', () => {
    expect([...PROVIDER_ERROR_CLASSES]).toEqual([
      'USER_ACTION_REQUIRED',
      'CONTENT_INVALID',
      'TRANSIENT_PROVIDER',
      'PERMANENT_PROVIDER',
      'INTERNAL',
      'UNKNOWN',
    ]);
  });

  it('retries only transient failures', () => {
    for (const errorClass of PROVIDER_ERROR_CLASSES) {
      expect(isRetryableProviderClass(errorClass)).toBe(errorClass === 'TRANSIENT_PROVIDER');
    }
  });

  it('maps every class to the lowercase contract class', () => {
    expect(toContractErrorClass('USER_ACTION_REQUIRED')).toBe('user_action_required');
    expect(toContractErrorClass('UNKNOWN')).toBe('unknown');
  });
});

describe('remediation wiring', () => {
  it('gives every remediation code a message, an action and a state', () => {
    for (const code of REMEDIATION_CODES) {
      const remediation = REMEDIATIONS[code];
      expect(remediation.code).toBe(code);
      expect(remediation.messageKey.length).toBeGreaterThan(0);
      expect(remediation.actionKey.length).toBeGreaterThan(0);
      expect(remediation.errorCode.length).toBeGreaterThan(0);
      expect(remediation.showsInActionCenter).toBe(true);
    }
  });

  it('never marks a non transient remediation retryable', () => {
    for (const code of REMEDIATION_CODES) {
      const remediation = REMEDIATIONS[code];
      if (remediation.retryable) {
        expect(remediation.defaultClass).toBe('TRANSIENT_PROVIDER');
      }
    }
  });
});

describe('classifyProviderError', () => {
  it('classifies 429 as transient with the rate limit remediation', () => {
    const classified = classifyProviderError({
      provider: 'x',
      operation: 'fetch_metrics',
      status: 429,
      headers: { 'retry-after': '90' },
      clock,
    });
    expect(classified.errorClass).toBe('TRANSIENT_PROVIDER');
    expect(classified.remediationCode).toBe('provider_rate_limited');
    expect(classified.retryAfterSeconds).toBe(90);
    expect(classified.retryable).toBe(true);
  });

  it('never marks a publish retryable, even when the class is transient', () => {
    const classified = classifyProviderError({
      provider: 'x',
      operation: 'publish',
      status: 503,
      clock,
    });
    expect(classified.errorClass).toBe('TRANSIENT_PROVIDER');
    expect(classified.retryable).toBe(false);
  });

  it('classifies an expired token as user action required', () => {
    const classified = classifyProviderError({
      provider: 'linkedin',
      operation: 'publish',
      status: 401,
      body: { error: 'revoked_access_token' },
      clock,
    });
    expect(classified.errorClass).toBe('USER_ACTION_REQUIRED');
    expect(classified.remediationCode).toBe('reconnect_account');
    expect(remediationFor(classified).oneClickAction).toBe('reconnect');
  });

  it('classifies a duplicate rejection as content invalid', () => {
    const classified = classifyProviderError({
      provider: 'x',
      operation: 'publish',
      status: 403,
      body: { detail: 'You are not allowed to create a duplicate content.' },
      clock,
    });
    expect(classified.errorClass).toBe('CONTENT_INVALID');
    expect(classified.remediationCode).toBe('duplicate_content');
  });

  it('classifies a suspended account as permanent', () => {
    const classified = classifyProviderError({
      provider: 'instagram',
      operation: 'publish',
      status: 403,
      body: { message: 'This account is suspended.' },
      clock,
    });
    expect(classified.errorClass).toBe('PERMANENT_PROVIDER');
    expect(classified.remediationCode).toBe('provider_rejected_content');
  });

  it('classifies our own bug as internal', () => {
    const classified = classifyProviderError({
      provider: 'fake',
      operation: 'preview',
      body: new TypeError('x is not a function'),
      clock,
    });
    expect(classified.errorClass).toBe('INTERNAL');
    expect(classified.remediationCode).toBe('contact_support');
  });

  it('classifies an unrecognised response as unknown and keeps evidence', () => {
    const classified = classifyProviderError({
      provider: 'fake',
      operation: 'get_status',
      status: 418,
      body: { odd: 'shape' },
      clock,
    });
    expect(classified.errorClass).toBe('UNKNOWN');
    expect(classified.errorCode).toBe('UNKNOWN');
    expect(classified.sanitizedResponse).toEqual({ odd: 'shape' });
  });

  it('classifies a transport failure as transient', () => {
    const classified = classifyProviderError({
      provider: 'fake',
      operation: 'get_status',
      transportCode: 'ECONNRESET',
      clock,
    });
    expect(classified.errorClass).toBe('TRANSIENT_PROVIDER');
    expect(classified.retryable).toBe(true);
  });

  it('strips a token the provider echoed into the error body', () => {
    const classified = classifyProviderError({
      provider: 'fake',
      operation: 'publish',
      status: 401,
      body: {
        message: 'Invalid token Bearer AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        access_token: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      },
      clock,
    });
    const serialized = JSON.stringify(classified);
    expect(serialized).not.toContain('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  });

  it('lets a provider refiner override the generic rules', () => {
    const classified = classifyProviderError({
      provider: 'tiktok',
      operation: 'publish',
      status: 500,
      clock,
      refiner: () => ({
        errorClass: 'USER_ACTION_REQUIRED',
        remediationCode: 'awaiting_provider_approval',
      }),
    });
    expect(classified.errorClass).toBe('USER_ACTION_REQUIRED');
    expect(classified.remediationCode).toBe('awaiting_provider_approval');
  });
});

describe('parseRetryAfterSeconds', () => {
  it('reads a delta seconds value', () => {
    expect(parseRetryAfterSeconds({ 'retry-after': '30' }, clock)).toBe(30);
  });

  it('reads an HTTP date', () => {
    expect(parseRetryAfterSeconds({ 'retry-after': 'Tue, 04 Aug 2026 12:01:00 GMT' }, clock)).toBe(60);
  });

  it('reads an absolute epoch reset header', () => {
    const epochSeconds = Math.floor(clock.now().getTime() / 1000) + 120;
    expect(parseRetryAfterSeconds({ 'x-rate-limit-reset': String(epochSeconds) }, clock)).toBe(120);
  });

  it('returns undefined when there is no hint', () => {
    expect(parseRetryAfterSeconds({}, clock)).toBeUndefined();
    expect(parseRetryAfterSeconds(undefined, clock)).toBeUndefined();
  });
});

describe('RelayError bridging', () => {
  it('carries the code, the message key and the retry hint', () => {
    const classified = classifyProviderError({
      provider: 'x',
      operation: 'fetch_metrics',
      status: 429,
      clock,
    });
    const error = toRelayError(classified, { correlationId: 'cor_1' });
    expect(error.code).toBe('RATE_LIMITED');
    expect(error.retryable).toBe(true);
    expect(error.details['remediationCode']).toBe('provider_rate_limited');
  });

  it('exposes the classification on ProviderCallError', () => {
    const classified = classifyProviderError({
      provider: 'x',
      operation: 'publish',
      status: 422,
      clock,
    });
    const error = new ProviderCallError(classified);
    expect(ProviderCallError.is(error)).toBe(true);
    expect(error.classified.errorClass).toBe('CONTENT_INVALID');
  });
});
