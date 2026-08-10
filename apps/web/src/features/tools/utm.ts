/**
 * UTM composition.
 *
 * The whole job is to not damage a URL that already works. Two things break
 * hand-rolled builders: string concatenation with a question mark, which
 * produces a second query string on a URL that already had one, and naive
 * encoding, which either double encodes an already encoded value or leaves a
 * space unencoded so the link dies when it is pasted into a post.
 *
 * `URL` and `URLSearchParams` handle both, so this module only decides which
 * parameters to set and in what order, and never builds a URL by hand.
 */

export const UTM_FIELDS = ['source', 'medium', 'campaign', 'term', 'content'] as const;
export type UtmField = (typeof UTM_FIELDS)[number];

export type UtmValues = Readonly<Partial<Record<UtmField, string>>>;

/** The canonical parameter name for a field. */
export function utmParameterName(field: UtmField): string {
  return `utm_${field}`;
}

export interface UtmComposition {
  /** The composed URL, or null when the destination did not parse. */
  readonly url: string | null;
  /** True when the destination already carried a non-UTM query string. */
  readonly preservedExistingQuery: boolean;
  /** UTM parameters that were already present and have been replaced. */
  readonly replaced: readonly UtmField[];
}

function isHttpUrl(value: URL): boolean {
  return value.protocol === 'http:' || value.protocol === 'https:';
}

/**
 * Compose a tagged URL.
 *
 * An empty or whitespace-only value is treated as "not set" and never written,
 * so a half-filled form does not produce `utm_term=` in the result.
 */
export function composeUtmUrl(destination: string, values: UtmValues): UtmComposition {
  const trimmed = destination.trim();
  if (trimmed === '') {
    return { url: null, preservedExistingQuery: false, replaced: [] };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { url: null, preservedExistingQuery: false, replaced: [] };
  }
  if (!isHttpUrl(parsed)) {
    return { url: null, preservedExistingQuery: false, replaced: [] };
  }

  const utmNames = new Set(UTM_FIELDS.map(utmParameterName));
  const preservedExistingQuery = [...parsed.searchParams.keys()].some(
    (name) => !utmNames.has(name),
  );

  const replaced: UtmField[] = [];
  for (const field of UTM_FIELDS) {
    const name = utmParameterName(field);
    const value = values[field]?.trim() ?? '';
    if (value === '') {
      continue;
    }
    if (parsed.searchParams.has(name)) {
      replaced.push(field);
    }
    // `set` replaces every existing occurrence and appends when absent, which
    // keeps the order of the parameters that were already there.
    parsed.searchParams.set(name, value);
  }

  return { url: parsed.toString(), preservedExistingQuery, replaced };
}
