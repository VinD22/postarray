import { describe, expect, it } from 'vitest';

import { DatabaseError } from '../errors';

import { buildClaimsPayload, serviceRoleClaims } from './rls-context';

/**
 * The claim payload is the contract between this package and the SQL helpers in
 * `migrations/0010_rls_helpers.sql`. If a key name drifts, every policy silently
 * starts denying, so the exact strings are asserted here.
 */

const USER = '33333333-3333-4333-8333-333333333333';
const WORKSPACE = '44444444-4444-4444-8444-444444444444';

describe('buildClaimsPayload', () => {
  it('defaults to the authenticated role', () => {
    expect(JSON.parse(buildClaimsPayload({}))).toEqual({ role: 'authenticated' });
  });

  it('emits the claim names the SQL helpers read', () => {
    const payload: unknown = JSON.parse(
      buildClaimsPayload({ userId: USER, workspaceId: WORKSPACE, role: 'service_role' }),
    );

    expect(payload).toEqual({
      role: 'service_role',
      relay_user_id: USER,
      relay_workspace_id: WORKSPACE,
    });
  });

  it('emits the opaque Neon Auth subject under `sub`', () => {
    const payload: unknown = JSON.parse(buildClaimsPayload({ authSubjectId: 'neon_user_01ABC' }));
    expect(payload).toMatchObject({ sub: 'neon_user_01ABC' });
  });

  it('rejects a non-UUID user id rather than sending a claim that silently denies', () => {
    expect(() => buildClaimsPayload({ userId: 'user_123' })).toThrowError(DatabaseError);
  });

  it('rejects a non-UUID workspace id', () => {
    expect(() => buildClaimsPayload({ workspaceId: 'ws_123' })).toThrowError(DatabaseError);
  });

  it('rejects an auth subject containing whitespace or control characters', () => {
    expect(() => buildClaimsPayload({ authSubjectId: 'neon user' })).toThrowError(DatabaseError);
  });
});

describe('serviceRoleClaims', () => {
  it('names the service role', () => {
    expect(serviceRoleClaims()).toEqual({ role: 'service_role' });
  });

  it('carries the acting operator when there is one, so the audit line has a name', () => {
    expect(serviceRoleClaims(USER)).toEqual({ role: 'service_role', userId: USER });
  });
});
