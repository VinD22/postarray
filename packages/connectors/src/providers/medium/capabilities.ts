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
 * Medium capability snapshot.
 *
 * Limits verified against the official Medium integration API documentation, 4 August
 * 2026. The API documents a 3,200 character body limit for Markdown posts.
 */

export const MEDIUM_CAPABILITY_REVISION = 1;
export const MEDIUM_MAX_CHARACTERS = 3200;
export const MEDIUM_MAX_TAGS = 5;

export interface MediumCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildMediumCapabilities(input: MediumCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('medium', MEDIUM_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'medium',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: MEDIUM_MAX_CHARACTERS,
      minLength: 1,
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
      image: 'unsupported',
      video: 'unsupported',
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
    deletion: { support: 'unsupported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 3600, maxRequests: 60 },
    cost: null,
  });
}
