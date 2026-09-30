import { Body, Controller, Get, HttpCode, Inject, Post, Query, Req, Res } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import { AuthRequiredError, NotFoundError, SCOPES, scopeRisk, type Scope } from '@relay/contracts';
import type { Request, Response } from 'express';

import type { WorkspaceView } from '../application/port';
import { RELAY_CONFIG } from '../application/tokens';
import { ActorContextFactory } from '../common/actor-context.factory';
import { CurrentPrincipal, Public, RateLimit, WorkspaceOptional } from '../common/decorators';
import { relayState, type Principal } from '../common/request.types';
import { parseBody, parseQuery } from '../common/zod';
import { consentDecisionSchema, authorizeQuerySchema } from './oauth.schemas';
import { OAuthProviderService } from './oauth-provider.service';

/**
 * The authorization endpoints a browser visits.
 *
 * `/oauth/authorize` does not render HTML. It validates the request, stages it,
 * and redirects the browser to the consent screen in the web app, which then
 * reads `/oauth/consent` for the data it needs and posts the decision back.
 * The token, introspection and revocation endpoints are in
 * `oauth-token.controller.ts`; dynamic registration is in
 * `registration.controller.ts`.
 */
@Controller('oauth')
export class OAuthProviderController {
  constructor(
    private readonly oauth: OAuthProviderService,
    private readonly actorContexts: ActorContextFactory,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
  ) {}

  private webUrl(path: string): string {
    const base = (this.config.core.appUrl ?? '').replace(/\/+$/, '');
    return `${base}${path}`;
  }

  /**
   * Begin an authorization request.
   *
   * Consent is a decision only a signed-in person can make. The route is
   * public so that a signed-out browser is sent to sign in, with this exact
   * request as the place to come back to, instead of being shown a JSON 401 it
   * cannot act on. The request is validated first, so a malformed or unknown
   * client never earns a trip through the sign-in page.
   */
  @Public()
  @Get('authorize')
  @RateLimit({ limit: 60, windowSeconds: 60 })
  async authorize(
    @Query() query: unknown,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const parsed = parseQuery(authorizeQuerySchema, query);
    const principal = relayState(request).principal;
    if (principal === undefined) {
      if (this.config.core.appUrl === undefined) {
        throw new AuthRequiredError();
      }
      const apiBase = (this.config.core.apiUrl ?? '').replace(/\/+$/, '');
      const returnTo = `${apiBase}${request.originalUrl}`;
      response.redirect(302, this.webUrl(`/sign-in?next=${encodeURIComponent(returnTo)}`));
      return;
    }
    if (principal.credentialKind !== 'session' || principal.userId === undefined) {
      // A machine credential cannot consent on a person's behalf.
      response.status(403).json({ error: 'invalid_request' });
      return;
    }
    const pending = await this.oauth.beginAuthorization(parsed, principal.userId);
    // The consent screen lives in the web app; the request id is the only thing
    // that travels, and it is meaningless without the session that staged it.
    response.redirect(
      302,
      this.webUrl(`/consent?request_id=${encodeURIComponent(pending.requestId)}`),
    );
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
      /** True when the app registered itself: its name is its own claim. */
      selfAsserted: boolean;
    };
    consentNonce: string;
    workspaces: readonly WorkspaceView[];
    scopes: readonly { scope: Scope; risk: string; descriptionKey: string }[];
    approvalLevelKey: string;
  }> {
    const userId = principal.userId ?? '';
    const pending = await this.oauth.describeAuthorization(requestId, userId);
    const selfAsserted = pending.client.registration === 'dynamic';
    return {
      client: {
        name: pending.client.name,
        clientId: pending.client.clientId,
        homepageUrl: pending.client.homepageUrl,
        privacyPolicyUrl: pending.client.privacyPolicyUrl,
        termsUrl: pending.client.termsUrl,
        // A self-registered app has no reviewed logo; rendering its claimed
        // one would lend it an identity it has not earned.
        logoUrl: selfAsserted ? null : pending.client.logoUrl,
        // The screen states "This app is not built by Post Array" when this is false.
        firstParty: pending.client.firstParty,
        selfAsserted,
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
   * consent, and the two are not substitutes. The chosen workspace must be one
   * the person belongs to, with the same 404 the workspace guard gives for any
   * other workspace, and the grant is recorded as that person in that
   * workspace.
   */
  @Post('consent')
  @WorkspaceOptional()
  @HttpCode(200)
  async consent(
    @Body() body: unknown,
    @CurrentPrincipal() principal: Principal,
    @Req() request: Request,
  ): Promise<{ redirectTo: string }> {
    const decision = parseBody(consentDecisionSchema, body);
    if (principal.credentialKind !== 'session' || principal.userId === undefined) {
      throw new NotFoundError({ details: { resource: 'workspace' } });
    }
    if (!principal.workspaceIds.includes(decision.workspaceId)) {
      throw new NotFoundError({ details: { resource: 'workspace' } });
    }
    const state = relayState(request);
    const acceptLanguage = request.headers['accept-language'];
    const ctx = this.actorContexts.build({
      principal: {
        ...principal,
        scopes: principal.scopesByWorkspace?.[decision.workspaceId] ?? [],
      },
      workspaceId: decision.workspaceId,
      correlationId: state.correlationId,
      surface: state.surface,
      idempotencyKey: state.idempotencyKey,
      acceptLanguage: typeof acceptLanguage === 'string' ? acceptLanguage : undefined,
    });
    const result = await this.oauth.completeConsent(decision, ctx, principal.userId);

    const target = new URL(result.redirectUri);
    if (result.denied || result.code === null) {
      target.searchParams.set('error', 'access_denied');
    } else {
      target.searchParams.set('code', result.code);
    }
    if (result.state !== null) {
      target.searchParams.set('state', result.state);
    }
    // RFC 9207: name the issuer so a client talking to several servers can
    // tell which one answered.
    target.searchParams.set('iss', this.oauth.issuer);
    // Returned as JSON rather than as a 302 so the consent screen can show a
    // "returning you to <app>" state instead of a blank navigation.
    return { redirectTo: target.toString() };
  }
}
