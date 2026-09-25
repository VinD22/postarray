import { describe, expect, it } from 'vitest';

import { draftsListState, type DraftsListInput } from './drafts-list-state';

const base: DraftsListInput = {
  isPending: false,
  hasData: true,
  rowCount: 2,
  failed: false,
  apiError: null,
  online: true,
};
const err = { isOffline: false, isAuthorization: false, isRateLimited: false };

describe('draftsListState', () => {
  it('covers loading, empty and ready', () => {
    expect(draftsListState({ ...base, hasData: false, isPending: true })).toBe('loading');
    expect(draftsListState({ ...base, rowCount: 0 })).toBe('empty');
    expect(draftsListState(base)).toBe('ready');
  });

  it('keeps rows on screen when a refresh fails or the connection drops', () => {
    expect(draftsListState({ ...base, failed: true, apiError: err })).toBe('partial');
    expect(draftsListState({ ...base, online: false })).toBe('partial');
  });

  it('classifies a failed first read by its cause', () => {
    const first = { ...base, hasData: false, failed: true };
    expect(draftsListState({ ...first, online: false })).toBe('offline');
    expect(draftsListState({ ...first, apiError: { ...err, isOffline: true } })).toBe('offline');
    expect(draftsListState({ ...first, apiError: { ...err, isAuthorization: true } })).toBe(
      'denied',
    );
    expect(draftsListState({ ...first, apiError: { ...err, isRateLimited: true } })).toBe(
      'rateLimited',
    );
    expect(draftsListState({ ...first, apiError: err })).toBe('error');
    expect(draftsListState({ ...first, apiError: null })).toBe('error');
  });
});
