import { describe, expect, it } from 'vitest';

import {
  NOT_IMPLEMENTED_CONTENT_KINDS,
  capabilitySnapshotSchema,
  estimateCreateCostMinor,
  summarizeCapabilities,
  supportsContentKind,
} from './capabilities';
import type { CapabilitySnapshot } from './capabilities';

function snapshot(overrides: Partial<CapabilitySnapshot> = {}): CapabilitySnapshot {
  return {
    capabilityVersion: 'x-2026-08-04.1',
    observedAt: '2026-08-04T10:00:00.000Z',
    provider: 'x',
    accountType: 'personal_profile',
    connectionId: 'conn_00000000000000000000000000',
    text: {
      maxLength: 280,
      minLength: 1,
      supportsMarkdown: false,
      linkCounting: { mode: 'fixed', charactersPerLink: 23 },
    },
    media: {
      maxImages: 4,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
      maxBytesByKind: {
        image: 5_242_880,
        video: 536_870_912,
        gif: 15_728_640,
        document: null,
        audio: null,
      },
      aspectRatios: { min: 0.5, max: 2, recommended: [1, 1.7778] },
      maxDurationSeconds: 140,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: 1000,
    },
    contentKinds: {
      ...NOT_IMPLEMENTED_CONTENT_KINDS,
      text: 'supported',
      image: 'supported',
      video: 'supported',
      thread: 'supported',
      carousel: 'unsupported',
      document: 'unsupported',
      long_video: 'requires_review',
    },
    destinations: [
      { kind: 'community', support: 'supported', searchable: true },
      { kind: 'board', support: 'unsupported', searchable: false },
    ],
    mentions: { support: 'supported', resolvesToExternalId: true, maxMentions: 10 },
    firstComment: { support: 'supported', maxItems: 1, minDelaySeconds: 60 },
    threads: { support: 'supported', maxItems: 25, minDelaySeconds: 30 },
    scheduling: { providerNative: 'not_implemented', maxLookAheadDays: 365, minLeadSeconds: 60 },
    privacy: { support: 'unsupported', mustBeExplicit: false, options: [] },
    disclosure: {
      aiLabel: 'not_implemented',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      support: 'supported',
      postMetrics: ['impressions', 'likes', 'comments', 'shares'],
      accountMetrics: ['follower_delta', 'profile_views'],
      historyWindowDays: 90,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 900, maxRequests: 300 },
    cost: { currency: 'USD', perCreateMinor: 2, perUrlCreateMinor: 20 },
    ...overrides,
  };
}

describe('capabilitySnapshotSchema', () => {
  it('accepts a complete snapshot and rejects unknown fields', () => {
    const value = snapshot();
    expect(capabilitySnapshotSchema.parse(value)).toEqual(value);
    expect(capabilitySnapshotSchema.safeParse({ ...value, extra: 1 }).success).toBe(false);
  });

  it('requires a support value for every content kind', () => {
    const value = snapshot();
    const partial = { ...value, contentKinds: { text: 'supported' } };
    expect(capabilitySnapshotSchema.safeParse(partial).success).toBe(false);
  });
});

describe('summarizeCapabilities', () => {
  it('separates unsupported from not implemented', () => {
    const summary = summarizeCapabilities(snapshot());
    expect(summary.supportedContentKinds).toEqual(['text', 'image', 'video', 'thread']);
    expect(summary.unsupportedContentKinds).toEqual(['carousel', 'document']);
    expect(summary.notImplementedContentKinds).toEqual(['short_video']);
    expect(summary.reviewRequiredContentKinds).toEqual(['long_video']);
  });

  it('projects the numbers the composer needs', () => {
    const summary = summarizeCapabilities(snapshot());
    expect(summary.maxTextLength).toBe(280);
    expect(summary.maxImages).toBe(4);
    expect(summary.maxSequenceItems).toBe(25);
    expect(summary.minSequenceDelaySeconds).toBe(30);
    expect(summary.destinationKinds).toEqual(['community']);
    expect(summary.providerNativeScheduling).toBe('not_implemented');
    expect(summary.analyticsHistoryWindowDays).toBe(90);
  });

  it('flags a metered connection and reports both prices', () => {
    const summary = summarizeCapabilities(snapshot());
    expect(summary.isMetered).toBe(true);
    expect(summary.currency).toBe('USD');
    expect(summary.perUrlCreateMinor).toBe(20);
  });

  it('reports no cost when the provider does not charge per operation', () => {
    const summary = summarizeCapabilities(snapshot({ cost: null }));
    expect(summary.isMetered).toBe(false);
    expect(summary.currency).toBeNull();
    expect(summary.perCreateMinor).toBeNull();
  });
});

describe('cost and support helpers', () => {
  it('charges the URL price only when the post contains a link', () => {
    expect(estimateCreateCostMinor(snapshot(), false)).toBe(2);
    expect(estimateCreateCostMinor(snapshot(), true)).toBe(20);
    expect(estimateCreateCostMinor(snapshot({ cost: null }), true)).toBeNull();
  });

  it('treats requires_review and not_implemented as not supported', () => {
    const value = snapshot();
    expect(supportsContentKind(value, 'text')).toBe(true);
    expect(supportsContentKind(value, 'long_video')).toBe(false);
    expect(supportsContentKind(value, 'short_video')).toBe(false);
  });
});
