import { describe, expect, it } from 'vitest';

import {
  clusterSimilar,
  contentFingerprint,
  isSubstantiallySimilar,
  normalizeForComparison,
  similarityRatio,
} from './similarity.js';

describe('normalizeForComparison', () => {
  it('strips links, mentions, hashtags, punctuation and case', () => {
    expect(
      normalizeForComparison('Hello @acme! Read https://example.com/a?utm=1 #launch'),
    ).toBe('hello read');
  });

  it('is stable under unicode normalisation', () => {
    expect(normalizeForComparison('café')).toBe(normalizeForComparison('café'));
  });
});

describe('similarityRatio', () => {
  it('is 1 for identical text', () => {
    const text = 'The scheduler now handles daylight saving transitions correctly.';
    expect(similarityRatio(text, text)).toBe(1);
  });

  it('is 1 for text that differs only by a tracking parameter', () => {
    const base = 'Read the release notes for the August build of the scheduler';
    expect(
      similarityRatio(`${base} https://acme.com/notes`, `${base} https://acme.com/notes?utm=x`),
    ).toBe(1);
  });

  it('is 0 for unrelated text', () => {
    expect(
      similarityRatio(
        'We are hiring a platform engineer in Berlin this quarter',
        'The capability matrix now documents every connector limit',
      ),
    ).toBe(0);
  });

  it('treats a small suffix on a long post as substantially similar', () => {
    const base =
      'We shipped the new scheduler today and it handles daylight saving transitions properly across every connected account';
    expect(isSubstantiallySimilar(base, `${base} Details`)).toBe(true);
  });
});

describe('contentFingerprint', () => {
  it('collapses formatting differences to one key', () => {
    expect(contentFingerprint('Hello,  world!')).toBe(contentFingerprint('hello world'));
  });

  it('separates genuinely different copy', () => {
    expect(contentFingerprint('one message')).not.toBe(contentFingerprint('another message'));
  });
});

describe('clusterSimilar', () => {
  it('puts unrelated texts in their own clusters', () => {
    const clusters = clusterSimilar([
      'We are hiring a platform engineer in Berlin this quarter',
      'The capability matrix now documents every connector limit',
      'A field report from the customer workshop in Lisbon',
    ]);
    expect(clusters).toHaveLength(3);
  });

  it('groups near duplicates together', () => {
    const base =
      'We shipped the new scheduler today and it handles daylight saving transitions properly across every connected account';
    const clusters = clusterSimilar([base, `${base} Details`, `${base} Notes attached`]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]?.memberIndexes).toEqual([0, 1, 2]);
  });
});
