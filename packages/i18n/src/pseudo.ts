/**
 * Pseudo locales for CI.
 *
 * `en-XA` accents the Latin letters and expands the text by about 40%, so an
 * untranslated string, a hard coded string and a container that clips at the
 * English width are all obvious at a glance.
 *
 * `en-XB` additionally forces right to left presentation, so mirrored layout,
 * logical CSS properties and bidirectional isolation can be checked without
 * waiting for a real RTL catalog.
 *
 * Only literal text is transformed. Argument names, plural keywords and ICU
 * syntax are untouched, so a pseudo message still formats correctly. If it does
 * not, the message was malformed to begin with and lint will say so.
 */

import { transformIcu } from './icu';
import { en } from './messages/en/index';
import type { LocaleFormatting } from './locales';
import type { PartialCatalog } from './messages/index';

export type PseudoVariant = 'accented' | 'bidi';

export const PSEUDO_LOCALE_CODES = {
  accented: 'en-XA',
  bidi: 'en-XB',
} as const;

/** Metadata for the pseudo locales, in the same shape as a real locale. */
export const PSEUDO_LOCALES: readonly LocaleFormatting[] = [
  {
    bcp47: 'en-XA',
    name: 'Pseudo (accented)',
    endonym: '[Ƥśéúüðó ãççéñţéð]',
    script: 'Latn',
    direction: 'ltr',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'MMM d, y',
    weekStartsOn: 0,
    hourCycle: 'h12',
  },
  {
    bcp47: 'en-XB',
    name: 'Pseudo (right to left)',
    endonym: '[Ƥśéúüðó ŕţļ]',
    script: 'Latn',
    direction: 'rtl',
    pluralCategories: ['one', 'other'],
    defaultDateFormat: 'MMM d, y',
    weekStartsOn: 6,
    hourCycle: 'h12',
  },
];

/** True for `en-XA` and `en-XB`. */
export function isPseudoLocale(code: string): boolean {
  const normalized = code.trim().toLowerCase();
  return normalized === 'en-xa' || normalized === 'en-xb';
}

export function getPseudoLocale(code: string): LocaleFormatting | undefined {
  const normalized = code.trim().toLowerCase();
  return PSEUDO_LOCALES.find((locale) => locale.bcp47.toLowerCase() === normalized);
}

/**
 * Accent map. Every replacement is a single code point that keeps the letter
 * recognisable, so a reviewer can still read the string and judge the layout.
 */
const ACCENTS: Readonly<Record<string, string>> = {
  a: 'ã',
  b: 'ƀ',
  c: 'ç',
  d: 'ð',
  e: 'é',
  f: 'ƒ',
  g: 'ĝ',
  h: 'ĥ',
  i: 'í',
  j: 'ĵ',
  k: 'ķ',
  l: 'ļ',
  m: 'ɱ',
  n: 'ñ',
  o: 'ó',
  p: 'þ',
  q: 'ʠ',
  r: 'ŕ',
  s: 'ś',
  t: 'ţ',
  u: 'ú',
  v: 'ṽ',
  w: 'ŵ',
  x: 'ẋ',
  y: 'ý',
  z: 'ž',
  A: 'Ã',
  B: 'Ɓ',
  C: 'Ç',
  D: 'Ð',
  E: 'É',
  F: 'Ƒ',
  G: 'Ĝ',
  H: 'Ĥ',
  I: 'Í',
  J: 'Ĵ',
  K: 'Ķ',
  L: 'Ļ',
  M: 'Ḿ',
  N: 'Ñ',
  O: 'Ó',
  P: 'Þ',
  Q: 'Ǫ',
  R: 'Ŕ',
  S: 'Ś',
  T: 'Ţ',
  U: 'Ú',
  V: 'Ṽ',
  W: 'Ŵ',
  X: 'Ẋ',
  Y: 'Ý',
  Z: 'Ž',
};

/** Padding characters appended to simulate translation growth. */
const PADDING_CHARACTER = '·';

/** Unicode bidirectional isolate marks used by the right to left variant. */
const RIGHT_TO_LEFT_ISOLATE = '\u2067';
const POP_DIRECTIONAL_ISOLATE = '\u2069';

export interface PseudoOptions {
  readonly variant?: PseudoVariant;
  /** Extra length as a fraction of the original. 0.4 is a 40% expansion. */
  readonly expansion?: number;
  /** Wrap the whole message in brackets so truncation is visible. */
  readonly brackets?: boolean;
}

function accent(text: string): string {
  let output = '';
  for (const character of text) {
    output += ACCENTS[character] ?? character;
  }
  return output;
}

function countLetters(text: string): number {
  let count = 0;
  for (const character of text) {
    if (ACCENTS[character] !== undefined) {
      count += 1;
    }
  }
  return count;
}

/**
 * Pseudo localize a single ICU message.
 *
 * Expansion is applied once, to the message as a whole, rather than to each
 * literal run, so a message with several arguments does not grow further than
 * a real translation would.
 */
export function pseudoLocalize(message: string, options: PseudoOptions = {}): string {
  const variant = options.variant ?? 'accented';
  const expansion = options.expansion ?? 0.4;
  const brackets = options.brackets ?? true;

  const transformed = transformIcu(message, {
    literal: (text) => {
      const accented = accent(text);
      return variant === 'bidi'
        ? `${RIGHT_TO_LEFT_ISOLATE}${accented}${POP_DIRECTIONAL_ISOLATE}`
        : accented;
    },
  });

  const letters = countLetters(message);
  const padding = Math.max(0, Math.round(letters * expansion));
  const tail = padding > 0 ? ` ${PADDING_CHARACTER.repeat(padding)}` : '';

  if (!brackets) {
    return `${transformed}${tail}`;
  }
  return `[${transformed}${tail}]`;
}

/** Pseudo localize a whole catalog, preserving every key. */
export function pseudoLocalizeCatalog(
  catalog: Readonly<Record<string, string>>,
  options: PseudoOptions = {},
): Readonly<Record<string, string>> {
  const output: Record<string, string> = {};
  for (const [key, value] of Object.entries(catalog)) {
    output[key] = pseudoLocalize(value, options);
  }
  return output;
}

/** The English catalog rendered into a pseudo locale, ready for a test run. */
export function createPseudoCatalog(variant: PseudoVariant = 'accented'): PartialCatalog {
  return pseudoLocalizeCatalog(en, { variant }) as PartialCatalog;
}
