import { beforeEach, describe, expect, it, vi } from 'vitest';

const callMock = vi.hoisted(() => vi.fn());

vi.mock('../call', () => ({ call: callMock }));

import { authApi } from './auth';
import { sessionApi } from './core';

describe('browser authentication contract', () => {
  beforeEach(() => {
    callMock.mockReset();
    callMock.mockResolvedValue({ status: 'accepted' });
  });

  it('uses the canonical password and session routes', async () => {
    await authApi.signInWithPassword(
      { identifier: 'person@example.test', password: 'a long test password' },
      'idem-signin',
    );
    await authApi.stepUpWithPassword('a long test password');
    await sessionApi.get('relay_session=session_test');
    await sessionApi.signOut('idem-signout');

    expect(callMock).toHaveBeenNthCalledWith(
      1,
      '/auth/signin',
      expect.objectContaining({ method: 'POST', idempotencyKey: 'idem-signin' }),
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      2,
      '/auth/step-up/password',
      expect.objectContaining({
        method: 'POST',
        body: { password: 'a long test password' },
        sideEffectFree: true,
      }),
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      3,
      '/auth/session',
      { forwardCookie: 'relay_session=session_test' },
      expect.any(Function),
    );
    expect(callMock).toHaveBeenNthCalledWith(
      4,
      '/auth/signout',
      expect.objectContaining({ body: { scope: 'current' }, idempotencyKey: 'idem-signout' }),
      expect.any(Function),
    );
  });

  it('sends the provider schemas for signup and one-time codes', async () => {
    await authApi.signUpWithPassword(
      {
        email: 'person@example.test',
        password: 'a long test password',
        displayName: 'Person',
        locale: 'en',
        timeZone: 'Asia/Kolkata',
        termsVersionHash: 'a'.repeat(64),
        privacyVersionHash: 'b'.repeat(64),
        acceptedTerms: true,
      },
      'idem-signup',
    );
    await authApi.sendMagicLink({ identifier: 'person@example.test', locale: 'en' }, 'idem-code');
    await authApi.verifyOneTimeCode(
      { identifier: 'person@example.test', code: '123456' },
      'idem-verify',
    );

    expect(callMock.mock.calls.map((call) => call[0])).toEqual([
      '/auth/signup',
      '/auth/magic-link',
      '/auth/magic-link/verify',
    ]);
  });
});
