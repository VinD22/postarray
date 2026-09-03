import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { durations, easings, loopDurations } from './tokens';

/**
 * The motion scale is only a scale if nothing routes around it.
 *
 * `theme.css` declares one motion vocabulary (80/120/160/200 functional,
 * 400/650/900 expressive, two loop periods, five named eases) and then hands
 * it to every animation and transition in the package through `var()`. That
 * held right up until it didn't: a popover entrance carried a hand-typed
 * 320ms, well past the 200ms functional ceiling, and two loops and a spinner
 * carried their own literals. Nothing caught any of them, because nothing was
 * looking.
 *
 * This test looks. It walks the declarations in `theme.css` and fails on any
 * literal time inside an `animation` or `transition` shorthand or longhand,
 * anywhere outside the token declaration block itself. A new utility either
 * picks a step off the scale or adds one, and either way the choice is visible
 * in the diff rather than buried in a shorthand.
 *
 * Two blocks are exempt, both deliberately:
 *
 * - `@theme`, which is where the durations are declared in the first place.
 * - The `prefers-reduced-motion: reduce` override, whose whole job is to force
 *   a literal 1ms over every token in the file.
 */

const THEME_CSS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'theme.css'), 'utf8');

/** `/* ... *\/` comments, so a duration mentioned in prose is not a match. */
const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Removes each block whose opening line matches `opener`, braces balanced, so
 * a nested rule inside the block goes with it.
 */
const removeBlocks = (css: string, opener: RegExp): string => {
  let out = '';
  let index = 0;

  for (;;) {
    const rest = css.slice(index);
    const match = opener.exec(rest);
    if (!match || match.index === undefined) {
      out += rest;
      return out;
    }

    const start = index + match.index;
    out += css.slice(index, start);

    let cursor = css.indexOf('{', start);
    if (cursor === -1) return out;

    let depth = 0;
    for (; cursor < css.length; cursor += 1) {
      const char = css[cursor];
      if (char === '{') depth += 1;
      else if (char === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }

    index = cursor + 1;
  }
};

/** A `time` in CSS: an integer or decimal followed by `s` or `ms`. */
const TIME_LITERAL = /(?<![\w.-])\d*\.?\d+m?s(?![\w-])/g;

/** `animation`, `transition`, and their `-duration` / `-delay` longhands. */
const MOTION_DECLARATION =
  /(?<property>animation|transition)(?<longhand>-duration|-delay)?\s*:\s*(?<value>[^;{}]*)[;}]/g;

interface Offence {
  readonly property: string;
  readonly value: string;
  readonly literals: readonly string[];
}

const findLiteralDurations = (css: string): Offence[] => {
  const offences: Offence[] = [];

  for (const match of css.matchAll(MOTION_DECLARATION)) {
    const { property, longhand, value } = match.groups ?? {};
    if (property === undefined || value === undefined) continue;

    const literals = value.match(TIME_LITERAL) ?? [];
    if (literals.length === 0) continue;

    offences.push({
      property: `${property}${longhand ?? ''}`,
      value: value.trim(),
      literals,
    });
  }

  return offences;
};

const declarationBody = stripComments(THEME_CSS);
const outsideTokenBlock = removeBlocks(
  removeBlocks(declarationBody, /@theme\b/),
  /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/,
);

describe('motion literals', () => {
  it('finds the animation and transition declarations it is meant to police', () => {
    // A guard on the guard: if the parser silently stopped matching, every
    // other assertion here would pass vacuously.
    const declarations = [...outsideTokenBlock.matchAll(MOTION_DECLARATION)];
    expect(declarations.length).toBeGreaterThan(8);
  });

  it('keeps the token block in scope of the parser it is exempted from', () => {
    expect(outsideTokenBlock).not.toContain('--duration-fast:');
    expect(declarationBody).toContain('--duration-fast:');
  });

  it('routes every animation and transition through the motion scale', () => {
    const offences = findLiteralDurations(outsideTokenBlock);

    expect(
      offences.map((offence) => `${offence.property}: ${offence.value}`),
      'Use a --duration-* token instead of a literal time. If no step fits, add one to the motion scale in @theme.',
    ).toEqual([]);
  });

  it('still allows the reduced-motion override its literal 1ms', () => {
    // The exemption has to stay narrow: the override is the one place a
    // literal is correct, and it must keep existing.
    expect(declarationBody).toMatch(/animation-duration:\s*1ms\s*!important/);
    expect(declarationBody).toMatch(/transition-duration:\s*1ms\s*!important/);
  });

  it('catches a literal that a future edit might introduce', () => {
    const offences = findLiteralDurations('.x { animation: spin 320ms linear infinite; }');
    expect(offences).toHaveLength(1);
    expect(offences[0]?.literals).toEqual(['320ms']);
  });

  it('does not mistake an ease or a token reference for a literal', () => {
    expect(
      findLiteralDurations(
        '.x { transition: opacity var(--duration-fast) cubic-bezier(0.2, 0, 0.15, 1); }',
      ),
    ).toEqual([]);
  });
});

describe('motion scale', () => {
  const declared = (name: string): string | undefined =>
    new RegExp(`--${name}:\\s*([^;]+);`).exec(declarationBody)?.[1]?.trim();

  it.each(Object.entries(durations))('declares --duration-%s in theme.css', (key, value) => {
    const cssName = `duration-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
    expect(declared(cssName)).toBe(`${value}ms`);
  });

  it('declares the two loop periods apart from the transition scale', () => {
    expect(declared('duration-loop-spin')).toBe(`${loopDurations.spin}ms`);
    expect(declared('duration-loop')).toBe(`${loopDurations.pulse}ms`);
  });

  it('keeps every functional duration inside the 80-200ms ceiling', () => {
    const functional = [durations.instant, durations.fast, durations.base, durations.slow];
    for (const value of functional) {
      expect(value).toBeGreaterThanOrEqual(80);
      expect(value).toBeLessThanOrEqual(200);
    }
  });

  it.each(Object.entries(easings))('declares --ease-%s in theme.css', (key, value) => {
    const cssName = `ease-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
    expect(declared(cssName)).toBe(value);
  });
});
