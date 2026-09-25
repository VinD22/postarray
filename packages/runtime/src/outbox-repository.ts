import { ERROR_CODES, RelayError } from '@relay/contracts';
import {
  Prisma,
  serviceRoleClaims,
  withRlsContext,
  withWorkspaceContext,
  type RelayPrismaClient,
} from '@relay/database';

import type { OutboxDispatchResult } from './outbox-dispatch';

export interface ClaimedOutboxEvent {
  readonly id: string;
  readonly workspaceId: string;
  readonly kind: string;
  readonly dedupeKey: string;
  readonly payload: Prisma.JsonValue;
  readonly attempts: number;
}

export interface ClaimOutboxOptions {
  readonly now: Date;
  readonly limit: number;
  readonly leaseMs: number;
  /**
   * Which kinds this dispatcher owns. Two dispatchers poll one table, and a
   * row claimed by the wrong one is a row that fails ten times and then dead
   * letters, so the filter is required rather than defaulted.
   */
  readonly kinds: readonly string[];
}

const RETRY_DELAYS_MS = [30_000, 120_000, 600_000, 3_600_000, 21_600_000, 86_400_000] as const;
export const OUTBOX_MAX_ATTEMPTS = 10;

export function outboxRetryDelayMs(attempt: number): number {
  const index = Math.max(0, Math.min(attempt - 1, RETRY_DELAYS_MS.length - 1));
  return RETRY_DELAYS_MS[index] ?? 86_400_000;
}

/** Atomically lease a bounded batch. The transaction ends before dispatch begins. */
export function claimOutboxEvents(
  prisma: RelayPrismaClient,
  options: ClaimOutboxOptions,
): Promise<ClaimedOutboxEvent[]> {
  const staleBefore = new Date(options.now.getTime() - options.leaseMs);
  return withRlsContext(prisma, serviceRoleClaims(), (tx) =>
    tx.$queryRaw<ClaimedOutboxEvent[]>(Prisma.sql`
      WITH claimable AS (
        SELECT id
        FROM private.outbox
        WHERE dispatched_at IS NULL
          AND dead_lettered_at IS NULL
          AND kind = ANY(${options.kinds}::text[])
          AND available_at <= ${options.now}
          AND (claimed_at IS NULL OR claimed_at < ${staleBefore})
        ORDER BY available_at, id
        FOR UPDATE SKIP LOCKED
        LIMIT ${options.limit}
      )
      UPDATE private.outbox AS event
      SET claimed_at = ${options.now}
      FROM claimable
      WHERE event.id = claimable.id
      RETURNING
        event.id,
        event.workspace_id AS "workspaceId",
        event.kind,
        event.dedupe_key AS "dedupeKey",
        event.payload,
        event.attempts
    `),
  );
}

/** Record dispatch and the Temporal identity in one workspace-scoped commit. */
export async function markOutboxDispatched(
  prisma: RelayPrismaClient,
  event: ClaimedOutboxEvent,
  result: OutboxDispatchResult,
  now: Date,
): Promise<void> {
  await withWorkspaceContext(
    prisma,
    { workspaceId: event.workspaceId, role: 'service_role' },
    async (db) => {
      if (result.publishJobId !== null && result.workflowId !== null && result.runId !== null) {
        const updated = await db.publishJob.updateMany({
          where: { id: result.publishJobId },
          data: { temporalWorkflowId: result.workflowId, temporalRunId: result.runId },
        });
        if (updated.count !== 1) {
          throw new RelayError(ERROR_CODES.NOT_FOUND, {
            details: { resource: 'publish_job' },
          });
        }
      }

      const marked = await db.outboxEvent.updateMany({
        where: { id: event.id, dispatchedAt: null, deadLetteredAt: null },
        data: { dispatchedAt: now, claimedAt: null, lastErrorCode: null },
      });
      if (marked.count !== 1) {
        throw new RelayError(ERROR_CODES.CONFLICT, {
          details: { resource: 'outbox_event', reason: 'lease_lost' },
        });
      }
    },
  );
}

/**
 * Retire a row this dispatcher can never handle.
 *
 * A kind no dispatcher understands is a programming error, not a transient
 * failure. Running it through the retry ladder burns twenty-four hours and
 * ten attempts to reach the same conclusion, so it goes straight to the dead
 * letter table where the replay tool can find it.
 */
export async function deadLetterOutboxEvent(
  prisma: RelayPrismaClient,
  event: ClaimedOutboxEvent,
  errorCode: string,
  now: Date,
): Promise<void> {
  await withWorkspaceContext(
    prisma,
    { workspaceId: event.workspaceId, role: 'service_role' },
    async (db) => {
      await db.outboxDeadLetter.create({
        data: {
          workspaceId: event.workspaceId,
          outboxEventId: event.id,
          kind: event.kind,
          dedupeKey: event.dedupeKey,
          payload: event.payload === null ? Prisma.JsonNull : event.payload,
          attempts: event.attempts + 1,
          errorCode,
          failedAt: now,
        },
      });
      await db.outboxEvent.update({
        where: { id: event.id },
        data: {
          attempts: event.attempts + 1,
          lastErrorCode: errorCode,
          claimedAt: null,
          deadLetteredAt: now,
        },
      });
    },
  );
}

export async function recordOutboxFailure(
  prisma: RelayPrismaClient,
  event: ClaimedOutboxEvent,
  errorCode: string,
  now: Date,
): Promise<{ readonly deadLettered: boolean; readonly attempts: number }> {
  const attempts = event.attempts + 1;
  const deadLettered = attempts >= OUTBOX_MAX_ATTEMPTS;
  const availableAt = new Date(now.getTime() + outboxRetryDelayMs(attempts));

  await withWorkspaceContext(
    prisma,
    { workspaceId: event.workspaceId, role: 'service_role' },
    async (db) => {
      if (deadLettered) {
        await db.outboxDeadLetter.create({
          data: {
            workspaceId: event.workspaceId,
            outboxEventId: event.id,
            kind: event.kind,
            dedupeKey: event.dedupeKey,
            payload: event.payload === null ? Prisma.JsonNull : event.payload,
            attempts,
            errorCode,
            failedAt: now,
          },
        });
      }
      await db.outboxEvent.update({
        where: { id: event.id },
        data: {
          attempts,
          lastErrorCode: errorCode,
          claimedAt: null,
          availableAt,
          ...(deadLettered ? { deadLetteredAt: now } : {}),
        },
      });
    },
  );

  return { deadLettered, attempts };
}
