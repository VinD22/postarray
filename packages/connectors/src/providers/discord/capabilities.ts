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
 * Discord capability snapshot.
 *
 * Limits verified against the official Discord developer documentation, 4 August 2026. A
 * message may carry 2,000 characters, and a bot may send 5 messages per 5 seconds per
 * channel.
 */

export const DISCORD_CAPABILITY_REVISION = 1;
export const DISCORD_MAX_CHARACTERS = 2000;

export interface DiscordCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildDiscordCapabilities(input: DiscordCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('discord', DISCORD_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'discord',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: DISCORD_MAX_CHARACTERS,
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
      thread: 'not_implemented',
      short_video: 'unsupported',
      long_video: 'unsupported',
      document: 'unsupported',
    }),
    destinations: [
      { kind: 'channel', support: 'supported', searchable: true },
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
    deletion: { support: 'supported', windowSeconds: 24 * 60 * 60 },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 5, maxRequests: 5 },
    cost: null,
  });
}
