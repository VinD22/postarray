import { describe, expect, it } from 'vitest';

import { decideRetry, retryBlockKey } from './retry-target';
import type { CampaignTargetView } from './types';

const JOB = 'job_01j000000000000000000001';

function target(overrides: Partial<CampaignTargetView> = {}): CampaignTargetView {
  return {
    variantId: 'var_01j000000000000000000001',
    connectionId: 'conn_01j000000000000000000001',
    provider: 'linkedin',
    accountLabel: 'Acme on LinkedIn',
    state: 'failed_permanently',
    hasExternalPost: false,
    receiptId: null,
    permalink: null,
    publishedAt: null,
    failedItemCount: 0,
    ...overrides,
  };
}

describe('decideRetry', () => {
  it('offers a retry for a target that failed and has a job to retry against', () => {
    expect(decideRetry(target(), JOB)).toEqual({
      kind: 'available',
      publishJobId: JOB,
      variantId: 'var_01j000000000000000000001',
    });
  });

  it('never offers a retry for a target that already published', () => {
    // The whole point of the split. A retry here would publish a second copy
    // to an account that already has one.
    const decision = decideRetry(target({ state: 'published', hasExternalPost: true }), JOB);
    expect(decision).toEqual({ kind: 'blocked', reason: 'alreadyPublished' });
  });

  it.each(['preparing_media', 'dispatching', 'provider_processing'] as const)(
    'says an attempt is still running rather than offering a retry during %s',
    (state) => {
      expect(decideRetry(target({ state }), JOB)).toEqual({
        kind: 'blocked',
        reason: 'inFlight',
      });
    },
  );

  it('says the system is already retrying rather than asking a person to', () => {
    expect(decideRetry(target({ state: 'retry_scheduled' }), JOB)).toEqual({
      kind: 'blocked',
      reason: 'retryScheduled',
    });
  });

  it('separates a cancellation from a failure', () => {
    // Nothing went wrong here. Somebody decided this should not go out, and
    // offering to retry it would be offering to undo their decision by button.
    expect(decideRetry(target({ state: 'canceled' }), JOB)).toEqual({
      kind: 'blocked',
      reason: 'canceled',
    });
  });

  it('separates something the person must fix from something they can retry', () => {
    expect(decideRetry(target({ state: 'action_required' }), JOB)).toEqual({
      kind: 'blocked',
      reason: 'actionRequired',
    });
  });

  it('says there is no job when nothing in the campaign ever produced a receipt', () => {
    expect(decideRetry(target(), null)).toEqual({ kind: 'blocked', reason: 'noJob' });
  });

  it('keys every reason into the catalog rather than into English', () => {
    expect(retryBlockKey('canceled')).toBe('web.receipt.retry.blocked.canceled');
  });
});
