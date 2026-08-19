import { describe, expect, it } from 'vitest';

import {
  PUBLISHING_LIMITS,
  PUBLISHING_LIMIT_PROVIDERS,
} from '@/features/marketing/data/publishing-limits';

import {
  CHARACTER_COUNTER_PAGES,
  CHARACTER_COUNTER_SLUGS,
  findCharacterCounterPage,
  linkRule,
  measurePost,
  type CharacterCounterPage,
} from './character-counter';
import { countGraphemes } from './text-count';

/**
 * The counters, and the one rule they exist to get right.
 *
 * A character counter is only worth publishing if it counts what the platform
 * counts. On X that is not the length of the text: every URL is rewritten to
 * the platform shortener before the post is measured, so a link costs a flat
 * width and a post can be hundreds of literal characters past the ceiling and
 * still publish. A counter that reported the literal length would tell a person
 * to cut a sentence they did not have to cut.
 *
 * Every number below is read from the generated dataset rather than typed into
 * the test, so a regenerated dataset that changed X's per link width would fail
 * here rather than quietly ship a wrong count.
 */

function counter(slug: string): CharacterCounterPage {
  const page = findCharacterCounterPage(slug);
  if (!page) {
    throw new Error(`no character counter page for ${slug}`);
  }
  return page;
}

/** Comfortably longer than the flat width X charges for it. */
const LONG_URL = 'https://example.test/a-path-that-is-far-longer-than-twenty-three-characters';

describe('which platforms get a counter', () => {
  it('publishes one page per platform with a recorded body ceiling, in cohort order', () => {
    const expected = PUBLISHING_LIMIT_PROVIDERS.filter((provider) => {
      const text = PUBLISHING_LIMITS[provider].text;
      return text !== null && text.maxLength > 0;
    });

    expect(CHARACTER_COUNTER_PAGES.map((page) => page.provider)).toEqual([...expected]);
    expect(CHARACTER_COUNTER_PAGES.length).toBeGreaterThan(0);
  });

  it('publishes no page for a platform this build ships no adapter for', () => {
    expect(PUBLISHING_LIMITS.google_business_profile.adapterPresent).toBe(false);
    expect(PUBLISHING_LIMITS.google_business_profile.text).toBeNull();
    expect(CHARACTER_COUNTER_SLUGS).not.toContain('google-business-profile');
    expect(findCharacterCounterPage('google-business-profile')).toBeUndefined();
  });

  it('carries the ceiling, the unit and the link rule from the dataset', () => {
    for (const page of CHARACTER_COUNTER_PAGES) {
      const limits = PUBLISHING_LIMITS[page.provider];
      expect(page.maxLength, page.slug).toBe(limits.text?.maxLength);
      expect(page.countingUnit, page.slug).toBe(limits.countingUnit);
      expect(page.linkCountingMode, page.slug).toBe(limits.text?.linkCountingMode);
      expect(page.charactersPerLink, page.slug).toBe(limits.text?.charactersPerLink ?? null);
      expect(page.source, page.slug).toBe(limits.source);
    }
  });

  it('never reports a fixed link rule without the width that makes it a sentence', () => {
    for (const page of CHARACTER_COUNTER_PAGES) {
      if (linkRule(page) === 'fixed') {
        expect(page.charactersPerLink, page.slug).not.toBeNull();
      }
    }
  });
});

describe('X counts a link at its rewritten width', () => {
  const x = counter('x');

  it('reads the flat width from the dataset rather than restating it', () => {
    expect(PUBLISHING_LIMITS.x.text?.linkCountingMode).toBe('fixed');
    expect(PUBLISHING_LIMITS.x.text?.charactersPerLink).toBe(23);
    expect(x.maxLength).toBe(280);
    expect(x.charactersPerLink).toBe(23);
    expect(linkRule(x)).toBe('fixed');
  });

  it('charges one link exactly the flat width, not the characters it occupies', () => {
    expect(countGraphemes(LONG_URL)).toBeGreaterThan(23);

    const result = measurePost(`Read this: ${LONG_URL}`, x);

    expect(result.count).toBe('Read this: '.length + 23);
    expect(result.linkCount).toBe(1);
    expect(result.linkCost).toBe(23);
  });

  it('charges every link separately', () => {
    const result = measurePost(`${LONG_URL} ${LONG_URL}`, x);

    expect(result.count).toBe(23 + 1 + 23);
    expect(result.linkCount).toBe(2);
  });

  it('lets a post fit that is literally far past the ceiling', () => {
    const body = `${'a'.repeat(240)} ${LONG_URL}`;

    expect(countGraphemes(body)).toBeGreaterThan(280);

    const result = measurePost(body, x);

    expect(result.count).toBe(240 + 1 + 23);
    expect(result.over).toBe(0);
    expect(result.remaining).toBe(280 - 264);
    expect(result.status).toBe('pass');
  });

  it('weights a non-Latin character as two, which is what X documents', () => {
    expect(x.countingUnit).toBe('weighted');
    expect(measurePost('日本', x).count).toBe(4);
    expect(measurePost('ab', x).count).toBe(2);
  });
});

describe('a platform that counts links as written', () => {
  const instagram = counter('instagram');

  it('charges the URL its real length', () => {
    expect(instagram.linkCountingMode).toBe('actual');
    expect(instagram.charactersPerLink).toBeNull();

    const result = measurePost(LONG_URL, instagram);

    expect(result.count).toBe(countGraphemes(LONG_URL));
    expect(result.linkCost).toBeNull();
    expect(result.linkCount).toBe(1);
  });

  it('counts an emoji as one character, the way a reader counts it', () => {
    expect(instagram.countingUnit).toBe('grapheme');
    expect(measurePost('\u{1F44D}', instagram).count).toBe(1);
  });
});

describe('the state a counter reports', () => {
  const x = counter('x');

  it('fits quietly while there is room', () => {
    const result = measurePost('a'.repeat(100), x);

    expect(result.status).toBe('pass');
    expect(result.remaining).toBe(180);
    expect(result.over).toBe(0);
    expect(result.usedFraction).toBeCloseTo(100 / 280);
  });

  it('warns inside the last five percent of the ceiling', () => {
    expect(measurePost('a'.repeat(270), x).status).toBe('warning');
  });

  it('fails past the ceiling and says by how much', () => {
    const result = measurePost('a'.repeat(281), x);

    expect(result.status).toBe('fail');
    expect(result.over).toBe(1);
    expect(result.remaining).toBe(-1);
  });

  it('caps the used share at one, so a bar cannot run off its track', () => {
    expect(measurePost('a'.repeat(1000), x).usedFraction).toBe(1);
  });

  it('leaves an empty post at rest rather than warning about nothing', () => {
    const result = measurePost('', x);

    expect(result.status).toBe('pass');
    expect(result.count).toBe(0);
    expect(result.usedFraction).toBe(0);
    expect(result.linkCount).toBe(0);
  });
});
