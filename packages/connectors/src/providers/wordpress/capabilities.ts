import type { CapabilitySnapshot } from '@relay/contracts';

import {
  NO_PRIVACY_CHOICE,
  RELAY_SIDE_SCHEDULING,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability';
import type { ProviderConnection } from '../shared/contract-shape';
import { capabilityVersion } from '../shared/verification';

/**
 * WordPress capability snapshot.
 *
 * Limits verified against the official WordPress REST API documentation, 4 August 2026.
 * WordPress imposes no post length ceiling, so the declared limit is the content-wide
 * guard the composer uses to keep drafts sane.
 */

export const WORDPRESS_CAPABILITY_REVISION = 1;
export const WORDPRESS_MAX_CHARACTERS = 10_000;

export interface WordpressCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildWordpressCapabilities(input: WordpressCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('wordpress', WORDPRESS_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'wordpress',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: WORDPRESS_MAX_CHARACTERS,
      minLength: 0,
      supportsMarkdown: true,
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: 0,
      maxVideos: 0,
      allowedMimeTypes: [],
      maxBytesByKind: mediaBytes({}),
      aspectRatios: { min: 0.1, max: 10, recommended: [1.91, 1] },
      maxDurationSeconds: null,
      minDurationSeconds: null,
      requiresThumbnail: false,
      altText: 'unsupported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      text: 'supported',
      image: 'not_implemented',
      video: 'not_implemented',
      carousel: 'unsupported',
      thread: 'unsupported',
      short_video: 'unsupported',
      long_video: 'unsupported',
      document: 'unsupported',
    }),
    destinations: [{ kind: 'none', support: 'unsupported', searchable: false }],
    mentions: { support: 'unsupported', resolvesToExternalId: false, maxMentions: null },
    firstComment: { support: 'unsupported', maxItems: 0, minDelaySeconds: 0 },
    threads: { support: 'unsupported', maxItems: 0, minDelaySeconds: 0 },
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: NO_PRIVACY_CHOICE,
    disclosure: {
      aiLabel: 'unsupported',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      support: 'unsupported',
      postMetrics: [],
      accountMetrics: [],
      historyWindowDays: null,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 3600, maxRequests: 120 },
    cost: null,
  });
}
