import { z } from 'zod';

import {
  CONTENT_KINDS,
  accountTypeSchema,
  capabilitySupportSchema,
  contentKindSchema,
  mediaKindSchema,
  providerIdSchema,
} from './enums.js';
import type { CapabilitySupport, ContentKind } from './enums.js';
import { normalizedMetricNameSchema } from './analytics.js';
import { currencyCodeSchema, isoInstantSchema } from './primitives.js';

/**
 * The capability snapshot is data, not code. It records what one connected
 * account may do right now. It is captured at approval time and revalidated
 * immediately before dispatch, so a snapshot always carries its own version.
 */

export const LINK_COUNTING_MODES = ['none', 'fixed', 'actual'] as const;
export const linkCountingModeSchema = z.enum(LINK_COUNTING_MODES);
export type LinkCountingMode = z.infer<typeof linkCountingModeSchema>;

export const textCapabilitySchema = z
  .object({
    maxLength: z.number().int().positive(),
    minLength: z.number().int().nonnegative(),
    supportsMarkdown: z.boolean(),
    linkCounting: z
      .object({
        mode: linkCountingModeSchema,
        charactersPerLink: z.number().int().nonnegative().nullable(),
      })
      .strict(),
  })
  .strict();
export type TextCapability = z.infer<typeof textCapabilitySchema>;

export const aspectRatioCapabilitySchema = z
  .object({
    min: z.number().positive(),
    max: z.number().positive(),
    recommended: z.array(z.number().positive()),
  })
  .strict();
export type AspectRatioCapability = z.infer<typeof aspectRatioCapabilitySchema>;

export const mediaCapabilitySchema = z
  .object({
    maxImages: z.number().int().nonnegative(),
    maxVideos: z.number().int().nonnegative(),
    allowedMimeTypes: z.array(z.string().min(1)),
    maxBytesByKind: z.record(mediaKindSchema, z.number().int().positive().nullable()),
    aspectRatios: aspectRatioCapabilitySchema,
    maxDurationSeconds: z.number().int().positive().nullable(),
    minDurationSeconds: z.number().int().nonnegative().nullable(),
    requiresThumbnail: z.boolean(),
    altText: capabilitySupportSchema,
    maxAltTextLength: z.number().int().positive().nullable(),
  })
  .strict();
export type MediaCapability = z.infer<typeof mediaCapabilitySchema>;

export const DESTINATION_KINDS = [
  'none',
  'community',
  'board',
  'group',
  'page',
  'organization',
  'channel',
  'publication',
] as const;
export const destinationKindSchema = z.enum(DESTINATION_KINDS);
export type DestinationKind = z.infer<typeof destinationKindSchema>;

export const destinationCapabilitySchema = z
  .object({
    kind: destinationKindSchema,
    support: capabilitySupportSchema,
    searchable: z.boolean(),
  })
  .strict();
export type DestinationCapability = z.infer<typeof destinationCapabilitySchema>;

export const mentionCapabilitySchema = z
  .object({
    support: capabilitySupportSchema,
    resolvesToExternalId: z.boolean(),
    maxMentions: z.number().int().nonnegative().nullable(),
  })
  .strict();
export type MentionCapability = z.infer<typeof mentionCapabilitySchema>;

export const sequenceCapabilitySchema = z
  .object({
    support: capabilitySupportSchema,
    maxItems: z.number().int().nonnegative(),
    minDelaySeconds: z.number().int().nonnegative(),
  })
  .strict();
export type SequenceCapability = z.infer<typeof sequenceCapabilitySchema>;

export const schedulingCapabilitySchema = z
  .object({
    providerNative: capabilitySupportSchema,
    maxLookAheadDays: z.number().int().positive().nullable(),
    minLeadSeconds: z.number().int().nonnegative(),
  })
  .strict();
export type SchedulingCapability = z.infer<typeof schedulingCapabilitySchema>;

export const privacyOptionSchema = z
  .object({
    value: z.string().min(1),
    labelKey: z.string().min(1),
    isDefault: z.boolean(),
  })
  .strict();
export type PrivacyOption = z.infer<typeof privacyOptionSchema>;

export const privacyCapabilitySchema = z
  .object({
    support: capabilitySupportSchema,
    /** TikTok and others forbid a preselected value; the user must choose. */
    mustBeExplicit: z.boolean(),
    options: z.array(privacyOptionSchema),
  })
  .strict();
export type PrivacyCapability = z.infer<typeof privacyCapabilitySchema>;

export const disclosureCapabilitySchema = z
  .object({
    aiLabel: capabilitySupportSchema,
    commercialContent: capabilitySupportSchema,
    brandedContent: capabilitySupportSchema,
  })
  .strict();
export type DisclosureCapability = z.infer<typeof disclosureCapabilitySchema>;

export const analyticsCapabilitySchema = z
  .object({
    support: capabilitySupportSchema,
    postMetrics: z.array(normalizedMetricNameSchema),
    accountMetrics: z.array(normalizedMetricNameSchema),
    historyWindowDays: z.number().int().positive().nullable(),
  })
  .strict();
export type AnalyticsCapability = z.infer<typeof analyticsCapabilitySchema>;

export const deletionCapabilitySchema = z
  .object({
    support: capabilitySupportSchema,
    windowSeconds: z.number().int().positive().nullable(),
  })
  .strict();
export type DeletionCapability = z.infer<typeof deletionCapabilitySchema>;

export const draftsCapabilitySchema = z
  .object({ support: capabilitySupportSchema })
  .strict();
export type DraftsCapability = z.infer<typeof draftsCapabilitySchema>;

export const rateLimitCapabilitySchema = z
  .object({
    windowSeconds: z.number().int().positive(),
    maxRequests: z.number().int().positive(),
  })
  .strict();
export type RateLimitCapability = z.infer<typeof rateLimitCapabilitySchema>;

/**
 * Provider cost is per operation on some networks. X charges materially more
 * for a create that contains a URL, which the composer must surface up front.
 */
export const costCapabilitySchema = z
  .object({
    currency: currencyCodeSchema,
    perCreateMinor: z.number().int().nonnegative(),
    perUrlCreateMinor: z.number().int().nonnegative(),
  })
  .strict();
export type CostCapability = z.infer<typeof costCapabilitySchema>;

export const capabilitySnapshotSchema = z
  .object({
    capabilityVersion: z.string().min(1),
    observedAt: isoInstantSchema,
    provider: providerIdSchema,
    accountType: accountTypeSchema,
    connectionId: z.string().min(1),
    text: textCapabilitySchema,
    media: mediaCapabilitySchema,
    contentKinds: z.record(contentKindSchema, capabilitySupportSchema),
    destinations: z.array(destinationCapabilitySchema),
    mentions: mentionCapabilitySchema,
    firstComment: sequenceCapabilitySchema,
    threads: sequenceCapabilitySchema,
    scheduling: schedulingCapabilitySchema,
    privacy: privacyCapabilitySchema,
    disclosure: disclosureCapabilitySchema,
    analytics: analyticsCapabilitySchema,
    deletion: deletionCapabilitySchema,
    drafts: draftsCapabilitySchema,
    rateLimit: rateLimitCapabilitySchema.nullable(),
    cost: costCapabilitySchema.nullable(),
  })
  .strict();
export type CapabilitySnapshot = z.infer<typeof capabilitySnapshotSchema>;

/** Every content kind marked `not_implemented`, a safe starting point. */
export const NOT_IMPLEMENTED_CONTENT_KINDS: Readonly<Record<ContentKind, CapabilitySupport>> =
  Object.freeze(
    Object.fromEntries(CONTENT_KINDS.map((kind) => [kind, 'not_implemented'])) as Record<
      ContentKind,
      CapabilitySupport
    >,
  );

function partitionContentKinds(
  contentKinds: Readonly<Record<ContentKind, CapabilitySupport>>,
  support: CapabilitySupport,
): ContentKind[] {
  return CONTENT_KINDS.filter((kind) => contentKinds[kind] === support);
}

/** A flat, UI-ready projection of a snapshot. Carries no provider payload. */
export interface CapabilitySummary {
  readonly capabilityVersion: string;
  readonly observedAt: string;
  readonly provider: CapabilitySnapshot['provider'];
  readonly accountType: CapabilitySnapshot['accountType'];
  readonly connectionId: string;
  readonly maxTextLength: number;
  readonly supportsMarkdown: boolean;
  readonly maxImages: number;
  readonly maxVideos: number;
  readonly maxVideoDurationSeconds: number | null;
  readonly requiresThumbnail: boolean;
  readonly altText: CapabilitySupport;
  readonly supportedContentKinds: readonly ContentKind[];
  readonly unsupportedContentKinds: readonly ContentKind[];
  readonly notImplementedContentKinds: readonly ContentKind[];
  readonly reviewRequiredContentKinds: readonly ContentKind[];
  readonly destinationKinds: readonly DestinationKind[];
  readonly mentions: CapabilitySupport;
  readonly firstComment: CapabilitySupport;
  readonly threads: CapabilitySupport;
  readonly maxSequenceItems: number;
  readonly minSequenceDelaySeconds: number;
  readonly providerNativeScheduling: CapabilitySupport;
  readonly maxLookAheadDays: number | null;
  readonly privacyMustBeExplicit: boolean;
  readonly requiresAiLabel: boolean;
  readonly analytics: CapabilitySupport;
  readonly postMetricCount: number;
  readonly accountMetricCount: number;
  readonly analyticsHistoryWindowDays: number | null;
  readonly deletion: CapabilitySupport;
  readonly drafts: CapabilitySupport;
  readonly currency: string | null;
  readonly perCreateMinor: number | null;
  readonly perUrlCreateMinor: number | null;
  readonly isMetered: boolean;
}

/** Reduce a snapshot to the flat view model the composer and rails consume. */
export function summarizeCapabilities(snapshot: CapabilitySnapshot): CapabilitySummary {
  const cost = snapshot.cost;
  return {
    capabilityVersion: snapshot.capabilityVersion,
    observedAt: snapshot.observedAt,
    provider: snapshot.provider,
    accountType: snapshot.accountType,
    connectionId: snapshot.connectionId,
    maxTextLength: snapshot.text.maxLength,
    supportsMarkdown: snapshot.text.supportsMarkdown,
    maxImages: snapshot.media.maxImages,
    maxVideos: snapshot.media.maxVideos,
    maxVideoDurationSeconds: snapshot.media.maxDurationSeconds,
    requiresThumbnail: snapshot.media.requiresThumbnail,
    altText: snapshot.media.altText,
    supportedContentKinds: partitionContentKinds(snapshot.contentKinds, 'supported'),
    unsupportedContentKinds: partitionContentKinds(snapshot.contentKinds, 'unsupported'),
    notImplementedContentKinds: partitionContentKinds(snapshot.contentKinds, 'not_implemented'),
    reviewRequiredContentKinds: partitionContentKinds(snapshot.contentKinds, 'requires_review'),
    destinationKinds: snapshot.destinations
      .filter((destination) => destination.support === 'supported')
      .map((destination) => destination.kind),
    mentions: snapshot.mentions.support,
    firstComment: snapshot.firstComment.support,
    threads: snapshot.threads.support,
    maxSequenceItems: Math.max(snapshot.firstComment.maxItems, snapshot.threads.maxItems),
    minSequenceDelaySeconds: Math.min(
      snapshot.firstComment.minDelaySeconds,
      snapshot.threads.minDelaySeconds,
    ),
    providerNativeScheduling: snapshot.scheduling.providerNative,
    maxLookAheadDays: snapshot.scheduling.maxLookAheadDays,
    privacyMustBeExplicit: snapshot.privacy.mustBeExplicit,
    requiresAiLabel: snapshot.disclosure.aiLabel === 'supported',
    analytics: snapshot.analytics.support,
    postMetricCount: snapshot.analytics.postMetrics.length,
    accountMetricCount: snapshot.analytics.accountMetrics.length,
    analyticsHistoryWindowDays: snapshot.analytics.historyWindowDays,
    deletion: snapshot.deletion.support,
    drafts: snapshot.drafts.support,
    currency: cost === null ? null : cost.currency,
    perCreateMinor: cost === null ? null : cost.perCreateMinor,
    perUrlCreateMinor: cost === null ? null : cost.perUrlCreateMinor,
    isMetered: cost !== null && (cost.perCreateMinor > 0 || cost.perUrlCreateMinor > 0),
  };
}

/** True when the connection can post this content kind right now. */
export function supportsContentKind(
  snapshot: CapabilitySnapshot,
  kind: ContentKind,
): boolean {
  return snapshot.contentKinds[kind] === 'supported';
}

/** Cost of one create on this connection, in minor units of `cost.currency`. */
export function estimateCreateCostMinor(
  snapshot: CapabilitySnapshot,
  containsUrl: boolean,
): number | null {
  if (snapshot.cost === null) {
    return null;
  }
  return containsUrl ? snapshot.cost.perUrlCreateMinor : snapshot.cost.perCreateMinor;
}
