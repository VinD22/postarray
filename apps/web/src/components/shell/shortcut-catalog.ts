/**
 * Every keyboard shortcut the shell advertises, in one place.
 *
 * There used to be three places. The cheat sheet listed three shortcuts, the
 * command palette printed a fourth key hint beside Compose, and the shell bound
 * two. `mod+shift+c` appeared in the first two and existed in neither, so the
 * one screen whose entire job is to tell you which keys work was telling you
 * about a key that did nothing.
 *
 * This is now the source both surfaces read, and `shortcut-catalog.test.ts`
 * reads the shell's own source to prove that every global entry here is
 * actually bound. A cheat sheet that lies is worse than none, and the only way
 * to keep that true is to make the lie fail a test rather than a review.
 *
 * Scope says where a shortcut is live. Only `global` entries belong to the
 * shell: the composer and the calendar bind their own and carry their own
 * sheets, and folding those in means folding in their dialogs too.
 */
export interface ShortcutEntry {
  readonly id: string;
  /** The binding, in the form `useHotkeys` and `Kbd` both accept. */
  readonly keys: string;
  /** Catalog key for the label. Never an English literal. */
  readonly labelKey: string;
  readonly scope: 'global';
}

export const SHORTCUT_CATALOG: readonly ShortcutEntry[] = [
  {
    id: 'command-palette',
    keys: 'mod+k',
    labelKey: 'nav.commandPalette',
    scope: 'global',
  },
  {
    id: 'compose',
    keys: 'mod+shift+c',
    labelKey: 'nav.compose',
    scope: 'global',
  },
  {
    id: 'shortcuts',
    keys: 'shift+?',
    labelKey: 'a11y.keyboard.shortcutsTitle',
    scope: 'global',
  },
];

/** The binding advertised for one catalogued shortcut, or nothing. */
export function shortcutKeys(id: string): string | undefined {
  return SHORTCUT_CATALOG.find((entry) => entry.id === id)?.keys;
}
