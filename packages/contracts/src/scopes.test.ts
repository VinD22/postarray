import { describe, expect, it } from 'vitest';

import {
  ALL_SCOPES,
  CONSEQUENTIAL_SCOPES,
  READ_SCOPES,
  SCOPES,
  hasConsequentialScope,
  isScope,
  missingScopes,
  normalizeScopes,
  scopeRisk,
  scopeSatisfies,
  scopeSchema,
  scopeStringSchema,
  scopesSatisfy,
} from './scopes.js';

describe('scope registry', () => {
  it('lists exactly the documented scopes', () => {
    expect([...ALL_SCOPES].sort()).toEqual(
      [
        'accounts:read',
        'accounts:write',
        'analytics:read',
        'billing:read',
        'connections:admin',
        'drafts:read',
        'drafts:write',
        'growth:read',
        'growth:write',
        'media:read',
        'media:write',
        'posts:cancel',
        'posts:publish',
        'posts:schedule',
        'rules:read',
        'rules:write',
        'webhooks:manage',
      ].sort(),
    );
  });

  it('gives every scope a risk and an intent based description key', () => {
    for (const scope of ALL_SCOPES) {
      const definition = SCOPES[scope];
      expect(['read', 'reversible', 'consequential']).toContain(definition.risk);
      expect(definition.descriptionKey.startsWith('scopes.')).toBe(true);
      expect(scopeSchema.safeParse(scope).success).toBe(true);
    }
  });

  it('classifies publishing and connection administration as consequential', () => {
    expect(CONSEQUENTIAL_SCOPES).toContain('posts:publish');
    expect(CONSEQUENTIAL_SCOPES).toContain('posts:schedule');
    expect(CONSEQUENTIAL_SCOPES).toContain('connections:admin');
    expect(READ_SCOPES).toContain('billing:read');
    expect(scopeRisk('drafts:write')).toBe('reversible');
  });
});

describe('scopeSatisfies', () => {
  it('matches only the exact scope', () => {
    expect(scopeSatisfies(['posts:publish'], 'posts:publish')).toBe(true);
    expect(scopeSatisfies(['posts:publish'], 'posts:schedule')).toBe(false);
  });

  it('does not let a write scope escalate into publishing', () => {
    const granted = ['accounts:write', 'drafts:write', 'media:write'];
    expect(scopeSatisfies(granted, 'posts:publish')).toBe(false);
    expect(scopeSatisfies(granted, 'posts:schedule')).toBe(false);
    expect(scopeSatisfies(granted, 'connections:admin')).toBe(false);
    expect(scopeSatisfies(granted, 'billing:read')).toBe(false);
  });

  it('does not let a write scope imply its own read scope', () => {
    expect(scopeSatisfies(['drafts:write'], 'drafts:read')).toBe(false);
    expect(scopeSatisfies(['accounts:write'], 'accounts:read')).toBe(false);
  });

  it('ignores wildcards and made-up scopes', () => {
    expect(scopeSatisfies(['*'], 'posts:publish')).toBe(false);
    expect(scopeSatisfies(['full_access'], 'analytics:read')).toBe(false);
    expect(scopeSatisfies(['posts:*'], 'posts:publish')).toBe(false);
  });
});

describe('scope helpers', () => {
  it('requires every listed scope', () => {
    expect(scopesSatisfy(['drafts:read', 'drafts:write'], ['drafts:read', 'drafts:write'])).toBe(
      true,
    );
    expect(scopesSatisfy(['drafts:read'], ['drafts:read', 'posts:schedule'])).toBe(false);
    expect(scopesSatisfy([], [])).toBe(true);
  });

  it('reports what is missing', () => {
    expect(missingScopes(['drafts:read'], ['drafts:read', 'posts:publish', 'media:read'])).toEqual([
      'posts:publish',
      'media:read',
    ]);
  });

  it('normalizes an untrusted list', () => {
    expect(normalizeScopes(['posts:publish', 'nope', 'posts:publish', 'drafts:read'])).toEqual([
      'drafts:read',
      'posts:publish',
    ]);
    expect(isScope('drafts:read')).toBe(true);
    expect(isScope('toString')).toBe(false);
  });

  it('detects a grant that can publish', () => {
    expect(hasConsequentialScope(['analytics:read', 'drafts:write'])).toBe(false);
    expect(hasConsequentialScope(['analytics:read', 'posts:publish'])).toBe(true);
  });

  it('parses the space delimited OAuth form', () => {
    const parsed = scopeStringSchema.parse('drafts:read  posts:schedule');
    expect(parsed).toEqual(['drafts:read', 'posts:schedule']);
    expect(scopeStringSchema.safeParse('drafts:read invented:scope').success).toBe(false);
  });
});
