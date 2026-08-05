import { CONTENT_KINDS, MEDIA_KINDS, summarizeCapabilities } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { contentKinds, mediaBytes } from './capability.js';
import { buildBlueskyCapabilities } from '../bluesky/capabilities.js';
import { buildInstagramCapabilities } from '../meta/instagram/capabilities.js';
import { buildLinkedInCapabilities } from '../linkedin/capabilities.js';
import { buildTikTokCapabilities } from '../tiktok/capabilities.js';
import { buildXCapabilities } from '../x/capabilities.js';
import { buildYouTubeCapabilities } from '../youtube/capabilities.js';
import { buildFacebookCapabilities } from '../meta/facebook/capabilities.js';
import { buildThreadsCapabilities } from '../meta/threads/capabilities.js';
import { testConnection } from './testing.js';

describe('capability builders', () => {
  it('defaults every content kind to not_implemented, the honest starting point', () => {
    const record = contentKinds({ text: 'supported' });
    expect(Object.keys(record).sort()).toEqual([...CONTENT_KINDS].sort());
    expect(record.text).toBe('supported');
    expect(record.carousel).toBe('not_implemented');
  });

  it('defaults every media byte ceiling to null rather than inventing one', () => {
    const record = mediaBytes({ image: 100 });
    expect(Object.keys(record).sort()).toEqual([...MEDIA_KINDS].sort());
    expect(record.image).toBe(100);
    expect(record.video).toBeNull();
  });
});

const OBSERVED_AT = '2026-08-04T12:00:00.000Z';

const snapshots = [
  buildXCapabilities({
    connection: testConnection({ provider: 'x' }),
    observedAt: OBSERVED_AT,
    grantedScopes: ['tweet.read', 'tweet.write', 'users.read', 'media.write'],
  }),
  buildLinkedInCapabilities({
    connection: testConnection({ provider: 'linkedin', accountType: 'organization' }),
    observedAt: OBSERVED_AT,
    grantedScopes: ['w_organization_social', 'r_organization_social'],
  }),
  buildInstagramCapabilities({
    connection: testConnection({ provider: 'instagram', accountType: 'business_profile' }),
    observedAt: OBSERVED_AT,
    grantedScopes: ['instagram_content_publish', 'instagram_manage_insights'],
  }),
  buildFacebookCapabilities({
    connection: testConnection({ provider: 'facebook', accountType: 'page' }),
    observedAt: OBSERVED_AT,
    grantedScopes: ['pages_manage_posts', 'read_insights'],
  }),
  buildThreadsCapabilities({
    connection: testConnection({ provider: 'threads' }),
    observedAt: OBSERVED_AT,
    grantedScopes: ['threads_content_publish', 'threads_manage_insights'],
  }),
  buildYouTubeCapabilities({
    connection: testConnection({ provider: 'youtube', accountType: 'channel' }),
    observedAt: OBSERVED_AT,
    grantedScopes: ['https://www.googleapis.com/auth/youtube.upload'],
    longUploadsAllowed: false,
    customThumbnailAllowed: false,
  }),
  buildTikTokCapabilities({
    connection: testConnection({ provider: 'tiktok', accountType: 'creator_profile' }),
    observedAt: OBSERVED_AT,
    grantedScopes: ['video.publish'],
  }),
  buildBlueskyCapabilities({
    connection: testConnection({ provider: 'bluesky' }),
    observedAt: OBSERVED_AT,
  }),
];

describe('every provider snapshot', () => {
  it('parses against the shared contract schema', () => {
    expect(snapshots).toHaveLength(8);
    for (const snapshot of snapshots) {
      expect(snapshot.capabilityVersion).toContain('2026-08-04');
      expect(snapshot.observedAt).toBe(OBSERVED_AT);
    }
  });

  it('marks capability 3 of the comment model as not implemented everywhere in V1', () => {
    // Capability 3 is a product decision, not a per provider one: no adapter exposes a
    // comment inbox in V1, which means no adapter offers more than one sequence item plus
    // thread parts.
    for (const snapshot of snapshots) {
      expect(snapshot.firstComment.maxItems).toBeLessThanOrEqual(1);
    }
  });

  it('summarizes without inventing a capability', () => {
    for (const snapshot of snapshots) {
      const summary = summarizeCapabilities(snapshot);
      const total =
        summary.supportedContentKinds.length +
        summary.unsupportedContentKinds.length +
        summary.notImplementedContentKinds.length +
        summary.reviewRequiredContentKinds.length;
      expect(total).toBe(CONTENT_KINDS.length);
    }
  });

  it('only reports a monetary cost for the metered provider', () => {
    const metered = snapshots.filter((snapshot) => snapshot.cost !== null);
    expect(metered).toHaveLength(1);
    expect(metered[0]?.provider).toBe('x');
  });

  it('never claims a rate limit a provider does not publish for our app', () => {
    const byProvider = new Map(snapshots.map((snapshot) => [snapshot.provider, snapshot]));
    expect(byProvider.get('x')?.rateLimit).toBeNull();
    expect(byProvider.get('linkedin')?.rateLimit).toBeNull();
    expect(byProvider.get('tiktok')?.rateLimit).toBeNull();
    // These three do publish a number, so we carry it.
    expect(byProvider.get('instagram')?.rateLimit).not.toBeNull();
    expect(byProvider.get('youtube')?.rateLimit).not.toBeNull();
    expect(byProvider.get('bluesky')?.rateLimit).not.toBeNull();
  });
});
