/**
 * The citation gate.
 *
 * `presentation-rules.ts` is the one file in the preview system that makes
 * claims about how a platform behaves. This suite is what stops a claim being
 * added from memory: every positive claim must sit under a comment carrying
 * the documentation URL it came from, and every provider must resolve to a
 * rule without the registry having to know the provider exists.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROVIDER_IDS } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_PRESENTATION,
  presentationFor,
  providersWithPresentationRules,
} from './presentation-rules';

/** Vitest runs from `apps/web`, so the suite reads the file it is asserting about. */
const PREVIEWS_DIR = join(process.cwd(), 'src/features/composer/previews');
const SOURCE = readFileSync(join(PREVIEWS_DIR, 'presentation-rules.ts'), 'utf8');
const LINES = SOURCE.split('\n');

/** True when one of the four lines above `index` carries a documentation URL. */
function citedAbove(index: number): boolean {
  return LINES.slice(Math.max(index - 4, 0), index).some(
    (line) => line.includes('//') && line.includes('https://'),
  );
}

describe('presentation rules', () => {
  it('cites a documentation URL for every claim that a platform shows a link card', () => {
    const uncited = LINES.map((line, index) => ({ line, index }))
      .filter(({ line }) => /^\s*linkCard: '(large|compact)',/.test(line))
      .filter(({ index }) => !citedAbove(index))
      .map(({ index }) => index + 1);
    expect(uncited).toEqual([]);
  });

  it('cites a documentation URL for every claim that a platform has its own title', () => {
    const uncited = LINES.map((line, index) => ({ line, index }))
      .filter(({ line }) => /^\s*showsTitle: true,/.test(line))
      .filter(({ index }) => !citedAbove(index))
      .map(({ index }) => index + 1);
    expect(uncited).toEqual([]);
  });

  it('states no collapse threshold, because none is published', () => {
    expect(SOURCE).not.toMatch(/afterChars: \d/);
    expect(SOURCE).not.toMatch(/afterLines: \d/);
    for (const provider of PROVIDER_IDS) {
      expect(presentationFor(provider).collapse).toBeNull();
    }
  });

  it('gives every provider a rule, and an unknown one the cautious default', () => {
    for (const provider of PROVIDER_IDS) {
      const rule = presentationFor(provider);
      expect(rule.mobileWidth).toBe(360);
      expect(rule.desktopWidth).toBeGreaterThan(rule.mobileWidth);
    }
    expect(presentationFor('fake')).toBe(DEFAULT_PRESENTATION);
    expect(DEFAULT_PRESENTATION.linkCard).toBeNull();
    expect(DEFAULT_PRESENTATION.showsTitle).toBe(false);
  });

  it('carries a sourced rule for each of the ten providers section A names', () => {
    const named = [
      'x',
      'instagram',
      'linkedin',
      'facebook',
      'threads',
      'bluesky',
      'tiktok',
      'youtube',
      'pinterest',
      'mastodon',
    ];
    expect([...providersWithPresentationRules()].sort()).toEqual([...named].sort());
  });
});
