import {
  type ValidationIssue,
  type ValidationResult,
  estimateCreateCostMinor,
  validationIssue,
  validationResult,
} from '@relay/contracts';

import type {
  CanonicalPreview,
  PreviewEntity,
  ProviderDraft,
  ProviderMediaRef,
} from '../contract.js';

/**
 * Deterministic validation and preview for the fake provider.
 *
 * Same input, same issues, every time, on every surface. The composer, the API
 * validation response and the MCP `validate_post` tool all call this, so a
 * cross surface test can assert they agree.
 */

const IMAGE_KINDS = new Set(['image', 'gif']);

function effectiveTextLength(draft: ProviderDraft): number {
  const counting = draft.capabilities.text.linkCounting;
  if (counting.mode === 'fixed' && counting.charactersPerLink !== null) {
    const linkCount = draft.links.length;
    const urlPattern = /https?:\/\/\S+/g;
    const inlineLinks = draft.body.match(urlPattern) ?? [];
    const stripped = draft.body.replace(urlPattern, '');
    const counted = Math.max(linkCount, inlineLinks.length);
    return stripped.length + counted * counting.charactersPerLink;
  }
  return draft.body.length;
}

function aspectRatioOf(asset: ProviderMediaRef): number | null {
  if (asset.width === null || asset.height === null || asset.height === 0) {
    return null;
  }
  return asset.width / asset.height;
}

/** Every deterministic issue the fake provider can raise. */
export function validateFakeDraft(draft: ProviderDraft): ValidationResult {
  const capabilities = draft.capabilities;
  const issues: ValidationIssue[] = [];
  const targetId = draft.postVariantId;
  const allMedia = [...draft.media, ...draft.threadItems.flatMap((item) => item.media)];

  const kindSupport = capabilities.contentKinds[draft.contentKind];
  if (kindSupport !== 'supported') {
    issues.push(
      validationIssue({
        code: 'content_kind_unsupported',
        severity: 'error',
        targetId,
        field: 'contentKind',
        // TODO(i18n): no `validation.content_kind_unsupported` key exists yet, so
        // this reuses the capability message the Action Center already renders.
        messageKey:
          kindSupport === 'not_implemented'
            ? 'error.capability_not_implemented.message'
            : 'error.capability_unsupported.message',
        params: { provider: 'fake', contentKind: draft.contentKind, support: kindSupport },
        remediationKey: 'error.capability_unsupported.action',
      }),
    );
  }

  if (draft.body.trim() === '' && draft.media.length === 0) {
    issues.push(
      validationIssue({
        code: 'text_required',
        severity: 'error',
        targetId,
        field: 'body',
        params: { provider: 'fake' },
      }),
    );
  }

  const used = effectiveTextLength(draft);
  if (used > capabilities.text.maxLength) {
    issues.push(
      validationIssue({
        code: 'text_too_long',
        severity: 'error',
        targetId,
        field: 'body',
        params: {
          over: used - capabilities.text.maxLength,
          limit: capabilities.text.maxLength,
          account: draft.connection.displayName,
          provider: 'fake',
        },
      }),
    );
  }

  const images = allMedia.filter((asset) => IMAGE_KINDS.has(asset.kind));
  const videos = allMedia.filter((asset) => asset.kind === 'video');

  if (images.length > capabilities.media.maxImages) {
    issues.push(
      validationIssue({
        code: 'media_count_exceeded',
        severity: 'error',
        targetId,
        field: 'media',
        params: { count: images.length, limit: capabilities.media.maxImages, provider: 'fake' },
      }),
    );
  }
  if (videos.length > capabilities.media.maxVideos) {
    issues.push(
      validationIssue({
        code: 'media_count_exceeded',
        severity: 'error',
        targetId,
        field: 'media',
        params: { count: videos.length, limit: capabilities.media.maxVideos, provider: 'fake' },
      }),
    );
  }

  for (const [index, asset] of allMedia.entries()) {
    const field = `media.${index}`;
    if (!capabilities.media.allowedMimeTypes.includes(asset.mimeType)) {
      issues.push(
        validationIssue({
          code: 'media_type_unsupported',
          severity: 'error',
          targetId,
          field,
          params: { mimeType: asset.mimeType, provider: 'fake' },
        }),
      );
      continue;
    }
    const maxBytes = capabilities.media.maxBytesByKind[asset.kind] ?? null;
    if (maxBytes !== null && asset.byteSize > maxBytes) {
      issues.push(
        validationIssue({
          code: 'media_file_too_large',
          severity: 'error',
          targetId,
          field,
          params: { bytes: asset.byteSize, limit: maxBytes, provider: 'fake' },
        }),
      );
    }
    if (asset.kind === 'video' && asset.durationSeconds !== null) {
      const max = capabilities.media.maxDurationSeconds;
      const min = capabilities.media.minDurationSeconds;
      if (max !== null && asset.durationSeconds > max) {
        issues.push(
          validationIssue({
            code: 'media_duration_too_long',
            severity: 'error',
            targetId,
            field,
            params: { seconds: asset.durationSeconds, limit: max, provider: 'fake' },
          }),
        );
      }
      if (min !== null && asset.durationSeconds < min) {
        issues.push(
          validationIssue({
            code: 'media_duration_too_short',
            severity: 'error',
            targetId,
            field,
            params: { seconds: asset.durationSeconds, min, provider: 'fake' },
          }),
        );
      }
    }
    const ratio = aspectRatioOf(asset);
    if (
      ratio !== null &&
      (ratio < capabilities.media.aspectRatios.min || ratio > capabilities.media.aspectRatios.max)
    ) {
      issues.push(
        validationIssue({
          code: 'media_aspect_ratio_unsupported',
          severity: 'error',
          targetId,
          field,
          params: {
            ratio: Math.round(ratio * 100) / 100,
            min: capabilities.media.aspectRatios.min,
            max: capabilities.media.aspectRatios.max,
            provider: 'fake',
          },
        }),
      );
    }
    if (
      IMAGE_KINDS.has(asset.kind) &&
      capabilities.media.altText === 'supported' &&
      (asset.altText === null || asset.altText.trim() === '') &&
      !asset.altTextWaived
    ) {
      issues.push(
        validationIssue({
          code: 'alt_text_missing',
          severity: 'error',
          targetId,
          field,
          params: { count: 1 },
        }),
      );
    }
  }

  if (capabilities.privacy.mustBeExplicit && draft.privacyValue === null) {
    issues.push(
      validationIssue({
        code: 'privacy_setting_required',
        severity: 'error',
        targetId,
        field: 'privacyValue',
        params: { provider: 'fake' },
        remediationKey: 'validation.privacy_setting_required.hint',
      }),
    );
  }
  if (
    draft.privacyValue !== null &&
    !capabilities.privacy.options.some((option) => option.value === draft.privacyValue)
  ) {
    issues.push(
      validationIssue({
        code: 'privacy_setting_required',
        severity: 'error',
        targetId,
        field: 'privacyValue',
        params: { provider: 'fake', value: draft.privacyValue },
        remediationKey: 'validation.privacy_setting_required.hint',
      }),
    );
  }

  if (draft.destination !== null) {
    const support = capabilities.destinations.find(
      (entry) => entry.kind === draft.destination?.kind,
    );
    if (support === undefined || support.support !== 'supported') {
      issues.push(
        validationIssue({
          code: 'destination_unsupported',
          severity: 'error',
          targetId,
          field: 'destination',
          params: { kind: draft.destination.kind, provider: 'fake' },
        }),
      );
    } else if (!draft.destination.canPost) {
      issues.push(
        validationIssue({
          code: 'destination_unsupported',
          severity: 'error',
          targetId,
          field: 'destination',
          params: { destination: draft.destination.displayLabel, provider: 'fake' },
        }),
      );
    }
  }

  const unresolved = draft.mentions.filter((mention) => !mention.resolvedToExternalId);
  if (unresolved.length > 0) {
    issues.push(
      validationIssue({
        code: 'mention_unresolved',
        severity: 'warning',
        targetId,
        field: 'mentions',
        params: { count: unresolved.length, provider: 'fake' },
      }),
    );
  }
  const maxMentions = capabilities.mentions.maxMentions;
  if (maxMentions !== null && draft.mentions.length > maxMentions) {
    issues.push(
      validationIssue({
        code: 'mention_unresolved',
        severity: 'error',
        targetId,
        field: 'mentions',
        params: { count: draft.mentions.length, limit: maxMentions, provider: 'fake' },
      }),
    );
  }

  const comments = draft.threadItems.filter((item) => item.kind === 'comment');
  const threads = draft.threadItems.filter((item) => item.kind === 'thread');
  if (comments.length > 0 && capabilities.firstComment.support !== 'supported') {
    issues.push(
      validationIssue({
        code: 'first_comment_unsupported',
        severity: 'error',
        targetId,
        field: 'threadItems',
        params: { provider: 'fake', support: capabilities.firstComment.support },
      }),
    );
  }
  if (comments.length > capabilities.firstComment.maxItems) {
    issues.push(
      validationIssue({
        code: 'first_comment_unsupported',
        severity: 'error',
        targetId,
        field: 'threadItems',
        params: {
          count: comments.length,
          limit: capabilities.firstComment.maxItems,
          provider: 'fake',
        },
      }),
    );
  }
  for (const comment of comments) {
    if (comment.delaySeconds < capabilities.firstComment.minDelaySeconds) {
      issues.push(
        validationIssue({
          code: 'first_comment_unsupported',
          severity: 'warning',
          targetId,
          field: `threadItems.${comment.order}`,
          params: {
            delaySeconds: comment.delaySeconds,
            min: capabilities.firstComment.minDelaySeconds,
            provider: 'fake',
          },
        }),
      );
    }
  }
  if (threads.length > 0 && capabilities.threads.support !== 'supported') {
    issues.push(
      validationIssue({
        code: 'thread_unsupported',
        severity: 'error',
        targetId,
        field: 'threadItems',
        params: { provider: 'fake', support: capabilities.threads.support },
      }),
    );
  }
  if (threads.length > capabilities.threads.maxItems) {
    issues.push(
      validationIssue({
        code: 'thread_unsupported',
        severity: 'error',
        targetId,
        field: 'threadItems',
        params: { count: threads.length, limit: capabilities.threads.maxItems, provider: 'fake' },
      }),
    );
  }

  if (draft.disclosure.brandedContent && capabilities.disclosure.brandedContent !== 'supported') {
    issues.push(
      validationIssue({
        code: 'disclosure_required',
        severity: 'warning',
        targetId,
        field: 'disclosure',
        params: { provider: 'fake', support: capabilities.disclosure.brandedContent },
      }),
    );
  }

  const containsUrl = draft.links.length > 0 || /https?:\/\//i.test(draft.body);
  const perCreate = estimateCreateCostMinor(capabilities, containsUrl);
  if (perCreate === null || capabilities.cost === null) {
    return validationResult({ issues });
  }
  const creates = 1 + draft.threadItems.length;
  return validationResult({
    issues,
    estimatedCostMinor: perCreate * creates,
    currency: capabilities.cost.currency,
  });
}

const MENTION_PATTERN = /@([A-Za-z0-9_]{1,30})/g;
const HASHTAG_PATTERN = /#([A-Za-z0-9_]{1,60})/g;
const URL_PATTERN = /https?:\/\/[^\s]+/g;

function entitiesIn(text: string, draft: ProviderDraft): PreviewEntity[] {
  const entities: PreviewEntity[] = [];
  for (const match of text.matchAll(MENTION_PATTERN)) {
    const handle = match[1] ?? '';
    const resolved = draft.mentions.find((mention) => mention.handle === handle);
    entities.push({
      kind: 'mention',
      offset: match.index,
      length: match[0].length,
      display: match[0],
      externalId: resolved?.externalId ?? null,
      // A handle we never resolved publishes as plain text, and the composer
      // must say so rather than implying a native tag.
      nativeTag: resolved?.resolvedToExternalId === true,
    });
  }
  for (const match of text.matchAll(HASHTAG_PATTERN)) {
    entities.push({
      kind: 'hashtag',
      offset: match.index,
      length: match[0].length,
      display: match[0],
      externalId: null,
      nativeTag: true,
    });
  }
  for (const match of text.matchAll(URL_PATTERN)) {
    entities.push({
      kind: 'link',
      offset: match.index,
      length: match[0].length,
      display: match[0],
      externalId: null,
      nativeTag: true,
    });
  }
  return entities.sort((left, right) => left.offset - right.offset);
}

function mediaLayoutFor(draft: ProviderDraft): CanonicalPreview['mediaLayout'] {
  if (draft.media.length === 0) return 'none';
  if (draft.media.some((asset) => asset.kind === 'video')) return 'video';
  if (draft.media.some((asset) => asset.kind === 'document')) return 'document';
  if (draft.contentKind === 'carousel') return 'carousel';
  return draft.media.length === 1 ? 'single' : 'grid';
}

function previewItems(media: readonly ProviderMediaRef[]): CanonicalPreview['mediaItems'] {
  return media.map((asset) => ({
    mediaId: asset.mediaId,
    kind: asset.kind,
    aspectRatio: aspectRatioOf(asset),
    thumbnailUrl: asset.sourceUrl,
    altText: asset.altText,
  }));
}

/** A normalized preview. Data, never HTML, and never an invented visual. */
export function buildFakePreview(draft: ProviderDraft): CanonicalPreview {
  const limit = draft.capabilities.text.maxLength;
  const used = effectiveTextLength(draft);
  const willTruncate = used > limit;
  const notices: string[] = [];
  if (willTruncate) {
    notices.push('validation.text_too_long.message');
  }
  if (draft.mentions.some((mention) => !mention.resolvedToExternalId)) {
    notices.push('validation.mention_unresolved.message');
  }

  return {
    provider: 'fake',
    accountType: draft.connection.accountType,
    connectionId: draft.connection.connectionId,
    authorDisplayName: draft.connection.displayName,
    authorHandle: null,
    authorAvatarUrl: null,
    renderedText: draft.body,
    entities: entitiesIn(draft.body, draft),
    counter: { used, limit, remaining: limit - used, unit: 'utf16' },
    truncation: { willTruncate, atIndex: willTruncate ? limit : null },
    mediaLayout: mediaLayoutFor(draft),
    mediaItems: previewItems(draft.media),
    linkCard:
      draft.links.length === 0
        ? null
        : {
            url: draft.links[0]?.publishedUrl ?? draft.links[0]?.originalUrl ?? '',
            rendered: draft.media.length === 0,
            titleFrom: draft.media.length === 0 ? 'provider_unfurl' : 'none',
            consumesCharacters: draft.capabilities.text.linkCounting.charactersPerLink ?? 0,
          },
    destinationLabel: draft.destination?.displayLabel ?? null,
    privacyLabelKey:
      draft.capabilities.privacy.options.find((option) => option.value === draft.privacyValue)
        ?.labelKey ?? null,
    disclosureLabelKeys: [
      ...(draft.disclosure.aiAssisted ? ['composerWeb.native.disclosureAi'] : []),
      ...(draft.disclosure.commercialContent ? ['composerWeb.native.disclosureCommercial'] : []),
      ...(draft.disclosure.brandedContent ? ['composerWeb.native.disclosureBranded'] : []),
    ],
    threadItems: draft.threadItems.map((item) => ({
      order: item.order,
      renderedText: item.body,
      delaySeconds: item.delaySeconds,
      mediaItems: previewItems(item.media),
    })),
    noticeKeys: notices,
  };
}
