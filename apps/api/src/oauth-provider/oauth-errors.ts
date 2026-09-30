import { ERROR_CODES, RelayError } from '@relay/contracts';

/**
 * OAuth protocol errors.
 *
 * The token, introspection and registration endpoints are read by OAuth client
 * libraries, not by our own web app, and those libraries only understand the
 * RFC 6749 section 5.2 shape: `{ "error": "invalid_grant" }` with a 400 (or a
 * 401 for client authentication). A problem+json 403 makes a compliant client
 * give up instead of re-running the flow, which is why these routes translate
 * the internal taxonomy here rather than going through the global filter.
 *
 * `error_description` is a developer-facing hint in ASCII, never product copy
 * and never a value the caller sent.
 */

export type OAuthErrorCode =
  | 'invalid_request'
  | 'invalid_client'
  | 'invalid_grant'
  | 'invalid_scope'
  | 'invalid_target'
  | 'unauthorized_client'
  | 'unsupported_grant_type'
  | 'invalid_redirect_uri'
  | 'invalid_client_metadata'
  | 'temporarily_unavailable';

export interface OAuthErrorBody {
  readonly error: OAuthErrorCode;
  readonly error_description?: string;
}

export interface OAuthErrorResponse {
  readonly status: number;
  readonly body: OAuthErrorBody;
}

/** Raised where the protocol answer is known exactly. */
export class OAuthProtocolError extends Error {
  constructor(
    readonly error: OAuthErrorCode,
    readonly status: number = 400,
    readonly description?: string,
  ) {
    super(error);
    this.name = 'OAuthProtocolError';
  }

  toResponse(): OAuthErrorResponse {
    return {
      status: this.status,
      body: {
        error: this.error,
        ...(this.description === undefined ? {} : { error_description: this.description }),
      },
    };
  }
}

function reasonOf(error: RelayError): string | undefined {
  const reason = error.details['reason'];
  return typeof reason === 'string' ? reason : undefined;
}

function touchesGrantType(error: RelayError): boolean {
  const issues = error.details['issues'];
  return (
    Array.isArray(issues) &&
    issues.some(
      (issue: unknown) =>
        typeof issue === 'object' &&
        issue !== null &&
        'path' in issue &&
        (issue as { path: unknown }).path === 'grant_type',
    )
  );
}

/**
 * Map a failure on the token endpoint to its RFC 6749 answer. Returns null for
 * anything that is not a client mistake, which then surfaces as a 500 through
 * the normal filter: a server fault must not be dressed up as `invalid_grant`.
 */
export function toTokenErrorResponse(error: unknown): OAuthErrorResponse | null {
  if (error instanceof OAuthProtocolError) {
    return error.toResponse();
  }
  if (!(error instanceof RelayError)) {
    return null;
  }
  const reason = reasonOf(error);
  if (reason === 'invalid_client' || reason === 'introspection_confidential_only') {
    return { status: 401, body: { error: 'invalid_client' } };
  }
  if (reason === 'invalid_grant') {
    return { status: 400, body: { error: 'invalid_grant' } };
  }
  if (reason === 'invalid_target') {
    return { status: 400, body: { error: 'invalid_target' } };
  }
  if (error.code === ERROR_CODES.VALIDATION_FAILED) {
    if (error.details['field'] === 'scope') {
      return { status: 400, body: { error: 'invalid_scope' } };
    }
    if (touchesGrantType(error)) {
      return { status: 400, body: { error: 'unsupported_grant_type' } };
    }
    return { status: 400, body: { error: 'invalid_request' } };
  }
  // Rate limiting and server faults keep their own status and shape.
  return null;
}
