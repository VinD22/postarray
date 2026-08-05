import { Inject, Injectable } from '@nestjs/common';
import { requireConfigValue, type RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import { z } from 'zod';

import { LOGGER, RELAY_CONFIG } from '../../application/tokens.js';
import type {
  IdentityProvider,
  IdentitySession,
  SignUpInput,
  TotpEnrollment,
} from './identity.port.js';

/**
 * Supabase Auth (GoTrue) over its REST interface.
 *
 * Written against the HTTP surface rather than the JavaScript SDK for three
 * reasons: the API process already speaks HTTP and validates every external
 * response with zod, the SDK's session persistence assumes a browser and would
 * be dead weight in a server, and every response here is a boundary that must
 * be parsed rather than trusted.
 *
 * Failures are deliberately flattened. A wrong password, an unknown address, a
 * locked identity and a provider outage all return null from the sign-in path,
 * and the handler renders one response. Distinguishing them for the caller is
 * how account enumeration works.
 */

const providerSessionSchema = z
  .object({
    access_token: z.string().min(1),
    refresh_token: z.string().min(1).optional(),
    user: z
      .object({
        id: z.string().min(1),
        email: z.string().min(3).optional(),
        email_confirmed_at: z.string().nullable().optional(),
        confirmed_at: z.string().nullable().optional(),
        factors: z
          .array(z.object({ id: z.string(), status: z.string(), factor_type: z.string() }))
          .optional(),
      })
      .loose(),
    /** Present when the provider needs a second factor before issuing access. */
    weak_password: z.unknown().optional(),
  })
  .loose();

const enrollResponseSchema = z
  .object({
    id: z.string().min(1),
    totp: z.object({ uri: z.string().min(1) }).loose(),
  })
  .loose();

const challengeResponseSchema = z.object({ id: z.string().min(1) }).loose();

const verifyResponseSchema = z.object({ access_token: z.string().min(1) }).loose();

/** Deliberately fixed. Only its cost matters, never its value. */
const DUMMY_PASSWORD = 'relay-dummy-verification-value-not-a-credential';

@Injectable()
export class SupabaseIdentityProvider implements IdentityProvider {
  constructor(
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  private get baseUrl(): string {
    const url = requireConfigValue(this.config.supabase.url, 'SUPABASE_URL');
    return `${url.replace(/\/+$/, '')}/auth/v1`;
  }

  private get anonKey(): string {
    return requireConfigValue(this.config.supabase.anonKey, 'SUPABASE_ANON_KEY');
  }

  private get serviceRoleKey(): string {
    return requireConfigValue(this.config.supabase.serviceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY');
  }

  private async call(
    path: string,
    init: { method: string; body?: unknown; bearer?: string; serviceRole?: boolean },
  ): Promise<{ status: number; body: unknown }> {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      apikey: init.serviceRole === true ? this.serviceRoleKey : this.anonKey,
    };
    if (init.bearer !== undefined) {
      headers['authorization'] = `Bearer ${init.bearer}`;
    } else if (init.serviceRole === true) {
      headers['authorization'] = `Bearer ${this.serviceRoleKey}`;
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: init.method,
        headers,
        ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch (cause) {
      // Never leak the provider's transport error to a caller: it can carry a
      // hostname, a token in a URL, or a stack from inside our network.
      this.logger.error({ err: cause, path }, 'identity_provider_unreachable');
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { subsystem: 'identity' },
        cause,
      });
    }

    let body: unknown = null;
    const text = await response.text();
    if (text.length > 0) {
      try {
        body = JSON.parse(text);
      } catch {
        body = null;
      }
    }
    return { status: response.status, body };
  }

  private toSession(parsed: z.infer<typeof providerSessionSchema>): IdentitySession {
    const user = parsed.user;
    const verifiedAt = user.email_confirmed_at ?? user.confirmed_at ?? null;
    const verifiedFactor = (user.factors ?? []).find(
      (factor) => factor.factor_type === 'totp' && factor.status === 'verified',
    );
    return {
      userId: user.id,
      email: user.email ?? '',
      emailVerified: typeof verifiedAt === 'string' && verifiedAt.length > 0,
      providerSessionId: parsed.access_token,
      mfaRequired: verifiedFactor !== undefined,
      mfaSatisfiedAt: null,
    };
  }

  async signUp(input: SignUpInput): Promise<{ userId: string | null }> {
    const result = await this.call('/signup', {
      method: 'POST',
      body: { email: input.email, password: input.password, data: { locale: input.locale } },
    });
    if (result.status >= 400) {
      // An address that already exists lands here. The caller answers 202
      // regardless and the provider emails the address that owns it.
      this.logger.info({ status: result.status }, 'identity_signup_not_created');
      return { userId: null };
    }
    const parsed = providerSessionSchema.safeParse(result.body);
    if (parsed.success) {
      return { userId: parsed.data.user.id };
    }
    const userOnly = z.object({ id: z.string().min(1) }).loose().safeParse(result.body);
    return { userId: userOnly.success ? userOnly.data.id : null };
  }

  async signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<IdentitySession | null> {
    const result = await this.call('/token?grant_type=password', {
      method: 'POST',
      body: { email: input.email, password: input.password },
    });
    if (result.status >= 400) {
      return null;
    }
    const parsed = providerSessionSchema.safeParse(result.body);
    return parsed.success ? this.toSession(parsed.data) : null;
  }

  async verifyDummyCredential(): Promise<void> {
    // A real round trip against an address that cannot exist, so the cost of a
    // failed lookup matches the cost of a failed password.
    await this.call('/token?grant_type=password', {
      method: 'POST',
      body: { email: 'dummy-verification@invalid.relay.internal', password: DUMMY_PASSWORD },
    });
  }

  async sendMagicLink(input: { email: string; locale: string }): Promise<void> {
    await this.call('/otp', {
      method: 'POST',
      body: { email: input.email, create_user: false, data: { locale: input.locale } },
    });
  }

  async verifyOtp(input: { email: string; token: string }): Promise<IdentitySession | null> {
    const result = await this.call('/verify', {
      method: 'POST',
      body: { type: 'email', email: input.email, token: input.token },
    });
    if (result.status >= 400) {
      return null;
    }
    const parsed = providerSessionSchema.safeParse(result.body);
    return parsed.success ? this.toSession(parsed.data) : null;
  }

  async sendPasswordReset(input: { email: string; locale: string }): Promise<void> {
    await this.call('/recover', {
      method: 'POST',
      body: { email: input.email, data: { locale: input.locale } },
    });
  }

  async signOut(providerSessionId: string): Promise<void> {
    await this.call('/logout', { method: 'POST', bearer: providerSessionId });
  }

  async enrollTotp(input: { userId: string; providerSessionId: string }): Promise<TotpEnrollment> {
    const result = await this.call('/factors', {
      method: 'POST',
      bearer: input.providerSessionId,
      body: { factor_type: 'totp', friendly_name: 'Relay' },
    });
    const parsed = enrollResponseSchema.safeParse(result.body);
    if (result.status >= 400 || !parsed.success) {
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { subsystem: 'identity', operation: 'enroll_totp' },
      });
    }
    return { factorId: parsed.data.id, provisioningUri: parsed.data.totp.uri };
  }

  async verifyTotp(input: {
    userId: string;
    providerSessionId: string;
    factorId: string;
    code: string;
  }): Promise<boolean> {
    const challenge = await this.call(`/factors/${input.factorId}/challenge`, {
      method: 'POST',
      bearer: input.providerSessionId,
    });
    const parsedChallenge = challengeResponseSchema.safeParse(challenge.body);
    if (challenge.status >= 400 || !parsedChallenge.success) {
      return false;
    }
    const verified = await this.call(`/factors/${input.factorId}/verify`, {
      method: 'POST',
      bearer: input.providerSessionId,
      body: { challenge_id: parsedChallenge.data.id, code: input.code },
    });
    return verified.status < 400 && verifyResponseSchema.safeParse(verified.body).success;
  }
}
