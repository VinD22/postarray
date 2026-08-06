import { describe, expect, it } from 'vitest';

import { mediaLifecycleIssues, type MediaLifecycleFacts } from './validation';

const NOW = new Date('2026-08-06T12:00:00.000Z');

function facts(overrides: Partial<MediaLifecycleFacts> = {}): MediaLifecycleFacts {
  return {
    scanState: 'clean',
    rights: 'owned_original',
    retentionExpiresAt: new Date('2026-09-05T12:00:00.000Z'),
    storageDeletedAt: null,
    ...overrides,
  };
}

describe('mediaLifecycleIssues', () => {
  it('blocks missing and retention-expired files without treating them as zero', () => {
    const media = new Map([['expired', facts({ retentionExpiresAt: NOW })]]);
    const issues = mediaLifecycleIssues(['missing', 'expired'], media, NOW, 'target_1');

    expect(issues.map((issue) => issue.code)).toEqual(['MEDIA_UNAVAILABLE', 'MEDIA_UNAVAILABLE']);
  });

  it.each(['pending', 'failed'])('blocks a %s processing state', (scanState) => {
    const issues = mediaLifecycleIssues(
      ['media_1'],
      new Map([['media_1', facts({ scanState })]]),
      NOW,
      'target_1',
    );

    expect(issues.map((issue) => issue.code)).toContain('MEDIA_NOT_READY');
  });

  it('distinguishes a rejected safety check from unfinished processing', () => {
    const issues = mediaLifecycleIssues(
      ['media_1'],
      new Map([['media_1', facts({ scanState: 'infected' })]]),
      NOW,
      'target_1',
    );

    expect(issues.map((issue) => issue.code)).toEqual(['MEDIA_SCAN_BLOCKED']);
  });

  it('blocks an undeclared file even after processing passes', () => {
    const issues = mediaLifecycleIssues(
      ['media_1'],
      new Map([['media_1', facts({ rights: 'unverified' })]]),
      NOW,
      'target_1',
    );

    expect(issues.map((issue) => issue.code)).toEqual(['MEDIA_RIGHTS_UNDECLARED']);
  });
});
