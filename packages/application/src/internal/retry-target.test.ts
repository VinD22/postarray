import { describe, expect, it } from 'vitest';

import { decideRetry, retryJobIdempotencyKey, type RetryEvidence } from './retry-target';

function evidence(overrides: Partial<RetryEvidence> = {}): RetryEvidence {
  return {
    job: { id: 'job_1', state: 'failed_permanently', hasReceipt: false },
    laterJobs: [],
    receiptCount: 0,
    lastAttempt: { outcome: 'failed', errorClass: 'permanent_provider' },
    connectionStatus: 'active',
    versionIsCurrent: true,
    ...overrides,
  };
}

describe('single target retry, duplicate publication safety', () => {
  it('creates a retry for a failed target with no evidence of publication', () => {
    expect(decideRetry(evidence())).toEqual({ kind: 'create' });
    expect(
      decideRetry(evidence({ job: { id: 'job_1', state: 'action_required', hasReceipt: false } })),
    ).toEqual({ kind: 'create' });
  });

  it('refuses after a worker crash where the provider accepted and a receipt exists', () => {
    // The job row still says failed because the crash came before the state
    // write, but the receipt proves the post is live.
    expect(
      decideRetry(
        evidence({ job: { id: 'job_1', state: 'failed_permanently', hasReceipt: true } }),
      ),
    ).toMatchObject({ kind: 'refuse', reason: 'receipt_exists' });
  });

  it('refuses when any job wrote a receipt for this version on this connection', () => {
    expect(decideRetry(evidence({ receiptCount: 1 }))).toMatchObject({
      kind: 'refuse',
      messageKey: 'errors.job_already_published',
    });
  });

  it('refuses after a provider timeout whose outcome is unknown', () => {
    expect(
      decideRetry(evidence({ lastAttempt: { outcome: 'failed', errorClass: 'unknown' } })),
    ).toMatchObject({ kind: 'refuse', reason: 'outcome_unknown' });
    expect(
      decideRetry(evidence({ lastAttempt: { outcome: 'pending', errorClass: null } })),
    ).toMatchObject({ kind: 'refuse', reason: 'outcome_unknown' });
  });

  it('returns the in-flight retry for a duplicated request instead of creating another', () => {
    expect(decideRetry(evidence({ laterJobs: [{ id: 'job_2', state: 'scheduled' }] }))).toEqual({
      kind: 'return_existing',
      jobId: 'job_2',
    });
    expect(decideRetry(evidence({ laterJobs: [{ id: 'job_2', state: 'dispatching' }] }))).toEqual({
      kind: 'return_existing',
      jobId: 'job_2',
    });
  });

  it('refuses when a later retry already published', () => {
    expect(
      decideRetry(evidence({ laterJobs: [{ id: 'job_2', state: 'published' }] })),
    ).toMatchObject({ kind: 'refuse', reason: 'retry_published' });
  });

  it('refuses a superseded job so only the latest failure can be retried', () => {
    expect(
      decideRetry(evidence({ laterJobs: [{ id: 'job_2', state: 'failed_permanently' }] })),
    ).toMatchObject({ kind: 'refuse', reason: 'superseded' });
  });

  it('refuses when the token was revoked before the retry', () => {
    expect(decideRetry(evidence({ connectionStatus: 'revoked' }))).toMatchObject({
      kind: 'refuse',
      reason: 'connection_not_active',
    });
  });

  it('refuses a job that is not in a failed state', () => {
    expect(
      decideRetry(evidence({ job: { id: 'job_1', state: 'scheduled', hasReceipt: false } })),
    ).toMatchObject({ kind: 'refuse', reason: 'not_failed' });
  });

  it('refuses when the content changed after the job was frozen', () => {
    expect(decideRetry(evidence({ versionIsCurrent: false }))).toMatchObject({
      kind: 'refuse',
      reason: 'version_changed',
    });
  });

  it('derives the idempotency key from the original job and the attempt', () => {
    expect(retryJobIdempotencyKey('job_1', 2)).toBe(retryJobIdempotencyKey('job_1', 2));
    expect(retryJobIdempotencyKey('job_1', 2)).not.toBe(retryJobIdempotencyKey('job_1', 3));
    expect(retryJobIdempotencyKey('job_1', 2)).not.toBe(retryJobIdempotencyKey('job_9', 2));
    expect(retryJobIdempotencyKey('job_1', 2)).toMatch(/^pj_retry_[a-f0-9]{40}$/);
  });
});
