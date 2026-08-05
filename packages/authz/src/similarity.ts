/**
 * Content similarity, used by the duplicate detector and by the bulk-action
 * escalation in `agent-policy.ts`.
 *
 * Deliberately deterministic and cheap: normalise, shingle, compare. No model,
 * no network, no locale-specific stemming. The same two strings always produce
 * the same number on every surface, which is what lets the composer, the API
 * and the worker agree that two posts are "substantially similar".
 */

const SHINGLE_SIZE = 3;

/**
 * Lowercase, strip URLs, mentions, hashtag markers, punctuation and emoji, and
 * collapse whitespace. Two posts that differ only by a tracking parameter or a
 * trailing hashtag block normalise to the same text.
 */
export function normalizeForComparison(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[@#]\S+/g, ' ')
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): readonly string[] {
  const normalized = normalizeForComparison(text);
  return normalized.length === 0 ? [] : normalized.split(' ');
}

/** Overlapping word n-grams. Falls back to single tokens for very short text. */
export function shingles(text: string, size: number = SHINGLE_SIZE): ReadonlySet<string> {
  const tokens = tokenize(text);
  if (tokens.length === 0) {
    return new Set<string>();
  }
  if (tokens.length < size) {
    return new Set<string>(tokens);
  }
  const output = new Set<string>();
  for (let index = 0; index + size <= tokens.length; index += 1) {
    output.add(tokens.slice(index, index + size).join(' '));
  }
  return output;
}

/** Jaccard overlap of the two shingle sets, in `[0, 1]`. */
export function similarityRatio(left: string, right: string): number {
  const leftSet = shingles(left);
  const rightSet = shingles(right);
  if (leftSet.size === 0 && rightSet.size === 0) {
    return 1;
  }
  if (leftSet.size === 0 || rightSet.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const entry of leftSet) {
    if (rightSet.has(entry)) {
      intersection += 1;
    }
  }
  const union = leftSet.size + rightSet.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * A stable fingerprint of the normalised text. Equal fingerprints mean an exact
 * duplicate after normalisation; near duplicates need `similarityRatio`.
 *
 * FNV-1a over the normalised bytes, rendered as 16 lowercase hex characters. It
 * is a dedupe key, never a security primitive.
 */
export function contentFingerprint(text: string): string {
  const normalized = normalizeForComparison(text);
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  const bytes = new TextEncoder().encode(normalized);
  for (const byte of bytes) {
    hash = ((hash ^ BigInt(byte)) * prime) & mask;
  }
  return hash.toString(16).padStart(16, '0');
}

/** The default above which two posts count as substantially similar. */
export const SUBSTANTIAL_SIMILARITY_THRESHOLD = 0.8;

export function isSubstantiallySimilar(
  left: string,
  right: string,
  threshold: number = SUBSTANTIAL_SIMILARITY_THRESHOLD,
): boolean {
  return similarityRatio(left, right) >= threshold;
}

export interface SimilarityCluster {
  readonly fingerprint: string;
  readonly memberIndexes: readonly number[];
}

/**
 * Group texts that are substantially similar to one another. Single-linkage:
 * a text joins the first cluster any member of which it matches, which is the
 * conservative direction for a safety check.
 */
export function clusterSimilar(
  texts: readonly string[],
  threshold: number = SUBSTANTIAL_SIMILARITY_THRESHOLD,
): readonly SimilarityCluster[] {
  const clusters: { fingerprint: string; memberIndexes: number[] }[] = [];
  texts.forEach((text, index) => {
    const existing = clusters.find((cluster) =>
      cluster.memberIndexes.some((member) => {
        const other = texts[member];
        return other !== undefined && isSubstantiallySimilar(text, other, threshold);
      }),
    );
    if (existing === undefined) {
      clusters.push({ fingerprint: contentFingerprint(text), memberIndexes: [index] });
    } else {
      existing.memberIndexes.push(index);
    }
  });
  return clusters.map((cluster) => ({
    fingerprint: cluster.fingerprint,
    memberIndexes: [...cluster.memberIndexes],
  }));
}
