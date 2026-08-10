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
  'blog/page.tsx',
  'changelog/page.tsx',
  'docs/page.tsx',
  'integrations/page.tsx',
  'integrations/capabilities/page.tsx',
  'legal/page.tsx',
  'methodology/page.tsx',
  'opportunities/page.tsx',
  'resources/page.tsx',
  'status/page.tsx',
  'tool-radar/page.tsx',
  'tools/page.tsx',
] as const;

/**
 * The whole `apps/web/src` tree, for the loud-residue census below.
 *
 * `MARKETING_DIR` is four levels up plus the route segments; the source root is
 * the same four levels up on its own.
 */
const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../../..');

/** `features/marketing/components`, one level up from this file. */
const MARKETING_DIR_COMPONENTS = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Nothing may import `components/loud/`. The directory is gone.
 *
 * The last two consumers were the tools page, which now uses `EditorialSection`
 * and `EditorialDisplay`, and the media alt-text nudge, which now uses the
 * design-system `Badge` because a product surface should never have been
 * reaching into the marketing vocabulary in the first place.
 *
 * This stays an empty exact set rather than being deleted with the directory:
 * it is what stops the poster system being reintroduced one import at a time.
 */
const LOUD_CONSUMERS_ALLOWED: readonly string[] = [];

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

  it('leaves no marketing route on the loud vocabulary', async () => {
    expect(await loudConsumersUnder(MARKETING_DIR)).toEqual([]);
  });
});

describe('the loud marketing vocabulary', () => {
  it('has exactly the consumers it is allowed to have', async () => {
    // Not a threshold to keep green by editing a number. The set is empty and
    // the directory is deleted. A name appearing here means a surface reached
    // back for the poster system, which is the thing this test exists to catch.
    const remaining = await loudConsumersUnder(SRC_DIR);
    expect([...remaining].sort()).toEqual([...LOUD_CONSUMERS_ALLOWED].sort());
  });

  it('no longer exists on disk', async () => {
    await expect(readdir(`${MARKETING_DIR_COMPONENTS}/loud`)).rejects.toThrow();
  });
});

async function loudConsumersUnder(root: string, prefix = ''): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const found: string[] = [];
  for (const entry of entries) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      // The loud components import each other; a file inside the directory is
      // not a consumer of it.
      if (relative.endsWith('components/loud')) continue;
      found.push(...(await loudConsumersUnder(`${root}/${entry.name}`, relative)));
      continue;
    }
    if (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) continue;
    const source = await readFile(`${root}/${entry.name}`, 'utf8');
    // This file names the path in prose and in its own allow-list.
    if (relative.endsWith('inverted-band.test.ts')) continue;
    if (relative.endsWith('editorial/index.ts')) continue;
    if (source.includes('components/loud/')) {
      found.push(relative);
    }
  }
  return found;
}
