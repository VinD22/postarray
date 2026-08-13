import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * The scene budget.
 *
 * This file is the mechanism that makes "loud, but no spamming" a property of
 * the codebase rather than a promise in a design doc. It matters more than any
 * individual animation in the scene vocabulary, and it should outlive all of
 * them.
 *
 * Background: this product previously had a loud visual system — hover-lift
 * poster cards, rotating stickers, logo marquees, torn-paper dividers — and
 * deleted it, because it was sprayed rather than spent. `editorial/
 * inverted-band.test.ts` still holds the empty allow-list that keeps that
 * vocabulary dead. The scene vocabulary is the second attempt, and the thing
 * that makes it a different attempt is this file: every loud device has a
 * per-page ceiling, the ceilings are small, and a page cannot quietly acquire
 * a third band because someone was in a hurry.
 *
 * It is a source census, for the same reason the inverted-band guard is one:
 * React Server Components render concurrently across requests, so a
 * module-level tally would be shared state between two visitors' pages, and a
 * React context would only see the subtree it wraps rather than the sibling
 * sections returned from the same page.
 *
 * WHEN THIS TEST FAILS, THE PAGE IS OVER BUDGET. Take a device out. The
 * override table below exists to record a deliberate, argued exception for one
 * page, not to be nudged upward until the test is green again — and
 * `VOCABULARY_CEILING` makes that structural: no override, present or future,
 * may exceed the vocabulary's own maximum.
 */

// Built with `join`, not `new URL`: the route segments contain `[` and `(`,
// which a URL would percent-encode into a path that does not exist on disk.
const HERE = dirname(fileURLToPath(import.meta.url));
const MARKETING_DIR = join(HERE, '../../../../app/[locale]/(marketing)');
const SRC_DIR = join(HERE, '../../../..');

interface SceneBudget {
  /** Pinned, scroll-scrubbed scenes. One per page: two means two pins fighting. */
  readonly scrollScene: number;
  /** Tinted full-width bands in a scene accent family. */
  readonly colorBand: number;
  /** Infinitely looping horizontal tracks. */
  readonly marquee: number;
  /** Auto-advancing looping product tours. */
  readonly sceneSequencer: number;
}

/**
 * The vocabulary's own maximum. Not a per-page allowance — the largest number
 * any page may ever be granted, for any reason, by any override.
 *
 * These are the numbers the scene vocabulary was designed around: one pin per
 * viewport (see the performance budget in `components/motion/README.md`), two
 * tinted bands before a page reads as a colour swatch rather than a document,
 * one marquee before motion stops being punctuation, one tour per page because
 * a page with two auto-advancing sequences has no focal point at all.
 */
const VOCABULARY_CEILING: SceneBudget = {
  scrollScene: 1,
  colorBand: 2,
  marquee: 1,
  sceneSequencer: 1,
};

/**
 * What an ordinary marketing page gets without arguing for more. Deliberately
 * below the ceiling: most pages are documents, and a document that reaches for
 * a marquee is usually avoiding an editing decision.
 */
const DEFAULT_BUDGET: SceneBudget = {
  scrollScene: 1,
  colorBand: 1,
  marquee: 0,
  sceneSequencer: 1,
};

/**
 * Per-page overrides, each with the argument for it written down. A page path
 * is relative to the marketing route directory.
 *
 * Adding a row here is a design decision that a reviewer can disagree with,
 * which is the point. Every value is still capped by `VOCABULARY_CEILING`.
 */
const PAGE_BUDGET: Readonly<Record<string, Partial<SceneBudget>>> = {
  // Home is the only page whose job is to be a demonstration rather than a
  // document, so it is the one page allowed the full vocabulary at once: a
  // second tinted band to separate the demonstration from the proof, and the
  // single marquee (the connector row) that is genuinely a list too long to
  // read all at once.
  'page.tsx': { colorBand: 2, marquee: 1 },

  // The product page carries a second band for the same reason home does: it
  // has two distinct halves (what it does / what it costs you to switch) and
  // the band is what tells a scanner they have crossed between them.
  'product/page.tsx': { colorBand: 2 },
};

const COMPONENT_PATTERNS: Readonly<Record<keyof SceneBudget, RegExp>> = {
  // `[\s/>]` so `<ScrollSceneFrame` is not counted as a `<ScrollScene`.
  scrollScene: /<ScrollScene[\s/>]/g,
  colorBand: /<ColorBand[\s/>]/g,
  marquee: /<Marquee[\s/>]/g,
  sceneSequencer: /<SceneSequencer[\s/>]/g,
};

const BUDGET_KEYS = Object.keys(COMPONENT_PATTERNS) as (keyof SceneBudget)[];

function countMatches(source: string, pattern: RegExp): number {
  return source.match(pattern)?.length ?? 0;
}

function budgetFor(page: string): SceneBudget {
  return { ...DEFAULT_BUDGET, ...PAGE_BUDGET[page] };
}

/** Every `page.tsx` under the marketing route tree, relative to it. */
async function marketingPages(root: string, prefix = ''): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const found: string[] = [];
  for (const entry of entries) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      found.push(...(await marketingPages(`${root}/${entry.name}`, relative)));
      continue;
    }
    if (entry.name === 'page.tsx') found.push(relative);
  }
  return found.sort();
}

/**
 * Discovered rather than listed, unlike the inverted-band guard's explicit
 * `MIGRATED_PAGES`. That guard is a migration tracker, so it names the pages it
 * has reached; this one is a ceiling, so a page added tomorrow has to be under
 * budget on the day it lands rather than on the day someone remembers to add it
 * to a list.
 */
const PAGES = await marketingPages(MARKETING_DIR);

describe('the scene budget', () => {
  it('finds the marketing pages it is supposed to be policing', () => {
    // A refactor that moves the route tree would otherwise turn this whole
    // file into a green no-op.
    expect(PAGES.length).toBeGreaterThan(10);
    expect(PAGES).toContain('page.tsx');
  });

  it.each(BUDGET_KEYS)('never grants any page more %s than the vocabulary allows', (key) => {
    for (const [page, override] of Object.entries(PAGE_BUDGET)) {
      const granted = override[key];
      if (granted === undefined) continue;
      expect(
        granted,
        `${page} is granted ${granted} ${key}, above the vocabulary ceiling of ` +
          `${VOCABULARY_CEILING[key]}. Raising the ceiling is a redesign, not a budget edit.`,
      ).toBeLessThanOrEqual(VOCABULARY_CEILING[key]);
    }
  });

  it('overrides only pages that exist', async () => {
    // An override for a deleted page is a rule nobody is reading any more.
    const pages = await marketingPages(MARKETING_DIR);
    for (const page of Object.keys(PAGE_BUDGET)) {
      expect(pages, `${page} has a budget override but no page on disk`).toContain(page);
    }
  });
});

describe('every marketing page stays inside its scene budget', () => {
  it.each(PAGES)('%s', async (page) => {
    const source = await readFile(`${MARKETING_DIR}/${page}`, 'utf8');
    const budget = budgetFor(page);

    const over: string[] = [];
    for (const key of BUDGET_KEYS) {
      const used = countMatches(source, COMPONENT_PATTERNS[key]);
      if (used <= budget[key]) continue;
      over.push(
        `${key}: ${used} used, ${budget[key]} budgeted. Remove one, or add a documented ` +
          `PAGE_BUDGET entry in scene-budget.test.ts arguing why this page needs it ` +
          `(ceiling: ${VOCABULARY_CEILING[key]}).`,
      );
    }

    expect(over.join('\n')).toBe('');
  });
});

describe('ParallaxLayer', () => {
  it('only ever appears inside a ScrollScene', async () => {
    // Parallax outside a pinned scene has nothing to be parallax against: it
    // is drift for its own sake, and drift for its own sake is the failure
    // mode the whole budget exists to prevent. Checked per file rather than
    // per render tree, which is as far as a source census can see — a file
    // that renders a ParallaxLayer must also render the ScrollScene it
    // belongs to.
    const offenders = await filesUsing(SRC_DIR, /<ParallaxLayer[\s/>]/, /<ScrollScene[\s/>]/);
    expect(offenders).toEqual([]);
  });
});

/**
 * Files under `root` that match `pattern` without also matching `requires`.
 *
 * Skips `components/motion` (the primitives define and document each other,
 * and their own tests render them in isolation on purpose) and every test
 * file, which quote the patterns as data.
 */
async function filesUsing(
  root: string,
  pattern: RegExp,
  requires: RegExp,
  prefix = '',
): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const found: string[] = [];
  for (const entry of entries) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      if (relative.endsWith('components/motion')) continue;
      found.push(...(await filesUsing(`${root}/${entry.name}`, pattern, requires, relative)));
      continue;
    }
    if (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) continue;
    if (entry.name.includes('.test.')) continue;
    const source = await readFile(`${root}/${entry.name}`, 'utf8');
    if (pattern.test(source) && !requires.test(source)) found.push(relative);
  }
  return found.sort();
}
