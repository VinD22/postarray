import { z } from 'zod';

/**
 * The identity provider port.
 *
 * Neon Auth is the identity provider for all four real login methods. This
 * interface is what `apps/api` needs from it, so the transport layer can be
 * tested without a network and so a provider migration is one implementation
 * rather than a rewrite of every route.
 *
 * What this port deliberately does **not** carry: a third-party provider token.
 * The provider may hand one back during a social login and we discard it. A
 * login-scoped Google token is not a YouTube publishing credential, and reusing
 * it as one is both a policy violation and a design that breaks the first time
 * a scope changes (`04-auth-oauth-and-security.md`, section 6).
 */

export const identitySessionSchema = z
  .object({
    userId: z.string().min(1).max(128),
    email: z.string().min(3).max(320),
    emailVerified: z.boolean(),
    /** The provider's own session handle, used to sign out there too. */
    providerSessionId: z.string().min(1).max(512).nullable(),
    /** True when the provider requires a second factor before this is usable. */
    mfaRequired: z.boolean(),
    /** Instant the provider recorded the second factor, when it did. */
    mfaSatisfiedAt: z.string().min(1).max(64).nullable(),
  })
  .strict();
export type IdentitySession = z.infer<typeof identitySessionSchema>;

export interface SignUpInput {
  readonly email: string;
  readonly password: string;
  readonly displayName: string;
  readonly locale: string;
}

export interface TotpEnrollment {
  /** The provider's factor handle, needed to verify the first code. */
  readonly factorId: string;
  /** `otpauth://` URI for the authenticator app. Shown once, never stored. */
  readonly provisioningUri: string;
}

export interface IdentityProvider {
  /**
   * Create an identity. Never reveals whether the address already exists: an
   * existing address produces the same response and an email to the address
   * that actually owns it.
   */
  signUp(input: SignUpInput): Promise<{ userId: string | null }>;

  /** Verify a password. Returns null for every failure, uniformly. */
  signInWithPassword(input: { email: string; password: string }): Promise<IdentitySession | null>;

  /**
   * Equalize the cost of a failed lookup.
   *
   * When an identifier does not resolve, the handler still performs a
   * verification against a fixed dummy credential with the same parameters as a
   * real one. Without this, a forty millisecond difference tells an attacker
   * that a username exists.
   */
  verifyDummyCredential(): Promise<void>;

  /** Send a one-time email code. Always reports success to the caller. */
  sendMagicLink(input: { email: string; locale: string }): Promise<void>;

  /** Exchange a one-time code for a session. Null on any failure. */
  verifyOtp(input: { email: string; token: string }): Promise<IdentitySession | null>;

  /** Send a password reset. Always reports success to the caller. */
  sendPasswordReset(input: { email: string; locale: string }): Promise<void>;

  /**
   * Set a new password from a reset token.
   *
   * Unlike the send half, this one is allowed to fail visibly: the person is
   * holding a link from their own inbox, and telling them plainly that it has
   * expired is what lets them ask for another. It still reveals nothing about
   * which account the token belonged to. False covers every failure uniformly:
   * unknown token, consumed token, expired token.
   */
  completePasswordReset(input: { token: string; newPassword: string }): Promise<boolean>;

  /** Invalidate the provider-side session. */
  signOut(providerSessionId: string): Promise<void>;

  /** Begin TOTP enrolment. The secret is shown once and never stored by us. */
  enrollTotp(input: { userId: string; providerSessionId: string }): Promise<TotpEnrollment>;

  /** Confirm enrolment, or satisfy a step-up, with a six digit code. */
  verifyTotp(input: {
    userId: string;
    providerSessionId: string;
    factorId: string;
    code: string;
  }): Promise<boolean>;
}
