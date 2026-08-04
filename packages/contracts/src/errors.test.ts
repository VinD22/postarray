import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  ERROR_CODES,
  ERROR_RETRYABLE,
  ERROR_STATUS,
  PROBLEM_TYPE_NAMESPACE,
  REDACTION_PLACEHOLDER,
  RelayError,
  ValidationFailedError,
  defaultMessageKey,
  errorCodeSchema,
  problemJsonSchema,
  redactDetails,
} from './errors.js';

describe('error taxonomy', () => {
  it('has a status and retry hint for every code', () => {
    for (const code of Object.values(ERROR_CODES)) {
      expect(ERROR_STATUS[code]).toBeGreaterThanOrEqual(400);
      expect(typeof ERROR_RETRYABLE[code]).toBe('boolean');
      expect(errorCodeSchema.safeParse(code).success).toBe(true);
    }
  });

  it('marks only transient classes retryable', () => {
    expect(ERROR_RETRYABLE.PROVIDER_TRANSIENT).toBe(true);
    expect(ERROR_RETRYABLE.PROVIDER_UNAVAILABLE).toBe(true);
    expect(ERROR_RETRYABLE.RATE_LIMITED).toBe(true);
    expect(ERROR_RETRYABLE.PROVIDER_PERMANENT).toBe(false);
    expect(ERROR_RETRYABLE.CONTENT_INVALID).toBe(false);
  });
});

describe('RelayError', () => {
  it('defaults message key, status and retry from the code', () => {
    const error = new RelayError(ERROR_CODES.RATE_LIMITED);
    expect(error.messageKey).toBe(defaultMessageKey(ERROR_CODES.RATE_LIMITED));
    expect(error.messageKey).toBe('errors.rate_limited');
    expect(error.status).toBe(429);
    expect(error.retryable).toBe(true);
    expect(RelayError.is(error)).toBe(true);
  });

  it('emits an RFC 9457 problem document', () => {
    const error = new RelayError(ERROR_CODES.NOT_FOUND, {
      details: { resource: 'connection' },
      correlationId: 'corr-1',
      instance: '/v1/connections/conn_1',
    });
    const problem = error.toProblemJson();
    expect(problem.type).toBe(`${PROBLEM_TYPE_NAMESPACE}:not_found`);
    expect(problem.title).toBe('NOT_FOUND');
    expect(problem.status).toBe(404);
    expect(problem.detail).toEqual({ resource: 'connection' });
    expect(problem.correlationId).toBe('corr-1');
    expect(problemJsonSchema.safeParse(problem).success).toBe(true);
    expect(JSON.parse(JSON.stringify(error))).toEqual(problem);
  });

  it('omits an empty detail bag', () => {
    expect(new RelayError(ERROR_CODES.INTERNAL).toProblemJson().detail).toBeUndefined();
  });
});

describe('redactDetails', () => {
  it('removes secret-looking keys at any depth', () => {
    const redacted = redactDetails({
      accessToken: 'abc',
      nested: { refreshToken: 'def', safe: 1 },
      apiKey: 'ghi',
      cookie: 'jkl',
      keep: 'visible',
    });
    expect(redacted.accessToken).toBe(REDACTION_PLACEHOLDER);
    expect(redacted.apiKey).toBe(REDACTION_PLACEHOLDER);
    expect(redacted.cookie).toBe(REDACTION_PLACEHOLDER);
    expect(redacted.keep).toBe('visible');
    expect(redacted.nested).toEqual({ refreshToken: REDACTION_PLACEHOLDER, safe: 1 });
  });

  it('truncates long strings and bounds arrays', () => {
    const redacted = redactDetails({
      long: 'x'.repeat(2000),
      many: Array.from({ length: 100 }, (_, index) => index),
    });
    expect(String(redacted.long)).toHaveLength(512);
    expect(redacted.many).toHaveLength(20);
  });

  it('is applied by the constructor', () => {
    const error = new RelayError(ERROR_CODES.INTERNAL, { details: { password: 'hunter2' } });
    expect(error.details.password).toBe(REDACTION_PLACEHOLDER);
  });
});

describe('fromUnknown', () => {
  it('passes a RelayError through untouched', () => {
    const original = new ValidationFailedError();
    expect(RelayError.fromUnknown(original)).toBe(original);
  });

  it('maps a ZodError to VALIDATION_FAILED with paths but no prose', () => {
    const result = z.object({ name: z.string() }).safeParse({ name: 7 });
    expect(result.success).toBe(false);
    const error = RelayError.fromUnknown(result.success ? null : result.error);
    expect(error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
    const issues = error.details.issues;
    expect(Array.isArray(issues)).toBe(true);
    expect(issues).toEqual([{ path: 'name', code: 'invalid_type' }]);
  });

  it('maps a plain Error to INTERNAL without leaking the message', () => {
    const error = RelayError.fromUnknown(new TypeError('database url postgres://user:pw@host'));
    expect(error.code).toBe(ERROR_CODES.INTERNAL);
    expect(error.details).toEqual({ name: 'TypeError' });
    expect(error.message).toBe(ERROR_CODES.INTERNAL);
  });

  it('maps a non-error throw to UNKNOWN', () => {
    const error = RelayError.fromUnknown('boom', 'corr-2');
    expect(error.code).toBe(ERROR_CODES.UNKNOWN);
    expect(error.correlationId).toBe('corr-2');
    expect(error.details).toEqual({ valueType: 'string' });
  });
});
