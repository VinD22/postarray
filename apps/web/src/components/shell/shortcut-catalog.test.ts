/**
 * The cheat sheet, as a gate.
 *
 * `shortcuts-dialog.tsx` carries the sentence this test exists to defend: a
 * cheat sheet that lies is worse than none. It was lying. The dialog and the
 * command palette both advertised `mod+shift+c` and no such binding existed
 * anywhere in the application, so the one screen whose entire job is to say
 * which keys work was naming a key that did nothing.
 *
 * A comment could not have caught that, and neither could a render test: the
 * dialog renders whatever list it is given, correct or not. So this reads the
 * shell's own source and compares the bindings actually registered with
 * `useHotkeys` against the catalogue both surfaces render from. It fails in
 * both directions, because both directions are bugs: a catalogued shortcut
 * with no binding is a lie, and a binding nobody advertises is a secret.
 *
 * Same technique as `components/home/app-motion-tier.test.ts`, for the same
 * reason: a binding is a decision somebody writes down, and catching it in
 * review is worth more than catching it in a browser.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { SHORTCUT_CATALOG } from './shortcut-catalog';

const SHELL_SOURCE = readFileSync(join(import.meta.dirname, 'app-shell.tsx'), 'utf8');

/**
 * Every binding registered in a `useHotkeys` call in the given source.
 *
 * Scoped to the inside of those calls rather than searched over the whole
 * file, so a quoted binding inside a comment or a className cannot be mistaken
 * for a registration. The map keys are quoted strings followed by a colon and
 * an arrow function, which is the only shape `HotkeyMap` accepts.
 */
function boundHotkeysIn(source: string): readonly string[] {
  const found: string[] = [];
  let cursor = source.indexOf('useHotkeys(');

  while (cursor !== -1) {
    const open = source.indexOf('{', cursor);
    if (open === -1) break;

    let depth = 0;
    let end = open;
    for (; end < source.length; end += 1) {
      if (source[end] === '{') depth += 1;
      else if (source[end] === '}') {
        depth -= 1;
        if (depth === 0) break;
      }
    }

    const map = source.slice(open, end + 1);
    for (const match of map.matchAll(/'([^']+)':\s*\(\)\s*=>/g)) {
      const binding = match[1];
      if (binding !== undefined) found.push(binding);
    }
    cursor = source.indexOf('useHotkeys(', end);
  }

  return found;
}

const BOUND = boundHotkeysIn(SHELL_SOURCE);
const GLOBAL_ENTRIES = SHORTCUT_CATALOG.filter((entry) => entry.scope === 'global');

describe('the shell shortcut catalog', () => {
  it('reads a real, non-empty set of bindings out of the shell', () => {
    // A parser that silently stopped finding anything would pass forever.
    expect(BOUND.length).toBeGreaterThan(1);
  });

  it('binds every global shortcut it advertises', () => {
    for (const entry of GLOBAL_ENTRIES) {
      expect(BOUND, `${entry.id} is advertised but not bound in app-shell.tsx`).toContain(
        entry.keys,
      );
    }
  });

  it('advertises every global shortcut it binds', () => {
    const advertised = GLOBAL_ENTRIES.map((entry) => entry.keys);
    for (const binding of BOUND) {
      expect(advertised, `${binding} is bound in app-shell.tsx but not catalogued`).toContain(
        binding,
      );
    }
  });

  it('gives every entry a distinct id and a distinct binding', () => {
    const ids = SHORTCUT_CATALOG.map((entry) => entry.id);
    const keys = SHORTCUT_CATALOG.map((entry) => entry.keys);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('labels every entry from the catalog rather than in English', () => {
    for (const entry of SHORTCUT_CATALOG) {
      expect(entry.labelKey).toMatch(/^[a-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/);
    }
  });
});
