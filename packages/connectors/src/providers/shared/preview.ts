import type { CapabilitySnapshot } from '@relay/contracts';

import type { CanonicalPreview, PreviewEntityRange, ProviderDraft } from './contract-shape.js';
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
    label: url.url,
    externalId: null,
    native: true,
  }));
}

function captureEntities(
  body: string,
  pattern: RegExp,
  kind: PreviewEntityRange['kind'],
  native: boolean,
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
      label: captured,
      externalId: null,
      native,
    });
  }
  return entities;
}

/** Build the preview every adapter returns, with provider specific bits passed in. */
export function buildPreview(
  draft: ProviderDraft,
  snapshot: CapabilitySnapshot,
  options: PreviewOptions,
): CanonicalPreview {
  const counting = { unit: options.unit, linkCounting: snapshot.text.linkCounting };
  const resolvedMentions: PreviewEntityRange[] = draft.mentions.map((mention) => ({
    kind: 'mention' as const,
    offset: mention.offset,
    length: mention.length,
    label: mention.displayLabel,
    externalId: mention.externalId,
    native: true,
  }));
  const resolvedOffsets = new Set(resolvedMentions.map((mention) => mention.offset));
  // A plain `@handle` the provider resolves when it renders is not a stored entity. It is
  // reported with `native: false` so the composer can label it as plain text.
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

  return {
    provider: snapshot.provider,
    connectionId: draft.connection.connectionId,
    accountType: draft.connection.accountType,
    renderedText: draft.body,
    entities,
    characterCount: countText(draft.body, counting),
    characterLimit: snapshot.text.maxLength,
    truncationIndex: truncationIndex(draft.body, snapshot.text.maxLength, counting),
    media: draft.media.map((item) => ({
      mediaId: item.mediaId,
      kind: item.kind,
      altText: item.altText,
      width: item.width,
      height: item.height,
    })),
    mediaLayout: draft.media.length === 0 ? 'none' : options.mediaLayout,
    linkCard:
      firstUrl === undefined || options.linkRendering === 'none'
        ? null
        : { url: firstUrl.url, renderedAs: options.linkRendering },
    destinationLabel: draft.destination === null ? null : draft.destination.label,
    privacyLabelKey: options.privacyLabelKey,
    sequence: draft.threadItems.map((item) => ({
      kind: item.kind,
      order: item.order,
      renderedText: item.body,
      delaySeconds: item.delaySeconds,
    })),
    warningKeys: [...options.warningKeys],
  };
}
