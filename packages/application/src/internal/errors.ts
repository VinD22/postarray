import { PolicyDenied, type Decision } from '@relay/authz';
import {
  ForbiddenError,
  NotFoundError,
  RelayError,
  ScopeInsufficientError,
  ValidationFailedError,
} from '@relay/contracts';

/**
 * The single place a policy decision becomes a transport error.
 *
 * `@relay/authz` deliberately knows nothing about the error taxonomy, so the
 * translation lives here. The message key travels unchanged, which is what lets
 * the UI render the same sentence next to a disabled button and in a toast.
 */
export function decisionToError(decision: Decision, correlationId?: string): RelayError {
  const details: Record<string, unknown> = {
    permission: decision.permission,
    reason: decision.reason,
    ...(decision.requiredRole === undefined ? {} : { requiredRole: decision.requiredRole }),
    ...(decision.requiredScopes === undefined
      ? {}
      : { requiredScopes: [...decision.requiredScopes] }),
    ...(decision.details ?? {}),
  };
  const options = {
    messageKey: decision.messageKey,
    details,
    ...(correlationId === undefined ? {} : { correlationId }),
  };
  if (decision.reason === 'scope_missing' || decision.reason === 'permission_not_delegable') {
    return new ScopeInsufficientError(options);
  }
  return new ForbiddenError(options);
}

/** Normalise anything thrown inside a service into the shared taxonomy. */
export function toRelayError(error: unknown, correlationId?: string): RelayError {
  if (error instanceof PolicyDenied) {
    return decisionToError(error.decision, correlationId);
  }
  return RelayError.fromUnknown(error, correlationId);
}

export function notFound(resource: string, id: string, correlationId?: string): RelayError {
  return new NotFoundError({
    messageKey: `errors.not_found.${resource}`,
    details: { resource, id },
    ...(correlationId === undefined ? {} : { correlationId }),
  });
}

export function invalid(
  messageKey: string,
  details: Record<string, unknown> = {},
  correlationId?: string,
): RelayError {
  return new ValidationFailedError({
    messageKey,
    details,
    ...(correlationId === undefined ? {} : { correlationId }),
  });
}
