import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * One inverted band per page.
 *
 * `EditorialSection tone="inverted"` is the single dramatic moment on a page,
 * not a rhythm — see that component's own doc comment. It cannot be enforced
 * at runtime: React Server Components render concurrently across requests, so
 * a module-level tally would be shared state between two visitors' pages and a
 * React context would only see the subtree it wraps, not sibling sections
 * returned from the same page. So it is enforced here, by reading the page
 * sources.
 *
 * A page declares an inverted band in exactly two ways: by passing
 * `tone="inverted"` to `EditorialSection`, or by rendering `ClosingCta`, which
 * is an inverted band by construction. The sum of the two must be at most one.
 */
// Built with `join`, not `new URL`: the route segments contain `[` and `(`,
// which a URL would percent-encode into a path that does not exist on disk.
const MARKETING_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../../app/[locale]/(marketing)',
);

/** Pages migrated onto the editorial vocabulary. Grows as later passes land. */
const MIGRATED_PAGES = [
  'page.tsx',
  'pricing/page.tsx',
  'product/page.tsx',
  'compare/page.tsx',
  'for-creators/page.tsx',
  'for-agencies/page.tsx',
  'for-developers/page.tsx',
] as const;

function countMatches(source: string, pattern: RegExp): number {
  return source.match(pattern)?.length ?? 0;
}

describe('the editorial marketing pages', () => {
  it.each(MIGRATED_PAGES)('declares at most one inverted band: %s', async (page) => {
    const source = await readFile(`${MARKETING_DIR}/${page}`, 'utf8');

    const explicitInverted = countMatches(source, /tone="inverted"/g);
    const closingCtas = countMatches(source, /<ClosingCta[\s/>]/g);

    expect(explicitInverted + closingCtas).toBeLessThanOrEqual(1);
  });

  it.each(MIGRATED_PAGES)('imports no loud component: %s', async (page) => {
    const source = await readFile(`${MARKETING_DIR}/${page}`, 'utf8');
    expect(source).not.toMatch(/components\/loud\//);
  });

  it('lists every page that still imports the loud vocabulary', async () => {
    // Not a threshold to keep green by editing the number: the loud directory
    // survives this pass on purpose, because roughly twenty other surfaces
    // still import it. This test states the remaining set so a later pass can
    // see at a glance what is left, and fails loudly if a *new* consumer
    // appears among the pages this pass already migrated.
    const remaining = await loudConsumersUnder(MARKETING_DIR);
    for (const page of MIGRATED_PAGES) {
      expect(remaining).not.toContain(page);
    }
  });
});

async function loudConsumersUnder(root: string, prefix = ''): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const found: string[] = [];
  for (const entry of entries) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      found.push(...(await loudConsumersUnder(`${root}/${entry.name}`, relative)));
      continue;
    }
    if (!entry.name.endsWith('.tsx')) continue;
    const source = await readFile(`${root}/${entry.name}`, 'utf8');
    if (source.includes('components/loud/')) {
      found.push(relative);
    }
  }
  return found;
}
