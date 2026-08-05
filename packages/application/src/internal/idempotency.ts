import { createHash } from 'node:crypto';

import {
  ConflictError,
  IDEMPOTENCY_RETENTION_SECONDS,
  IdempotencyMismatchError,
  canonicalJson,
  idempotencyKeySchema,
} from '@relay/contracts';
import { z } from 'zod';

import { systemClock } from '../ports/clock.js';
import type { Clock } from '../types.js';
import type { ActorContext, KeyValueStore } from '../types.js';

import { invalid } from './errors.js';

/**
 * Idempotent writes.
 *
 * An `ActorContext.idempotencyKey` replays the stored result for the same
 * `(workspace, key)` pair, and raises `IDEMPOTENCY_MISMATCH` when the same key
 * arrives with a different request body. That is the difference between a
 * client retrying safely and a client accidentally publishing twice.
 *
 * Two layers hold this together:
 *
 *  1. This record, in the key value store, which replays the *response* so a
 *     retry looks identical to the caller.
 *  2. A durable unique constraint on the row the operation creates. Publishing
 *     is the case that matters: `publish_jobs` is unique on
 *     `(workspace_id, idempotency_key)`, so even if the key value store is
 *     empty (a cold Redis, a different process, a crash between the write and
 *     the record) the database still refuses the second external publication.
 *
 * The key value record is an optimisation and a nicety. The database constraint
 * is the guarantee.
 */

const recordSchema = z
  .object({
    fingerprint: z.string().min(1),
    status: z.enum(['in_progress', 'done']),
    operation: z.string().min(1),
    result: z.string().optional(),
    resourceId: z.string().optional(),
    createdAt: z.string(),
  })
  .strict();

type IdempotencyRecordShape = z.infer<typeof recordSchema>;

export function fingerprintOf(operation: string, body: unknown): string {
  return createHash('sha256').update(canonicalJson({ operation, body })).digest('hex');
}

function storeKey(workspaceId: string, key: string): string {
  return `idempotency:${workspaceId}:${key}`;
}

async function readRecord(kv: KeyValueStore, key: string): Promise<IdempotencyRecordShape | null> {
  const raw = await kv.get(key);
  if (raw === null) {
    return null;
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return null;
  }
  const parsed = recordSchema.safeParse(parsedJson);
  return parsed.success ? parsed.data : null;
}

export interface IdempotentRun<T> {
  readonly operation: string;
  readonly body: unknown;
  readonly run: () => Promise<T>;
  /** Pulls the durable resource id out of the result, for the audit trail. */
  readonly resourceIdOf?: (result: T) => string | undefined;
}

/**
 * Wrap a write so a replay is safe. Called by every consequential service
 * method; a method that does not go through it is a review finding.
 */
export async function withIdempotency<T>(
  kv: KeyValueStore,
  ctx: ActorContext,
  input: IdempotentRun<T>,
  clock: Clock = systemClock,
): Promise<T> {
  const rawKey = ctx.idempotencyKey;
  if (rawKey === undefined) {
    return input.run();
  }

  const keyCheck = idempotencyKeySchema.safeParse(rawKey);
  if (!keyCheck.success) {
    throw invalid('errors.idempotency_key_invalid', {}, ctx.correlationId);
  }

  const key = storeKey(ctx.workspaceId, keyCheck.data);
  const fingerprint = fingerprintOf(input.operation, input.body);

  const reserved = await kv.set(
    key,
    JSON.stringify({
      fingerprint,
      status: 'in_progress',
      operation: input.operation,
      createdAt: clock.now().toISOString(),
    } satisfies IdempotencyRecordShape),
    { ifAbsent: true, ttlSeconds: IDEMPOTENCY_RETENTION_SECONDS },
  );

  if (!reserved) {
    const stored = await readRecord(kv, key);
    if (stored === null) {
      // The record expired between the reservation attempt and the read. Treat
      // it as a fresh request rather than failing a legitimate retry.
      return input.run();
    }
    if (stored.fingerprint !== fingerprint) {
      throw new IdempotencyMismatchError({
        messageKey: 'errors.idempotency_key_reused',
        details: { operation: input.operation, storedOperation: stored.operation },
        correlationId: ctx.correlationId,
      });
    }
    if (stored.status === 'in_progress') {
      throw new ConflictError({
        messageKey: 'errors.idempotency_in_progress',
        details: { operation: input.operation },
        retryable: true,
        correlationId: ctx.correlationId,
      });
    }
    if (stored.result === undefined) {
      return input.run();
    }
    const replayed: unknown = JSON.parse(stored.result);
    return replayed as T;
  }

  try {
    const result = await input.run();
    const resourceId = input.resourceIdOf?.(result);
    await kv.set(
      key,
      JSON.stringify({
        fingerprint,
        status: 'done',
        operation: input.operation,
        result: JSON.stringify(result),
        ...(resourceId === undefined ? {} : { resourceId }),
        createdAt: clock.now().toISOString(),
      } satisfies IdempotencyRecordShape),
      { ttlSeconds: IDEMPOTENCY_RETENTION_SECONDS },
    );
    return result;
  } catch (error) {
    // A failed attempt must not poison the key: the caller is entitled to fix
    // the problem and retry with the same key.
    await kv.delete(key);
    throw error;
  }
}

/**
 * The deterministic idempotency key a publish job carries. Derived from the
 * frozen content version and the target, so the same version dispatched to the
 * same connection can only ever produce one job, whatever the caller sent.
 */
export function publishJobIdempotencyKey(input: {
  readonly contentVersionId: string;
  readonly connectionId: string;
  readonly scheduledInstant: string;
  readonly callerKey?: string;
}): string {
  const digest = createHash('sha256')
    .update(
      canonicalJson({
        contentVersionId: input.contentVersionId,
        connectionId: input.connectionId,
        scheduledInstant: input.scheduledInstant,
        callerKey: input.callerKey ?? null,
      }),
    )
    .digest('hex');
  return `pj_${digest.slice(0, 48)}`;
}
