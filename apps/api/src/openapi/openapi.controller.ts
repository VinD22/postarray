import { randomBytes } from 'node:crypto';

import { Controller, Get, Header, Inject, Res } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import { API_VERSION } from '@relay/contracts';
import type { Response } from 'express';

import { RELAY_CONFIG } from '../application/tokens';
import { Public } from '../common/decorators';
import { buildOpenApiDocument } from './document';
import { renderReference } from './reference-page';

/**
 * The published specification, and a reference page that renders it.
 *
 * The page is entirely self-contained: no CDN script, no web font, no external
 * stylesheet. That is not minimalism for its own sake, it is what lets the API
 * origin keep a `default-src 'self'` content security policy with no
 * `unsafe-inline` escape hatch. A documentation page that forces a hole in the
 * policy protecting the OAuth endpoints is a bad trade.
 */
@Controller()
export class OpenApiController {
  constructor(@Inject(RELAY_CONFIG) private readonly config: RelayConfig) {}

  private get serverUrl(): string {
    return this.config.core.apiUrl ?? '/';
  }

  @Public()
  @Get('openapi.json')
  @Header('cache-control', 'public, max-age=300')
  spec(): Record<string, unknown> {
    return buildOpenApiDocument({ serverUrl: this.serverUrl, version: API_VERSION });
  }

  @Public()
  @Get('docs')
  docs(@Res() response: Response): void {
    const nonce = randomBytes(16).toString('base64');
    const document = buildOpenApiDocument({ serverUrl: this.serverUrl, version: API_VERSION });
    response.setHeader('content-type', 'text/html; charset=utf-8');
    response.setHeader(
      'content-security-policy',
      [
        "default-src 'none'",
        `style-src 'nonce-${nonce}'`,
        `script-src 'nonce-${nonce}'`,
        "base-uri 'none'",
        "form-action 'none'",
        "frame-ancestors 'none'",
      ].join('; '),
    );
    response.status(200).send(renderReference(document, nonce));
  }
}
