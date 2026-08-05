import { describe, expect, it } from 'vitest';

import { ERROR_CODES } from '@relay/contracts';

import { ApiError } from './error';

describe('ApiError', () => {
  it('resolves a catalog message pair from the finer messageKey', () => {
    const error = ApiError.fromProblem(
      {
        code: ERROR_CODES.CONNECTION_ACTION_REQUIRED,
        status: 409,
        messageKey: 'error.connection_expired',
        retryable: false,
        detail: { account: 'Example Studio EU' },
      },
      409,
      'web_abc',
      null,
    );

    expect(error.messageKey).toBe('error.connection_expired.message');
    expect(error.actionKey).toBe('error.connection_expired.action');
    expect(error.messageValues).toEqual({ account: 'Example Studio EU' });
  });

  it('falls back to a code specific message when the API sends no messageKey', () => {
    const error = ApiError.fromProblem(
      { code: ERROR_CODES.SCOPE_INSUFFICIENT, status: 403 },
      403,
      null,
      null,
    );

    expect(error.messageKey).toBe('error.insufficient_scope.message');
    expect(error.isAuthorization).toBe(true);
    expect(error.isAuthentication).toBe(false);
  });

  it('normalises every messageKey spelling the API might send', () => {
    for (const key of ['errors.rate_limited', 'error.rate_limited', 'rate_limited']) {
      const error = ApiError.fromProblem(
        { code: ERROR_CODES.RATE_LIMITED, messageKey: key },
        429,
        null,
        30,
      );
      expect(error.messageKey).toBe('error.rate_limited.message');
      expect(error.isRateLimited).toBe(true);
      expect(error.retryAfterSeconds).toBe(30);
    }
  });

  it('drops non scalar details so an ICU formatter never receives an object', () => {
    const error = ApiError.fromProblem(
      {
        code: ERROR_CODES.VALIDATION_FAILED,
        detail: { field: 'body', issues: [{ code: 'TEXT_TOO_LONG' }], limit: 280 },
      },
      422,
      null,
      null,
    );

    expect(error.messageValues).toEqual({ field: 'body', limit: 280 });
  });

  it('distinguishes offline from an unreachable network', () => {
    expect(ApiError.offline(null).messageKey).toBe('error.offline.message');
    expect(ApiError.network(null).messageKey).toBe('error.network_unreachable.message');
  });

  it('never loses an unknown thrown value', () => {
    const error = ApiError.fromUnknown('boom', 'web_xyz');
    expect(error.code).toBe(ERROR_CODES.UNKNOWN);
    expect(error.correlationId).toBe('web_xyz');
  });
});
