/**
 * Composer state to `PreviewModel`.
 *
 * Pure, synchronous and the only place in `previews/` that reads a capability
 * snapshot. Every provider component downstream sees a finished model, so no
 * component can quietly disagree with the snapshot about what a platform
 * allows.
 */

import { resolveVariant, type CapabilitySnapshot, type MediaKind } from '@relay/contracts';

import {
  findUrls,
  mediaLimitFor,
  resolvePublishedUrl,
} from '../state/capability-rules';
import type { ComposerState, TargetAccount, VariantSettings } from '../types';
import { readPreviewCounter } from './counter';
import { presentationFor } from './presentation-rules';
import type { PreviewLink, PreviewMedia, PreviewModel, PreviewThreadItem } from './types';

/** What the media layer knows about one attachment, or that it does not know yet. */
export interface PreviewMediaFacts {
  readonly id: string;
  readonly kind: MediaKind;
  readonly altText: string | null;
  readonly altTextWaived: boolean;
  readonly width: number | null;
  readonly height: number | null;
  readonly durationMs: number | null;
  readonly available: boolean;
  readonly loading: boolean;
  readonly thumbnailUrl: string | null;
}

export interface PreviewMediaLookup {
  /** Null when this id has not been loaded. The preview then renders a skeleton. */
  readonly get: (mediaId: string) => PreviewMediaFacts | null;
}

export interface BuildPreviewModelInput {
  readonly state: ComposerState;
  readonly account: TargetAccount;
  readonly media: PreviewMediaLookup;
  /** Already translated and formatted by the caller. "Just now", or a time. */
  readonly postedAtLabel: string;
}

/** The host part of a URL, without a leading `www.`. Empty when unparsable. */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Which attachments the platform will actually accept, in draft order.
 *
 * Two ceilings apply at once: the per kind maximum from the snapshot, and the
 * total this content kind allows. An attachment past either is kept in the
 * model with `sent: false` so the preview can show it in the "Not sent" strip
 * rather than dropping it and leaving the writer to find out at publish time.
 */
function markSent(
  ids: readonly string[],
  lookup: PreviewMediaLookup,
  snapshot: CapabilitySnapshot,
  totalLimit: number,
): PreviewMedia[] {
  let images = 0;
  let videos = 0;
  let total = 0;

  return ids.map((id) => {
    const facts = lookup.get(id);
    const kind: MediaKind = facts?.kind ?? 'image';
    const isVideo = kind === 'video';
    const kindLimit = isVideo ? snapshot.media.maxVideos : snapshot.media.maxImages;
    const kindUsed = isVideo ? videos : images;
    const sent = kindUsed < kindLimit && total < totalLimit;
    if (sent) {
      total += 1;
      if (isVideo) {
        videos += 1;
      } else {
        images += 1;
      }
    }
    return {
      id,
      kind,
      altText: facts?.altText ?? null,
      altTextWaived: facts?.altTextWaived ?? false,
      width: facts?.width ?? null,
      height: facts?.height ?? null,
      durationMs: facts?.durationMs ?? null,
      sent,
      available: facts?.available ?? true,
      loading: facts === null ? true : facts.loading,
      thumbnailUrl: facts?.thumbnailUrl ?? null,
    } satisfies PreviewMedia;
  });
}

/**
 * The links the platform is given.
 *
 * Title and description are always null. Nothing in the composer fetches a
 * destination's metadata, so a card here shows the domain and only the domain.
 * Inventing a headline would be inventing the post.
 */
function buildLinks(state: ComposerState, body: string): PreviewLink[] {
  const specs = state.master.links;
  const urls =
    specs.length > 0
      ? specs.map((spec) => resolvePublishedUrl(spec) ?? spec.originalUrl)
      : findUrls(body);
  const seen = new Set<string>();
  const links: PreviewLink[] = [];
  for (const url of urls) {
    if (seen.has(url)) {
      continue;
    }
    seen.add(url);
    links.push({ url, domain: domainOf(url), title: null, description: null });
  }
  return links;
}

export function buildPreviewModel(input: BuildPreviewModelInput): PreviewModel {
  const { state, account, media, postedAtLabel } = input;
  const snapshot = account.capabilities;
  const resolved = resolveVariant(state.master, state.overrides[account.connectionId] ?? {});
  const values = resolved.values;
  const settings: VariantSettings | undefined = state.settings[account.connectionId];

  // What the platform receives is the body followed by the signature. The
  // counter below deliberately reads `values.body` alone, because that is what
  // `validate-draft.ts` measures, and a preview that disagreed with the thing
  // blocking the publish would be worse than no counter.
  const text = values.signature
    ? `${values.body}\n\n${values.signature.appliedText}`
    : values.body;

  const totalLimit = mediaLimitFor(snapshot, values.contentKind);
  const threadItems: PreviewThreadItem[] = values.threadItems.map((item) => ({
    id: item.id,
    text: item.body,
    mediaIds: item.mediaIds,
    delaySeconds: item.delaySeconds,
  }));
  const firstLink = values.links[0];

  return {
    provider: account.provider,
    account: {
      displayName: account.displayName,
      handle: account.handle,
      avatarUrl: account.avatarUrl,
    },
    contentKind: values.contentKind,
    kindSupport: snapshot.contentKinds[values.contentKind] ?? 'not_implemented',
    text,
    title: state.master.title,
    links: buildLinks(state, values.body),
    media: markSent(values.mediaIds, media, snapshot, totalLimit),
    threadItems,
    counter: readPreviewCounter(values.body, snapshot),
    presentation: presentationFor(account.provider),
    postedAtLabel,
    showsAltText: snapshot.media.altText === 'supported',
    resolvesMentions: snapshot.mentions.support === 'supported',
    maxThreadItems: Math.max(snapshot.threads.maxItems, snapshot.firstComment.maxItems),
    publishedUrl: firstLink ? resolvePublishedUrl(firstLink) : null,
    destinationLabel: settings?.destination?.displayLabel ?? null,
  };
}
