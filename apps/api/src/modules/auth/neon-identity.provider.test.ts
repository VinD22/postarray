import { ERROR_CODES, RelayError } from '@relay/contracts';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RecordingLogger, asLogger, testConfig } from '../../testing/fakes';
import { NeonIdentityProvider } from './neon-identity.provider';

const SESSION_COOKIE = '__Secure-neon-auth.session_token=session-opaque-value';

function provider(): NeonIdentityProvider {
  return new NeonIdentityProvider(testConfig(), asLogger(new RecordingLogger()));
}

function jsonResponse(
  body: unknown,
  status = 200,
  headers: Readonly<Record<string, string>> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('NeonIdentityProvider', () => {
  it('parses a password session and retains only the opaque Neon session cookie', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        { user: { id: 'neon_user_01ABC', email: 'owner@example.test', emailVerified: true } },
        200,
        { 'set-cookie': `${SESSION_COOKIE}; Path=/; Secure; HttpOnly; SameSite=Lax` },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      provider().signInWithPassword({ email: 'owner@example.test', password: 'valid-password' }),
    ).resolves.toMatchObject({
      userId: 'neon_user_01ABC',
      emailVerified: true,
      providerSessionId: SESSION_COOKIE,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://auth.relay.test/sign-in/email'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('fails closed when a successful response has no usable session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({ user: { id: 'neon_user_01ABC', email: 'owner@example.test' } }),
      ),
    );
    await expect(
      provider().signInWithPassword({ email: 'owner@example.test', password: 'password' }),
    ).resolves.toBeNull();
  });

  it('uses the email OTP endpoints for code-based sign in', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ success: true }))
      .mockResolvedValueOnce(
        jsonResponse(
          { user: { id: 'neon_user_01ABC', email: 'owner@example.test' } },
          200,
          { 'set-cookie': `${SESSION_COOKIE}; Path=/; Secure; HttpOnly` },
        ),
      );
    vi.stubGlobal('fetch', fetchMock);
    const identity = provider();

    await identity.sendMagicLink({ email: 'owner@example.test', locale: 'en' });
    await identity.verifyOtp({ email: 'owner@example.test', token: '123456' });

    expect(fetchMock.mock.calls.map((call) => String(call[0]))).toEqual([
      'https://auth.relay.test/email-otp/send-verification-otp',
      'https://auth.relay.test/sign-in/email-otp',
    ]);
  });

  it('sends the provider cookie back when signing out', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true }));
    vi.stubGlobal('fetch', fetchMock);

    await provider().signOut(SESSION_COOKIE);

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://auth.relay.test/sign-out'),
      expect.objectContaining({ headers: expect.objectContaining({ cookie: SESSION_COOKIE }) }),
    );
  });

  it('reports TOTP truthfully as not implemented for Neon Auth', () => {
    expect(() =>
      provider().enrollTotp({ userId: 'user_01', providerSessionId: SESSION_COOKIE }),
    ).toThrowError(
      expect.objectContaining<Partial<RelayError>>({ code: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED }),
    );
  });

  it('maps an upstream outage to a sanitized provider error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ private: 'payload' }, 503)));

    await expect(
      provider().signInWithPassword({ email: 'owner@example.test', password: 'password' }),
    ).rejects.toMatchObject({ code: ERROR_CODES.PROVIDER_UNAVAILABLE });
  });
});
