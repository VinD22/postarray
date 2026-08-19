import { contentFingerprint, similarityRatio } from '@relay/authz';
import {
  estimateCreateCostMinor,
  mergeValidationResults,
  supportsContentKind,
  validationIssue,
  validationResult,
  type CapabilitySnapshot,
  type ContentKind,
  type LinkSpec,
  type MediaKind,
  type ValidationIssue,
  type ValidationResult,
} from '@relay/contracts';

import type { ActorContext, ServiceDeps, ValidationService } from '../types';

import {
  containsUrl,
  countCharacters,
  linkHosts,
  loadCapabilitiesFor,
  type ConnectionCapabilities,
} from '../internal/capabilities';
import { loadAggregate, type AggregateVariant } from '../internal/content-store';
import { authorized, type Db } from '../internal/runtime';
import { resolveTarget } from '../internal/stored-content';

/**
 * The deterministic preflight.
 *
 * Same input, same issues, every time and on every surface. It never throws for
 * a content problem: a content problem is data the composer renders next to the
 * field. It throws only when it cannot do its job at all, which is a different
 * failure and deserves a different treatment.
 *
 * What it checks, in order: per-target capability limits, duplicate and
 * cross-account similarity fingerprints, cadence budgets, mention and
 * destination resolution, link safety, alt-text policy, and the provider cost
 * estimate.
 */

/** Posts inside this window are compared for duplicate and similarity. */
const DUPLICATE_WINDOW_HOURS = 72;
const CROSS_ACCOUNT_SIMILARITY_THRESHOLD = 0.8;
/** Default per-connection budget when the project has not set one. */
const DEFAULT_DAILY_CADENCE = 10;

interface TargetContext {
  readonly variant: AggregateVariant;
  readonly body: string;
  readonly locale: string;
  readonly mediaIds: readonly string[];
  readonly contentKind: ContentKind;
  readonly links: readonly LinkSpec[];
  readonly capabilities: ConnectionCapabilities | undefined;
}

export interface MediaLifecycleFacts {
  readonly scanState: string;
  readonly rights: string;
  readonly retentionExpiresAt: Date;
  readonly storageDeletedAt: Date | null;
}

export function mediaLifecycleIssues(
  mediaIds: readonly string[],
  media: ReadonlyMap<string, MediaLifecycleFacts>,
  now: Date,
  targetId: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const mediaId of new Set(mediaIds)) {
    const entry = media.get(mediaId);
    if (entry === undefined) {
      issues.push(
        validationIssue({
          code: 'MEDIA_UNAVAILABLE',
          severity: 'error',
          targetId,
          params: { reason: 'missing' },
        }),
      );
      continue;
    }
    if (entry.storageDeletedAt !== null || entry.retentionExpiresAt.getTime() <= now.getTime()) {
      issues.push(
        validationIssue({
          code: 'MEDIA_UNAVAILABLE',
          severity: 'error',
          targetId,
          params: { reason: 'retention_expired' },
        }),
      );
    }
    if (entry.rights === 'unverified') {
      issues.push(
        validationIssue({ code: 'MEDIA_RIGHTS_UNDECLARED', severity: 'error', targetId }),
      );
    }
    if (entry.scanState === 'infected' || entry.scanState === 'suspicious') {
      issues.push(
        validationIssue({
          code: 'MEDIA_SCAN_BLOCKED',
          severity: 'error',
          targetId,
          params: { scanState: entry.scanState },
        }),
      );
    } else if (entry.scanState !== 'clean') {
      issues.push(
        validationIssue({
          code: 'MEDIA_NOT_READY',
          severity: 'error',
          targetId,
          params: { scanState: entry.scanState },
        }),
      );
    }
  }
  return issues;
}

function targetIssues(
  target: TargetContext,
  snapshot: CapabilitySnapshot | null,
  media: ReadonlyMap<string, MediaFacts>,
  now: Date,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const targetId = target.variant.id;
  const attached = target.mediaIds
    .map((id) => media.get(id))
    .filter((entry): entry is MediaFacts => entry !== undefined);

  issues.push(...mediaLifecycleIssues(target.mediaIds, media, now, targetId));

  if (target.body.trim() === '' && target.mediaIds.length === 0) {
    issues.push(
      validationIssue({ code: 'TEXT_REQUIRED', severity: 'error', targetId, field: 'body' }),
    );
  }

  if (snapshot === null) {
    issues.push(
      validationIssue({
        code: 'CAPABILITY_UNAVAILABLE',
        severity: 'error',
        targetId,
        messageKey: 'validation.capability_unavailable.message',
        params: { connectionId: target.variant.connectionId },
      }),
    );
    return issues;
  }

  // Text length, counted the way this provider counts it.
  const characters = countCharacters(target.body, snapshot);
  if (characters > snapshot.text.maxLength) {
    issues.push(
      validationIssue({
        code: 'TEXT_TOO_LONG',
        severity: 'error',
        targetId,
        field: 'body',
        params: { count: characters, limit: snapshot.text.maxLength },
      }),
    );
  }
  if (characters < snapshot.text.minLength) {
    issues.push(
      validationIssue({
        code: 'TEXT_TOO_SHORT',
        severity: 'error',
        targetId,
        field: 'body',
        params: { count: characters, minimum: snapshot.text.minLength },
      }),
    );
  }

  // Content kind. `unsupported` and `not_implemented` are different answers and
  // the user is told which one they got.
  const support = snapshot.contentKinds[target.contentKind] ?? 'not_implemented';
  if (support === 'unsupported') {
    issues.push(
      validationIssue({
        code: 'CONTENT_KIND_UNSUPPORTED',
        severity: 'error',
        targetId,
        messageKey: 'validation.content_kind_unsupported.message',
        params: { contentKind: target.contentKind, provider: snapshot.provider },
      }),
    );
  } else if (support === 'not_implemented') {
    issues.push(
      validationIssue({
        code: 'CONTENT_KIND_NOT_IMPLEMENTED',
        severity: 'error',
        targetId,
        messageKey: 'validation.content_kind_not_implemented.message',
        params: { contentKind: target.contentKind, provider: snapshot.provider },
      }),
    );
  } else if (support === 'requires_review' && !supportsContentKind(snapshot, target.contentKind)) {
    issues.push(
      validationIssue({
        code: 'CONTENT_KIND_REQUIRES_REVIEW',
        severity: 'error',
        targetId,
        messageKey: 'validation.content_kind_requires_review.message',
        params: { contentKind: target.contentKind },
      }),
    );
  }

  // Media counts, types, size and alt text.
  const images = attached.filter((entry) => entry.kind === 'image').length;
  const videos = attached.filter((entry) => entry.kind === 'video').length;

  if (images > snapshot.media.maxImages) {
    issues.push(
      validationIssue({
        code: 'MEDIA_COUNT_EXCEEDED',
        severity: 'error',
        targetId,
        params: { count: images, limit: snapshot.media.maxImages, kind: 'image' },
      }),
    );
  }
  if (videos > snapshot.media.maxVideos) {
    issues.push(
      validationIssue({
        code: 'MEDIA_COUNT_EXCEEDED',
        severity: 'error',
        targetId,
        params: { count: videos, limit: snapshot.media.maxVideos, kind: 'video' },
      }),
    );
  }
  if (images > 0 && videos > 0) {
    issues.push(
      validationIssue({ code: 'MEDIA_MIXED_TYPES_UNSUPPORTED', severity: 'error', targetId }),
    );
  }

  for (const entry of attached) {
    if (
      snapshot.media.allowedMimeTypes.length > 0 &&
      !snapshot.media.allowedMimeTypes.includes(entry.mimeType)
    ) {
      issues.push(
        validationIssue({
          code: 'MEDIA_TYPE_UNSUPPORTED',
          severity: 'error',
          targetId,
          params: { mimeType: entry.mimeType },
        }),
      );
    }
    const maxBytes = snapshot.media.maxBytesByKind[entry.kind];
    if (maxBytes !== undefined && maxBytes !== null && entry.byteSize > maxBytes) {
      issues.push(
        validationIssue({
          code: 'MEDIA_FILE_TOO_LARGE',
          severity: 'error',
          targetId,
          params: { byteSize: entry.byteSize, limit: maxBytes },
        }),
      );
    }
    if (
      entry.durationMs !== null &&
      snapshot.media.maxDurationSeconds !== null &&
      entry.durationMs / 1000 > snapshot.media.maxDurationSeconds
    ) {
      issues.push(
        validationIssue({
          code: 'MEDIA_DURATION_TOO_LONG',
          severity: 'error',
          targetId,
          params: {
            seconds: Math.round(entry.durationMs / 1000),
            limit: snapshot.media.maxDurationSeconds,
          },
        }),
      );
    }
    if (
      entry.kind === 'image' &&
      snapshot.media.altText === 'supported' &&
      entry.altText === null &&
      !entry.altTextWaived
    ) {
      issues.push(
        validationIssue({
          code: 'ALT_TEXT_MISSING',
          severity: 'warning',
          targetId,
          params: { count: 1 },
          remediationKey: 'validation.alt_text_missing.hint',
        }),
      );
    }
  }

  if (snapshot.media.requiresThumbnail && videos > 0) {
    const hasThumbnail = attached.some((entry) => entry.kind === 'image');
    if (!hasThumbnail) {
      issues.push(validationIssue({ code: 'THUMBNAIL_REQUIRED', severity: 'warning', targetId }));
    }
  }

  // Destination.
  const requiresDestination = snapshot.destinations.some(
    (destination) => destination.support === 'supported' && destination.kind !== 'none',
  );
  if (requiresDestination && target.variant.destinationId === null) {
    issues.push(validationIssue({ code: 'DESTINATION_REQUIRED', severity: 'error', targetId }));
  }

  // Mentions. An unresolved handle publishes as plain text, and we say so.
  if (snapshot.mentions.support !== 'supported' && target.variant.settings.mentions.length > 0) {
    issues.push(
      validationIssue({
        code: 'MENTION_UNRESOLVED',
        severity: 'warning',
        targetId,
        params: { count: target.variant.settings.mentions.length },
      }),
    );
  }
  if (
    snapshot.mentions.maxMentions !== null &&
    target.variant.settings.mentions.length > snapshot.mentions.maxMentions
  ) {
    issues.push(
      validationIssue({
        code: 'MENTION_COUNT_EXCEEDED',
        severity: 'error',
        targetId,
        messageKey: 'validation.mention_count_exceeded.message',
        params: {
          count: target.variant.settings.mentions.length,
          limit: snapshot.mentions.maxMentions,
        },
      }),
    );
  }

  // Privacy and disclosure.
  if (snapshot.privacy.mustBeExplicit && target.variant.settings.privacyValue === null) {
    issues.push(validationIssue({ code: 'PRIVACY_SETTING_REQUIRED', severity: 'error', targetId }));
  }
  if (
    snapshot.privacy.support === 'supported' &&
    target.variant.settings.privacyValue !== null &&
    !snapshot.privacy.options.some(
      (option) => option.value === target.variant.settings.privacyValue,
    )
  ) {
    issues.push(
      validationIssue({
        code: 'PRIVACY_VALUE_UNSUPPORTED',
        severity: 'error',
        targetId,
        messageKey: 'validation.privacy_value_unsupported.message',
        params: { value: target.variant.settings.privacyValue },
      }),
    );
  }

  return issues;
}

interface MediaFacts extends MediaLifecycleFacts {
  readonly id: string;
  readonly kind: MediaKind;
  readonly mimeType: string;
  readonly byteSize: number;
  readonly durationMs: number | null;
  readonly altText: string | null;
  readonly altTextWaived: boolean;
}

async function loadMediaFacts(
  db: Db,
  mediaIds: readonly string[],
): Promise<ReadonlyMap<string, MediaFacts>> {
  const unique = [...new Set(mediaIds)];
  if (unique.length === 0) {
    return new Map();
  }
  const rows = await db.mediaAsset.findMany({
    where: { id: { in: unique }, deletedAt: null },
    select: {
      id: true,
      kind: true,
      mimeType: true,
      byteSize: true,
      durationMs: true,
      altText: true,
      altTextWaivedAt: true,
      scanState: true,
      rights: true,
      retentionExpiresAt: true,
      storageDeletedAt: true,
    },
  });
  return new Map(
    rows.map((row) => [
      row.id,
      {
        id: row.id,
        kind: row.kind,
        mimeType: row.mimeType,
        byteSize: Number(row.byteSize),
        durationMs: row.durationMs,
        altText: row.altText,
        altTextWaived: row.altTextWaivedAt !== null,
        scanState: row.scanState,
        rights: row.rights,
        retentionExpiresAt: row.retentionExpiresAt,
        storageDeletedAt: row.storageDeletedAt,
      } satisfies MediaFacts,
    ]),
  );
}

/**
 * Duplicate and cross-account similarity. Compares this draft against what the
 * same connection recently published and against the other targets of this
 * same request.
 */
async function duplicateIssues(
  db: Db,
  targets: readonly TargetContext[],
  since: Date,
): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  for (const target of targets) {
    const recent = await db.publicationReceipt.findMany({
      where: { connectionId: target.variant.connectionId, publishedAt: { gte: since } },
      orderBy: { publishedAt: 'desc' },
      take: 25,
      select: { id: true, contentVersion: { select: { body: true } } },
    });
    for (const receipt of recent) {
      const previous = receipt.contentVersion.body;
      if (contentFingerprint(previous) === contentFingerprint(target.body)) {
        issues.push(
          validationIssue({
            code: 'DUPLICATE_WITHIN_WINDOW',
            severity: 'error',
            targetId: target.variant.id,
            params: { windowHours: DUPLICATE_WINDOW_HOURS, receiptId: receipt.id },
          }),
        );
        break;
      }
      if (similarityRatio(previous, target.body) >= CROSS_ACCOUNT_SIMILARITY_THRESHOLD) {
        issues.push(
          validationIssue({
            code: 'SIMILAR_WITHIN_WINDOW',
            severity: 'warning',
            targetId: target.variant.id,
            messageKey: 'validation.similar_within_window.message',
            params: { windowHours: DUPLICATE_WINDOW_HOURS, receiptId: receipt.id },
          }),
        );
        break;
      }
    }
  }

  // Cross-account similarity inside this one request.
  for (let left = 0; left < targets.length; left += 1) {
    for (let right = left + 1; right < targets.length; right += 1) {
      const first = targets[left];
      const second = targets[right];
      if (first === undefined || second === undefined) {
        continue;
      }
      if (similarityRatio(first.body, second.body) >= CROSS_ACCOUNT_SIMILARITY_THRESHOLD) {
        issues.push(
          validationIssue({
            code: 'CROSS_ACCOUNT_SIMILARITY',
            severity: 'warning',
            targetId: second.variant.id,
            messageKey: 'validation.cross_account_similarity.message',
            params: { otherTargetId: first.variant.id },
            remediationKey: 'validation.cross_account_similarity.remediation',
          }),
        );
      }
    }
  }

  return issues;
}

/** One connection may not exceed its daily publication budget. */
async function cadenceIssues(
  db: Db,
  targets: readonly TargetContext[],
  now: Date,
): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  const dayStart = new Date(now.getTime());
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const perConnection = new Map<string, number>();
  for (const target of targets) {
    perConnection.set(
      target.variant.connectionId,
      (perConnection.get(target.variant.connectionId) ?? 0) + 1,
    );
  }

  for (const [connectionId, requested] of perConnection) {
    const scheduled = await db.publishJob.count({
      where: {
        connectionId,
        scheduledFor: { gte: dayStart, lt: dayEnd },
        state: { notIn: ['canceled', 'failed_permanently'] },
      },
    });
    if (scheduled + requested > DEFAULT_DAILY_CADENCE) {
      const target = targets.find((entry) => entry.variant.connectionId === connectionId);
      issues.push(
        validationIssue({
          code: 'CADENCE_EXCEEDED',
          severity: 'warning',
          ...(target === undefined ? {} : { targetId: target.variant.id }),
          params: { scheduled, requested, budget: DEFAULT_DAILY_CADENCE },
        }),
      );
    }
  }

  return issues;
}

/** Blocked destinations, unresolvable URLs and disabled short links. */
async function linkIssues(db: Db, targets: readonly TargetContext[]): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  for (const target of targets) {
    const urls = target.body.match(/https?:\/\/\S+/g) ?? [];
    for (const url of urls) {
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        issues.push(
          validationIssue({
            code: 'LINK_MALFORMED',
            severity: 'error',
            targetId: target.variant.id,
            messageKey: 'validation.link_malformed.message',
            params: { url },
          }),
        );
        continue;
      }
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        issues.push(
          validationIssue({
            code: 'LINK_NOT_ALLOWED',
            severity: 'error',
            targetId: target.variant.id,
            params: { scheme: parsed.protocol },
          }),
        );
      }
    }

    const shortLinkIds = [
      ...new Set(
        target.links.map((link) => link.shortLinkId).filter((id): id is string => id !== null),
      ),
    ];
    if (shortLinkIds.length === 0) {
      continue;
    }
    const links = await db.shortLink.findMany({
      where: { id: { in: shortLinkIds } },
      select: { id: true, state: true },
    });
    for (const link of links) {
      if (link.state !== 'active') {
        issues.push(
          validationIssue({
            code: 'LINK_DESTINATION_UNVERIFIED',
            severity: 'error',
            targetId: target.variant.id,
            params: { shortLinkId: link.id, state: link.state },
          }),
        );
      }
    }
  }
  return issues;
}

export function createValidationService(deps: ServiceDeps): ValidationService {
  return {
    async validate(ctx: ActorContext, input: { contentItemId: string }): Promise<ValidationResult> {
      return authorized(deps, ctx, 'content.read', undefined, async (db) => {
        const aggregate = await loadAggregate(db, input.contentItemId);

        if (aggregate.variants.length === 0) {
          return validationResult({
            issues: [
              validationIssue({
                code: 'NO_TARGETS_SELECTED',
                severity: 'error',
                messageKey: 'validation.no_targets_selected.message',
              }),
            ],
          });
        }

        const capabilities = await loadCapabilitiesFor(
          db,
          deps,
          aggregate.variants.map((variant) => variant.connectionId),
        );

        const targets: TargetContext[] = aggregate.variants.map((variant) => {
          const resolved = resolveTarget(aggregate.master, variant.settings.overrides);
          return {
            variant,
            body: resolved.values.body,
            locale: resolved.values.locale,
            mediaIds: resolved.values.mediaIds,
            contentKind: resolved.values.contentKind,
            links: resolved.values.links,
            capabilities: capabilities.get(variant.connectionId),
          };
        });

        const media = await loadMediaFacts(
          db,
          targets.flatMap((target) => [...target.mediaIds]),
        );
        const now = deps.clock.now();

        const perTarget = targets.map((target) => {
          const snapshot = target.capabilities?.snapshot ?? null;
          const issues = targetIssues(target, snapshot, media, now);
          const cost =
            snapshot === null ? null : estimateCreateCostMinor(snapshot, containsUrl(target.body));
          if (cost === null || snapshot === null || snapshot.cost === null) {
            return validationResult({ issues });
          }
          return validationResult({
            issues,
            estimatedCostMinor: cost,
            currency: snapshot.cost.currency,
          });
        });

        const since = new Date(now.getTime() - DUPLICATE_WINDOW_HOURS * 3_600_000);

        const [duplicates, cadence, links] = await Promise.all([
          duplicateIssues(db, targets, since),
          cadenceIssues(db, targets, now),
          linkIssues(db, targets),
        ]);

        const scheduleIssues: ValidationIssue[] = [];
        const schedule = aggregate.master.schedule;
        if (schedule !== null && new Date(schedule.instant).getTime() < now.getTime()) {
          scheduleIssues.push(
            validationIssue({
              code: 'SCHEDULE_IN_PAST',
              severity: 'error',
              field: 'schedule',
              params: { instant: schedule.instant },
            }),
          );
        }

        return mergeValidationResults([
          ...perTarget,
          validationResult({
            issues: [...duplicates, ...cadence, ...links, ...scheduleIssues],
          }),
        ]);
      });
    },
  };
}

export { linkHosts };
