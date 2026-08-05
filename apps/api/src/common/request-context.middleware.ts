import { Inject, Injectable, type NestMiddleware } from '@nestjs/common';
import { API_HEADERS } from '@relay/contracts';
import { newCorrelationId, runWithContext } from '@relay/observability';
import type { NextFunction, Request, Response } from 'express';

import type { Clock } from '../application/port';
import { CLOCK } from '../application/tokens';
import { takeRawBody } from './raw-body';
import type { RelayRequest } from './request.types';

/**
 * Establishes the ambient request context for the whole call.
 *
 * A correlation id is accepted from the caller when it looks safe, minted
 * otherwise, echoed on the response and carried into every log line, span,
 * audit event, publication receipt and outbound webhook. Support conversations
 * start with this value, so it is never optional and never regenerated
 * mid-request.
 */
const CORRELATION_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

function firstHeader(value: string | readonly string[] | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : (value as string);
}

/** Accept a caller-supplied id only when it is a safe, bounded token. */
export function sanitizeCorrelationId(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return CORRELATION_ID_PATTERN.test(trimmed) ? trimmed : undefined;
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(@Inject(CLOCK) private readonly clock: Clock) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const inbound = sanitizeCorrelationId(firstHeader(request.headers[API_HEADERS.correlationId]));
    const correlationId = inbound ?? newCorrelationId();

    const rawBody = takeRawBody(request);
    (request as RelayRequest).relay = {
      correlationId,
      // Refined by AuthGuard once the credential kind is known: a cookie is the
      // web app, a bearer token or an API key is a programmatic surface.
      surface: 'api',
      startedAt: this.clock.now().getTime(),
      ...(rawBody === undefined ? {} : { rawBody }),
    };

    response.setHeader(API_HEADERS.correlationId, correlationId);
    response.setHeader(API_HEADERS.apiVersion, 'v1');

    runWithContext({ correlationId, surface: 'api' }, () => {
      next();
    });
  }
}
