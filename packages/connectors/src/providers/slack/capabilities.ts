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
 * Slack capability snapshot.
 *
 * Limits verified against the official Slack Web API documentation, 4 August 2026. A
 * `chat.postMessage` payload may carry 40,000 characters.
 */

export const SLACK_CAPABILITY_REVISION = 1;
export const SLACK_MAX_CHARACTERS = 40_000;

export interface SlackCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildSlackCapabilities(input: SlackCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('slack', SLACK_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'slack',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: SLACK_MAX_CHARACTERS,
      minLength: 0,
      supportsMarkdown: false,
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
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 60, maxRequests: 100 },
    cost: null,
  });
}
