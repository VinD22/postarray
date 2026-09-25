import { describe, expect, it } from 'vitest';

import { loadCatalog } from '@relay/i18n';

import { SHELL_KEY_PREFIXES, sliceCatalog } from './catalog-slice';

describe('sliceCatalog', () => {
  it('keeps only keys under the given prefixes', () => {
    const catalog = { 'a11y.x': 'A', 'web.home.title': 'B', 'nav.y': 'C' } as never;
    expect(sliceCatalog(catalog, ['a11y.', 'nav.'])).toEqual({ 'a11y.x': 'A', 'nav.y': 'C' });
  });

  // The root layout serializes this slice into every public page's RSC
  // payload. A budget keeps a new namespace from quietly riding along.
  it('keeps the root shell slice small', async () => {
    const full = await loadCatalog('en');
    const shell = sliceCatalog(full, SHELL_KEY_PREFIXES);
    const shellBytes = JSON.stringify(shell).length;
    const fullBytes = JSON.stringify(full).length;
    expect(shellBytes).toBeLessThan(40_000);
    expect(shellBytes).toBeLessThan(fullBytes / 10);
    expect(shell['a11y.region.notifications' as keyof typeof shell]).toBeDefined();
    expect(shell['action.close' as keyof typeof shell]).toBeDefined();
  });
});
