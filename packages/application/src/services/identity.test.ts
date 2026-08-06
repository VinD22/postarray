import { describe, expect, it } from 'vitest';

import { normalizeAliasForLookup } from './identity';

describe('normalizeAliasForLookup', () => {
  it('normalizes compatible ASCII aliases deterministically', () => {
    expect(normalizeAliasForLookup('  Mira.K_7  ')).toBe('mira.k_7');
    expect(normalizeAliasForLookup('ｍira')).toBe('mira');
  });

  it('rejects aliases outside the conservative launch policy', () => {
    expect(normalizeAliasForLookup('mıra')).toBeNull();
    expect(normalizeAliasForLookup('ab')).toBeNull();
    expect(normalizeAliasForLookup('7mira')).toBeNull();
  });
});
