import type { MessageKey } from '@relay/i18n/translate';

/**
 * The invisible character catalog.
 *
 * Four real Unicode characters, each with a name and an honest description of
 * what it is actually for. None of them is claimed to reliably survive on any
 * named platform: we have no verified connector behaviour to back that claim,
 * so the copy describes what the character is (a joiner, a zero-width space,
 * a printable blank glyph) rather than promising a result nobody here has
 * tested.
 *
 * Every `char` below is written as a `\uXXXX` escape rather than the literal
 * glyph. Three of these four are genuinely invisible in a source file, and an
 * accidental duplicate or a mangled encoding would be impossible to spot by
 * eye if it were pasted in as the real character.
 */

export interface InvisibleCharacterEntry {
  readonly id: string;
  /** The literal character(s) the copy button copies. */
  readonly char: string;
  /** `U+XXXX`, upper case, for display and for the paste-test match. */
  readonly codepoint: string;
  readonly nameKey: MessageKey;
  readonly explainerKey: MessageKey;
}

export const INVISIBLE_CHARACTERS: readonly InvisibleCharacterEntry[] = [
  {
    id: 'braille-blank',
    char: '\u2800',
    codepoint: 'U+2800',
    nameKey: 'web.toolDirectory.invisibleCharacter.entry.brailleBlank.name',
    explainerKey: 'web.toolDirectory.invisibleCharacter.entry.brailleBlank.explainer',
  },
  {
    id: 'zero-width-space',
    char: '\u200B',
    codepoint: 'U+200B',
    nameKey: 'web.toolDirectory.invisibleCharacter.entry.zeroWidthSpace.name',
    explainerKey: 'web.toolDirectory.invisibleCharacter.entry.zeroWidthSpace.explainer',
  },
  {
    id: 'zero-width-joiner',
    char: '\u200D',
    codepoint: 'U+200D',
    nameKey: 'web.toolDirectory.invisibleCharacter.entry.zeroWidthJoiner.name',
    explainerKey: 'web.toolDirectory.invisibleCharacter.entry.zeroWidthJoiner.explainer',
  },
  {
    id: 'zero-width-non-joiner',
    char: '\u200C',
    codepoint: 'U+200C',
    nameKey: 'web.toolDirectory.invisibleCharacter.entry.zeroWidthNonJoiner.name',
    explainerKey: 'web.toolDirectory.invisibleCharacter.entry.zeroWidthNonJoiner.explainer',
  },
];

const BY_CHARACTER = new Map(INVISIBLE_CHARACTERS.map((entry) => [entry.char, entry]));

export interface InvisibleCharacterMatch {
  readonly entry: InvisibleCharacterEntry;
  /** How many times it appears in the pasted text. */
  readonly count: number;
}

/**
 * Which catalog characters are present in `text`, for the paste-test area, in
 * catalog order. Used to confirm a copy actually landed on the clipboard
 * rather than being silently dropped by the destination.
 */
export function findInvisibleCharacters(text: string): readonly InvisibleCharacterMatch[] {
  const counts = new Map<string, number>();
  for (const character of text) {
    if (BY_CHARACTER.has(character)) {
      counts.set(character, (counts.get(character) ?? 0) + 1);
    }
  }

  return INVISIBLE_CHARACTERS.filter((entry) => counts.has(entry.char)).map((entry) => ({
    entry,
    count: counts.get(entry.char) ?? 0,
  }));
}
