import type { CapabilitySnapshot } from '@relay/contracts';

import { connectionMetadataString, mentionOffset } from './access.js';
import type { CanonicalPreview, PreviewEntityRange, ProviderDraft, ProviderMedia } from './contract-shape.js';
import { countText, detectUrls, truncationIndex, type CountingUnit } from './text.js';

/**
 * The canonical preview is data, never HTML, and it never invents a visual the provider
 * does not produce. The design system turns it into a native looking preview.
 */

export type MediaLayout = 'none' | 'single' | 'grid' | 'carousel' | 'video' | 'document';
export type LinkRendering = 'card' | 'inline_text' | 'none';

export interface PreviewOptions {
  readonly unit: CountingUnit;
  readonly mediaLayout: MediaLayout;
  readonly linkRendering: LinkRendering;
  /** True when the provider resolves `@handle` at render time rather than by entity id. */
  readonly resolvesMentionsAtRender: boolean;
  readonly privacyLabelKey: string | null;
  readonly warningKeys: readonly string[];
}

const HASHTAG_PATTERN = /(?:^|\s)(#[\p{L}\p{N}_]+)/gu;
const HANDLE_PATTERN = /(?:^|\s)(@[A-Za-z0-9_.]{1,64})/gu;

function linkEntities(body: string, rendering: LinkRendering): PreviewEntityRange[] {
  if (rendering === 'none') {
    return [];
  }
  return detectUrls(body).map((url) => ({
    kind: 'link' as const,
    offset: url.offset,
    length: url.length,
    display: url.url,
    externalId: null,
    nativeTag: true,
  }));
}

function captureEntities(
  body: string,
  pattern: RegExp,
  kind: PreviewEntityRange['kind'],
  nativeTag: boolean,
): PreviewEntityRange[] {
  const entities: PreviewEntityRange[] = [];
  for (const match of body.matchAll(pattern)) {
    const captured = match[1];
    if (captured === undefined || match.index === undefined) {
      continue;
    }
    entities.push({
      kind,
      offset: match.index + match[0].length - captured.length,
      length: captured.length,
      display: captured,
      externalId: null,
      nativeTag,
    });
  }
  return entities;
}

function aspectRatioOf(media: ProviderMedia): number | null {
  if (media.width === null || media.height === null || media.height === 0) {
    return null;
  }
  return media.width / media.height;
}

function previewMedia(media: readonly ProviderMedia[]): CanonicalPreview['mediaItems'] {
  return media.map((item) => ({
    mediaId: item.mediaId,
    kind: item.kind,
    aspectRatio: aspectRatioOf(item),
    thumbnailUrl: item.sourceUrl,
    altText: item.altText,
  }));
}

function disclosureLabelKeys(draft: ProviderDraft): string[] {
  const keys: string[] = [];
  if (draft.disclosure.aiAssisted) {
    keys.push('disclosure.aiAssisted.label');
  }
  if (draft.disclosure.commercialContent) {
    keys.push('disclosure.commercialContent.label');
  }
  if (draft.disclosure.brandedContent) {
    keys.push('disclosure.brandedContent.label');
  }
  return keys;
}

/** Build the preview every adapter returns, with provider specific bits passed in. */
export function buildPreview(
  draft: ProviderDraft,
  snapshot: CapabilitySnapshot,
  options: PreviewOptions,
): CanonicalPreview {
  const counting = { unit: options.unit, linkCounting: snapshot.text.linkCounting };
  // A stored mention carries no offset, so the exact slice is located in the body.
  const resolvedMentions: PreviewEntityRange[] = draft.mentions.flatMap((mention) => {
    const at = mentionOffset(draft.body, mention);
    if (at === null) {
      return [];
    }
    return [
      {
        kind: 'mention' as const,
        offset: at.offset,
        length: at.length,
        display: mention.displayLabel,
        externalId: mention.externalId,
        nativeTag: mention.resolvedToExternalId,
      },
    ];
  });
  const resolvedOffsets = new Set(resolvedMentions.map((mention) => mention.offset));
  // A plain `@handle` the provider resolves when it renders is not a stored entity. It is
  // reported with `nativeTag: false` so the composer can label it as plain text.
  const handleEntities = options.resolvesMentionsAtRender
    ? captureEntities(draft.body, HANDLE_PATTERN, 'mention', false).filter(
        (entity) => !resolvedOffsets.has(entity.offset),
      )
    : [];

  const entities = [
    ...linkEntities(draft.body, options.linkRendering),
    ...captureEntities(draft.body, HASHTAG_PATTERN, 'hashtag', true),
    ...resolvedMentions,
    ...handleEntities,
  ].sort((left, right) => left.offset - right.offset);

  const urls = detectUrls(draft.body);
  const firstUrl = urls[0];
  const used = countText(draft.body, counting);
  const atIndex = truncationIndex(draft.body, snapshot.text.maxLength, counting);
  const linkCounting = snapshot.text.linkCounting;

  return {
    provider: snapshot.provider,
    accountType: draft.connection.accountType,
    connectionId: draft.connection.connectionId,
    authorDisplayName: draft.connection.displayName,
    authorHandle: connectionMetadataString(draft.connection, 'handle'),
    authorAvatarUrl: connectionMetadataString(draft.connection, 'avatarUrl'),
    renderedText: draft.body,
    entities,
    counter: {
      used,
      limit: snapshot.text.maxLength,
      remaining: snapshot.text.maxLength - used,
      unit: options.unit,
    },
    truncation: { willTruncate: atIndex !== null, atIndex },
    mediaLayout: draft.media.length === 0 ? 'none' : options.mediaLayout,
    mediaItems: previewMedia(draft.media),
    linkCard:
      firstUrl === undefined || options.linkRendering === 'none'
        ? null
        : {
            url: firstUrl.url,
            rendered: options.linkRendering === 'card',
            titleFrom: options.linkRendering === 'card' ? 'provider_unfurl' : 'none',
            consumesCharacters:
              linkCounting.mode === 'fixed' && linkCounting.charactersPerLink !== null
                ? linkCounting.charactersPerLink
                : linkCounting.mode === 'actual'
                  ? firstUrl.length
                  : 0,
          },
    destinationLabel: draft.destination === null ? null : draft.destination.displayLabel,
    privacyLabelKey: options.privacyLabelKey,
    disclosureLabelKeys: disclosureLabelKeys(draft),
    threadItems: draft.threadItems.map((item) => ({
      order: item.order,
      renderedText: item.body,
      delaySeconds: item.delaySeconds,
      mediaItems: previewMedia(item.media),
    })),
    noticeKeys: [...options.warningKeys],
  };
}
