import { describe, expect, it } from 'vitest';

import { describeApiError } from './api-error.js';

describe('describeApiError', () => {
  it('routes a missing scope to the permission state and keeps the scope names', () => {
    const described = describeApiError({
      code: 'SCOPE_INSUFFICIENT',
      messageKey: 'error.insufficient_scope.message',
      details: { requiredScopes: ['billing:read'], scope: 'billing:read' },
    });

    expect(described.kind).toBe('permission');
    expect(described.requirements).toEqual(['billing:read']);
    expect(described.values.scope).toBe('billing:read');
    expect(described.retrySafe).toBe(false);
  });

  it('routes a rate limit to its own state with the reset instant and usage', () => {
    const described = describeApiError({
      code: 'RATE_LIMITED',
      details: { resetAt: '2026-08-04T12:00:00.000Z', used: 90, limit: 100 },
    });

    expect(described.kind).toBe('rate-limit');
    expect(described.resetAt).toBe('2026-08-04T12:00:00.000Z');
    expect(described.usedRequests).toBe(90);
    expect(described.limitRequests).toBe(100);
    expect(described.retrySafe).toBe(true);
  });

  it('treats a transport failure as offline rather than as an unknown error', () => {
    expect(describeApiError(new TypeError('Failed to fetch')).kind).toBe('offline');
  });

  it('never offers retry for a permanent provider failure', () => {
    expect(describeApiError({ code: 'PROVIDER_PERMANENT' }).retrySafe).toBe(false);
  });

  it('drops non scalar detail values so nothing unformattable reaches a message', () => {
    const described = describeApiError({
      code: 'VALIDATION_FAILED',
      details: { field: 'url', nested: { secret: 'x' } },
    });

    expect(described.values).toEqual({ field: 'url' });
    expect(described.kind).toBe('validation');
  });

  it('falls back to a stable unknown code when the thrown value is not an api error', () => {
    const described = describeApiError('boom');
    expect(described.code).toBe('UNKNOWN');
    expect(described.messageKey).toBeNull();
  });
});
