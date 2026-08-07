/**
 * Sign in, sign up and onboarding progress.
 *
 * Every failure here is deliberately uninformative about whether an account
 * exists. The API returns the same shape for "no such account" and "wrong
 * password", and the client never branches on anything finer.
 */

import { call } from '../call';
import { demoOnboardingState } from '../fixtures';
import type { OnboardingStateView, OnboardingUseCase } from '../types';

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

  requestPasswordReset: (
    input: { identifier: string; locale: string },
    idempotencyKey: string,
  ): Promise<{ status: 'accepted' }> =>
    call('/auth/password-reset', { method: 'POST', body: input, idempotencyKey }, () => ({
      status: 'accepted',
    })),
};

export const onboardingApi = {
  getState: (): Promise<OnboardingStateView> => call('/onboarding', {}, () => demoOnboardingState),

  setUseCase: (input: { useCase: OnboardingUseCase }): Promise<OnboardingStateView> =>
    call('/onboarding/use-case', { method: 'PATCH', body: input }, () => ({
      ...demoOnboardingState,
      useCase: input.useCase,
    })),

  /** Marks a step done so a refresh resumes where the user left off. */
  complete: (input: { step: string }): Promise<OnboardingStateView> =>
    call('/onboarding/steps', { method: 'PATCH', body: input }, () => demoOnboardingState),
};
