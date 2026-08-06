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
 * Telegram capability snapshot.
 *
 * Limits verified against the official Bot API documentation, 4 August 2026. A message
 * carries 4096 UTF-8 characters; a photo sent by URL may be up to 10 MB.
 */

export const TELEGRAM_CAPABILITY_REVISION = 1;
export const TELEGRAM_MAX_CHARACTERS = 4096;
export const TELEGRAM_MAX_IMAGES = 1;
export const TELEGRAM_MAX_ALT_TEXT = 1024;

export interface TelegramCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildTelegramCapabilities(input: TelegramCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('telegram', TELEGRAM_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'telegram',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: TELEGRAM_MAX_CHARACTERS,
      minLength: 0,
      supportsMarkdown: true,
      // Telegram counts links as characters.
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: TELEGRAM_MAX_IMAGES,
      maxVideos: 0,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      maxBytesByKind: mediaBytes({
        image: 10 * MEGABYTE,
        gif: 10 * MEGABYTE,
      }),
      aspectRatios: { min: 0.1, max: 10, recommended: [1.91, 1, 4 / 5] },
      maxDurationSeconds: null,
      minDurationSeconds: null,
      requiresThumbnail: false,
      altText: 'unsupported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      text: 'supported',
      image: 'supported',
      thread: 'supported',
      carousel: 'unsupported',
      video: 'unsupported',
      short_video: 'unsupported',
      long_video: 'unsupported',
      document: 'unsupported',
    }),
    destinations: [{ kind: 'none', support: 'unsupported', searchable: false }],
    mentions: { support: 'unsupported', resolvesToExternalId: false, maxMentions: null },
    firstComment: { support: 'unsupported', maxItems: 0, minDelaySeconds: 0 },
    threads: {
      support: 'supported',
      maxItems: 25,
      minDelaySeconds: 0,
    },
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
    rateLimit: { windowSeconds: 3600, maxRequests: 30 },
    cost: null,
  });
}
