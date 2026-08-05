import { Body, Controller, Get, HttpCode, Inject, Post, Req, Res } from '@nestjs/common';
import {
  AuthRequiredError,
  CapabilityNotImplementedError,
  ValidationFailedError,
} from '@relay/contracts';
import type { Request, Response } from 'express';

import type { IdentityContext, Services } from '../../application/port';
import { SERVICES } from '../../application/tokens';
import { REFRESH_COOKIE, SESSION_COOKIE, parseCookies } from '../../common/cookies';
import {
  CurrentPrincipal,
  Identity,
  Public,
  RateLimit,
  RequireStepUp,
  WorkspaceOptional,
} from '../../common/decorators';
import type { Principal } from '../../common/request.types';
import { parseBody } from '../../common/zod';
import { clientFingerprint } from '../../security/csrf';
import { AuthService, type EstablishedSession } from './auth.service';
import {
  magicLinkSchema,
  passwordResetSchema,
  setAliasSchema,
  signInSchema,
  signOutSchema,
  signUpSchema,
  verifyOtpSchema,
  verifyTotpSchema,
} from './auth.schemas';
import { withUniformTiming } from './uniform-timing';

/**
 * Authentication.
 *
 * The uniformity rule runs through every route here: signup, sign-in, password
 * reset and magic link all answer with the same shape, the same status and the
 * same timing band whether or not the identity exists. The information that
 * differentiates them is delivered by email, to the address that actually owns
 * it. Signup with an existing address returns 202 and emails that address; it
 * never returns "email already registered", because that response is a customer
 * list with an API.
 *
 * Rate limits are deliberately tight. Alias login is the highest-value
 * credential stuffing surface in the product.
 */
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(SERVICES) private readonly services: Services,
  ) {}

  /**
   * Create an identity.
   *
   * Signup is not a workspace. It creates a personal workspace with the creator
   * as owner, and the company name, if collected, is never a login credential.
   * The exact Terms and Privacy version hashes the person saw are recorded, and
   * that consent row is append only.
   */
  @Public()
  @Post('signup')
  @RateLimit({ limit: 10, windowSeconds: 600 })
  @HttpCode(202)
  async signUp(@Body() body: unknown): Promise<{ status: 'accepted' }> {
    const input = parseBody(signUpSchema, body);
    return withUniformTiming(async () => {
      const created = await this.auth.provider.signUp({
        email: input.email,
        password: input.password,
        locale: input.locale,
      });
      if (created.userId !== null) {
        await this.auth.recordConsent({
          userId: created.userId,
          termsVersionHash: input.termsVersionHash,
          privacyVersionHash: input.privacyVersionHash,
          countryCode: null,
        });
      }
      // Identical for a new address and for one that already exists.
      return { status: 'accepted' as const };
    });
  }

  /**
   * Sign in with an email address or a username alias plus a password.
   *
   * One endpoint, one field. Two endpoints would let a caller learn which kind
   * of value exists purely by choosing where to send it.
   */
  @Public()
  @Post('signin')
  @RateLimit({ limit: 10, windowSeconds: 600 })
  @HttpCode(200)
  signIn(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<EstablishedSession> {
    const input = parseBody(signInSchema, body);
    return withUniformTiming(async () => {
      const session = await this.auth.signIn(input.identifier, input.password);
      if (session === null) {
        throw new AuthRequiredError({ details: { reason: 'invalid_credentials' } });
      }
      return this.auth.establishSession(session, response, fingerprintOf(request));
    });
  }

  /** Send a one-time code. Always 202, whether or not the identity exists. */
  @Public()
  @Post('magic-link')
  @RateLimit({ limit: 5, windowSeconds: 900 })
  @HttpCode(202)
  async magicLink(@Body() body: unknown): Promise<{ status: 'accepted' }> {
    const input = parseBody(magicLinkSchema, body);
    return withUniformTiming(async () => {
      const resolved = await this.services.identity.resolveLoginIdentifier(input.identifier);
      if (resolved !== null) {
        await this.auth.provider.sendMagicLink({
          email: resolved.email,
          locale: input.locale,
        });
      }
      return { status: 'accepted' as const };
    });
  }

  /**
   * Exchange a one-time code for a session. The code travels in the body, and
   * the final redirect never carries it, so it cannot land in history or a
   * referrer header.
   */
  @Public()
  @Post('magic-link/verify')
  @RateLimit({ limit: 10, windowSeconds: 600 })
  @HttpCode(200)
  verifyMagicLink(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<EstablishedSession> {
    const input = parseBody(verifyOtpSchema, body);
    return withUniformTiming(async () => {
      const resolved = await this.services.identity.resolveLoginIdentifier(input.identifier);
      if (resolved === null) {
        await this.auth.provider.verifyDummyCredential();
        throw new AuthRequiredError({ details: { reason: 'invalid_credentials' } });
      }
      const session = await this.auth.provider.verifyOtp({
        email: resolved.email,
        token: input.code,
      });
      if (session === null) {
        throw new AuthRequiredError({ details: { reason: 'invalid_credentials' } });
      }
      return this.auth.establishSession(session, response, fingerprintOf(request));
    });
  }

  /** Always 202. "If that account exists, we sent a reset link." */
  @Public()
  @Post('password-reset')
  @RateLimit({ limit: 5, windowSeconds: 900 })
  @HttpCode(202)
  async passwordReset(@Body() body: unknown): Promise<{ status: 'accepted' }> {
    const input = parseBody(passwordResetSchema, body);
    return withUniformTiming(async () => {
      const resolved = await this.services.identity.resolveLoginIdentifier(input.identifier);
      if (resolved !== null) {
        await this.auth.provider.sendPasswordReset({
          email: resolved.email,
          locale: input.locale,
        });
      }
      return { status: 'accepted' as const };
    });
  }

  /**
   * Rotate the session.
   *
   * The refresh cookie is scoped to this path only, so it is not attached to
   * every request in the product. Rotation is one-time-use, and presenting a
   * consumed token destroys the whole family.
   */
  @Public()
  @Post('session/refresh')
  @RateLimit({ limit: 60, windowSeconds: 600 })
  @HttpCode(200)
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<EstablishedSession> {
    const presented = parseCookies(request.headers.cookie)[REFRESH_COOKIE];
    if (presented === undefined) {
      throw new AuthRequiredError({ details: { reason: 'refresh_missing' } });
    }
    return this.auth.refreshSession(presented, response, fingerprintOf(request));
  }

  /** End this session, or every session this identity holds. */
  @Post('signout')
  @WorkspaceOptional()
  @HttpCode(200)
  async signOut(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ terminatedSessions: number }> {
    const { scope } = parseBody(signOutSchema, body);
    const sessionId = parseCookies(request.headers.cookie)[SESSION_COOKIE];
    if (sessionId === undefined) {
      throw new AuthRequiredError({ details: { reason: 'no_session' } });
    }
    return { terminatedSessions: await this.auth.signOut(sessionId, scope, response) };
  }

  /** Who am I, and which workspaces can I address right now. */
  @Get('me')
  @WorkspaceOptional()
  me(@CurrentPrincipal() principal: Principal): {
    actorType: Principal['actorType'];
    userId: string | null;
    workspaceIds: readonly string[];
    scopes: readonly string[];
    approvalLevel: Principal['approvalLevel'];
    emailVerified: boolean;
    locale: string;
  } {
    return {
      actorType: principal.actorType,
      userId: principal.userId ?? null,
      workspaceIds: principal.workspaceIds,
      scopes: principal.scopes,
      approvalLevel: principal.approvalLevel,
      emailVerified: principal.emailVerified,
      locale: principal.locale,
    };
  }

  /**
   * Claim or change the username alias.
   *
   * A step-up action, because the alias is part of the account takeover chain.
   * Normalization, the single-script rule, confusable skeleton uniqueness and
   * the reserved list all live in one function in `@relay/application`, shared
   * by creation and lookup, so the two can never disagree about what a value
   * means. A retired alias is tombstoned and never reissued: an alias someone
   * else can claim is a way to inherit misdirected trust.
   */
  @Post('alias')
  @WorkspaceOptional()
  @RequireStepUp()
  @RateLimit({ limit: 3, windowSeconds: 60 * 60 * 24 * 30 })
  @HttpCode(200)
  setAlias(
    @Identity() identity: IdentityContext,
    @Body() body: unknown,
  ): Promise<{ alias: string }> {
    const { alias } = parseBody(setAliasSchema, body);
    return this.auth.setAlias(identity, alias);
  }

  /* ---------------------------------------------------------------------- */
  /* Multi-factor authentication                                             */
  /* ---------------------------------------------------------------------- */

  /**
   * Begin TOTP enrolment. Six digits, thirty second period, plus or minus one
   * step of drift, with ten single-use recovery codes.
   *
   * SMS is not offered and will not be. SIM swap makes it worse than no second
   * factor for a product that holds publishing credentials for other people's
   * brands.
   */
  @Post('mfa/totp')
  @WorkspaceOptional()
  @RequireStepUp()
  @HttpCode(201)
  async enrollTotp(
    @Req() request: Request,
    @CurrentPrincipal() principal: Principal,
  ): Promise<{ factorId: string; provisioningUri: string }> {
    const sessionId = parseCookies(request.headers.cookie)[SESSION_COOKIE];
    if (sessionId === undefined || principal.userId === undefined) {
      throw new AuthRequiredError({ details: { reason: 'no_session' } });
    }
    return this.auth.provider.enrollTotp({
      userId: principal.userId,
      providerSessionId: sessionId,
    });
  }

  /** Confirm enrolment, or satisfy a step-up, with a six digit code. */
  @Post('mfa/totp/verify')
  @WorkspaceOptional()
  @HttpCode(200)
  async verifyTotp(
    @Body() body: unknown,
    @Req() request: Request,
    @CurrentPrincipal() principal: Principal,
  ): Promise<{ verified: true }> {
    const input = parseBody(verifyTotpSchema, body);
    const sessionId = parseCookies(request.headers.cookie)[SESSION_COOKIE];
    if (sessionId === undefined || principal.userId === undefined) {
      throw new AuthRequiredError({ details: { reason: 'no_session' } });
    }
    const verified = await this.auth.provider.verifyTotp({
      userId: principal.userId,
      providerSessionId: sessionId,
      factorId: input.factorId,
      code: input.code,
    });
    if (!verified) {
      throw new ValidationFailedError({ details: { field: 'code', reason: 'invalid' } });
    }
    await this.auth.markStepUpSatisfied(sessionId);
    return { verified: true };
  }

  /**
   * Passkeys.
   *
   * Honestly labelled: this is `not_implemented`, which is a different state
   * from `unsupported`. Phase 3 of the roadmap adds WebAuthn as an additional
   * and step-up factor; the hard part, and the reason it is not here yet, is
   * account recovery. We will not ship an account that a lost phone can
   * destroy. There is no stub, no disabled button and no dormant client.
   */
  @Post('mfa/passkeys')
  @WorkspaceOptional()
  registerPasskey(): never {
    throw new CapabilityNotImplementedError({
      details: { capability: 'webauthn', phase: 'roadmap_phase_3' },
    });
  }
}

function fingerprintOf(request: Request): string {
  return clientFingerprint(request.headers['user-agent'], request.headers['accept-language']);
}
