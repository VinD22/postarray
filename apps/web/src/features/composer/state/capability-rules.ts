/**
 * Everything the composer knows about a platform comes from here, and
 * everything here comes from the versioned capability snapshot for one
 * connection. There is no hard-coded "280" anywhere in this feature, because
 * the limit differs by account type on the same provider.
 */

import type {
  CapabilitySnapshot,
  ContentKind,
  DestinationKind,
  LinkSpec,
  MediaKind,
} from '@relay/contracts';

/** Matches an absolute http(s) URL. Deliberately conservative. */
const URL_PATTERN = /https?:\/\/[^\s<>"')]+/g;

export function findUrls(text: string): string[] {
  return text.match(URL_PATTERN) ?? [];
}

/**
 * The character count the provider itself would compute.
 *
 * X charges a fixed cost per link whatever its length, Bluesky counts graphemes
 * as written. `linkCounting.mode` records which, so the counter beside the
 * field matches the counter the platform will apply.
 */
export function countCharacters(text: string, snapshot: CapabilitySnapshot): number {
  const graphemes = [...text].length;
  const { mode, charactersPerLink } = snapshot.text.linkCounting;
  if (mode !== 'fixed' || charactersPerLink === null) {
    return graphemes;
  }
  let total = graphemes;
  for (const url of findUrls(text)) {
    total = total - [...url].length + charactersPerLink;
  }
  return Math.max(total, 0);
}

export interface CounterReading {
  readonly used: number;
  readonly limit: number;
  readonly remaining: number;
  readonly level: 'ok' | 'near' | 'over';
}

/** At 90% the counter warns. Over the limit it blocks. */
export function readCounter(text: string, snapshot: CapabilitySnapshot): CounterReading {
  const limit = snapshot.text.maxLength;
  const used = countCharacters(text, snapshot);
  const remaining = limit - used;
  const level = used > limit ? 'over' : used >= limit * 0.9 ? 'near' : 'ok';
  return { used, limit, remaining, level };
}

/** Total attachments this connection accepts for the given post type. */
export function mediaLimitFor(snapshot: CapabilitySnapshot, kind: ContentKind): number {
  if (kind === 'video' || kind === 'short_video' || kind === 'long_video') {
    return snapshot.media.maxVideos;
  }
  if (kind === 'text') {
    return Math.max(snapshot.media.maxImages, snapshot.media.maxVideos);
  }
  return snapshot.media.maxImages;
}

export function acceptsMimeType(snapshot: CapabilitySnapshot, mimeType: string): boolean {
  return snapshot.media.allowedMimeTypes.includes(mimeType);
}

export function maxBytesFor(snapshot: CapabilitySnapshot, kind: MediaKind): number | null {
  return snapshot.media.maxBytesByKind[kind] ?? null;
}

/** Destination kinds this connection actually offers, with their support level. */
export function destinationFor(
  snapshot: CapabilitySnapshot,
): { kind: DestinationKind; support: string; searchable: boolean } | null {
  const usable = snapshot.destinations.find((entry) => entry.kind !== 'none');
  if (!usable) {
    return null;
  }
  return { kind: usable.kind, support: usable.support, searchable: usable.searchable };
}

/** Whether a URL may appear in the body at all for this connection. */
export function allowsLinkInBody(snapshot: CapabilitySnapshot): boolean {
  return snapshot.text.linkCounting.mode !== 'none';
}

export type IncompatibilityCode =
  | 'text_too_long'
  | 'link_not_allowed'
  | 'media_count_exceeded'
  | 'media_kind_unsupported'
  | 'thread_unsupported'
  | 'markdown_unsupported';

export interface Incompatibility {
  readonly code: IncompatibilityCode;
  readonly params: Readonly<Record<string, string | number>>;
}

const MARKDOWN_PATTERN = /(\*\*|__|^#{1,6}\s|\[[^\]]+]\([^)]+\))/m;

/**
 * Why a candidate body cannot land on this connection unchanged.
 *
 * Returning the reasons rather than a boolean is the point: the global edit
 * panel names the account and the number, so nothing is ever silently dropped.
 */
export function checkBodyCompatibility(
  body: string,
  snapshot: CapabilitySnapshot,
): Incompatibility[] {
  const reasons: Incompatibility[] = [];
  const reading = readCounter(body, snapshot);
  if (reading.level === 'over') {
    reasons.push({
      code: 'text_too_long',
      params: { limit: reading.limit, actual: reading.used },
    });
  }
  if (findUrls(body).length > 0 && !allowsLinkInBody(snapshot)) {
    reasons.push({ code: 'link_not_allowed', params: {} });
  }
  if (MARKDOWN_PATTERN.test(body) && !snapshot.text.supportsMarkdown) {
    reasons.push({ code: 'markdown_unsupported', params: {} });
  }
  return reasons;
}

export interface MediaFacts {
  readonly id: string;
  readonly name: string | null;
  readonly mimeType: string;
  readonly kind: MediaKind;
  readonly bytes: number;
}

export function checkMediaCompatibility(
  media: readonly MediaFacts[],
  snapshot: CapabilitySnapshot,
  kind: ContentKind,
): Incompatibility[] {
  const reasons: Incompatibility[] = [];
  const limit = mediaLimitFor(snapshot, kind);
  if (media.length > limit) {
    reasons.push({
      code: 'media_count_exceeded',
      params: { limit, actual: media.length },
    });
  }
  for (const file of media) {
    if (!acceptsMimeType(snapshot, file.mimeType)) {
      reasons.push({
        code: 'media_kind_unsupported',
        params: { mimeType: file.mimeType, name: file.name ?? file.mimeType },
      });
    }
  }
  return reasons;
}

export function checkSequenceCompatibility(
  itemCount: number,
  snapshot: CapabilitySnapshot,
): Incompatibility[] {
  if (itemCount === 0) {
    return [];
  }
  const supported =
    snapshot.firstComment.support === 'supported' || snapshot.threads.support === 'supported';
  return supported ? [] : [{ code: 'thread_unsupported', params: {} }];
}

/**
 * Trim a body to the exact limit this connection accepts, cutting on a word
 * boundary. Used only to show the user what an incompatible target would get,
 * never applied without an explicit confirmation.
 */
export function adaptBodyFor(body: string, snapshot: CapabilitySnapshot): string {
  let candidate = body;
  if (!allowsLinkInBody(snapshot)) {
    candidate = candidate
      .replace(URL_PATTERN, '')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }
  if (!snapshot.text.supportsMarkdown) {
    candidate = candidate.replace(/\*\*|__/g, '').replace(/^#{1,6}\s/gm, '');
  }
  if (readCounter(candidate, snapshot).level !== 'over') {
    return candidate;
  }
  const graphemes = [...candidate];
  let cut = graphemes.length;
  while (cut > 0 && readCounter(graphemes.slice(0, cut).join(''), snapshot).level === 'over') {
    cut -= 1;
  }
  const trimmed = graphemes.slice(0, cut).join('');
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > cut * 0.6 ? trimmed.slice(0, lastSpace) : trimmed).trimEnd();
}

/** The exact URL a target will publish, given the link plan. */
export function resolvePublishedUrl(link: LinkSpec): string | null {
  if (!link.tracked) {
    return appendUtm(link.originalUrl, link.utm);
  }
  return link.publishedUrl;
}

export function appendUtm(url: string, utm: LinkSpec['utm']): string {
  if (!utm) {
    return url;
  }
  const entries = Object.entries(utm).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0,
  );
  if (entries.length === 0) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  const query = entries.map(([key, value]) => `utm_${key}=${encodeURIComponent(value)}`).join('&');
  return `${url}${separator}${query}`;
}
