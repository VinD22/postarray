import { describe, expect, it } from 'vitest';

import { updateProjectSchema } from './projects.schemas';

describe('project rule input', () => {
  it('accepts the persisted voice, audience, claim, term and domain fields', () => {
    expect(
      updateProjectSchema.parse({
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
    expect(() => updateProjectSchema.parse({ localeRules: {} })).toThrow();
    expect(() =>
      updateProjectSchema.parse({ approvedClaims: Array.from({ length: 101 }, () => 'claim') }),
    ).toThrow();
  });
});
