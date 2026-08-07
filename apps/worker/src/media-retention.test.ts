import { describe, expect, it } from 'vitest';

import { drainMediaRetention, MEDIA_RETENTION_ASSET_BATCH } from './media-retention';

describe('media retention coordinator', () => {
  it('drains large workspaces in batches and continues past a failed tenant', async () => {
    const calls = new Map<string, number>();

    const result = await drainMediaRetention({
      listWorkspaceIds: async (excluded) =>
        excluded.includes('ws_failed') ? [] : ['ws_large', 'ws_failed'],
      purgeWorkspace: async (workspaceId) => {
        const call = (calls.get(workspaceId) ?? 0) + 1;
        calls.set(workspaceId, call);
        if (workspaceId === 'ws_failed') {
          throw new Error('storage unavailable');
        }
        return call === 1 ? MEDIA_RETENTION_ASSET_BATCH : 3;
      },
    });

    expect(calls.get('ws_large')).toBe(2);
    expect(calls.get('ws_failed')).toBe(1);
    expect(result).toEqual({ workspaces: 2, purged: 103, failures: 1 });
  });
});
