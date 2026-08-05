import {
  capabilitySnapshotSchema,
  estimateCreateCostMinor,
  type CapabilitySnapshot,
} from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { containsUrl, countCharacters, linkHosts } from './capabilities.js';

/**
 * Cost estimation and character counting are the two numbers the composer shows
 * before anything is sent, so they are tested against a snapshot shaped like the
 * metered network: a plain create is cheap, a create containing a URL is not.
 */
function snapshot(overrides: Partial<CapabilitySnapshot> = {}): CapabilitySnapshot {
  return capabilitySnapshotSchema.parse({
    capabilityVersion: '2026-08-04',
    observedAt: '2026-08-04T09:00:00.000Z',
    provider: 'x',
    accountType: 'personal_profile',
    connectionId: 'conn-1',
    text: {
      maxLength: 280,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'fixed', charactersPerLink: 23 },
    },
    media: {
      maxImages: 4,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4'],
      // The record is exhaustive on purpose: a connector must state a limit or an
      // explicit null for every media kind, so "not accepted" is never implied.
      maxBytesByKind: {
        image: 5_242_880,
        video: 536_870_912,
        gif: 15_728_640,
        document: null,
        audio: null,
      },
      aspectRatios: { min: 0.5, max: 2, recommended: [1] },
      maxDurationSeconds: 140,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: 1000,
    },
    contentKinds: {
      text: 'supported',
      image: 'supported',
      carousel: 'supported',
      video: 'supported',
      short_video: 'unsupported',
      long_video: 'unsupported',
      document: 'unsupported',
      thread: 'supported',
    },
    destinations: [{ kind: 'none', support: 'supported', searchable: false }],
    mentions: { support: 'supported', resolvesToExternalId: true, maxMentions: 10 },
    firstComment: { support: 'supported', maxItems: 1, minDelaySeconds: 0 },
    threads: { support: 'supported', maxItems: 25, minDelaySeconds: 0 },
    scheduling: { providerNative: 'unsupported', maxLookAheadDays: 365, minLeadSeconds: 0 },
    privacy: { support: 'unsupported', mustBeExplicit: false, options: [] },
    disclosure: {
      aiLabel: 'not_implemented',
      commercialContent: 'not_implemented',
      brandedContent: 'not_implemented',
    },
    analytics: {
      support: 'supported',
      postMetrics: ['impressions', 'likes'],
      accountMetrics: ['follower_delta'],
      historyWindowDays: 90,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 900, maxRequests: 300 },
    cost: { currency: 'USD', perCreateMinor: 2, perUrlCreateMinor: 20 },
    ...overrides,
  });
}

describe('provider cost estimation', () => {
  it('charges the plain rate for a post with no link', () => {
    expect(estimateCreateCostMinor(snapshot(), false)).toBe(2);
  });

  it('charges materially more for a post containing a URL', () => {
    expect(estimateCreateCostMinor(snapshot(), true)).toBe(20);
  });

  it('reports no estimate at all when the provider is not metered', () => {
    expect(estimateCreateCostMinor(snapshot({ cost: null }), true)).toBeNull();
  });

  it('detects the URL that changes the price', () => {
    expect(containsUrl('Read the notes at https://acme.com/notes')).toBe(true);
    expect(containsUrl('Read the notes on our blog')).toBe(false);
  });
});

describe('character counting', () => {
  it('charges a fixed cost per link when the provider does', () => {
    const body = 'See https://acme.com/a-very-long-path-that-would-otherwise-count';
    // "See " is 4 characters, and the URL counts as 23 whatever its length.
    expect(countCharacters(body, snapshot())).toBe(4 + 23);
  });

  it('counts the actual characters when the provider does', () => {
    const actual = snapshot({
      text: {
        maxLength: 3000,
        minLength: 0,
        supportsMarkdown: true,
        linkCounting: { mode: 'actual', charactersPerLink: null },
      },
    });
    const body = 'See https://acme.com/a';
    expect(countCharacters(body, actual)).toBe(body.length);
  });

  it('excludes links entirely when the provider does not count them', () => {
    const free = snapshot({
      text: {
        maxLength: 3000,
        minLength: 0,
        supportsMarkdown: false,
        linkCounting: { mode: 'none', charactersPerLink: null },
      },
    });
    expect(countCharacters('See https://acme.com/a', free)).toBe('See '.length);
  });

  it('counts astral characters as one, not two', () => {
    expect(countCharacters('👋', snapshot())).toBe(1);
  });
});

describe('linkHosts', () => {
  it('extracts every distinct host in publication order', () => {
    expect(
      linkHosts('First https://Acme.com/a then https://docs.acme.com/b then https://acme.com/c'),
    ).toEqual(['acme.com', 'docs.acme.com']);
  });

  it('returns nothing for a body with no links', () => {
    expect(linkHosts('No links here at all')).toEqual([]);
  });
});
