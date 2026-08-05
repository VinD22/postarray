import { Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import type { RelayConfig } from '@relay/config';
import { ForbiddenError } from '@relay/contracts';
import type { Request } from 'express';

import { RELAY_CONFIG } from '../application/tokens.js';
import { SESSION_COOKIE, parseCookies } from '../common/cookies.js';
import { relayState } from '../common/request.types.js';
import { CredentialDirectory } from '../security/credential-directory.js';
import {
  CSRF_HEADER,
  STATE_CHANGING_METHODS,
  isAllowedOrigin,
  verifyCsrfToken,
} from '../security/csrf.js';

/**
 * CSRF protection for cookie-authenticated routes.
 *
 * Only cookie credentials are ambient, so only cookie credentials are
 * CSRF-exposed. A bearer token has to be attached deliberately by the caller
 * and is therefore skipped here rather than being given a token ceremony that
 * protects nothing.
 *
 * Two checks, both required:
 * a signed double-submit token, and an exact `Origin` allowlist. A
 * state-changing request with no `Origin` header at all is rejected: every
 * browser sends one on a cross-origin write, so its absence on a cookie
 * request is not a browser we need to support.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly directory: CredentialDirectory,
    @Inject(RELAY_CONFIG) private readonly config: RelayConfig,
  ) {}

  /** Exact origins permitted to make a cookie-authenticated write. */
  get allowedOrigins(): readonly string[] {
    return [this.config.core.appUrl, this.config.core.apiUrl].filter(
      (value): value is string => typeof value === 'string' && value.length > 0,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const principal = relayState(request).principal;

    if (principal === undefined || principal.credentialKind !== 'session') {
      return true;
    }
    if (!STATE_CHANGING_METHODS.has(request.method.toUpperCase())) {
      return true;
    }

    const origin = typeof request.headers.origin === 'string' ? request.headers.origin : undefined;
    if (!isAllowedOrigin(origin, this.allowedOrigins)) {
      throw new ForbiddenError({ details: { reason: 'origin_rejected' } });
    }

    const sessionId = parseCookies(request.headers.cookie)[SESSION_COOKIE];
    if (sessionId === undefined) {
      throw new ForbiddenError({ details: { reason: 'csrf_session_missing' } });
    }
    const session = await this.directory.getSession(sessionId);
    if (session === null) {
      throw new ForbiddenError({ details: { reason: 'csrf_session_missing' } });
    }

    const presented = request.headers[CSRF_HEADER];
    const token = typeof presented === 'string' ? presented : undefined;
    if (!verifyCsrfToken(token, session.csrfSecret)) {
      throw new ForbiddenError({ details: { reason: 'csrf_token_invalid' } });
    }
    return true;
  }
}
