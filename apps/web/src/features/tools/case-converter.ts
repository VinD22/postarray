import { detectUrls } from './text-count';
import { detectHashtags, detectMentions, type DetectedToken } from './social-tokens';

/**
 * Case conversion that never touches a URL, a hashtag or an @mention.
 *
 * A link is case sensitive in its path and query string, a hashtag is how a
 * platform indexes a post, and a mention is somebody's handle. Upper-casing or
 * title-casing straight through the body would silently break all three, so
 * this module finds them first with the same detectors the hashtag counter
 * uses, then transforms only the text between them.
 *
 * "Title Case" here means one fixed rule: capitalize the first letter of every
 * word and lowercase the rest. It does not lowercase short connecting words
 * such as "a" or "of" the way a house style guide might, because that is an
 * editorial choice this tool has no basis to make on a reader's behalf.
 */

export type CaseConversionMode = 'sentence' | 'title' | 'upper' | 'lower';

export const CASE_CONVERSION_MODES: readonly CaseConversionMode[] = [
  'sentence',
  'title',
  'upper',
  'lower',
];

interface Segment {
  readonly text: string;
  /** True for a URL, hashtag or mention: passed through unmodified. */
  readonly protectedSpan: boolean;
}

/**
 * Every protected span in the body, sorted, with overlaps resolved in favour
 * of whichever span was found first: a URL is detected before hashtags and
 * mentions are, so an `@handle` inside a profile URL's path never becomes its
 * own, overlapping mention span.
 */
function protectedSpans(body: string): readonly DetectedToken[] {
  const urls = detectUrls(body);
  const spans: DetectedToken[] = [
    ...urls.map((url) => ({ text: url.url, offset: url.offset, length: url.length })),
    ...detectHashtags(body, urls),
    ...detectMentions(body, urls),
  ].sort((a, b) => a.offset - b.offset);

  const accepted: DetectedToken[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.offset < cursor) {
      continue;
    }
    accepted.push(span);
    cursor = span.offset + span.length;
  }
  return accepted;
}

function toSegments(body: string): readonly Segment[] {
  const spans = protectedSpans(body);
  const segments: Segment[] = [];
  let cursor = 0;

  for (const span of spans) {
    if (span.offset > cursor) {
      segments.push({ text: body.slice(cursor, span.offset), protectedSpan: false });
    }
    segments.push({ text: body.slice(span.offset, span.offset + span.length), protectedSpan: true });
    cursor = span.offset + span.length;
  }
  if (cursor < body.length) {
    segments.push({ text: body.slice(cursor), protectedSpan: false });
  }
  return segments;
}

const WORD_PATTERN = /[\p{L}\p{N}'’]+/gu;

function titleCaseText(text: string): string {
  return text.replace(WORD_PATTERN, (word) => {
    const [first, ...rest] = Array.from(word);
    if (first === undefined) {
      return word;
    }
    return first.toLocaleUpperCase() + rest.join('').toLocaleLowerCase();
  });
}

/**
 * Lowercase every letter, then capitalize the first letter of the text and
 * the first letter after every `.`, `!` or `?`.
 *
 * A protected span is copied through untouched and does not itself satisfy
 * "the next letter": `"@relay just shipped. #v2 is live"` capitalizes "just"
 * and, after the full stop, "is", never the handle or the tag.
 */
function sentenceCaseSegments(segments: readonly Segment[]): string {
  let out = '';
  let expectCapital = true;

  for (const segment of segments) {
    if (segment.protectedSpan) {
      out += segment.text;
      continue;
    }
    for (const character of segment.text) {
      if (/\p{L}/u.test(character)) {
        out += expectCapital ? character.toLocaleUpperCase() : character.toLocaleLowerCase();
        expectCapital = false;
      } else {
        out += character;
        if (character === '.' || character === '!' || character === '?') {
          expectCapital = true;
        }
      }
    }
  }

  return out;
}

export interface CaseConversionResult {
  readonly mode: CaseConversionMode;
  readonly text: string;
  /** Number of URL, hashtag and mention spans left untouched. */
  readonly preservedCount: number;
}

export function convertCase(body: string, mode: CaseConversionMode): CaseConversionResult {
  const segments = toSegments(body);
  const preservedCount = segments.filter((segment) => segment.protectedSpan).length;

  const text = ((): string => {
    switch (mode) {
      case 'upper':
        return segments
          .map((segment) => (segment.protectedSpan ? segment.text : segment.text.toLocaleUpperCase()))
          .join('');
      case 'lower':
        return segments
          .map((segment) => (segment.protectedSpan ? segment.text : segment.text.toLocaleLowerCase()))
          .join('');
      case 'title':
        return segments
          .map((segment) => (segment.protectedSpan ? segment.text : titleCaseText(segment.text)))
          .join('');
      case 'sentence':
        return sentenceCaseSegments(segments);
    }
  })();

  return { mode, text, preservedCount };
}
