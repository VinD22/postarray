import { ERROR_CODES, RelayError, type ErrorCode } from '@relay/contracts';
import { productMetrics } from '@relay/observability';

import type {
  ActorContext,
  ServiceDeps,
  WorkerActivityContext,
  WorkerCredentialService,
} from '../types';

import { notFound } from '../internal/errors';
import { toProviderId } from '../internal/mappers';
import { runInWorkspace } from '../internal/runtime';

/**
 * Credential health for the worker.
 *
 * Two activities, one purpose: the token refresh workflow must be able to see
 * that a connection is about to break, and the user must be told before it
 * does. Nothing here returns, logs or embeds a token. `describeCredential`
 * answers with an expiry, two booleans and a duration, which is everything the
 * workflow needs and nothing it could leak into workflow history.
 */

function context(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

/** Connection states in which no credential can be refreshed any more. */
const REVOKED_STATUSES = new Set(['revoked', 'disconnected']);

type IncidentKind =
  | 'invalid_token'
  | 'permission_lost'
  | 'review_restriction'
  | 'rate_limited'
  | 'account_restricted'
  | 'provider_outage'
  | 'refresh_failed';

/**
 * Which incident the user sees. The message key is the worker's own stable key,
 * so the classification follows it first and falls back to the error code.
 */
function incidentKind(messageKey: string, errorCode: ErrorCode): IncidentKind {
  if (messageKey.endsWith('token_refresh_failed')) {
    return 'refresh_failed';
  }
  if (messageKey.endsWith('access_revoked')) {
    return 'invalid_token';
  }
  switch (errorCode) {
    case ERROR_CODES.SCOPE_INSUFFICIENT:
    case ERROR_CODES.FORBIDDEN:
      return 'permission_lost';
    case ERROR_CODES.RATE_LIMITED:
      return 'rate_limited';
    case ERROR_CODES.PROVIDER_UNAVAILABLE:
      return 'provider_outage';
    default:
      return 'invalid_token';
  }
}

function credentialStoreUnavailable(): RelayError {
  return new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
    messageKey: 'errors.capability_not_implemented',
    details: { reason: 'credential_store_not_configured' },
  });
}

export function createWorkerCredentialService(deps: ServiceDeps): WorkerCredentialService {
  return {
    async describeCredential(input) {
      const store = deps.credentialStore;
      if (store === undefined) {
        throw credentialStoreUnavailable();
      }
      const connection = await runInWorkspace(deps, context(input.ctx), async (db) => {
        const row = await db.socialConnection.findFirst({
          where: { id: input.connectionId, workspaceId: input.ctx.workspaceId },
          select: { id: true, provider: true, status: true },
        });
        if (row === null) {
          throw notFound('connection', input.connectionId, input.ctx.correlationId);
        }
        return row;
      });

      const record = await store.find({
        workspaceId: input.ctx.workspaceId,
        connectionId: connection.id,
        provider: toProviderId(connection.provider),
      });
      const revoked = REVOKED_STATUSES.has(connection.status) || record === null;
      if (record === null) {
        // No stored credential is not "expires never". It is a connection that
        // cannot publish, and the workflow must treat it as revoked.
        return { expiresAt: null, refreshable: false, revoked: true, lifetimeSeconds: null };
      }

      // The credential's life is measured from the last time it was issued. When
      // we have never refreshed it, the life is unknown rather than assumed, and
      // the workflow falls back to the remaining time before expiry.
      const issuedAt = record.lastRefreshedAt;
      const lifetimeSeconds =
        record.accessTokenExpiresAt === null || issuedAt === null
          ? null
          : Math.max(
              0,
              Math.round(
                (new Date(record.accessTokenExpiresAt).getTime() - new Date(issuedAt).getTime()) /
                  1000,
              ),
            );
      return {
        expiresAt: record.accessTokenExpiresAt,
        refreshable: !revoked && record.refreshToken !== null,
        revoked,
        lifetimeSeconds,
      };
    },

    async raiseConnectionIncident(input) {
      await runInWorkspace(deps, context(input.ctx), async (db) => {
        const connection = await db.socialConnection.findFirst({
          where: { id: input.connectionId, workspaceId: input.ctx.workspaceId },
          select: { id: true, status: true },
        });
        if (connection === null) {
          throw notFound('connection', input.connectionId, input.ctx.correlationId);
        }
        // One open incident per connection and remediation. A retried activity,
        // or a workflow that fails the same way twice, must not stack the same
        // card up in the Action Center.
        const existing = await db.connectionIncident.findFirst({
          where: {
            connectionId: connection.id,
            workspaceId: input.ctx.workspaceId,
            state: 'open',
            remediationKey: input.messageKey,
          },
          select: { id: true },
        });
        if (existing === null) {
          await db.connectionIncident.create({
            data: {
              workspaceId: input.ctx.workspaceId,
              connectionId: connection.id,
              kind: incidentKind(input.messageKey, input.errorCode),
              state: 'open',
              remediationKey: input.messageKey,
              detail: { errorCode: input.errorCode, correlationId: input.ctx.correlationId },
              detectedAt: deps.clock.now(),
            },
          });
        }
        // The Action Center reads open incidents and connection status together,
        // so the status flip is what makes the broken connection findable.
        if (connection.status === 'active') {
          await db.socialConnection.updateMany({
            where: { id: connection.id, workspaceId: input.ctx.workspaceId },
            data: { status: 'action_required' },
          });

          // A connection falling out of `active` is a token the product could
          // not keep alive. Counted only on the transition, so a repeated
          // failure against an already-broken connection does not inflate it.
          productMetrics.tokenRefreshFailuresTotal.add(1, {
            connection_id: connection.id,
            error_class: input.errorCode,
          });
        }
      });
    },
  };
}
