import type { CapabilitySnapshot } from '@relay/contracts';

import {
  MEGABYTE,
  NO_PRIVACY_CHOICE,
  RELAY_SIDE_SCHEDULING,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability';
import type { ProviderConnection } from '../shared/contract-shape';
import { capabilityVersion } from '../shared/verification';

/**
 * Pinterest capability snapshot.
 *
 * Limits verified against the official Pinterest v5 API documentation, 4 August 2026. A
 * pin requires an image; the v5 API accepts up to 20 MB for a standard image pin.
 */

export const PINTEREST_CAPABILITY_REVISION = 1;
export const PINTEREST_MAX_TITLE_CHARACTERS = 100;
export const PINTEREST_MAX_DESCRIPTION_CHARACTERS = 500;
export const PINTEREST_MAX_IMAGES = 1;

export interface PinterestCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildPinterestCapabilities(input: PinterestCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('pinterest', PINTEREST_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'pinterest',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: PINTEREST_MAX_DESCRIPTION_CHARACTERS,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: PINTEREST_MAX_IMAGES,
      maxVideos: 0,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      maxBytesByKind: mediaBytes({
        image: 20 * MEGABYTE,
        gif: 20 * MEGABYTE,
      }),
      aspectRatios: { min: 0.5, max: 2, recommended: [1.91, 1, 0.75] },
      maxDurationSeconds: null,
      minDurationSeconds: null,
      requiresThumbnail: false,
      altText: 'unsupported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      text: 'unsupported',
      image: 'supported',
      video: 'not_implemented',
      carousel: 'unsupported',
      thread: 'unsupported',
      short_video: 'not_implemented',
      long_video: 'unsupported',
      document: 'unsupported',
    }),
    destinations: [
      { kind: 'board', support: 'supported', searchable: true },
      { kind: 'none', support: 'unsupported', searchable: false },
    ],
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
    rateLimit: { windowSeconds: 3600, maxRequests: 90 },
    cost: null,
  });
}
