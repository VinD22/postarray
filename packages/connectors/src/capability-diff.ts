import {
  type CapabilitySnapshot,
  type CapabilitySupport,
  type ContentKind,
  type MediaKind,
  RelayError,
} from '@relay/contracts';

import type { ProviderDraft } from './contract.js';
import { type RemediationCode } from './errors.js';
import { type Clock, epochMillisecondsOf, systemClock } from './ports.js';

/**
 * Approval drift.
 *
 * The capability snapshot version used at approval is stored on the approved
 * content version. At dispatch the worker fetches a fresh snapshot and compares
 * the two here. If a capability the content actually relies on regressed, the
 * publish stops and the Action Center names the exact capability. We never
 * silently adapt approved content, and we never publish against a stale
 * snapshot.
 */

export const CAPABILITY_DIFF_DECISIONS = ['proceed', 'warn', 'require_reapproval', 'block'] as const;
export type CapabilityDiffDecision = (typeof CAPABILITY_DIFF_DECISIONS)[number];

export const CHANGE_SEVERITIES = ['info', 'warning', 'blocking'] as const;
export type ChangeSeverity = (typeof CHANGE_SEVERITIES)[number];

/** Default life of a snapshot before it must be refetched. */
export const DEFAULT_MAX_SNAPSHOT_AGE_SECONDS = 15 * 60;

export interface CapabilityUsage {
  readonly contentKind: ContentKind;
  readonly textLength: number;
  readonly containsUrl: boolean;
  readonly imageCount: number;
  readonly videoCount: number;
  readonly documentCount: number;
  readonly largestBytesByKind: Readonly<Partial<Record<MediaKind, number>>>;
  readonly longestVideoSeconds: number | null;
  readonly usesAltText: boolean;
  readonly usesFirstComment: boolean;
  readonly usesThreadParts: boolean;
  readonly sequenceItemCount: number;
  readonly minSequenceDelaySeconds: number | null;
  readonly nativeMentionCount: number;
  readonly usesDestination: boolean;
  readonly destinationKind: string | null;
  readonly privacyValue: string | null;
  readonly usesAiDisclosure: boolean;
  readonly usesCommercialDisclosure: boolean;
  readonly usesBrandedContentDisclosure: boolean;
}

/** Derive exactly what the approved content depends on. */
export function usageFromDraft(draft: ProviderDraft): CapabilityUsage {
  const largest: Partial<Record<MediaKind, number>> = {};
  let longestVideo: number | null = null;
  let images = 0;
  let videos = 0;
  let documents = 0;
  let hasAltText = false;

  const allMedia = [...draft.media, ...draft.threadItems.flatMap((item) => item.media)];
  for (const asset of allMedia) {
    const previous = largest[asset.kind] ?? 0;
    largest[asset.kind] = Math.max(previous, asset.byteSize);
    if (asset.kind === 'image' || asset.kind === 'gif') images += 1;
    if (asset.kind === 'video') {
      videos += 1;
      if (asset.durationSeconds !== null) {
        longestVideo = Math.max(longestVideo ?? 0, asset.durationSeconds);
      }
    }
    if (asset.kind === 'document') documents += 1;
    if (asset.altText !== null && asset.altText !== '') hasAltText = true;
  }

  const comments = draft.threadItems.filter((item) => item.kind === 'comment');
  const threads = draft.threadItems.filter((item) => item.kind === 'thread');
  const delays = draft.threadItems.map((item) => item.delaySeconds);

  return {
    contentKind: draft.contentKind,
    textLength: draft.body.length,
    containsUrl: draft.links.length > 0 || /https?:\/\//i.test(draft.body),
    imageCount: images,
    videoCount: videos,
    documentCount: documents,
    largestBytesByKind: largest,
    longestVideoSeconds: longestVideo,
    usesAltText: hasAltText,
    usesFirstComment: comments.length > 0,
    usesThreadParts: threads.length > 0,
    sequenceItemCount: draft.threadItems.length,
    minSequenceDelaySeconds: delays.length === 0 ? null : Math.min(...delays),
    nativeMentionCount: draft.mentions.filter((mention) => mention.resolvedToExternalId).length,
    usesDestination: draft.destination !== null,
    destinationKind: draft.destination?.kind ?? null,
    privacyValue: draft.privacyValue,
    usesAiDisclosure: draft.disclosure.aiAssisted,
    usesCommercialDisclosure: draft.disclosure.commercialContent,
    usesBrandedContentDisclosure: draft.disclosure.brandedContent,
  };
}

export interface CapabilityChange {
  /** Dotted path into the snapshot, for example `media.maxImages`. */
  readonly path: string;
  readonly before: string | number | boolean | null;
  readonly after: string | number | boolean | null;
  readonly severity: ChangeSeverity;
  /** True when the approved content actually depends on this capability. */
  readonly usedByContent: boolean;
  readonly messageKey: string;
  readonly remediationCode: RemediationCode;
}

export interface CapabilityDiffResult {
  readonly decision: CapabilityDiffDecision;
  readonly changes: readonly CapabilityChange[];
  readonly blockingChanges: readonly CapabilityChange[];
  readonly capabilityVersionChanged: boolean;
  readonly snapshotStale: boolean;
  readonly snapshotAgeSeconds: number;
  readonly costIncreased: boolean;
}

function change(input: CapabilityChange): CapabilityChange {
  return input;
}

function supportRegressed(before: CapabilitySupport, after: CapabilitySupport): boolean {
  return before === 'supported' && after !== 'supported';
}

interface SupportRule {
  readonly path: string;
  readonly before: CapabilitySupport;
  readonly after: CapabilitySupport;
  readonly used: boolean;
  readonly messageKey: string;
  readonly remediationCode: RemediationCode;
}

function diffSupport(rules: readonly SupportRule[]): CapabilityChange[] {
  const changes: CapabilityChange[] = [];
  for (const rule of rules) {
    if (rule.before === rule.after) continue;
    const regressed = supportRegressed(rule.before, rule.after);
    changes.push(
      change({
        path: rule.path,
        before: rule.before,
        after: rule.after,
        severity: regressed && rule.used ? 'blocking' : regressed ? 'warning' : 'info',
        usedByContent: rule.used,
        messageKey: rule.messageKey,
        remediationCode: rule.remediationCode,
      }),
    );
  }
  return changes;
}

interface LimitRule {
  readonly path: string;
  readonly before: number | null;
  readonly after: number | null;
  readonly required: number | null;
  readonly messageKey: string;
  readonly remediationCode: RemediationCode;
}

function diffLimits(rules: readonly LimitRule[]): CapabilityChange[] {
  const changes: CapabilityChange[] = [];
  for (const rule of rules) {
    if (rule.before === rule.after) continue;
    const tightened =
      rule.after !== null && (rule.before === null || rule.after < rule.before);
    const violated = tightened && rule.required !== null && rule.after !== null && rule.after < rule.required;
    changes.push(
      change({
        path: rule.path,
        before: rule.before,
        after: rule.after,
        severity: violated ? 'blocking' : tightened ? 'warning' : 'info',
        usedByContent: rule.required !== null && rule.required > 0,
        messageKey: rule.messageKey,
        remediationCode: rule.remediationCode,
      }),
    );
  }
  return changes;
}

export interface DiffCapabilitiesInput {
  readonly approved: CapabilitySnapshot;
  readonly live: CapabilitySnapshot;
  readonly usage: CapabilityUsage;
  readonly clock?: Clock;
  readonly maxSnapshotAgeSeconds?: number;
}

/**
 * Compare the snapshot stored at approval with the live one at dispatch.
 *
 * ```ts
 * const diff = diffCapabilities({ approved, live, usage: usageFromDraft(draft) });
 * if (diff.decision !== 'proceed') {
 *   throw capabilityDriftError(diff);
 * }
 * ```
 */
export function diffCapabilities(input: DiffCapabilitiesInput): CapabilityDiffResult {
  const clock = input.clock ?? systemClock;
  const { approved, live, usage } = input;

  const ageSeconds = Math.max(
    0,
    Math.floor((clock.now().getTime() - epochMillisecondsOf(live.observedAt)) / 1000),
  );
  const stale = ageSeconds > (input.maxSnapshotAgeSeconds ?? DEFAULT_MAX_SNAPSHOT_AGE_SECONDS);

  const structurallyDifferent =
    approved.provider !== live.provider || approved.connectionId !== live.connectionId;

  const changes: CapabilityChange[] = [];

  changes.push(
    ...diffSupport([
      {
        path: `contentKinds.${usage.contentKind}`,
        before: approved.contentKinds[usage.contentKind] ?? 'not_implemented',
        after: live.contentKinds[usage.contentKind] ?? 'not_implemented',
        used: true,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'grant_additional_permission',
      },
      {
        path: 'media.altText',
        before: approved.media.altText,
        after: live.media.altText,
        used: usage.usesAltText,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'fix_content',
      },
      {
        path: 'firstComment.support',
        before: approved.firstComment.support,
        after: live.firstComment.support,
        used: usage.usesFirstComment,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'grant_additional_permission',
      },
      {
        path: 'threads.support',
        before: approved.threads.support,
        after: live.threads.support,
        used: usage.usesThreadParts,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'grant_additional_permission',
      },
      {
        path: 'mentions.support',
        before: approved.mentions.support,
        after: live.mentions.support,
        used: usage.nativeMentionCount > 0,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'fix_content',
      },
      {
        path: 'privacy.support',
        before: approved.privacy.support,
        after: live.privacy.support,
        used: usage.privacyValue !== null,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'choose_privacy_option',
      },
      {
        path: 'disclosure.aiLabel',
        before: approved.disclosure.aiLabel,
        after: live.disclosure.aiLabel,
        used: usage.usesAiDisclosure,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'fix_content',
      },
      {
        path: 'disclosure.commercialContent',
        before: approved.disclosure.commercialContent,
        after: live.disclosure.commercialContent,
        used: usage.usesCommercialDisclosure,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'fix_content',
      },
      {
        path: 'disclosure.brandedContent',
        before: approved.disclosure.brandedContent,
        after: live.disclosure.brandedContent,
        used: usage.usesBrandedContentDisclosure,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'fix_content',
      },
      {
        path: 'analytics.support',
        before: approved.analytics.support,
        after: live.analytics.support,
        used: false,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'grant_additional_permission',
      },
      {
        path: 'deletion.support',
        before: approved.deletion.support,
        after: live.deletion.support,
        used: false,
        messageKey: 'error.capability_unsupported.message',
        remediationCode: 'grant_additional_permission',
      },
    ]),
  );

  if (usage.usesDestination && usage.destinationKind !== null) {
    const before = approved.destinations.find((entry) => entry.kind === usage.destinationKind);
    const after = live.destinations.find((entry) => entry.kind === usage.destinationKind);
    changes.push(
      ...diffSupport([
        {
          path: `destinations.${usage.destinationKind}`,
          before: before?.support ?? 'unsupported',
          after: after?.support ?? 'unsupported',
          used: true,
          messageKey: 'error.destination_unavailable.message',
          remediationCode: 'fix_content',
        },
      ]),
    );
  }

  const videoBytes = usage.largestBytesByKind.video ?? null;
  const imageBytes = usage.largestBytesByKind.image ?? null;

  changes.push(
    ...diffLimits([
      {
        path: 'text.maxLength',
        before: approved.text.maxLength,
        after: live.text.maxLength,
        required: usage.textLength,
        messageKey: 'validation.text_too_long.message',
        remediationCode: 'content_too_long',
      },
      {
        path: 'media.maxImages',
        before: approved.media.maxImages,
        after: live.media.maxImages,
        required: usage.imageCount,
        messageKey: 'validation.media_count_exceeded.message',
        remediationCode: 'media_invalid',
      },
      {
        path: 'media.maxVideos',
        before: approved.media.maxVideos,
        after: live.media.maxVideos,
        required: usage.videoCount,
        messageKey: 'validation.media_count_exceeded.message',
        remediationCode: 'media_invalid',
      },
      {
        path: 'media.maxDurationSeconds',
        before: approved.media.maxDurationSeconds,
        after: live.media.maxDurationSeconds,
        required: usage.longestVideoSeconds,
        messageKey: 'validation.media_duration_too_long.message',
        remediationCode: 'media_invalid',
      },
      {
        path: 'media.maxBytesByKind.video',
        before: approved.media.maxBytesByKind.video ?? null,
        after: live.media.maxBytesByKind.video ?? null,
        required: videoBytes,
        messageKey: 'validation.media_file_too_large.message',
        remediationCode: 'media_invalid',
      },
      {
        path: 'media.maxBytesByKind.image',
        before: approved.media.maxBytesByKind.image ?? null,
        after: live.media.maxBytesByKind.image ?? null,
        required: imageBytes,
        messageKey: 'validation.media_file_too_large.message',
        remediationCode: 'media_invalid',
      },
      {
        path: 'threads.maxItems',
        before: approved.threads.maxItems,
        after: live.threads.maxItems,
        required: usage.usesThreadParts ? usage.sequenceItemCount : null,
        messageKey: 'validation.thread_unsupported.message',
        remediationCode: 'fix_content',
      },
      {
        path: 'mentions.maxMentions',
        before: approved.mentions.maxMentions,
        after: live.mentions.maxMentions,
        required: usage.nativeMentionCount === 0 ? null : usage.nativeMentionCount,
        messageKey: 'validation.mention_unresolved.message',
        remediationCode: 'fix_content',
      },
    ]),
  );

  // A provider that now demands an explicit privacy choice invalidates content
  // approved without one. We never pick a default on the user's behalf.
  if (!approved.privacy.mustBeExplicit && live.privacy.mustBeExplicit && usage.privacyValue === null) {
    changes.push(
      change({
        path: 'privacy.mustBeExplicit',
        before: false,
        after: true,
        severity: 'blocking',
        usedByContent: true,
        messageKey: 'validation.privacy_setting_required.message',
        remediationCode: 'choose_privacy_option',
      }),
    );
  }

  // A privacy option that disappeared between approval and dispatch.
  if (usage.privacyValue !== null) {
    const stillOffered = live.privacy.options.some((option) => option.value === usage.privacyValue);
    if (!stillOffered && live.privacy.options.length > 0) {
      changes.push(
        change({
          path: 'privacy.options',
          before: usage.privacyValue,
          after: null,
          severity: 'blocking',
          usedByContent: true,
          messageKey: 'validation.privacy_setting_required.message',
          remediationCode: 'choose_privacy_option',
        }),
      );
    }
  }

  const approvedCost = approved.cost;
  const liveCost = live.cost;
  const beforeMinor =
    approvedCost === null
      ? null
      : usage.containsUrl
        ? approvedCost.perUrlCreateMinor
        : approvedCost.perCreateMinor;
  const afterMinor =
    liveCost === null
      ? null
      : usage.containsUrl
        ? liveCost.perUrlCreateMinor
        : liveCost.perCreateMinor;
  const costIncreased = beforeMinor !== null && afterMinor !== null && afterMinor > beforeMinor;
  if (costIncreased) {
    changes.push(
      change({
        path: 'cost.perCreateMinor',
        before: beforeMinor,
        after: afterMinor,
        severity: 'warning',
        usedByContent: true,
        messageKey: 'error.payment_required.message',
        remediationCode: 'usage_balance_required',
      }),
    );
  }

  const blockingChanges = changes.filter((entry) => entry.severity === 'blocking');
  const warnings = changes.filter((entry) => entry.severity === 'warning');

  const decision: CapabilityDiffDecision = structurallyDifferent
    ? 'block'
    : stale
      ? 'block'
      : blockingChanges.length > 0
        ? 'require_reapproval'
        : warnings.length > 0
          ? 'warn'
          : 'proceed';

  return {
    decision,
    changes,
    blockingChanges,
    capabilityVersionChanged: approved.capabilityVersion !== live.capabilityVersion,
    snapshotStale: stale,
    snapshotAgeSeconds: ageSeconds,
    costIncreased,
  };
}

/** A snapshot past its age budget may not be used to publish. Refetch or fail. */
export function assertSnapshotUsable(
  snapshot: CapabilitySnapshot,
  options: { readonly clock?: Clock; readonly maxAgeSeconds?: number } = {},
): void {
  const clock = options.clock ?? systemClock;
  const ageSeconds = Math.floor(
    (clock.now().getTime() - epochMillisecondsOf(snapshot.observedAt)) / 1000,
  );
  if (ageSeconds > (options.maxAgeSeconds ?? DEFAULT_MAX_SNAPSHOT_AGE_SECONDS)) {
    throw new RelayError('CONNECTION_ACTION_REQUIRED', {
      messageKey: 'error.user_action_required.message',
      details: {
        reason: 'CAPABILITY_SNAPSHOT_STALE',
        provider: snapshot.provider,
        connectionId: snapshot.connectionId,
        ageSeconds,
      },
    });
  }
}

/** The error a dispatch raises when approved content no longer fits. */
export function capabilityDriftError(result: CapabilityDiffResult): RelayError {
  const first = result.blockingChanges[0];
  return new RelayError(
    result.snapshotStale ? 'CONNECTION_ACTION_REQUIRED' : 'CAPABILITY_UNSUPPORTED',
    {
      messageKey: first?.messageKey ?? 'error.capability_unsupported.message',
      details: {
        decision: result.decision,
        snapshotStale: result.snapshotStale,
        changedPaths: result.blockingChanges.map((entry) => entry.path),
        remediationCode: first?.remediationCode ?? 'grant_additional_permission',
      },
    },
  );
}
