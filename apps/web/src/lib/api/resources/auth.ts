/**
 * Sign in, sign up and onboarding progress.
 *
 * Every failure here is deliberately uninformative about whether an account
 * exists. The API returns the same shape for "no such account" and "wrong
 * password", and the client never branches on anything finer.
 */

import { call } from '../call';
import type { ForwardAuth } from '../transport';
import { demoOnboardingState } from '../fixtures';
import type { ManagedSessionView, OnboardingStateView, OnboardingUseCase } from '../types';

export interface EstablishedSession {
  readonly userId: string;
  readonly workspaceIds: readonly string[];
  readonly csrfToken: string;
  readonly expiresAt: string;
}

export interface PasswordCredentials {
  /** Either an email address or a sign-in alias. The API resolves both. */
  readonly identifier: string;
  readonly password: string;
}

export const authApi = {
  stepUpWithPassword: (password: string): Promise<{ verified: true }> =>
    call(
      '/auth/step-up/password',
      { method: 'POST', body: { password }, sideEffectFree: true },
      () => ({ verified: true }),
    ),

  sessions: (): Promise<readonly ManagedSessionView[]> =>
    call<{ readonly data: readonly ManagedSessionView[] }, readonly ManagedSessionView[]>(
      '/auth/sessions',
      {},
      () => [
        {
          id: 'session_demo_current',
          device: 'mac',
          location: null,
          lastSeenAt: new Date().toISOString(),
          isCurrent: true,
        },
      ],
      ({ data }) => data,
    ),

  revokeOtherSessions: (idempotencyKey: string): Promise<{ terminatedSessions: number }> =>
    call('/auth/sessions/revoke-others', { method: 'POST', body: {}, idempotencyKey }, () => ({
      terminatedSessions: 0,
    })),

  signInWithPassword: (
    input: PasswordCredentials,
    idempotencyKey: string,
  ): Promise<EstablishedSession> =>
    call('/auth/signin', { method: 'POST', body: input, idempotencyKey }, () => ({
      userId: 'user_demo000000000000000001',
      workspaceIds: ['ws_demo0000000000000000001'],
      csrfToken: 'demo-csrf',
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    })),

  signUpWithPassword: (
    input: {
      email: string;
      password: string;
      displayName: string;
      locale: string;
      timeZone: string;
      termsVersionHash: string;
      privacyVersionHash: string;
      acceptedTerms: true;
    },
    idempotencyKey: string,
  ): Promise<{ status: 'accepted' }> =>
    call('/auth/signup', { method: 'POST', body: input, idempotencyKey }, () => ({
      status: 'accepted',
    })),

  /**
   * Always resolves. The response never reveals whether the address is
   * registered, which is why the confirmation copy is conditional.
   */
  sendMagicLink: (
    input: { identifier: string; locale: string },
    idempotencyKey: string,
  ): Promise<{ status: 'accepted' }> =>
    call('/auth/magic-link', { method: 'POST', body: input, idempotencyKey }, () => ({
      status: 'accepted',
    })),

  verifyOneTimeCode: (
    input: { identifier: string; code: string },
    idempotencyKey: string,
  ): Promise<EstablishedSession> =>
    call('/auth/magic-link/verify', { method: 'POST', body: input, idempotencyKey }, () => ({
      userId: 'user_demo000000000000000001',
      workspaceIds: ['ws_demo0000000000000000001'],
      csrfToken: 'demo-csrf',
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    })),

  /**
   * Finish a reset with the token from the email.
   *
   * The token travels in the body, never the query string, so it does not land
   * in browser history, a referrer header or a proxy log. Unlike the request
   * half, this one is allowed to fail visibly: the person is holding a link
   * from their own inbox, and telling them the link expired is what lets them
   * ask for another.
   */
  completePasswordReset: (input: {
    token: string;
    newPassword: string;
  }): Promise<{
    status: 'reset';
  }> =>
    call('/auth/password-reset/complete', { method: 'POST', body: input }, () => ({
      status: 'reset' as const,
    })),

  requestPasswordReset: (
    input: { identifier: string; locale: string },
    idempotencyKey: string,
  ): Promise<{ status: 'accepted' }> =>
    call('/auth/password-reset', { method: 'POST', body: input, idempotencyKey }, () => ({
      status: 'accepted',
    })),
};

export const onboardingApi = {
  /**
   * Where this person is in the first run.
   *
   * Read from a Server Component as well as from the browser, so it takes the
   * same `ForwardAuth` every other server-side read takes. Without it the Next
   * server calls the API with no session cookie and Node's own user agent, the
   * fingerprint check fails, and the entry point 401s for a healthy session.
   */
  getState: (forward: ForwardAuth = {}): Promise<OnboardingStateView> =>
    call('/onboarding', { ...forward }, () => demoOnboardingState),

  setUseCase: (input: { useCase: OnboardingUseCase }): Promise<OnboardingStateView> =>
    call('/onboarding/use-case', { method: 'PATCH', body: input }, () => ({
      ...demoOnboardingState,
      useCase: input.useCase,
    })),

  /** Marks a step done so a refresh resumes where the user left off. */
  complete: (input: { step: string }): Promise<OnboardingStateView> =>
    call('/onboarding/steps', { method: 'PATCH', body: input }, () => demoOnboardingState),
};
