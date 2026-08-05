import {
  Catch,
  HttpException,
  Inject,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import {
  API_HEADERS,
  ERROR_CODES,
  PROBLEM_JSON_CONTENT_TYPE,
  RelayError,
  type ErrorCode,
  type ProblemJson,
} from '@relay/contracts';
import type { Logger } from '@relay/observability';
import type { Request, Response } from 'express';

import { LOGGER } from '../application/tokens';
import { actionKeyFor, messageKeyFor } from './message-keys';
import { relayState } from './request.types';

/**
 * The single exit for every failure in the API, rendered as RFC 9457
 * `application/problem+json`.
 *
 * Two rules hold without exception:
 *
 * 1. Nothing reaches a client that has not been through `RelayError`, whose
 *    `details` bag is redacted at construction. A provider payload, a token or
 *    another tenant's identifier can therefore not leak through an error path.
 * 2. Resource existence is never disclosed. A cross-workspace read is a 404,
 *    not a 403, because "you may not see this" tells the caller it exists.
 */
export interface RelayProblemJson extends ProblemJson {
  /** Catalog key for the "what can I do next" sentence. */
  readonly actionKey: string;
}

const HTTP_STATUS_TO_CODE: Readonly<Record<number, ErrorCode>> = {
  400: ERROR_CODES.VALIDATION_FAILED,
  401: ERROR_CODES.AUTH_REQUIRED,
  402: ERROR_CODES.PAYMENT_REQUIRED,
  403: ERROR_CODES.FORBIDDEN,
  404: ERROR_CODES.NOT_FOUND,
  405: ERROR_CODES.NOT_FOUND,
  409: ERROR_CODES.CONFLICT,
  413: ERROR_CODES.MEDIA_TOO_LARGE,
  415: ERROR_CODES.VALIDATION_FAILED,
  422: ERROR_CODES.VALIDATION_FAILED,
  429: ERROR_CODES.RATE_LIMITED,
  501: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
  502: ERROR_CODES.PROVIDER_TRANSIENT,
  503: ERROR_CODES.PROVIDER_UNAVAILABLE,
};

/** Map a framework exception onto the product's own taxonomy. */
export function toRelayError(exception: unknown, correlationId: string): RelayError {
  if (RelayError.is(exception)) {
    return exception;
  }
  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    const code = HTTP_STATUS_TO_CODE[status] ?? ERROR_CODES.INTERNAL;
    return new RelayError(code, {
      status,
      correlationId,
      details: { origin: 'http' },
      cause: exception,
    });
  }
  return RelayError.fromUnknown(exception, correlationId);
}

@Catch()
export class ProblemJsonFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    let correlationId = 'unknown';
    try {
      correlationId = relayState(request).correlationId;
    } catch {
      // The failure happened before the context middleware ran. Fall through
      // with the placeholder rather than throwing inside the error handler.
    }

    const error = toRelayError(exception, correlationId);
    const messageKey = messageKeyFor(error.code);
    const problem: RelayProblemJson = {
      ...error.toProblemJson(),
      messageKey,
      actionKey: actionKeyFor(messageKey),
      instance: request.originalUrl,
      correlationId,
    };

    if (error.status >= 500) {
      this.logger.error(
        { err: error, code: error.code, status: error.status, correlationId, path: request.path },
        'request_failed',
      );
    } else {
      this.logger.warn(
        { code: error.code, status: error.status, correlationId, path: request.path },
        'request_rejected',
      );
    }

    if (response.headersSent) {
      response.end();
      return;
    }

    response.setHeader('content-type', PROBLEM_JSON_CONTENT_TYPE);
    response.setHeader(API_HEADERS.correlationId, correlationId);
    if (error.code === ERROR_CODES.AUTH_REQUIRED) {
      // MCP and OAuth clients discover the authorization server from here.
      response.setHeader(
        'www-authenticate',
        'Bearer realm="relay", error="invalid_token", resource_metadata="/.well-known/oauth-protected-resource"',
      );
    }
    response.status(error.status).json(problem);
  }
}
