import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { Public, RateLimit } from '../common/decorators';
import { DynamicRegistrationService } from './dynamic-registration.service';
import { OAuthProtocolError } from './oauth-errors';

/**
 * `POST /oauth/register`, RFC 7591.
 *
 * Unauthenticated by design: a client registers before any person has signed
 * in. What bounds it is the per-address rate limit, the size caps in the
 * schema, deduplication of identical registrations, and the fact that a
 * registered client can do nothing at all until a signed-in person approves it
 * on the consent screen.
 */
@Controller('oauth')
export class OAuthRegistrationController {
  constructor(private readonly registration: DynamicRegistrationService) {}

  @Public()
  @Post('register')
  @RateLimit({ limit: 30, windowSeconds: 60, unauthenticatedIpLimit: 30 })
  async register(@Body() body: unknown, @Res() response: Response): Promise<void> {
    response.setHeader('cache-control', 'no-store');
    try {
      response.status(201).json(await this.registration.register(body));
    } catch (error) {
      if (!(error instanceof OAuthProtocolError)) {
        throw error;
      }
      const mapped = error.toResponse();
      response.status(mapped.status).json(mapped.body);
    }
  }
}
