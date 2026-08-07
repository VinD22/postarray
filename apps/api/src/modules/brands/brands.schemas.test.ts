import { describe, expect, it } from 'vitest';

import { updateBrandSchema } from './brands.schemas';

describe('brand rule input', () => {
  it('accepts the persisted voice, audience, claim, term and domain fields', () => {
    expect(
      updateBrandSchema.parse({
        name: 'Example',
        voice: 'Direct and specific.',
        audience: 'Independent publishing teams.',
        approvedClaims: ['Supports scheduled publishing'],
        blockedTerms: ['guaranteed growth'],
        domains: ['example.test'],
      }),
    ).toEqual({
      name: 'Example',
      voice: 'Direct and specific.',
      audience: 'Independent publishing teams.',
      approvedClaims: ['Supports scheduled publishing'],
      blockedTerms: ['guaranteed growth'],
      domains: ['example.test'],
    });
  });

  it('rejects unknown and unbounded rule input', () => {
    expect(() => updateBrandSchema.parse({ localeRules: {} })).toThrow();
    expect(() =>
      updateBrandSchema.parse({ approvedClaims: Array.from({ length: 101 }, () => 'claim') }),
    ).toThrow();
  });
});
