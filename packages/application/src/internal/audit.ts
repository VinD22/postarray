import { appendAuditEvent, type RlsTransactionClient } from '@relay/database';

import { fromStoredSurface, toStoredActorType, toStoredSurface } from './mappers';
import type { ActorSnapshot, Db } from './runtime';

/**
 * Every write appends one audit event, in the same transaction as the write it
 * describes. A rolled back mutation must not leave a claim that it happened.
 *
 * `before` and `after` are hashed, never stored: the log proves that a value
 * changed without keeping a copy of a customer's draft or email.
 */

/**
 * Boundary shim. `withWorkspace` returns a proxy over the very transaction
 * client `appendAuditEvent` expects; the two published types differ only in
 * which `$` helpers they omit. Nothing else in this package reaches through it.
 */
function auditClient(db: Db): RlsTransactionClient {
  return db as unknown as RlsTransactionClient;
}

export interface AuditInput {
  readonly action: string;
  readonly targetType: string;
  readonly targetId?: string;
  readonly before?: unknown;
  readonly after?: unknown;
  readonly metadata?: Record<string, unknown>;
}

export async function recordAudit(db: Db, actor: ActorSnapshot, input: AuditInput): Promise<void> {
  const ctx = actor.ctx;
  await appendAuditEvent(auditClient(db), {
    workspaceId: ctx.workspaceId,
    actor: {
      type: toStoredActorType(ctx.actorType),
      ...(actor.userId === null ? {} : { id: actor.userId }),
      ...(ctx.clientId === undefined ? {} : { clientId: ctx.clientId }),
    },
    surface: toStoredSurface(ctx.surface),
    action: input.action,
    target: {
      type: input.targetType,
      ...(input.targetId === undefined ? {} : { id: input.targetId }),
    },
    ...(input.before === undefined ? {} : { before: input.before }),
    ...(input.after === undefined ? {} : { after: input.after }),
    metadata: {
      ...(input.metadata ?? {}),
      // The contract surface, which may be `agent` even though the column
      // cannot hold it. Keeping it here means the audit trail stays honest.
      contractSurface: ctx.surface,
      approvalLevel: ctx.approvalLevel,
    },
    ...(ctx.ipAddress === undefined ? {} : { ipAddress: ctx.ipAddress }),
    ...(ctx.userAgent === undefined ? {} : { userAgent: ctx.userAgent }),
    correlationId: ctx.correlationId,
  });
}

export { fromStoredSurface };
