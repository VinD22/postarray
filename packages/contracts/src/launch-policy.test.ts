import { describe, expect, it } from 'vitest';

import { CORE_PROVIDER_IDS, isCoreProvider } from './launch-policy';

describe('launch provider policy', () => {
  it('offers the eight intentional V1 providers in product order', () => {
    expect(CORE_PROVIDER_IDS).toEqual([
      'x',
      'instagram',
      'linkedin',
      'facebook',
      'youtube',
      'tiktok',
      'reddit',
      'medium',
    ]);
  });

  it('keeps later adapters, including Bluesky, outside the launch cohort', () => {
    expect(isCoreProvider('reddit')).toBe(true);
    expect(isCoreProvider('bluesky')).toBe(false);
    expect(isCoreProvider('threads')).toBe(false);
  });
});
