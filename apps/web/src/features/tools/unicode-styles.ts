import type { MessageKey } from '@relay/i18n/translate';

/**
 * The Unicode text styler.
 *
 * Every style below maps an ordinary Latin letter or digit to a different
 * Unicode code point that happens to look like a styled version of it: the
 * Mathematical Alphanumeric Symbols block, the enclosed alphanumerics, the
 * halfwidth and fullwidth forms, a handful of phonetic small capitals, and two
 * combining marks that draw a line through or under whatever they follow.
 *
 * This is not a font. No font file is produced, downloaded or referenced. The
 * output is text, and the reason it looks different after pasting is that the
 * characters themselves are different characters. That has two consequences the
 * pages built on this module are required to state plainly:
 *
 * 1. A screen reader reads these code points badly or not at all, and a search
 *    index does not match them against the plain letters they resemble.
 * 2. Whether any given platform keeps, strips or normalises a given code point
 *    is a property of that platform on that day, in that app, on that device.
 *    This module records no such claim, and neither may a page using it.
 *
 * Every function here is pure and synchronous. Nothing is fetched, stored or
 * measured.
 */

export type UnicodeStyleId =
  | 'boldSerif'
  | 'italicSerif'
  | 'boldItalicSerif'
  | 'script'
  | 'scriptBold'
  | 'fraktur'
  | 'doubleStruck'
  | 'sans'
  | 'sansBold'
  | 'sansItalic'
  | 'monospace'
  | 'smallCaps'
  | 'circled'
  | 'squared'
  | 'fullwidth'
  | 'strikethrough'
  | 'underline';

export interface UnicodeStyle {
  readonly id: UnicodeStyleId;
  /** The catalog key naming this style in the interface. */
  readonly nameKey: MessageKey;
  /** The catalog key describing, in one sentence, what it is made of. */
  readonly noteKey: MessageKey;
  readonly transform: (input: string) => string;
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';

interface RangeSpec {
  /** Code point the run of A..Z starts at. */
  readonly upper?: number;
  /** Code point the run of a..z starts at. */
  readonly lower?: number;
  /** Code point the run of 0..9 starts at. */
  readonly digits?: number;
  /**
   * Letters the run does not actually contain, because the code point that
   * would hold them is reserved and the character lives elsewhere in Unicode.
   * Without these the styles below emit reserved, unassigned code points.
   */
  readonly holes?: Readonly<Record<string, string>>;
}

function buildMap(spec: RangeSpec): ReadonlyMap<string, string> {
  const map = new Map<string, string>();
  const runs: readonly (readonly [string, number | undefined])[] = [
    [UPPER, spec.upper],
    [LOWER, spec.lower],
    [DIGITS, spec.digits],
  ];
  for (const [source, start] of runs) {
    if (start === undefined) {
      continue;
    }
    for (let index = 0; index < source.length; index += 1) {
      const char = source[index];
      if (char === undefined) {
        continue;
      }
      map.set(char, String.fromCodePoint(start + index));
    }
  }
  for (const [char, replacement] of Object.entries(spec.holes ?? {})) {
    map.set(char, replacement);
  }
  return map;
}

/**
 * Apply a per character map, code point by code point.
 *
 * Iterating the string yields whole code points, so an emoji or an astral
 * character passes through intact rather than being torn into surrogate halves.
 */
function applyMap(map: ReadonlyMap<string, string>, input: string): string {
  let out = '';
  for (const char of input) {
    out += map.get(char) ?? char;
  }
  return out;
}

/** Follow every non-newline character with a combining mark. */
function applyCombining(mark: string, input: string): string {
  let out = '';
  for (const char of input) {
    out += char === '\n' || char === '\r' ? char : char + mark;
  }
  return out;
}

const BOLD_SERIF = buildMap({ upper: 0x1d400, lower: 0x1d41a, digits: 0x1d7ce });

const ITALIC_SERIF = buildMap({
  upper: 0x1d434,
  lower: 0x1d44e,
  // U+1D455 is reserved; italic h is the Planck constant sign.
  holes: { h: 'ℎ' },
});

const BOLD_ITALIC_SERIF = buildMap({ upper: 0x1d468, lower: 0x1d482 });

const SCRIPT = buildMap({
  upper: 0x1d49c,
  lower: 0x1d4b6,
  holes: {
    B: 'ℬ',
    E: 'ℰ',
    F: 'ℱ',
    H: 'ℋ',
    I: 'ℐ',
    L: 'ℒ',
    M: 'ℳ',
    R: 'ℛ',
    e: 'ℯ',
    g: 'ℊ',
    o: 'ℴ',
  },
});

const SCRIPT_BOLD = buildMap({ upper: 0x1d4d0, lower: 0x1d4ea });

const FRAKTUR = buildMap({
  upper: 0x1d504,
  lower: 0x1d51e,
  holes: { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' },
});

const DOUBLE_STRUCK = buildMap({
  upper: 0x1d538,
  lower: 0x1d552,
  digits: 0x1d7d8,
  holes: {
    C: 'ℂ',
    H: 'ℍ',
    N: 'ℕ',
    P: 'ℙ',
    Q: 'ℚ',
    R: 'ℝ',
    Z: 'ℤ',
  },
});

const SANS = buildMap({ upper: 0x1d5a0, lower: 0x1d5ba, digits: 0x1d7e2 });
const SANS_BOLD = buildMap({ upper: 0x1d5d4, lower: 0x1d5ee, digits: 0x1d7ec });
const SANS_ITALIC = buildMap({ upper: 0x1d608, lower: 0x1d622 });
const MONOSPACE = buildMap({ upper: 0x1d670, lower: 0x1d68a, digits: 0x1d7f6 });

const FULLWIDTH = buildMap({
  upper: 0xff21,
  lower: 0xff41,
  digits: 0xff10,
  holes: { ' ': '　' },
});

const CIRCLED = buildMap({
  upper: 0x24b6,
  lower: 0x24d0,
  // U+2460 starts at circled one, so zero has to be named separately.
  digits: 0x245f,
  holes: { '0': '⓪' },
});

const SQUARED = buildMap({ upper: 0x1f130 });

/**
 * Small capitals, letter by letter.
 *
 * Unicode has no small capital X, so x is left as it was typed rather than
 * substituted with something that merely looks close. The pages say so.
 */
const SMALL_CAPS: ReadonlyMap<string, string> = new Map(
  Object.entries({
    a: 'ᴀ',
    b: 'ʙ',
    c: 'ᴄ',
    d: 'ᴅ',
    e: 'ᴇ',
    f: 'ꜰ',
    g: 'ɢ',
    h: 'ʜ',
    i: 'ɪ',
    j: 'ᴊ',
    k: 'ᴋ',
    l: 'ʟ',
    m: 'ᴍ',
    n: 'ɴ',
    o: 'ᴏ',
    p: 'ᴘ',
    q: 'ꞯ',
    r: 'ʀ',
    s: 'ꜱ',
    t: 'ᴛ',
    u: 'ᴜ',
    v: 'ᴠ',
    w: 'ᴡ',
    x: 'x',
    y: 'ʏ',
    z: 'ᴢ',
  }),
);

export const COMBINING_STRIKETHROUGH = '̶';
export const COMBINING_UNDERLINE = '̲';

/** Every style this module can produce, in the order a page lists them. */
export const UNICODE_STYLES: readonly UnicodeStyle[] = [
  {
    id: 'boldSerif',
    nameKey: 'web.toolDirectory.fontGenerator.style.boldSerif.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.boldSerif.note',
    transform: (input) => applyMap(BOLD_SERIF, input),
  },
  {
    id: 'italicSerif',
    nameKey: 'web.toolDirectory.fontGenerator.style.italicSerif.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.italicSerif.note',
    transform: (input) => applyMap(ITALIC_SERIF, input),
  },
  {
    id: 'boldItalicSerif',
    nameKey: 'web.toolDirectory.fontGenerator.style.boldItalicSerif.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.boldItalicSerif.note',
    transform: (input) => applyMap(BOLD_ITALIC_SERIF, input),
  },
  {
    id: 'script',
    nameKey: 'web.toolDirectory.fontGenerator.style.script.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.script.note',
    transform: (input) => applyMap(SCRIPT, input),
  },
  {
    id: 'scriptBold',
    nameKey: 'web.toolDirectory.fontGenerator.style.scriptBold.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.scriptBold.note',
    transform: (input) => applyMap(SCRIPT_BOLD, input),
  },
  {
    id: 'fraktur',
    nameKey: 'web.toolDirectory.fontGenerator.style.fraktur.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.fraktur.note',
    transform: (input) => applyMap(FRAKTUR, input),
  },
  {
    id: 'doubleStruck',
    nameKey: 'web.toolDirectory.fontGenerator.style.doubleStruck.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.doubleStruck.note',
    transform: (input) => applyMap(DOUBLE_STRUCK, input),
  },
  {
    id: 'sans',
    nameKey: 'web.toolDirectory.fontGenerator.style.sans.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.sans.note',
    transform: (input) => applyMap(SANS, input),
  },
  {
    id: 'sansBold',
    nameKey: 'web.toolDirectory.fontGenerator.style.sansBold.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.sansBold.note',
    transform: (input) => applyMap(SANS_BOLD, input),
  },
  {
    id: 'sansItalic',
    nameKey: 'web.toolDirectory.fontGenerator.style.sansItalic.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.sansItalic.note',
    transform: (input) => applyMap(SANS_ITALIC, input),
  },
  {
    id: 'monospace',
    nameKey: 'web.toolDirectory.fontGenerator.style.monospace.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.monospace.note',
    transform: (input) => applyMap(MONOSPACE, input),
  },
  {
    id: 'smallCaps',
    nameKey: 'web.toolDirectory.fontGenerator.style.smallCaps.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.smallCaps.note',
    transform: (input) => applyMap(SMALL_CAPS, input),
  },
  {
    id: 'circled',
    nameKey: 'web.toolDirectory.fontGenerator.style.circled.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.circled.note',
    transform: (input) => applyMap(CIRCLED, input),
  },
  {
    id: 'squared',
    nameKey: 'web.toolDirectory.fontGenerator.style.squared.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.squared.note',
    transform: (input) => applyMap(SQUARED, input.toUpperCase()),
  },
  {
    id: 'fullwidth',
    nameKey: 'web.toolDirectory.fontGenerator.style.fullwidth.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.fullwidth.note',
    transform: (input) => applyMap(FULLWIDTH, input),
  },
  {
    id: 'strikethrough',
    nameKey: 'web.toolDirectory.fontGenerator.style.strikethrough.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.strikethrough.note',
    transform: (input) => applyCombining(COMBINING_STRIKETHROUGH, input),
  },
  {
    id: 'underline',
    nameKey: 'web.toolDirectory.fontGenerator.style.underline.name',
    noteKey: 'web.toolDirectory.fontGenerator.style.underline.note',
    transform: (input) => applyCombining(COMBINING_UNDERLINE, input),
  },
];

const BY_ID: ReadonlyMap<UnicodeStyleId, UnicodeStyle> = new Map(
  UNICODE_STYLES.map((style) => [style.id, style]),
);

/**
 * The styles named by `ids`, in the order this module lists them rather than
 * the order the caller happened to write them, so two pages offering the same
 * styles present them the same way.
 *
 * An id with no style is dropped rather than thrown for, because the type
 * already prevents it and a marketing page must not fail to render over a
 * cosmetic list.
 */
export function stylesFor(ids: readonly UnicodeStyleId[]): readonly UnicodeStyle[] {
  const wanted = new Set<UnicodeStyleId>(ids);
  return UNICODE_STYLES.filter((style) => wanted.has(style.id));
}

export interface StyledSample {
  readonly id: UnicodeStyleId;
  readonly nameKey: MessageKey;
  readonly noteKey: MessageKey;
  readonly text: string;
}

/** Render one input in every requested style. Pure, and cheap enough to run per keystroke. */
export function styleText(input: string, ids: readonly UnicodeStyleId[]): readonly StyledSample[] {
  return stylesFor(ids).map((style) => ({
    id: style.id,
    nameKey: style.nameKey,
    noteKey: style.noteKey,
    text: style.transform(input),
  }));
}

/** Look one style up by id. Used by the tests and by the preview row. */
export function unicodeStyle(id: UnicodeStyleId): UnicodeStyle | undefined {
  return BY_ID.get(id);
}
