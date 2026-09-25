import { describe, expect, it } from 'vitest';

import { approvalsIndexState, type ApprovalsIndexInput } from './approvals-index-state';

const base: ApprovalsIndexInput = {
  isPending: false,
  error: null,
  count: 2,
  hasMore: false,
  membersFailed: false,
};
const err = { isOffline: false, isAuthorization: false, isRateLimited: false };

describe('approvalsIndexState', () => {
  it('covers every state', () => {
    expect(approvalsIndexState({ ...base, isPending: true })).toBe('loading');
    expect(approvalsIndexState({ ...base, error: { ...err, isOffline: true } })).toBe('offline');
    expect(approvalsIndexState({ ...base, error: { ...err, isAuthorization: true } })).toBe(
      'permission-denied',
    );
    expect(approvalsIndexState({ ...base, error: { ...err, isRateLimited: true } })).toBe(
      'rate-limited',
    );
    expect(approvalsIndexState({ ...base, error: err })).toBe('error');
    expect(approvalsIndexState({ ...base, count: 0 })).toBe('empty');
    expect(approvalsIndexState({ ...base, hasMore: true })).toBe('partial');
    expect(approvalsIndexState({ ...base, membersFailed: true })).toBe('partial');
    expect(approvalsIndexState(base)).toBe('ready');
  });

  it('prefers an error over an empty list', () => {
    expect(approvalsIndexState({ ...base, count: 0, error: err })).toBe('error');
  });
});
