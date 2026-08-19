import { detectUrls } from './text-count';
import { detectHashtags, detectMentions, type DetectedToken } from './social-tokens';

/**
 * The hashtag and mention counter's arithmetic.
 *
 * This module counts what is actually in the post: the total number of
 * hashtags, how many of them are repeats of an earlier one, and the same two
 * numbers for @mentions. It does not compare that count against a platform
 * ceiling.
 *
 * Instagram publishes a hard cap of 30 hashtags on a single post, which is
 * well known, but it is not a number this repository's generated
 * publishing-limits dataset carries: `ProviderLimits` has no hashtag count
 * field today, and every other tool on this site states a number only when it
 * comes from that dataset, beside the official source and the date a person
 * read it. Typing "30" into this file would be exactly the kind of unsourced
 * fact this product refuses to show, so this tool counts and flags duplicates
 * and leaves the ceiling comparison for a page that can cite one.
 */

export interface DuplicateGroup {
  /** The token text as it was first seen, casing preserved for display. */
  readonly text: string;
  /** How many times it appears, counting the first occurrence. */
  readonly count: number;
}

export interface HashtagCountResult {
  readonly hashtags: readonly DetectedToken[];
  readonly mentions: readonly DetectedToken[];
  readonly hashtagCount: number;
  readonly mentionCount: number;
  /** Hashtags left after collapsing case-insensitive repeats. */
  readonly uniqueHashtagCount: number;
  /** Case-insensitive repeats, one entry per repeated hashtag. */
  readonly duplicateHashtags: readonly DuplicateGroup[];
}

/**
 * Group tokens by lowercase text, in order of first appearance, keeping the
 * first seen casing for display and reporting only the groups seen more than
 * once.
 */
function duplicatesOf(tokens: readonly DetectedToken[]): readonly DuplicateGroup[] {
  const order: string[] = [];
  const seen = new Map<string, { readonly text: string; count: number }>();

  for (const token of tokens) {
    const key = token.text.toLocaleLowerCase();
    const existing = seen.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }
    seen.set(key, { text: token.text, count: 1 });
    order.push(key);
  }

  return order
    .map((key) => {
      const entry = seen.get(key);
      return entry === undefined ? null : entry;
    })
    .filter((entry): entry is { readonly text: string; count: number } => entry !== null)
    .filter((entry) => entry.count > 1)
    .map((entry) => ({ text: entry.text, count: entry.count }));
}

export function countHashtagsAndMentions(body: string): HashtagCountResult {
  const urls = detectUrls(body);
  const hashtags = detectHashtags(body, urls);
  const mentions = detectMentions(body, urls);
  const duplicateHashtags = duplicatesOf(hashtags);
  const duplicateHashtagOccurrences = duplicateHashtags.reduce(
    (total, group) => total + (group.count - 1),
    0,
  );

  return {
    hashtags,
    mentions,
    hashtagCount: hashtags.length,
    mentionCount: mentions.length,
    uniqueHashtagCount: hashtags.length - duplicateHashtagOccurrences,
    duplicateHashtags,
  };
}
