import { describe, expect, it } from 'vitest';

import { updateProjectConnectionsSchema, updateProjectSchema } from './projects.schemas';

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

describe('project connection membership input', () => {
  it('defaults the missing side to an empty list', () => {
    expect(updateProjectConnectionsSchema.parse({ add: ['conn_1'] })).toEqual({
      add: ['conn_1'],
      remove: [],
    });
  });

  it('rejects an empty change and unknown fields', () => {
    expect(() => updateProjectConnectionsSchema.parse({})).toThrow();
    expect(() => updateProjectConnectionsSchema.parse({ connectionIds: ['conn_1'] })).toThrow();
  });
});
