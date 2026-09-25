/**
 * The brand colour gate.
 *
 * Provider brand colour is permitted in three places and three only: an
 * identity dot, a 1px rule, and a logo at logo scale beside the provider's
 * name as text (`packages/design-system/README.md`, "Provider brand colours").
 * A preview is exactly the surface where that rule is easiest to break, since
 * a mock post that wore a platform's own blue would look more convincing and
 * be less honest: it would read as a rendering by the platform rather than as
 * our model of it.
 *
 * So no file under `previews/` may paint a brand colour itself. The header
 * glyph comes from `ProviderIdentity`, which uses the reviewed `StatusDot`
 * and puts the platform name beside it in text.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const PREVIEWS_DIR = join(process.cwd(), 'src/features/composer/previews');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return sourceFiles(full);
    }
    return /\.tsx?$/.test(entry) ? [full] : [];
  });
}

const FILES = sourceFiles(PREVIEWS_DIR);

/** Utilities and tokens that paint with a provider's own colour. */
const BANNED = [/\bbg-brand-/, /\bborder-brand-/, /\btext-brand-/, /--brand-/];

describe('previews never paint a provider brand colour', () => {
  it('finds files to check, so a rename cannot silently disable this gate', () => {
    expect(FILES.length).toBeGreaterThan(15);
  });

  it('has no brand fill, brand border or brand token in any preview file', () => {
    const offenders = FILES.flatMap((file) => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => BANNED.some((pattern) => pattern.test(line)))
        // This suite names the patterns it bans, so its own source is exempt.
        .filter(() => !file.endsWith('brand-colour.test.ts'))
        .map(({ index }) => `${relative(PREVIEWS_DIR, file)}:${index + 1}`);
    });
    expect(offenders).toEqual([]);
  });

  it('gets its provider glyph from the reviewed identity component', () => {
    const frame = readFileSync(join(PREVIEWS_DIR, 'frame.tsx'), 'utf8');
    expect(frame).toContain('ProviderIdentity');
  });
});
