import { Body, Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { SCOPES, scopeRisk, type Scope } from '@relay/contracts';
import type { Response } from 'express';

import type { WorkspaceView } from '../application/port';
import { CurrentPrincipal, Public, RateLimit, WorkspaceOptional } from '../common/decorators';
import type { Principal } from '../common/request.types';
import { parseBody, parseQuery } from '../common/zod';
import {
  authorizeQuerySchema,
  consentDecisionSchema,
  introspectionRequestSchema,
  revocationRequestSchema,
  tokenRequestSchema,
  type TokenResponse,
} from './oauth.schemas';
import { OAuthProviderService } from './oauth-provider.service';

/**
 * The authorization endpoints.
 *
 * `/oauth/authorize` does not render HTML. It validates the request, stages it,
 * and redirects the browser to the consent screen in the web app, which then
 * reads `/oauth/consent` for the data it needs and posts the decision back.
 * Keeping the screen in the product means it looks like the product, is
 * translated by the same catalog and is accessible to the same standard, and
 * it keeps this service free of markup.
 */
@Controller('oauth')
export class OAuthProviderController {
  constructor(private readonly oauth: OAuthProviderService) {}

  /**
   * Begin an authorization request.
   *
   * Requires a signed-in user: consent is a decision only a human can make.
   * An unauthenticated caller is sent to sign in first, and comes back here.
   */
  @Get('authorize')
  @WorkspaceOptional()
  @RateLimit({ limit: 60, windowSeconds: 60 })
  async authorize(
    @Query() query: unknown,
    @CurrentPrincipal() principal: Principal,
    @Res() response: Response,
  ): Promise<void> {
    const parsed = parseQuery(authorizeQuerySchema, query);
    const userId = principal.userId;
    if (userId === undefined) {
      // A machine credential cannot consent on a person's behalf.
      response.status(403).json({ error: 'invalid_request' });
      return;
    }
    const pending = await this.oauth.beginAuthorization(parsed, userId);
    // The consent screen lives in the web app; the request id is the only thing
    // that travels, and it is meaningless without the session that staged it.
    response.redirect(302, `/consent?request_id=${encodeURIComponent(pending.requestId)}`);
  }

  /**
   * The data the consent screen renders.
   *
   * Scopes come back grouped by risk, with a description key for each, so the
   * screen can separate what an app may read from what it may cause. There is
   * no `full_access` scope to hide behind, and there never will be.
   */
  @Get('consent')
  @WorkspaceOptional()
  async consentData(
    @Query('request_id') requestId: string,
    @CurrentPrincipal() principal: Principal,
  ): Promise<{
    client: {
      name: string;
      clientId: string;
      homepageUrl: string;
      privacyPolicyUrl: string;
      termsUrl: string;
      logoUrl: string | null;
      firstParty: boolean;
    };
    consentNonce: string;
    workspaces: readonly WorkspaceView[];
    scopes: readonly { scope: Scope; risk: string; descriptionKey: string }[];
    approvalLevelKey: string;
  }> {
    const userId = principal.userId ?? '';
    const pending = await this.oauth.describeAuthorization(requestId, userId);
    return {
      client: {
        name: pending.client.name,
        clientId: pending.client.clientId,
        homepageUrl: pending.client.homepageUrl,
        privacyPolicyUrl: pending.client.privacyPolicyUrl,
        termsUrl: pending.client.termsUrl,
        logoUrl: pending.client.logoUrl,
        // The screen states "This app is not built by Relay" when this is false.
        firstParty: pending.client.firstParty,
      },
      consentNonce: pending.consentNonce,
      workspaces: await this.oauth.listWorkspacesFor(userId),
      scopes: pending.requestedScopes.map((scope) => ({
        scope,
        risk: scopeRisk(scope),
        descriptionKey: SCOPES[scope].descriptionKey,
      })),
      // The grant operates at "may schedule". Immediate publish still needs a
      // human confirmation, and the screen says so.
      approvalLevelKey: 'developer.consent.approval_level.level_2_scheduled',
    };
  }

  /**
   * The consent decision.
   *
   * Carries a single-use nonce bound to the pending request. `state` protects
   * the client from a forged callback; this nonce protects us from a forged
   * consent, and the two are not substitutes.
   */
  @Post('consent')
  @WorkspaceOptional()
  @HttpCode(200)
  async consent(
    @Body() body: unknown,
    @CurrentPrincipal() principal: Principal,
  ): Promise<{ redirectTo: string }> {
    const decision = parseBody(consentDecisionSchema, body);
    const result = await this.oauth.completeConsent(
      decision,
      principal.userId ?? '',
      principal.locale,
    );

    const target = new URL(result.redirectUri);
    if (result.denied || result.code === null) {
      target.searchParams.set('error', 'access_denied');
    } else {
      target.searchParams.set('code', result.code);
    }
    if (result.state !== null) {
      target.searchParams.set('state', result.state);
    }
    // Returned as JSON rather than as a 302 so the consent screen can show a
    // "returning you to <app>" state instead of a blank navigation.
    return { redirectTo: target.toString() };
  }

  /**
   * The token endpoint.
   *
   * Scopes are re-derived from the stored grant, never read from the token
   * request. A client that asks for more at this step gets what the user
   * actually approved, which is what closes the escalation-between-authorize-
   * and-token gap.
   */
  @Public()
  @Post('token')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  @HttpCode(200)
  async token(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponse> {
    // A token response must never be cached by anything between us and the
    // client, including a well-meaning proxy.
    response.setHeader('cache-control', 'no-store');
    response.setHeader('pragma', 'no-cache');
    return this.oauth.token(parseBody(tokenRequestSchema, body));
  }

  /** RFC 7009. Always 200, so it cannot be used to probe for live tokens. */
  @Public()
  @Post('revoke')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  @HttpCode(200)
  async revoke(@Body() body: unknown): Promise<Record<string, never>> {
    const request = parseBody(revocationRequestSchema, body);
    await this.oauth.revoke(request.token, request.client_id, request.client_secret);
    return {};
  }

  /** RFC 7662. Confidential clients, own tokens only. */
  @Public()
  @Post('introspect')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  @HttpCode(200)
  introspect(@Body() body: unknown): Promise<Record<string, unknown>> {
    const parsed = parseBody(introspectionRequestSchema, body);
    return this.oauth.introspect(parsed.token, parsed.client_id, parsed.client_secret);
  }
}
