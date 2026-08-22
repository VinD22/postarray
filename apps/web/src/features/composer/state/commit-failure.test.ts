import { describe, expect, it } from 'vitest';

import { ApiError } from '@/lib/api';

import { COMMIT_FAILURE_TITLE_KEY, describeCommitFailure } from './commit-failure';

describe('describeCommitFailure', () => {
  it('names what did not happen, per intent', () => {
    for (const intent of ['draft', 'approval', 'schedule', 'publish'] as const) {
      expect(describeCommitFailure(intent, new Error('boom')).titleKey).toBe(
        COMMIT_FAILURE_TITLE_KEY[intent],
      );
    }
  });

  it('carries the user-safe message, the remediation and the correlation id', () => {
    const failure = describeCommitFailure(
      'publish',
      ApiError.fromProblem(
        {
          code: 'CONNECTION_ACTION_REQUIRED',
          messageKey: 'error.connection_expired',
          detail: { provider: 'linkedin' },
          correlationId: 'corr_publish_1',
        },
        409,
        null,
        null,
      ),
    );

    expect(failure.messageKey).toBe('error.connection_expired.message');
    expect(failure.actionKey).toBe('error.connection_expired.action');
    expect(failure.values).toEqual({ provider: 'linkedin' });
    expect(failure.correlationId).toBe('corr_publish_1');
  });

  it('still produces a catalog key for a failure that is not an ApiError', () => {
    const failure = describeCommitFailure('schedule', new TypeError('fetch failed'));
    expect(failure.messageKey.startsWith('error.')).toBe(true);
    expect(failure.messageKey.endsWith('.message')).toBe(true);
    expect(failure.actionKey.endsWith('.action')).toBe(true);
  });

  it('never leaks a raw error string into the message', () => {
    const failure = describeCommitFailure('publish', new Error('DB password is hunter2'));
    expect(JSON.stringify(failure)).not.toContain('hunter2');
  });
});
