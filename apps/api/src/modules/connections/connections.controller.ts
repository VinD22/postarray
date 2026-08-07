import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import { ERROR_CODES, ForbiddenError, RelayError } from '@relay/contracts';
import type { CapabilitySnapshot, Paginated, ProviderId } from '@relay/contracts';
import type { Request, Response } from 'express';

import type {
  ActorContext,
  Clock,
  ConnectionView,
  MentionEntity,
  ProviderDestination,
} from '../../application/port';
import { CLOCK, RELAY_CONFIG } from '../../application/tokens';
import {
  OAUTH_STATE_COOKIE,
  expireCookie,
  parseCookies,
  serializeCookie,
} from '../../common/cookies';
import {
  Actor,
  Idempotent,
  Public,
  RateLimit,
  RequireScope,
  RequireStepUp,
} from '../../common/decorators';
import { instantAfter } from '../../common/instant';
import { relayState } from '../../common/request.types';
import { connectionIdSchema } from '../../common/schemas';
import { constantTimeEquals, randomToken } from '../../security/credentials';
import { parseBody, parseParams, parseQuery } from '../../common/zod';
import {
  beginOAuthSchema,
  callbackParamsSchema,
  listConnectionsQuerySchema,
  listDestinationsQuerySchema,
  oauthCallbackQuerySchema,
  searchMentionsQuerySchema,
} from './connections.schemas';
import { ConnectionsService } from './connections.service';
import { OAUTH_TRANSACTION_TTL_SECONDS, OAuthTransactionStore } from './oauth-transaction.store';

/**
 * Connected social accounts, and the OAuth handshake that creates them.
 *
 * Social publisher OAuth is a different system from login OAuth and shares no
 * client, redirect URI, token store or code path with it
 * (`04-auth-oauth-and-security.md`, section 6). Signing in with Facebook does
 * not connect a Page; connecting a Page is this flow, with its own consent
 * screen and its own review-approved permissions.
 */
@Controller('v1/connections')
export class ConnectionsController {
  constructor(
    private readonly connections: ConnectionsService,
    private readonly transactions: OAuthTransactionStore,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  @Get('providers')
  @RequireScope('accounts:read')
  listAvailableProviders(@Actor() actor: ActorContext): Promise<readonly ProviderId[]> {
    return this.connections.listAvailableProviders(actor);
  }

  @Get()
  @RequireScope('accounts:read')
  list(@Actor() actor: ActorContext, @Query() query: unknown): Promise<Paginated<ConnectionView>> {
    return this.connections.list(actor, parseQuery(listConnectionsQuerySchema, query));
  }

  @Get(':id')
  @RequireScope('accounts:read')
  get(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ConnectionView> {
    return this.connections.get(actor, parseParams(connectionIdSchema, id));
  }

  /**
   * What this account can actually do, right now. `unsupported` (the provider
   * does not offer it) and `not_implemented` (we have not built it) are
   * different states and are never merged.
   */
  @Get(':id/capabilities')
  @RequireScope('accounts:read')
  capabilities(@Actor() actor: ActorContext, @Param('id') id: string): Promise<CapabilitySnapshot> {
    return this.connections.getCapabilities(actor, parseParams(connectionIdSchema, id));
  }

  /**
   * Start a provider handshake.
   *
   * Connecting an account grants Relay publishing power over a third-party
   * identity, so it is a step-up action. The `state` we generate is recorded in
   * a server-side transaction *and* placed in a short-lived, HttpOnly cookie on
   * this browser. The callback must satisfy both.
   */
  @Post('oauth/begin')
  @RequireScope('connections:admin')
  @RequireStepUp()
  @Idempotent()
  @RateLimit({ limit: 20, windowSeconds: 300, connectorBudget: true })
  async beginOAuth(
    @Actor() actor: ActorContext,
    @Res({ passthrough: true }) response: Response,
    @Body() body: unknown,
  ): Promise<{ authorizationUrl: string; transactionId: string }> {
    const input = parseBody(beginOAuthSchema, body);
    const result = await this.connections.beginOAuth(actor, input);

    const state = randomToken(32);
    const now = this.clock.now();
    await this.transactions.put({
      transactionId: result.transactionId,
      provider: input.provider,
      state,
      workspaceId: actor.workspaceId,
      brandId: input.brandId,
      actorId: actor.actorId,
      actorType: actor.actorType,
      scopes: [...actor.scopes],
      approvalLevel: actor.approvalLevel,
      locale: actor.locale,
      correlationId: actor.correlationId,
      surface: actor.surface,
      redirectTo: this.sanitizeReturnPath(input.redirectTo),
      createdAt: now.toISOString(),
      expiresAt: instantAfter(now, OAUTH_TRANSACTION_TTL_SECONDS),
    });

    response.append(
      'set-cookie',
      serializeCookie(OAUTH_STATE_COOKIE, `${result.transactionId}.${state}`, {
        maxAgeSeconds: OAUTH_TRANSACTION_TTL_SECONDS,
        // Lax so the provider's top-level GET redirect still carries it.
        sameSite: 'Lax',
        secure: !this.config.core.isDevelopment,
        path: '/v1/connections/callback',
      }),
    );
    return result;
  }

  /**
   * The provider callback.
   *
   * Public because the provider redirects a browser here with no credential of
   * ours attached. Everything that decides what happens next comes from the
   * stored transaction, not from the URL: the workspace, the actor, the scopes
   * and the brand. The only things taken from the query string are the
   * provider's `code` and `state`, and `state` has to match the cookie exactly
   * before the code is used at all.
   */
  @Public()
  @Get('callback/:provider')
  @RateLimit({ limit: 60, windowSeconds: 60 })
  async callback(
    @Param() params: unknown,
    @Query() query: unknown,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { provider } = parseParams(callbackParamsSchema, params);
    const callback = parseQuery(oauthCallbackQuerySchema, query);

    const cookie = parseCookies(request.headers.cookie)[OAUTH_STATE_COOKIE];
    this.clearStateCookie(response);

    if (callback.error !== undefined) {
      // The person declined, or the provider refused. Neither is our error, and
      // neither may leak the provider's raw text into a redirect target.
      this.redirect(response, null, { status: 'declined', provider });
      return;
    }
    if (callback.code === undefined || callback.state === undefined || cookie === undefined) {
      throw new ForbiddenError({ details: { reason: 'oauth_state_missing' } });
    }

    const separator = cookie.indexOf('.');
    if (separator <= 0) {
      throw new ForbiddenError({ details: { reason: 'oauth_state_malformed' } });
    }
    const transactionId = cookie.slice(0, separator);
    const cookieState = cookie.slice(separator + 1);
    if (!constantTimeEquals(cookieState, callback.state)) {
      throw new ForbiddenError({ details: { reason: 'oauth_state_mismatch' } });
    }

    const transaction = await this.transactions.consume(transactionId);
    if (transaction === null) {
      throw new ForbiddenError({ details: { reason: 'oauth_transaction_expired' } });
    }
    if (transaction.provider !== provider) {
      throw new ForbiddenError({ details: { reason: 'oauth_provider_mismatch' } });
    }
    if (!constantTimeEquals(transaction.state, callback.state)) {
      throw new ForbiddenError({ details: { reason: 'oauth_state_mismatch' } });
    }

    const actor = this.transactions.toActorContext(transaction);
    relayState(request).workspaceId = transaction.workspaceId;

    const connections = await this.connections.completeOAuth(actor, {
      transactionId,
      code: callback.code,
      state: callback.state,
    });

    // The final URL carries no code, no state and no token: a credential in a
    // URL ends up in browser history, a referrer header and a proxy log.
    this.redirect(response, transaction.redirectTo, {
      status: 'connected',
      provider,
      count: String(connections.length),
    });
  }

  @Post(':id/reconnect')
  @RequireScope('connections:admin')
  @RequireStepUp()
  @Idempotent()
  reconnect(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ConnectionView> {
    return this.connections.reconnect(actor, parseParams(connectionIdSchema, id));
  }

  @Post(':id/pause')
  @RequireScope('connections:admin')
  @Idempotent()
  pause(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ConnectionView> {
    return this.connections.pause(actor, parseParams(connectionIdSchema, id));
  }

  @Post(':id/resume')
  @RequireScope('connections:admin')
  @Idempotent()
  resume(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ConnectionView> {
    return this.connections.resume(actor, parseParams(connectionIdSchema, id));
  }

  /**
   * Disconnect. Destructive and abuse-relevant, so it is a step-up action, and
   * it also calls the provider's revoke endpoint where one exists rather than
   * quietly forgetting the token on our side.
   */
  @Post(':id/disconnect')
  @RequireScope('connections:admin')
  @RequireStepUp()
  @Idempotent()
  @HttpCode(200)
  disconnect(@Actor() actor: ActorContext, @Param('id') id: string): Promise<ConnectionView> {
    return this.connections.disconnect(actor, parseParams(connectionIdSchema, id));
  }

  /** Native destinations: a Page, a channel, a board, a community. */
  @Get(':id/destinations')
  @RequireScope('accounts:read')
  @RateLimit({ limit: 60, windowSeconds: 60, connectorBudget: true })
  listDestinations(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<readonly ProviderDestination[]> {
    return this.connections.listDestinations(
      actor,
      parseParams(connectionIdSchema, id),
      parseQuery(listDestinationsQuerySchema, query),
    );
  }

  /** Native mention lookup, so a handle resolves to the real account. */
  @Get(':id/mentions')
  @RequireScope('accounts:read')
  @RateLimit({ limit: 60, windowSeconds: 60, connectorBudget: true })
  searchMentions(
    @Actor() actor: ActorContext,
    @Param('id') id: string,
    @Query() query: unknown,
  ): Promise<readonly MentionEntity[]> {
    return this.connections.searchMentions(
      actor,
      parseParams(connectionIdSchema, id),
      parseQuery(searchMentionsQuerySchema, query),
    );
  }

  /**
   * A return path is accepted only as a path on our own app origin. Accepting
   * an absolute URL here would turn the callback into an open redirector that
   * fires immediately after a successful account connection.
   */
  private sanitizeReturnPath(candidate: string | undefined): string | null {
    if (candidate === undefined) {
      return null;
    }
    if (!candidate.startsWith('/') || candidate.startsWith('//')) {
      return null;
    }
    return candidate.slice(0, 2048);
  }

  private clearStateCookie(response: Response): void {
    response.append(
      'set-cookie',
      expireCookie(OAUTH_STATE_COOKIE, {
        path: '/v1/connections/callback',
        secure: !this.config.core.isDevelopment,
        sameSite: 'Lax',
      }),
    );
  }

  private redirect(
    response: Response,
    returnPath: string | null,
    query: Readonly<Record<string, string>>,
  ): void {
    const appUrl = this.config.core.appUrl;
    if (appUrl === undefined) {
      throw new RelayError(ERROR_CODES.INTERNAL, { details: { reason: 'app_url_unset' } });
    }
    const target = new URL(returnPath ?? '/connections', appUrl);
    for (const [key, value] of Object.entries(query)) {
      target.searchParams.set(key, value);
    }
    response.redirect(303, target.toString());
  }
}
