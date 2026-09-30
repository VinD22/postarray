import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { Public, RateLimit } from '../common/decorators';
import { parseBody } from '../common/zod';
import { toTokenErrorResponse } from './oauth-errors';
import { OAuthIntrospectionService } from './oauth-introspection.service';
import { OAuthTokenService } from './oauth-token.service';
import {
  introspectionRequestSchema,
  revocationRequestSchema,
  tokenRequestSchema,
} from './oauth.schemas';

/**
 * The machine-facing OAuth endpoints: token, revocation and introspection.
 *
 * Their callers are OAuth client libraries and our own resource servers, so
 * every client mistake is answered in the RFC 6749 section 5.2 shape rather
 * than as problem+json. A server fault still goes through the global filter as
 * a 500: it must never be reported as the client's `invalid_grant`.
 */
@Controller('oauth')
export class OAuthTokenController {
  constructor(
    private readonly tokens: OAuthTokenService,
    private readonly introspection: OAuthIntrospectionService,
  ) {}

  /** Send the OAuth error for a client mistake, or rethrow anything else. */
  private fail(response: Response, error: unknown): void {
    const mapped = toTokenErrorResponse(error);
    if (mapped === null) {
      throw error;
    }
    response.status(mapped.status).json(mapped.body);
  }

  /**
   * The token endpoint.
   *
   * Scopes are re-derived from the stored grant, never read from the token
   * request. A client that asks for more at this step gets what the user
   * actually approved.
   */
  @Public()
  @Post('token')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async token(@Body() body: unknown, @Res() response: Response): Promise<void> {
    // A token response must never be cached by anything between us and the
    // client, including a well-meaning proxy. Errors included.
    response.setHeader('cache-control', 'no-store');
    response.setHeader('pragma', 'no-cache');
    try {
      const issued = await this.tokens.token(parseBody(tokenRequestSchema, body));
      response.status(200).json(issued);
    } catch (error) {
      this.fail(response, error);
    }
  }

  /** RFC 7009. Always 200 for a known client, so it cannot probe for live tokens. */
  @Public()
  @Post('revoke')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  @HttpCode(200)
  async revoke(@Body() body: unknown, @Res() response: Response): Promise<void> {
    try {
      const request = parseBody(revocationRequestSchema, body);
      await this.introspection.revoke(request.token, request.client_id, request.client_secret);
      response.status(200).json({});
    } catch (error) {
      this.fail(response, error);
    }
  }

  /**
   * RFC 7662. Confidential clients about their own tokens, and the designated
   * resource server about tokens bound to its resource.
   *
   * The MCP server calls this for every tool call it has not cached, from one
   * address, so the route's budget is sized for that caller rather than for a
   * browser. Guessing a 32 byte client secret at this rate is still hopeless.
   */
  @Public()
  @Post('introspect')
  @RateLimit({ limit: 3000, windowSeconds: 60, unauthenticatedIpLimit: 3000 })
  async introspect(@Body() body: unknown, @Res() response: Response): Promise<void> {
    response.setHeader('cache-control', 'no-store');
    try {
      const parsed = parseBody(introspectionRequestSchema, body);
      response.status(200).json(await this.introspection.introspect(parsed));
    } catch (error) {
      this.fail(response, error);
    }
  }
}
