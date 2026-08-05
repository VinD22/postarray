import type { CapabilitySnapshot, CapabilitySupport } from '@relay/contracts';

import {
  MEGABYTE,
  RELAY_SIDE_SCHEDULING,
  buildSnapshot,
  contentKinds,
  mediaBytes,
} from '../../shared/capability.js';
import type { ProviderConnection } from '../../shared/contract-shape.js';
import { normalizedNames } from '../../shared/metrics.js';
import { capabilityVersion } from '../../shared/verification.js';
import { THREADS_ACCOUNT_METRICS, THREADS_POST_METRICS } from './metrics.js';

/**
 * Threads capability snapshot.
 *
 * Launch fallback connector. Container lifecycle, the same shape as Instagram.
 * Planning baseline captured 4 August 2026; re-verify before implementation.
 */

export const THREADS_CAPABILITY_REVISION = 1;
export const THREADS_MAX_TEXT_LENGTH = 500;
export const THREADS_CAROUSEL_MIN = 2;
export const THREADS_CAROUSEL_MAX = 20;
export const THREADS_MAX_THREAD_PARTS = 25;

export interface ThreadsCapabilityInput {
  readonly connection: ProviderConnection;
  readonly observedAt: string;
  readonly grantedScopes: readonly string[];
}

export function buildThreadsCapabilities(input: ThreadsCapabilityInput): CapabilitySnapshot {
  const granted = input.grantedScopes;
  const canPublish = granted.includes('threads_content_publish');
  const canReadInsights = granted.includes('threads_manage_insights');
  const publishState: CapabilitySupport = canPublish ? 'supported' : 'requires_review';

  return buildSnapshot({
    capabilityVersion: capabilityVersion('threads', THREADS_CAPABILITY_REVISION),
    observedAt: input.observedAt,
    provider: 'threads',
    accountType: input.connection.accountType,
    connectionId: input.connection.connectionId,
    text: {
      maxLength: THREADS_MAX_TEXT_LENGTH,
      minLength: 0,
      supportsMarkdown: false,
      linkCounting: { mode: 'actual', charactersPerLink: null },
    },
    media: {
      maxImages: THREADS_CAROUSEL_MAX,
      maxVideos: 1,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'],
      maxBytesByKind: mediaBytes({ image: 8 * MEGABYTE, video: 1024 * MEGABYTE }),
      aspectRatios: { min: 0.01, max: 10, recommended: [1, 4 / 5, 1.91] },
      maxDurationSeconds: 300,
      minDurationSeconds: 1,
      requiresThumbnail: false,
      altText: 'supported',
      maxAltTextLength: null,
    },
    contentKinds: contentKinds({
      text: publishState,
      image: publishState,
      carousel: publishState,
      video: publishState,
      // Threads has one video product, not a separate short form surface.
      short_video: 'unsupported',
      long_video: 'unsupported',
      document: 'unsupported',
      // A reply container pointing at our own root post is the natural way to build a
      // thread on Threads.
      thread: publishState,
    }),
    destinations: [{ kind: 'none', support: 'unsupported', searchable: false }],
    mentions: {
      support: 'supported',
      resolvesToExternalId: false,
      maxMentions: null,
    },
    firstComment: { support: publishState, maxItems: 1, minDelaySeconds: 0 },
    threads: {
      support: publishState,
      maxItems: THREADS_MAX_THREAD_PARTS,
      minDelaySeconds: 0,
    },
    scheduling: RELAY_SIDE_SCHEDULING,
    privacy: {
      // Threads controls who may reply rather than who may see the post, so there is a
      // safe default and the user is not forced to choose.
      support: 'supported',
      mustBeExplicit: false,
      options: [
        { value: 'everyone', labelKey: 'connectors.threads.reply_control.everyone', isDefault: true },
        {
          value: 'accounts_you_follow',
          labelKey: 'connectors.threads.reply_control.accounts_you_follow',
          isDefault: false,
        },
        {
          value: 'mentioned_only',
          labelKey: 'connectors.threads.reply_control.mentioned_only',
          isDefault: false,
        },
      ],
    },
    disclosure: {
      aiLabel: 'unsupported',
      commercialContent: 'unsupported',
      brandedContent: 'unsupported',
    },
    analytics: {
      support: canReadInsights ? 'supported' : 'requires_review',
      postMetrics: normalizedNames(THREADS_POST_METRICS),
      accountMetrics: normalizedNames(THREADS_ACCOUNT_METRICS),
      historyWindowDays: null,
    },
    deletion: { support: 'unsupported', windowSeconds: null },
    drafts: { support: 'unsupported' },
    rateLimit: null,
    cost: null,
  });
}
