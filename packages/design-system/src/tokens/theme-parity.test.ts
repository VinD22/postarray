import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { relativeLuminance } from './contrast';
import { PROVIDER_KEYS, darkTheme, lightTheme, type ThemeName, type ThemeTokens } from './tokens';

/**
 * theme.css and tokens.ts must agree.
 *
 * Two files declare the same palette. `theme.css` is what the browser paints.
 * `tokens.ts` is what the contrast gate measures, and what every consumer that
 * cannot read a custom property (canvas previews, chart renderers, generated OG
 * images) reads instead. Until this file existed, nothing checked that they
 * said the same thing: an accent edit applied to `tokens.ts` alone would sail
 * through `contrast.test.ts` while the browser kept rendering the old value,
 * and an edit applied to `theme.css` alone would ship an unmeasured pair.
 *
 * So this test resolves the CSS itself — the raw palette, one level of
 * `var()` indirection, and both dark-theme blocks — and compares every
 * semantic colour token against its TypeScript counterpart, in both themes.
 *
 * It also holds the two dark blocks to each other. `theme.css` declares dark
 * twice on purpose (once under `prefers-color-scheme` for people who never
 * chose a theme, once under `[data-theme='dark']` for the in-app toggle), and
 * a token present in only one of them silently splits those two audiences.
 */

const THEME_CSS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'theme.css'), 'utf8');

/** A `--custom-property: value` map, keyed without the leading dashes. */
type Declarations = Map<string, string>;

/**
 * Custom properties declared in `theme.css` that have no `tokens.ts`
 * counterpart, by design. Both are compositional rather than palette entries:
 * a scrim is a translucent black over whatever is beneath it, and the hard
 * shadow's colour is an alpha, not a swatch. Neither can be expressed as one
 * of `ThemeTokens`' opaque hex strings, and nothing outside CSS consumes them.
 */
const CSS_ONLY_COLOUR_TOKENS = ['surface-scrim', 'shadow-hard-color'];

/**
 * Where each `tokens.ts` field lives in `theme.css`.
 *
 * Spelled out rather than derived from the field names: several pairs are not
 * a mechanical transform of each other (`blush.bg` is `--accent-blush-bg`,
 * `accent.default` is `--accent-default` but `accent.onAccent` is
 * `--accent-on-accent`), and a wrong guess would silently compare a token to
 * nothing. A missing entry here fails the coverage test below.
 */
const TOKEN_TO_CSS: Readonly<Record<string, string>> = {
  'surface.canvas': 'surface-canvas',
  'surface.raised': 'surface-raised',
  'surface.sunken': 'surface-sunken',
  'surface.overlay': 'surface-overlay',
  'surface.hover': 'surface-hover',
  'surface.active': 'surface-active',
  'surface.inverted': 'surface-inverted',

  'border.subtle': 'border-subtle',
  'border.default': 'border-default',
  'border.strong': 'border-strong',
  'border.focus': 'border-focus',
  'border.bold': 'border-bold',

  'text.primary': 'text-primary',
  'text.secondary': 'text-secondary',
  'text.tertiary': 'text-tertiary',
  'text.disabled': 'text-disabled',
  'text.inverted': 'text-inverted',
  'text.accent': 'text-accent',

  'accent.default': 'accent-default',
  'accent.hover': 'accent-hover',
  'accent.active': 'accent-active',
  'accent.subtleBg': 'accent-subtle-bg',
  'accent.subtleBgHover': 'accent-subtle-bg-hover',
  'accent.onAccent': 'accent-on-accent',

  // The action accent (vermilion). Same six-token shape as `accent`.
  'accentAction.default': 'accent-action-default',
  'accentAction.hover': 'accent-action-hover',
  'accentAction.active': 'accent-action-active',
  'accentAction.subtleBg': 'accent-action-subtle-bg',
  'accentAction.subtleBgHover': 'accent-action-subtle-bg-hover',
  'accentAction.onAccent': 'accent-action-on-accent',

  // The two scene accents. Same six-token shape as `accent` above, which is
  // exactly why they are spelled out the same way: `accentWarm.subtleBgHover`
  // is `--accent-warm-subtle-bg-hover`, not a camel-to-kebab transform of the
  // field name, and a wrong guess would compare a token to nothing.
  'accentWarm.default': 'accent-warm-default',
  'accentWarm.hover': 'accent-warm-hover',
  'accentWarm.active': 'accent-warm-active',
  'accentWarm.subtleBg': 'accent-warm-subtle-bg',
  'accentWarm.subtleBgHover': 'accent-warm-subtle-bg-hover',
  'accentWarm.onAccent': 'accent-warm-on-accent',

  'accentCool.default': 'accent-cool-default',
  'accentCool.hover': 'accent-cool-hover',
  'accentCool.active': 'accent-cool-active',
  'accentCool.subtleBg': 'accent-cool-subtle-bg',
  'accentCool.subtleBgHover': 'accent-cool-subtle-bg-hover',
  'accentCool.onAccent': 'accent-cool-on-accent',

  'cta.bg': 'cta-bg',
  'cta.bgHover': 'cta-bg-hover',
  'cta.bgActive': 'cta-bg-active',
  'cta.on': 'cta-on',

  'blush.bg': 'accent-blush-bg',
  'blush.bgHover': 'accent-blush-bg-hover',
  'blush.on': 'accent-blush-on',

  'status.success.fg': 'status-success-fg',
  'status.success.bg': 'status-success-bg',
  'status.success.border': 'status-success-border',
  'status.warning.fg': 'status-warning-fg',
  'status.warning.bg': 'status-warning-bg',
  'status.warning.border': 'status-warning-border',
  'status.info.fg': 'status-info-fg',
  'status.info.bg': 'status-info-bg',
  'status.info.border': 'status-info-border',
  'status.destructive.fg': 'status-destructive-fg',
  'status.destructive.bg': 'status-destructive-bg',
  'status.destructive.border': 'status-destructive-border',
  'status.destructive.solid': 'status-destructive-solid',
  'status.destructive.solidHover': 'status-destructive-solid-hover',
  'status.destructive.solidActive': 'status-destructive-solid-active',
  'status.destructive.on': 'status-destructive-on',

  ...Object.fromEntries(
    PROVIDER_KEYS.map((provider) => [
      `brand.${provider}`,
      `brand-${provider.replaceAll('_', '-')}`,
    ]),
  ),
};

/* --------------------------------------------------------------------------
 * A very small CSS reader
 *
 * Not a parser: it walks braces, tracks the selectors it is inside, and
 * collects `--name: value` declarations per selector path. That is all this
 * comparison needs, and it means the test has no dependency on a CSS parser
 * whose own version could drift.
 * ----------------------------------------------------------------------- */

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Declarations keyed by the joined selector path, e.g. `@media … | :root`. */
function readDeclarationBlocks(css: string): Map<string, Declarations> {
  const blocks = new Map<string, Declarations>();
  const stack: string[] = [];
  let buffer = '';

  for (const character of stripComments(css)) {
    if (character === '{') {
      stack.push(normalizeSelector(buffer));
      buffer = '';
      continue;
    }
    if (character === '}') {
      collect(blocks, stack, buffer);
      buffer = '';
      stack.pop();
      continue;
    }
    if (character === ';') {
      collect(blocks, stack, buffer);
      buffer = '';
      continue;
    }
    buffer += character;
  }
  return blocks;
}

function normalizeSelector(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

function collect(blocks: Map<string, Declarations>, stack: readonly string[], raw: string): void {
  const declaration = raw.trim();
  if (!declaration.startsWith('--')) return;
  const separator = declaration.indexOf(':');
  if (separator === -1) return;

  const path = stack.join(' | ');
  const existing = blocks.get(path) ?? new Map<string, string>();
  existing.set(
    declaration.slice(2, separator).trim(),
    declaration
      .slice(separator + 1)
      .trim()
      .replace(/\s+/g, ' '),
  );
  blocks.set(path, existing);
}

const BLOCKS = readDeclarationBlocks(THEME_CSS);

/** Merges every block whose selector path matches, in source order. */
function mergeBlocks(matches: (path: string) => boolean): Declarations {
  const merged: Declarations = new Map();
  for (const [path, declarations] of BLOCKS) {
    if (!matches(path)) continue;
    for (const [name, value] of declarations) merged.set(name, value);
  }
  return merged;
}

/** Section 1: the raw palette, declared on a bare top-level `:root`. */
const PALETTE = mergeBlocks((path) => path === ':root');

/** Section 2: the light semantic layer. */
const LIGHT_BLOCK = mergeBlocks((path) => path === ":root, :root[data-theme='light']");

/** Section 3, first copy: dark for people who never chose a theme. */
const DARK_SYSTEM_BLOCK = mergeBlocks((path) => path.endsWith(":root:not([data-theme='light'])"));

/** Section 3, second copy: dark for the explicit in-app toggle. */
const DARK_EXPLICIT_BLOCK = mergeBlocks((path) => path === ":root[data-theme='dark']");

const THEME_BLOCKS: Readonly<Record<ThemeName, Declarations>> = {
  light: LIGHT_BLOCK,
  dark: DARK_EXPLICIT_BLOCK,
};

const TS_THEMES: Readonly<Record<ThemeName, ThemeTokens>> = {
  light: lightTheme,
  dark: darkTheme,
};

/** Follows `var(--x)` through the palette until it lands on a literal. */
function resolve(value: string, theme: Declarations, depth = 0): string {
  const reference = /^var\(\s*--([\w-]+)\s*\)$/.exec(value);
  if (!reference?.[1]) return value;
  if (depth > 8) throw new Error(`--${reference[1]} does not resolve to a literal`);

  const next = theme.get(reference[1]) ?? PALETTE.get(reference[1]);
  if (next === undefined) throw new Error(`--${reference[1]} is referenced but never declared`);
  return resolve(next, theme, depth + 1);
}

/** `#ABC` and `#AABBCC` both become `#aabbcc`, so casing is never a failure. */
function normalizeHex(value: string): string {
  const hex = value.trim().toLowerCase();
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(hex);
  if (!short) return hex;
  return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
}

/** Reads a dotted path such as `status.destructive.solid` off a theme object. */
function tokenValue(theme: ThemeTokens, path: string): string {
  let current: unknown = theme;
  for (const segment of path.split('.')) {
    current = (current as Record<string, unknown>)[segment];
  }
  if (typeof current !== 'string') throw new Error(`${path} is not a colour string`);
  return current;
}

/** "lighter" / "darker" / "a different hue at the same lightness". */
function direction(cssValue: string, tsValue: string): string {
  try {
    const cssLuminance = relativeLuminance(cssValue);
    const tsLuminance = relativeLuminance(tsValue);
    if (Math.abs(cssLuminance - tsLuminance) < 1e-6) {
      return 'the same lightness, a different hue';
    }
    return cssLuminance > tsLuminance
      ? 'lighter in theme.css than in tokens.ts'
      : 'darker in theme.css than in tokens.ts';
  } catch {
    return 'not comparable as two opaque colours';
  }
}

const THEME_NAMES: readonly ThemeName[] = ['light', 'dark'];

describe('theme.css and tokens.ts', () => {
  it.each(THEME_NAMES)('render the same palette: %s theme', (themeName) => {
    const block = THEME_BLOCKS[themeName];
    const tsTheme = TS_THEMES[themeName];
    const drifted: string[] = [];

    for (const [tokenPath, cssName] of Object.entries(TOKEN_TO_CSS)) {
      // The light block declares every token; the dark blocks only declare
      // what actually changes, so an undeclared dark token correctly falls
      // back to the light value the browser already computed.
      const declaration = block.get(cssName) ?? LIGHT_BLOCK.get(cssName);
      if (declaration === undefined) {
        drifted.push(
          `--${cssName} (${themeName}): declared in tokens.ts as ` +
            `${normalizeHex(tokenValue(tsTheme, tokenPath))}, but theme.css never declares it, ` +
            `so the browser renders nothing for it.`,
        );
        continue;
      }

      const rendered = normalizeHex(resolve(declaration, block));
      const declared = normalizeHex(tokenValue(tsTheme, tokenPath));
      if (rendered === declared) continue;

      drifted.push(
        `--${cssName} (${themeName}): theme.css renders ${rendered}, tokens.ts declares ` +
          `${declared}. The browser shows the theme.css value and the contrast gate ` +
          `measures the tokens.ts one; the drift is ${direction(rendered, declared)}. ` +
          `Fix whichever file is stale, then re-run the contrast gate.`,
      );
    }

    expect(drifted.join('\n')).toBe('');
  });

  it('declares the two dark blocks identically', () => {
    // Same values, twice: `prefers-color-scheme` for people who never chose a
    // theme, `[data-theme='dark']` for the in-app toggle. A token in only one
    // block splits those two audiences without any visible failure.
    const names = new Set([...DARK_SYSTEM_BLOCK.keys(), ...DARK_EXPLICIT_BLOCK.keys()]);
    const split: string[] = [];

    for (const name of [...names].sort()) {
      const system = DARK_SYSTEM_BLOCK.get(name);
      const explicit = DARK_EXPLICIT_BLOCK.get(name);
      if (system === explicit) continue;
      split.push(
        `--${name}: prefers-color-scheme block says ${system ?? '(absent)'}, ` +
          `[data-theme='dark'] block says ${explicit ?? '(absent)'}. ` +
          `A visitor on system dark and a visitor who pressed the toggle would see ` +
          `different colours.`,
      );
    }

    expect(split.join('\n')).toBe('');
  });

  it('maps every colour token in tokens.ts to a custom property', () => {
    const mapped = new Set(Object.values(TOKEN_TO_CSS));
    const unmapped = [...LIGHT_BLOCK.keys()].filter(
      (name) =>
        !mapped.has(name) &&
        !CSS_ONLY_COLOUR_TOKENS.includes(name) &&
        /^(surface|border|text|accent|cta|status|brand)-/.test(name),
    );

    // A new semantic colour in theme.css with no `tokens.ts` counterpart is
    // invisible to the contrast gate, which is the failure mode this whole
    // file exists to close.
    expect(unmapped).toEqual([]);
  });
});
