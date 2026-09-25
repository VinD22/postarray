import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * A design-system `Button` wraps its children in a truncating span, and an
 * SVG is `display: block`, so an icon passed as a child breaks onto its own
 * line above the label (the composer's Suggest trigger did exactly that).
 * Icons go in `iconStart` / `iconEnd`. `asChild` buttons are exempt: their
 * child is the element itself.
 */
const ICON_CHILD = /<Button\b((?:(?!asChild)[^>])*?)>\s*<([A-Z]\w+)\s+aria-hidden/gs;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return name.endsWith('.tsx') && !name.includes('.test.') ? [full] : [];
  });
}

describe('Button icons', () => {
  it('are never passed as children of a non-asChild Button', () => {
    const root = path.resolve(__dirname, '..');
    const offenders = sourceFiles(root).flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(ICON_CHILD)].map(
        (match) => `${path.relative(root, file)}: ${match[2] ?? ''}`,
      ),
    );
    expect(offenders).toEqual([]);
  });
});
