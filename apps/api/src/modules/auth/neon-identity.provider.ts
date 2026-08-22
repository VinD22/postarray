import { Inject, Injectable } from '@nestjs/common';
import { requireConfigValue, type RelayConfig } from '@relay/config';
import { CapabilityNotImplementedError, ERROR_CODES, RelayError } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import { z } from 'zod';

import { LOGGER, RELAY_CONFIG } from '../../application/tokens';
import type {
  IdentityProvider,
  IdentitySession,
  SignUpInput,
  TotpEnrollment,
} from './identity.port';

const SESSION_COOKIE_NAME = '__Secure-neon-auth.session_token';
const DUMMY_PASSWORD = 'relay-dummy-verification-value-not-a-credential';

const neonUserSchema = z
  .object({
    id: z.string().min(1).max(128),
    email: z.string().email(),
    emailVerified: z.boolean().optional(),
  })
  .loose();

const authResponseSchema = z
  .object({
    user: neonUserSchema,
    token: z.string().min(1).max(2_048).optional(),
  })
  .loose();

interface ProviderResponse {
  readonly status: number;
  readonly body: unknown;
  readonly sessionCookie: string | null;
}

function sessionCookieFrom(headers: Headers, body: unknown): string | null {
  const withGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  const values = withGetSetCookie.getSetCookie?.() ?? [];
  const fallback = headers.get('set-cookie');
  if (fallback !== null) values.push(fallback);

  for (const value of values) {
    const first = value.split(';', 1)[0]?.trim();
    if (first?.startsWith(`${SESSION_COOKIE_NAME}=`) === true && !/[\r\n]/u.test(first)) {
      return first;
    }
  }

  const parsed = authResponseSchema.safeParse(body);
  return parsed.success && parsed.data.token !== undefined
    ? `${SESSION_COOKIE_NAME}=${parsed.data.token}`
    : null;
}

/**
 * Neon Auth's managed Better Auth REST surface.
 *
 * The API process owns a separate Relay session, so only Neon's opaque session
 * cookie is retained for provider sign-out. Provider responses are parsed at
 * this boundary and no provider payload is logged or exposed to a caller.
 */
@Injectable()
export class NeonIdentityProvider implements IdentityProvider {
  constructor(
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    @Inject(LOGGER) private readonly logger: Logger,
  ) {}

  private get baseUrl(): string {
    const baseUrl = this.config.neon.authBaseUrl;
    if (baseUrl === undefined) {
      // A raw ConfigValidationError here would surface as an opaque 500 on the
      // first signup attempt. Name the exact variables and the remedy instead,
      // and hand the caller the same typed unavailability the rest of the
      // identity path uses.
      this.logger.error(
        {
          missingEnvVars: ['NEON_AUTH_BASE_URL', 'NEON_AUTH_COOKIE_SECRET', 'NEON_AUTH_JWKS_URL'],
          remedy:
            'Provision Neon Auth for this project (Neon console > Auth, or the Neon MCP ' +
            'provision_neon_auth action), then set the NEON_AUTH_* variables in .env. ' +
            'See docs/runbooks/local-development.md.',
        },
        'identity_provider_not_configured',
      );
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        messageKey: 'error.provider_unavailable.message',
        details: { subsystem: 'identity', reason: 'not_configured' },
      });
    }
    return baseUrl;
  }

  private async call(
    path: string,
    init: { readonly method: 'GET' | 'POST'; readonly body?: unknown; readonly cookie?: string },
  ): Promise<ProviderResponse> {
    const url = new URL(path, this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`);
    const headers: Record<string, string> = {
      accept: 'application/json',
      'content-type': 'application/json',
      origin: requireConfigValue(this.config.core.appUrl, 'APP_URL'),
    };
    if (init.cookie !== undefined) {
      if (/[\r\n]/u.test(init.cookie)) {
        throw new RelayError(ERROR_CODES.VALIDATION_FAILED, {
          details: { field: 'providerSessionId', reason: 'invalid_cookie' },
        });
      }
      headers['cookie'] = init.cookie;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: init.method,
        headers,
        ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch (cause) {
      this.logger.error({ err: cause, operation: path }, 'identity_provider_unreachable');
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { subsystem: 'identity' },
        cause,
      });
    }

    const body: unknown = await response.json().catch(() => null);
    if (response.status >= 500) {
      this.logger.warn({ status: response.status, operation: path }, 'identity_provider_failed');
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { subsystem: 'identity' },
      });
    }
    return {
      status: response.status,
      body,
      sessionCookie: sessionCookieFrom(response.headers, body),
    };
  }

  private toSession(result: ProviderResponse): IdentitySession | null {
    const parsed = authResponseSchema.safeParse(result.body);
    if (result.status >= 400 || !parsed.success || result.sessionCookie === null) {
      return null;
    }
    return {
      userId: parsed.data.user.id,
      email: parsed.data.user.email,
      emailVerified: parsed.data.user.emailVerified ?? false,
      providerSessionId: result.sessionCookie,
      mfaRequired: false,
      mfaSatisfiedAt: null,
    };
  }

  async signUp(input: SignUpInput): Promise<{ userId: string | null }> {
    const result = await this.call('sign-up/email', {
      method: 'POST',
      body: {
        email: input.email,
        password: input.password,
        name: input.displayName,
        locale: input.locale,
      },
    });
    if (result.status >= 400) {
      this.logger.info({ status: result.status }, 'identity_signup_not_created');
      return { userId: null };
    }
    const parsed = authResponseSchema.safeParse(result.body);
    return { userId: parsed.success ? parsed.data.user.id : null };
  }

  async signInWithPassword(input: {
    email: string;
    password: string;
  }): Promise<IdentitySession | null> {
    return this.toSession(await this.call('sign-in/email', { method: 'POST', body: input }));
  }

  async verifyDummyCredential(): Promise<void> {
    await this.call('sign-in/email', {
      method: 'POST',
      body: {
        email: 'dummy-verification@invalid.relay.internal',
        password: DUMMY_PASSWORD,
      },
    });
  }

  async sendMagicLink(input: { email: string; locale: string }): Promise<void> {
    await this.call('email-otp/send-verification-otp', {
      method: 'POST',
      body: { email: input.email, type: 'sign-in', locale: input.locale },
    });
  }

  async verifyOtp(input: { email: string; token: string }): Promise<IdentitySession | null> {
    return this.toSession(
      await this.call('sign-in/email-otp', {
        method: 'POST',
        body: { email: input.email, otp: input.token },
      }),
    );
  }

  async sendPasswordReset(input: { email: string; locale: string }): Promise<void> {
    const appUrl = requireConfigValue(this.config.core.appUrl, 'APP_URL');
    await this.call('request-password-reset', {
      method: 'POST',
      body: {
        email: input.email,
        redirectTo: new URL(`/${input.locale}/reset-password`, appUrl).toString(),
      },
    });
  }

  async signOut(providerSessionId: string): Promise<void> {
    await this.call('sign-out', { method: 'POST', cookie: providerSessionId, body: {} });
  }

  enrollTotp(_input: { userId: string; providerSessionId: string }): Promise<TotpEnrollment> {
    throw new CapabilityNotImplementedError({
      details: { provider: 'neon_auth', capability: 'totp' },
    });
  }

  verifyTotp(_input: {
    userId: string;
    providerSessionId: string;
    factorId: string;
    code: string;
  }): Promise<boolean> {
    throw new CapabilityNotImplementedError({
      details: { provider: 'neon_auth', capability: 'totp' },
    });
  }
}
