import { detectUrls } from '../shared/text.js';

/**
 * AT Protocol rich text facets.
 *
 * Facets index into the **UTF-8 byte** offsets of the post text, not into JavaScript string
 * indices. Getting this wrong shifts every link and mention in a post containing an emoji
 * or any non-ASCII character, so the conversion is explicit and tested.
 */

export interface FacetIndex {
  readonly byteStart: number;
  readonly byteEnd: number;
}

export interface FacetFeature {
  readonly $type: string;
  readonly uri?: string;
  readonly did?: string;
  readonly tag?: string;
}

export interface Facet {
  readonly index: FacetIndex;
  readonly features: readonly FacetFeature[];
}

const encoder = new TextEncoder();

/** The UTF-8 byte offset of a UTF-16 string index. */
export function byteOffsetOf(text: string, stringIndex: number): number {
  return encoder.encode(text.slice(0, stringIndex)).length;
}

export function byteLength(text: string): number {
  return encoder.encode(text).length;
}

export interface ResolvedMention {
  readonly did: string;
  readonly offset: number;
  readonly length: number;
}

const TAG_PATTERN = /(?:^|\s)(#[\p{L}\p{N}_]{1,64})/gu;

/**
 * Build the facet list for a post: links, resolved mentions and hashtags. A mention we did
 * not resolve to a DID is deliberately absent, because a display string must never
 * masquerade as a native tag.
 */
export function buildFacets(text: string, mentions: readonly ResolvedMention[]): Facet[] {
  const facets: Facet[] = [];

  for (const url of detectUrls(text)) {
    facets.push({
      index: {
        byteStart: byteOffsetOf(text, url.offset),
        byteEnd: byteOffsetOf(text, url.offset + url.length),
      },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url.url }],
    });
  }

  for (const mention of mentions) {
    facets.push({
      index: {
        byteStart: byteOffsetOf(text, mention.offset),
        byteEnd: byteOffsetOf(text, mention.offset + mention.length),
      },
      features: [{ $type: 'app.bsky.richtext.facet#mention', did: mention.did }],
    });
  }

  for (const match of text.matchAll(TAG_PATTERN)) {
    const tag = match[1];
    if (tag === undefined || match.index === undefined) {
      continue;
    }
    const start = match.index + match[0].length - tag.length;
    facets.push({
      index: {
        byteStart: byteOffsetOf(text, start),
        byteEnd: byteOffsetOf(text, start + tag.length),
      },
      features: [{ $type: 'app.bsky.richtext.facet#tag', tag: tag.slice(1) }],
    });
  }

  return facets.sort((left, right) => left.index.byteStart - right.index.byteStart);
}
