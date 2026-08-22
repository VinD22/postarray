import { describe, expect, it } from 'vitest';

import { REQUESTED_SCOPES, buildPermissions } from './permissions';

describe('buildPermissions', () => {
  it('marks a scope the provider granted as granted', () => {
    const rows = buildPermissions('linkedin', ['w_member_social', 'openid']);
    expect(rows.find((row) => row.scope === 'w_member_social')?.state).toBe('granted');
    expect(rows.find((row) => row.scope === 'openid')?.state).toBe('granted');
  });

  it('marks a requested scope the provider withheld as not granted', () => {
    const rows = buildPermissions('linkedin', ['w_member_social']);
    expect(rows.find((row) => row.scope === 'r_organization_social')?.state).toBe('not_granted');
  });

  it('reports unknown, never not granted, when there is no record of the grant', () => {
    const rows = buildPermissions('linkedin', null);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((row) => row.state === 'unknown')).toBe(true);
    expect(rows.some((row) => row.state === 'not_granted')).toBe(false);
  });

  it('keeps every requested scope and its purpose', () => {
    for (const [provider, requested] of Object.entries(REQUESTED_SCOPES)) {
      const rows = buildPermissions(provider, []);
      expect(rows.map((row) => row.scope)).toEqual(requested.map((entry) => entry.scope));
      expect(rows.every((row) => row.purposeKey.length > 0)).toBe(true);
    }
  });

  it('returns nothing for a provider with no authored scope list', () => {
    expect(buildPermissions('unknown_provider', ['anything'])).toEqual([]);
  });
});
