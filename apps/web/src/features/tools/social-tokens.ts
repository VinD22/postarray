import { detectUrls, type DetectedUrl } from './text-count';

/**
 * Hashtag and @mention detection, shared by the hashtag counter and the case
 * converter.
 *
 * Both tools need the same answer to the same question: which spans of a post
 * are a hashtag or a mention, so the hashtag counter can count them and the
 * case converter can leave them untouched. A single scanner living here is
 * what keeps the two from quietly drifting onto different definitions of
 * "hashtag".
 *
 * A match is excluded when it falls inside a detected URL. A profile link such
 * as `https://instagram.com/@handle` contains an `@` that is part of the path,
 * not a mention typed into the post, and a search link can contain a literal
 * `#` in its query string. `text-count.ts` already finds URLs for the
 * character counters, so that result is reused rather than re-detected here.
 */

export interface DetectedToken {
  /** Includes the leading `#` or `@`. */
  readonly text: string;
  /** UTF-16 offset of the first character in the body. */
  readonly offset: number;
  /** UTF-16 length of the token as it appears in the body. */
  readonly length: number;
}

// A lookbehind excludes a match that starts mid word, so "price#1" and
// "email@example.com" are not read as a hashtag or a mention that happens to
// follow other text.
const HASHTAG_PATTERN = /(?<![\p{L}\p{N}_])#[\p{L}\p{N}_]+/gu;
const MENTION_PATTERN = /(?<![\p{L}\p{N}_.])@[\p{L}\p{N}_.]+/gu;

function withinAnyUrl(offset: number, urls: readonly DetectedUrl[]): boolean {
  return urls.some((url) => offset >= url.offset && offset < url.offset + url.length);
}

function scan(body: string, pattern: RegExp, urls: readonly DetectedUrl[]): DetectedToken[] {
  const found: DetectedToken[] = [];
  for (const match of body.matchAll(pattern)) {
    const [value] = match;
    if (value === undefined || match.index === undefined) {
      continue;
    }
    if (withinAnyUrl(match.index, urls)) {
      continue;
    }
    found.push({ text: value, offset: match.index, length: value.length });
  }
  return found;
}

/**
 * Every `#hashtag` in the body, in order of appearance.
 *
 * `urls` defaults to a fresh scan of `body`, but a caller that already ran
 * `detectUrls` may pass its result to avoid scanning the same text twice.
 */
export function detectHashtags(
  body: string,
  urls: readonly DetectedUrl[] = detectUrls(body),
): DetectedToken[] {
  return scan(body, HASHTAG_PATTERN, urls);
}

/** Every `@mention` in the body, in order of appearance. */
export function detectMentions(
  body: string,
  urls: readonly DetectedUrl[] = detectUrls(body),
): DetectedToken[] {
  return scan(body, MENTION_PATTERN, urls);
}
