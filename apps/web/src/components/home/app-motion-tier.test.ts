/**
 * The in-app motion tier, as a gate.
 *
 * The governing rule for the signed-in product: motion is **fast**, 120 to
 * 200ms. Loud in-app means better choreography, not longer duration, because
 * a slow app is never delightful no matter how pretty it is.
 *
 * The expressive tier (400 to 900ms) is permitted at exactly three moments,
 * all three named below and all three named in `components/motion/README.md`.
 * This test scans the in-app surfaces Track B phase 4 touched and fails both
 * ways: a fourth expressive moment fails, and so does an entry on the
 * permitted list that no longer uses anything expressive, so the list cannot
 * quietly rot into a blanket excuse.
 *
 * It reads the source rather than measuring a running timeline on purpose. A
 * duration is a decision somebody writes down; catching it in review is worth
 * more than catching it in a frame counter.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Everything this phase owns, relative to `apps/web/src`. */
const IN_APP_DIRECTORIES = [
  'components/home',
  'components/empty',
  'components/onboarding',
  'features/calendar',
  'features/receipts',
  'features/composer',
] as const;

/** The GSAP-side names for the 400/650/900ms tier. */
const EXPRESSIVE_CONSTANTS = ['EXPRESSIVE_SM', 'EXPRESSIVE_MD', 'EXPRESSIVE_LG'] as const;

/**
 * The primitives in `components/motion` that run in the expressive tier.
 *
 * `Reveal`, `StaggerList` and `LiveBadge` are deliberately absent: the README
 * documents all three as app-safe, and `LiveBadge` in particular is CSS-driven
 * precisely so it stays cheap enough for this tier.
 */
const EXPRESSIVE_PRIMITIVES = [
  'CelebrationBurst',
  'KineticHeadline',
  'Magnetic',
  'MagneticButton',
  'Marquee',
  'PinnedScene',
  'ScrollScene',
  'ParallaxLayer',
  'SceneSequencer',
  'CountUp',
] as const;

/**
 * The three sanctioned moments.
 *
 *  - `components/onboarding/done-step.tsx` — onboarding completion. The one
 *    screen in the signed-in product that is a celebration rather than a
 *    working screen: `KineticHeadline`, `MagneticButton` and a large
 *    `CelebrationBurst`.
 *  - `features/receipts/publish-celebration.tsx` — publish and live success.
 *    The burst is expressive; the card's own slam-in is 200ms, at the fast
 *    tier, because that part is choreography rather than spectacle.
 *  - `components/empty/empty-scene.tsx` — first-run empty states. Permitted
 *    the expressive tier and currently declining it: the stroke draw-in runs
 *    at 200ms per stroke, 40ms apart. It stays on this list because the
 *    permission is what was granted, and the test below proves the file is
 *    not silently using it anyway.
 */
const PERMITTED_EXPRESSIVE_FILES: readonly string[] = [
  'components/onboarding/done-step.tsx',
  'features/receipts/publish-celebration.tsx',
  'components/empty/empty-scene.tsx',
];

const SRC = join(import.meta.dirname, '..', '..');

function sourceFilesIn(directory: string): readonly string[] {
  const found: string[] = [];
  for (const name of readdirSync(join(SRC, directory))) {
    const relative = `${directory}/${name}`;
    if (statSync(join(SRC, relative)).isDirectory()) {
      found.push(...sourceFilesIn(relative));
      continue;
    }
    if (!/\.tsx?$/.test(name) || name.includes('.test.')) continue;
    found.push(relative);
  }
  return found;
}

const ALL_FILES = IN_APP_DIRECTORIES.flatMap(sourceFilesIn);

/**
 * The names a file actually imports from `components/motion`.
 *
 * Import specifiers, never a substring search over the whole file: a comment
 * explaining why this screen does *not* use `CountUp` must not read as a use
 * of it, or the gate would punish the documentation that makes it reviewable.
 */
function motionImportsIn(source: string): readonly string[] {
  const names: string[] = [];
  const pattern = /import\s*\{([^}]*)\}\s*from\s*'@\/components\/motion'/g;
  for (const match of source.matchAll(pattern)) {
    for (const specifier of (match[1] ?? '').split(',')) {
      const name = specifier
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0];
      if (name) names.push(name);
    }
  }
  return names;
}

function usesExpressiveTier(source: string): boolean {
  const imported = motionImportsIn(source);
  return (
    EXPRESSIVE_PRIMITIVES.some((name) => imported.includes(name)) ||
    EXPRESSIVE_CONSTANTS.some((name) => new RegExp(`\\b${name}\\b`).test(source))
  );
}

describe('the in-app motion tier', () => {
  it('scans a real, non-empty set of files', () => {
    // A guard that silently stopped finding anything would pass forever.
    expect(ALL_FILES.length).toBeGreaterThan(40);
  });

  it('reaches the expressive tier only at the named moments', () => {
    const offenders = ALL_FILES.filter((file) =>
      usesExpressiveTier(readFileSync(join(SRC, file), 'utf8')),
    );

    for (const file of offenders) {
      expect(PERMITTED_EXPRESSIVE_FILES, `${file} is not a named expressive moment`).toContain(
        file,
      );
    }
  });

  it('keeps the permitted list at the three moments that were argued for', () => {
    // Not a dumping ground: three moments were sanctioned, and a fourth needs
    // an argument in `components/motion/README.md` before it goes here.
    expect(PERMITTED_EXPRESSIVE_FILES).toHaveLength(3);
    for (const file of PERMITTED_EXPRESSIVE_FILES) {
      expect(() => readFileSync(join(SRC, file), 'utf8')).not.toThrow();
    }
  });

  it('holds the empty scene to the fast tier it actually ships at', () => {
    // Permitted the expressive tier, declining it. If that ever changes, this
    // fails and the change gets argued for rather than absorbed by the
    // permission above.
    const source = readFileSync(join(SRC, 'components/empty/empty-scene.tsx'), 'utf8');
    expect(usesExpressiveTier(source)).toBe(false);
    expect(source).toContain('DURATION_SLOW');
  });

  it('never ships an audio element or a sound toggle in the signed-in product', () => {
    // The publish celebration is the one place anybody would reach for a
    // chime. Sound is off by default and no toggle was built, so the honest
    // implementation is that neither exists.
    const offenders = ALL_FILES.filter((file) => {
      const source = readFileSync(join(SRC, file), 'utf8');
      return /<audio\b/.test(source) || /new Audio\(/.test(source);
    });

    expect(offenders).toEqual([]);
  });
});
