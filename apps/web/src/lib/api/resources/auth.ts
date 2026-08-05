/**
 * Sign in, sign up and onboarding progress.
 *
 * Every failure here is deliberately uninformative about whether an account
 * exists. The API returns the same shape for "no such account" and "wrong
 * password", and the client never branches on anything finer.
 */

import { call } from '../call.js';
import { demoOnboardingState, demoSession } from '../fixtures.js';
import type { OnboardingStateView, OnboardingUseCase, SessionView } from '../types.js';

export type SocialAuthProvider = 'google' | 'facebook';

export interface PasswordCredentials {
  /** Either an email address or a sign-in alias. The API resolves both. */
  readonly identifier: string;
  readonly password: string;
}

export const authApi = {
  /** Returns the provider consent URL and the exact data the provider shares. */
  beginSocial: (
    input: { provider: SocialAuthProvider; returnUrl: string; intent: 'sign-in' | 'sign-up' },
    idempotencyKey: string,
  ): Promise<{ authorizationUrl: string }> =>
    call('/auth/social/begin', { method: 'POST', body: input, idempotencyKey }, () => ({
      authorizationUrl: input.returnUrl,
    })),

  signInWithPassword: (
    input: PasswordCredentials,
    idempotencyKey: string,
  ): Promise<SessionView> =>
    call('/auth/sign-in', { method: 'POST', body: input, idempotencyKey }, () => demoSession),

  signUpWithPassword: (
    input: { email: string; password: string; name: string },
    idempotencyKey: string,
  ): Promise<SessionView> =>
    call('/auth/sign-up', { method: 'POST', body: input, idempotencyKey }, () => demoSession),

  /**
   * Always resolves. The response never reveals whether the address is
   * registered, which is why the confirmation copy is conditional.
   */
  sendMagicLink: (
    input: { email: string; returnUrl: string },
    idempotencyKey: string,
  ): Promise<{ expiresInMinutes: number; resendAfterSeconds: number }> =>
    call('/auth/magic-link', { method: 'POST', body: input, idempotencyKey }, () => ({
      expiresInMinutes: 15,
      resendAfterSeconds: 60,
    })),

  requestPasswordReset: (
    input: { email: string },
    idempotencyKey: string,
  ): Promise<void> =>
    call('/auth/password-reset', { method: 'POST', body: input, idempotencyKey }, () => undefined),
};

export const onboardingApi = {
  getState: (): Promise<OnboardingStateView> =>
    call('/onboarding', {}, () => demoOnboardingState),

  setUseCase: (input: { useCase: OnboardingUseCase }): Promise<OnboardingStateView> =>
    call('/onboarding/use-case', { method: 'PATCH', body: input }, () => ({
      ...demoOnboardingState,
      useCase: input.useCase,
    })),

  /** Marks a step done so a refresh resumes where the user left off. */
  complete: (input: { step: string }): Promise<OnboardingStateView> =>
    call('/onboarding/steps', { method: 'PATCH', body: input }, () => demoOnboardingState),
};
