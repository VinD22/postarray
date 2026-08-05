import { describe, expect, it } from 'vitest';

import { ERROR_CODES } from '@relay/contracts';
import type { ErrorCode } from '@relay/contracts';

import {
  EXIT_CODES,
  EXIT_OK,
  errorCodesForExit,
  exitCodeFor,
  isRetryableExit,
} from './exit-codes.js';

describe('EXIT_CODES', () => {
  it('covers every error code in the taxonomy', () => {
    const codes = Object.values(ERROR_CODES) as ErrorCode[];
    for (const code of codes) {
      expect(EXIT_CODES[code], code).toBeTypeOf('number');
    }
    expect(Object.keys(EXIT_CODES).sort()).toEqual([...codes].sort());
  });

  it('never collides with success', () => {
    for (const value of Object.values(EXIT_CODES)) {
      expect(value).not.toBe(EXIT_OK);
    }
  });

  it('stays inside the range a shell can report', () => {
    for (const value of Object.values(EXIT_CODES)) {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(126);
    }
  });

  it('groups related failures so a script can branch on a family', () => {
    expect(exitCodeFor('AUTH_REQUIRED')).toBe(exitCodeFor('AUTH_INVALID_CREDENTIALS'));
    expect(errorCodesForExit(exitCodeFor('AUTH_REQUIRED'))).toContain('AUTH_INVALID_CREDENTIALS');
  });

  it('marks a transient family as worth retrying', () => {
    expect(isRetryableExit(exitCodeFor('RATE_LIMITED'))).toBe(true);
    expect(isRetryableExit(exitCodeFor('PROVIDER_TRANSIENT'))).toBe(true);
    expect(isRetryableExit(exitCodeFor('CONTENT_INVALID'))).toBe(false);
    expect(isRetryableExit(exitCodeFor('FORBIDDEN'))).toBe(false);
  });
});
