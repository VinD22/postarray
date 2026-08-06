import type { CapabilitySnapshot } from '@relay/contracts';

import {
  MEGABYTE,
  RELAY_SIDE_SCHEDULING,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../shared/capability';
import type { ProviderConnection } from '../shared/contract-shape';
import { normalizedNames } from '../shared/metrics';
import { capabilityVersion } from '../shared/verification';
import { MASTODON_ACCOUNT_METRICS, MASTODON_POST_METRICS } from './metrics';

/**
 * Mastodon capability snapshot.
 *
 * Limits verified against the Mastodon API documentation, 4 August 2026. Character limits
 * are set by the instance admin, so the snapshot uses the Mastodon.social default of 500.
 */

export const MASTODON_CAPABILITY_REVISION = 1;
export const MASTODON_MAX_CHARACTERS = 500;
export const MASTODON_MAX_IMAGES = 4;
export const MASTODON_MAX_THREAD_PARTS = 25;
export const MASTODON_MAX_ALT_TEXT = 1500;

export interface MastodonCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
}

export function buildMastodonCapabilities(input: MastodonCapabilityInput): CapabilitySnapshot {
  return buildSnapshot({
    capabilityVersion: capabilityVersion('mastodon', MASTODON_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'mastodon',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: MASTODON_MAX_CHARACTERS,
      minLength: 0,
      supportsMarkdown: true,
      // Mastodon renders links inline; they cost their own characters.
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: MASTODON_MAX_IMAGES,
      maxVideos: 1,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
      ],
      maxBytesByKind: mediaBytes({
        image: 8 * MEGABYTE,
        gif: 8 * MEGABYTE,
        video: 40 * MEGABYTE,
      }),
      aspectRatios: { min: 0.1, max: 10, recommended: [1.91, 1, 4 / 5] },
      maxDurationSeconds: 600,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: MASTODON_MAX_ALT_TEXT,
    },
    contentKinds: contentKinds({
      text: 'supported',
      image: 'supported',
      video: 'supported',
      // A thread is built by replying to your own status.
      thread: 'supported',
      carousel: 'unsupported',
      short_video: 'unsupported',
      long_video: 'unsupported',
      document: 'unsupported',
    }),
    destinations: [{ kind: 'none', support: 'unsupported', searchable: false }],
    mentions: {
      // The server resolves @handle at render time; no entity id is stored.
      support: 'supported',
      resolvesToExternalId: false,
      maxMentions: null,
    },
    firstComment: { support: 'supported', maxItems: 1, minDelaySeconds: 0 },
    threads: {
      support: 'supported',
      maxItems: MASTODON_MAX_THREAD_PARTS,
      minDelaySeconds: 0,
    },
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: {
      support: 'supported',
      mustBeExplicit: false,
      options: [
        { value: 'public', labelKey: 'privacy.mastodon.public.label', isDefault: true },
        { value: 'unlisted', labelKey: 'privacy.mastodon.unlisted.label', isDefault: false },
        { value: 'private', labelKey: 'privacy.mastodon.private.label', isDefault: false },
      ],
    },
    disclosure: {
      aiLabel: 'unsupported',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      // Public engagement counts read from the status object, not a private insights API.
      support: 'supported',
      postMetrics: normalizedNames(MASTODON_POST_METRICS),
      accountMetrics: normalizedNames(MASTODON_ACCOUNT_METRICS),
      historyWindowDays: null,
    },
    deletion: { support: 'supported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: { windowSeconds: 3600, maxRequests: 300 },
    cost: null,
  });
}
