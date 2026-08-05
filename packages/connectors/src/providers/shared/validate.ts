import { validationIssue, type CapabilitySnapshot, type ValidationIssue } from '@relay/contracts';

import type { ProviderDraft, ProviderMedia } from './contract-shape.js';
import { countText, type CountingUnit } from './text.js';

/**
 * Deterministic validation shared by every adapter.
 *
 * It reads only the capability snapshot and the draft, never the network, so the composer,
 * the API, the CLI and the worker always reach the same verdict for the same input.
 * A provider adds its own rules on top; it never re-implements these.
 */

export interface SharedValidationOptions {
  readonly unit: CountingUnit;
  /** Alt text is required by our composer even where the provider allows omitting it. */
  readonly requireAltText: boolean;
  /** Providers that need at least one media item, for example TikTok and YouTube. */
  readonly requiresMedia: boolean;
  /** Providers that refuse mixing images and video in one post. */
  readonly allowMixedMedia: boolean;
}

const DEFAULTS: SharedValidationOptions = {
  unit: 'grapheme',
  requireAltText: false,
  requiresMedia: false,
  allowMixedMedia: false,
};

function aspectRatio(media: ProviderMedia): number | null {
  if (media.width === null || media.height === null || media.height === 0) {
    return null;
  }
  return media.width / media.height;
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function countKind(media: readonly ProviderMedia[], kind: ProviderMedia['kind']): number {
  return media.filter((item) => item.kind === kind).length;
}

/** Text length, including the provider's own link counting rule. */
export function validateText(
  body: string,
  snapshot: CapabilitySnapshot,
  unit: CountingUnit,
  targetId: string,
  field = 'body',
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const length = countText(body, { unit, linkCounting: snapshot.text.linkCounting });
  if (length > snapshot.text.maxLength) {
    issues.push(
      validationIssue({
        code: 'TEXT_TOO_LONG',
        severity: 'error',
        field,
        targetId,
        remediationKey: 'content_too_long',
        params: {
          provider: snapshot.provider,
          length,
          limit: snapshot.text.maxLength,
          over: length - snapshot.text.maxLength,
        },
      }),
    );
  }
  if (length < snapshot.text.minLength) {
    issues.push(
      validationIssue({
        code: 'TEXT_TOO_SHORT',
        severity: 'error',
        field,
        targetId,
        params: { provider: snapshot.provider, length, minimum: snapshot.text.minLength },
      }),
    );
  }
  return issues;
}

/** Media counts, formats, sizes, ratios, durations and alt text. */
export function validateMedia(
  media: readonly ProviderMedia[],
  snapshot: CapabilitySnapshot,
  targetId: string,
  options: Partial<SharedValidationOptions> = {},
): ValidationIssue[] {
  const settings = { ...DEFAULTS, ...options };
  const issues: ValidationIssue[] = [];
  const capability = snapshot.media;

  const imageCount = countKind(media, 'image') + countKind(media, 'gif');
  const videoCount = countKind(media, 'video');

  if (imageCount > capability.maxImages) {
    issues.push(
      validationIssue({
        code: 'TOO_MANY_IMAGES',
        severity: 'error',
        field: 'media',
        targetId,
        remediationKey: 'media_invalid',
        params: { provider: snapshot.provider, count: imageCount, limit: capability.maxImages },
      }),
    );
  }
  if (videoCount > capability.maxVideos) {
    issues.push(
      validationIssue({
        code: 'TOO_MANY_VIDEOS',
        severity: 'error',
        field: 'media',
        targetId,
        remediationKey: 'media_invalid',
        params: { provider: snapshot.provider, count: videoCount, limit: capability.maxVideos },
      }),
    );
  }
  if (settings.requiresMedia && media.length === 0) {
    issues.push(
      validationIssue({
        code: 'MEDIA_REQUIRED',
        severity: 'error',
        field: 'media',
        targetId,
        remediationKey: 'media_invalid',
        params: { provider: snapshot.provider },
      }),
    );
  }
  if (!settings.allowMixedMedia && imageCount > 0 && videoCount > 0) {
    issues.push(
      validationIssue({
        code: 'MIXED_MEDIA_NOT_ALLOWED',
        severity: 'error',
        field: 'media',
        targetId,
        remediationKey: 'media_invalid',
        params: { provider: snapshot.provider },
      }),
    );
  }

  for (const [index, item] of media.entries()) {
    const field = `media.${index}`;
    if (!capability.allowedMimeTypes.includes(item.mimeType)) {
      issues.push(
        validationIssue({
          code: 'MEDIA_FORMAT_UNSUPPORTED',
          severity: 'error',
          field,
          targetId,
          remediationKey: 'media_invalid',
          params: {
            provider: snapshot.provider,
            mimeType: item.mimeType,
            allowed: capability.allowedMimeTypes.join(', '),
          },
        }),
      );
    }
    const maxBytes = capability.maxBytesByKind[item.kind] ?? null;
    if (maxBytes !== null && item.byteSize > maxBytes) {
      issues.push(
        validationIssue({
          code: 'MEDIA_TOO_LARGE',
          severity: 'error',
          field,
          targetId,
          remediationKey: 'media_invalid',
          params: { provider: snapshot.provider, byteSize: item.byteSize, limit: maxBytes },
        }),
      );
    }
    const ratio = aspectRatio(item);
    if (
      ratio !== null &&
      (ratio < capability.aspectRatios.min || ratio > capability.aspectRatios.max)
    ) {
      issues.push(
        validationIssue({
          code: 'MEDIA_ASPECT_RATIO_INVALID',
          severity: 'error',
          field,
          targetId,
          remediationKey: 'media_invalid',
          params: {
            provider: snapshot.provider,
            ratio: round(ratio),
            min: round(capability.aspectRatios.min),
            max: round(capability.aspectRatios.max),
          },
        }),
      );
    }
    if (item.durationSeconds !== null) {
      if (
        capability.maxDurationSeconds !== null &&
        item.durationSeconds > capability.maxDurationSeconds
      ) {
        issues.push(
          validationIssue({
            code: 'MEDIA_TOO_LONG',
            severity: 'error',
            field,
            targetId,
            remediationKey: 'media_invalid',
            params: {
              provider: snapshot.provider,
              durationSeconds: item.durationSeconds,
              limit: capability.maxDurationSeconds,
            },
          }),
        );
      }
      if (
        capability.minDurationSeconds !== null &&
        item.durationSeconds < capability.minDurationSeconds
      ) {
        issues.push(
          validationIssue({
            code: 'MEDIA_TOO_SHORT',
            severity: 'error',
            field,
            targetId,
            remediationKey: 'media_invalid',
            params: {
              provider: snapshot.provider,
              durationSeconds: item.durationSeconds,
              minimum: capability.minDurationSeconds,
            },
          }),
        );
      }
    }
    const needsAltText =
      capability.altText === 'supported' && item.kind !== 'video' && item.kind !== 'audio';
    if (needsAltText && item.altText === null && !item.altTextWaived) {
      issues.push(
        validationIssue({
          code: 'ALT_TEXT_MISSING',
          severity: settings.requireAltText ? 'error' : 'warning',
          field,
          targetId,
          params: { provider: snapshot.provider },
        }),
      );
    }
    if (
      item.altText !== null &&
      capability.maxAltTextLength !== null &&
      item.altText.length > capability.maxAltTextLength
    ) {
      issues.push(
        validationIssue({
          code: 'ALT_TEXT_TOO_LONG',
          severity: 'error',
          field,
          targetId,
          params: {
            provider: snapshot.provider,
            length: item.altText.length,
            limit: capability.maxAltTextLength,
          },
        }),
      );
    }
  }
  return issues;
}

/** Content kind, destination, mention, sequence, privacy and disclosure rules. */
export function validateDraftShape(
  draft: ProviderDraft,
  snapshot: CapabilitySnapshot,
  options: Partial<SharedValidationOptions> = {},
): ValidationIssue[] {
  const settings = { ...DEFAULTS, ...options };
  const targetId = draft.connection.connectionId;
  const issues: ValidationIssue[] = [];

  const kindSupport = snapshot.contentKinds[draft.contentKind];
  if (kindSupport !== 'supported') {
    issues.push(
      validationIssue({
        code:
          kindSupport === 'unsupported'
            ? 'CONTENT_KIND_UNSUPPORTED'
            : kindSupport === 'requires_review'
              ? 'CONTENT_KIND_REQUIRES_REVIEW'
              : 'CONTENT_KIND_NOT_IMPLEMENTED',
        severity: 'error',
        field: 'contentKind',
        targetId,
        remediationKey:
          kindSupport === 'requires_review' ? 'awaiting_provider_approval' : undefined,
        params: { provider: snapshot.provider, contentKind: draft.contentKind },
      }),
    );
  }

  issues.push(...validateText(draft.body, snapshot, settings.unit, targetId));
  issues.push(...validateMedia(draft.media, snapshot, targetId, settings));

  const required = snapshot.destinations.find(
    (destination) => destination.support === 'supported' && destination.kind !== 'none',
  );
  if (draft.destination !== null && required === undefined) {
    issues.push(
      validationIssue({
        code: 'DESTINATION_UNSUPPORTED',
        severity: 'error',
        field: 'destination',
        targetId,
        params: { provider: snapshot.provider },
      }),
    );
  }

  if (draft.mentions.length > 0 && snapshot.mentions.support !== 'supported') {
    issues.push(
      validationIssue({
        code: 'MENTIONS_NOT_RESOLVED',
        severity: 'warning',
        field: 'mentions',
        targetId,
        params: { provider: snapshot.provider },
      }),
    );
  }
  if (
    snapshot.mentions.maxMentions !== null &&
    draft.mentions.length > snapshot.mentions.maxMentions
  ) {
    issues.push(
      validationIssue({
        code: 'TOO_MANY_MENTIONS',
        severity: 'error',
        field: 'mentions',
        targetId,
        params: {
          provider: snapshot.provider,
          count: draft.mentions.length,
          limit: snapshot.mentions.maxMentions,
        },
      }),
    );
  }

  const comments = draft.threadItems.filter((item) => item.kind === 'comment');
  const threadParts = draft.threadItems.filter((item) => item.kind === 'thread');
  if (comments.length > 0 && snapshot.firstComment.support !== 'supported') {
    issues.push(
      validationIssue({
        code:
          snapshot.firstComment.support === 'unsupported'
            ? 'FIRST_COMMENT_UNSUPPORTED'
            : 'FIRST_COMMENT_NOT_AVAILABLE',
        severity: 'error',
        field: 'threadItems',
        targetId,
        remediationKey:
          snapshot.firstComment.support === 'requires_review'
            ? 'grant_additional_permission'
            : undefined,
        params: { provider: snapshot.provider },
      }),
    );
  }
  if (comments.length > snapshot.firstComment.maxItems) {
    issues.push(
      validationIssue({
        code: 'TOO_MANY_COMMENTS',
        severity: 'error',
        field: 'threadItems',
        targetId,
        params: {
          provider: snapshot.provider,
          count: comments.length,
          limit: snapshot.firstComment.maxItems,
        },
      }),
    );
  }
  if (threadParts.length > 0 && snapshot.threads.support !== 'supported') {
    issues.push(
      validationIssue({
        code: 'THREADS_UNSUPPORTED',
        severity: 'error',
        field: 'threadItems',
        targetId,
        params: { provider: snapshot.provider },
      }),
    );
  }
  if (threadParts.length > snapshot.threads.maxItems) {
    issues.push(
      validationIssue({
        code: 'TOO_MANY_THREAD_PARTS',
        severity: 'error',
        field: 'threadItems',
        targetId,
        params: {
          provider: snapshot.provider,
          count: threadParts.length,
          limit: snapshot.threads.maxItems,
        },
      }),
    );
  }
  for (const [index, item] of draft.threadItems.entries()) {
    issues.push(
      ...validateText(item.body, snapshot, settings.unit, targetId, `threadItems.${index}.body`),
    );
    const minimum =
      item.kind === 'comment'
        ? snapshot.firstComment.minDelaySeconds
        : snapshot.threads.minDelaySeconds;
    if (item.delaySeconds < minimum) {
      issues.push(
        validationIssue({
          code: 'SEQUENCE_DELAY_TOO_SHORT',
          severity: 'error',
          field: `threadItems.${index}.delaySeconds`,
          targetId,
          params: { provider: snapshot.provider, delaySeconds: item.delaySeconds, minimum },
        }),
      );
    }
  }

  if (snapshot.privacy.support === 'supported') {
    const chosen = draft.privacyValue;
    if (chosen === null) {
      issues.push(
        validationIssue({
          code: 'PRIVACY_CHOICE_REQUIRED',
          severity: snapshot.privacy.mustBeExplicit ? 'error' : 'warning',
          field: 'privacyValue',
          targetId,
          remediationKey: 'choose_privacy_option',
          params: { provider: snapshot.provider },
        }),
      );
    } else if (!snapshot.privacy.options.some((option) => option.value === chosen)) {
      issues.push(
        validationIssue({
          code: 'PRIVACY_OPTION_UNAVAILABLE',
          severity: 'error',
          field: 'privacyValue',
          targetId,
          remediationKey: 'choose_privacy_option',
          params: { provider: snapshot.provider, value: chosen },
        }),
      );
    }
  }

  if (draft.disclosure.commercialContent && snapshot.disclosure.commercialContent !== 'supported') {
    issues.push(
      validationIssue({
        code: 'COMMERCIAL_DISCLOSURE_UNSUPPORTED',
        severity: 'warning',
        field: 'disclosure.commercialContent',
        targetId,
        params: { provider: snapshot.provider },
      }),
    );
  }
  if (draft.disclosure.aiAssisted && snapshot.disclosure.aiLabel !== 'supported') {
    issues.push(
      validationIssue({
        code: 'AI_DISCLOSURE_UNSUPPORTED',
        severity: 'warning',
        field: 'disclosure.aiAssisted',
        targetId,
        params: { provider: snapshot.provider },
      }),
    );
  }

  return issues;
}
