import { createHash } from 'node:crypto';

import {
  Inject,
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  API_HEADERS,
  ConflictError,
  IDEMPOTENCY_RETENTION_SECONDS,
  IdempotencyMismatchError,
  ValidationFailedError,
  canonicalJson,
  idempotencyKeySchema,
} from '@relay/contracts';
import type { Request, Response } from 'express';
import { from, of, switchMap, tap, type Observable } from 'rxjs';

import type { Clock, KeyValueStore } from '../application/port';
import { CLOCK, KEY_VALUE_STORE } from '../application/tokens';
import { IDEMPOTENT_KEY } from '../common/decorators';
import { relayState } from '../common/request.types';
import { idempotencyRecordSchema, type StoredIdempotencyRecord } from '../security/records';

/**
 * Idempotency for every create, schedule, publish and cancel.
 *
 * Every external side effect in Post Array is idempotent (`AGENTS.md`, hard rule 6),
 * and the mechanism is the same on all five surfaces: an `Idempotency-Key`
 * header, scoped to `(workspace_id, key)`, holding the request hash and the
 * exact response for 24 hours.
 *
 * Three outcomes:
 *
 * - **First use.** The handler runs and its status and body are stored.
 * - **Replay with the same body.** The stored response is returned byte for
 *   byte. The handler does not run, so a client that retries after a timeout
 *   cannot publish twice.
 * - **Replay with a different body.** `409 IDEMPOTENCY_MISMATCH`. Silently
 *   overwriting would let a typo replace a post that already went out.
 *
 * A concurrent second request holding the same key while the first is still
 * running gets a `409 CONFLICT`, not a second execution. The reservation is an
 * atomic set-if-absent, so the race is decided in the store rather than by
 * timing.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(KEY_VALUE_STORE) private readonly kv: KeyValueStore,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    const required = this.reflector.getAllAndOverride<boolean>(IDEMPOTENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (required !== true) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const state = relayState(request);

    const presented = state.idempotencyKey;
    if (presented === undefined) {
      throw new ValidationFailedError({
        details: { header: API_HEADERS.idempotencyKey, reason: 'required' },
      });
    }
    const parsedKey = idempotencyKeySchema.safeParse(presented);
    if (!parsedKey.success) {
      throw new ValidationFailedError({
        details: { header: API_HEADERS.idempotencyKey, reason: 'malformed' },
      });
    }

    const workspaceId = state.workspaceId ?? 'unscoped';
    const route = `${request.method}:${request.route?.path ?? request.path}`;
    const requestHash = hashRequest(route, request.body);
    const storeKey = `relay:idempotency:${workspaceId}:${parsedKey.data}`;
    const lockKey = `${storeKey}:lock`;

    return from(this.resolveStored(storeKey)).pipe(
      switchMap((stored) => {
        if (stored !== null) {
          if (stored.requestHash !== requestHash || stored.route !== route) {
            throw new IdempotencyMismatchError({
              details: { key: parsedKey.data, reason: 'request_differs' },
            });
          }
          state.idempotentReplay = true;
          response.status(stored.status);
          response.setHeader('x-relay-idempotent-replay', 'true');
          return of(safeJsonParse(stored.body));
        }

        return from(
          this.kv.setIfAbsent(lockKey, this.clock.now().toISOString(), { ttlSeconds: 120 }),
        ).pipe(
          switchMap((won) => {
            if (!won) {
              // Another request holding this key is still in flight. Telling the
              // caller to retry is correct; running the handler again is not.
              throw new ConflictError({
                details: { key: parsedKey.data, reason: 'in_flight' },
              });
            }
            return next.handle().pipe(
              tap({
                next: (body) => {
                  void this.store(storeKey, {
                    key: parsedKey.data,
                    workspaceId,
                    route,
                    requestHash,
                    status: response.statusCode,
                    body: JSON.stringify(body ?? null),
                    createdAt: this.clock.now().toISOString(),
                  });
                },
                error: () => {
                  // A failed attempt reserves nothing: the caller must be able
                  // to retry the same key once the cause is fixed.
                  void this.kv.delete(lockKey);
                },
              }),
            );
          }),
        );
      }),
    );
  }

  private async resolveStored(storeKey: string): Promise<StoredIdempotencyRecord | null> {
    const raw = await this.kv.get(storeKey);
    if (raw === null) {
      return null;
    }
    const parsed = idempotencyRecordSchema.safeParse(safeJsonParse(raw));
    return parsed.success ? parsed.data : null;
  }

  private async store(storeKey: string, record: StoredIdempotencyRecord): Promise<void> {
    const validated = idempotencyRecordSchema.safeParse(record);
    if (!validated.success) {
      // An oversized response is not stored, so the retry re-executes rather
      // than replaying something truncated.
      return;
    }
    await this.kv.set(storeKey, JSON.stringify(validated.data), {
      ttlSeconds: IDEMPOTENCY_RETENTION_SECONDS,
    });
  }
}

/**
 * The request fingerprint. The route is included so the same key used against
 * two different endpoints is a mismatch rather than a cross-route replay, and
 * the body is canonicalized so key order in the JSON does not change the hash.
 */
export function hashRequest(route: string, body: unknown): string {
  return createHash('sha256').update(canonicalJson({ route, body }), 'utf8').digest('hex');
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
