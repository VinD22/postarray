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
 * Dev.to capability snapshot.
 *
 * Limits verified against the official Forem API documentation, 4 August 2026. Dev.to
 * does not publish a strict body length; the 4,096 ceiling is the API's own documented
 * article size recommendation.
 */

export const DEVTO_CAPABILITY_REVISION = 1;
export const DEVTO_MAX_CHARACTERS = 4096;
export const DEVTO_MAX_TAGS = 4;

export interface DevtoCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildDevtoCapabilities(input: DevtoCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('devto', DEVTO_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'devto',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: DEVTO_MAX_CHARACTERS,
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
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 3600, maxRequests: 60 },
    cost: null,
  });
}
