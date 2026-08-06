import { RelayError, type ErrorCode } from '@relay/contracts';
import type { Clock, SchedulerPort } from '@relay/application';
import type { RelayPrismaClient } from '@relay/database';
import type { Logger } from '@relay/observability';

import { dispatchWorkflowOutbox } from './outbox-dispatch';
import { claimOutboxEvents, markOutboxDispatched, recordOutboxFailure } from './outbox-repository';

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_LEASE_MS = 5 * 60_000;
const DEFAULT_POLL_MS = 1_000;

export interface OutboxDispatcherOptions {
  readonly prisma: RelayPrismaClient;
  readonly scheduler: SchedulerPort;
  readonly clock: Clock;
  readonly logger: Logger;
  readonly batchSize?: number;
  readonly leaseMs?: number;
  readonly pollMs?: number;
}

export interface OutboxRunResult {
  readonly claimed: number;
  readonly dispatched: number;
  readonly failed: number;
  readonly deadLettered: number;
}

function errorCode(error: unknown): ErrorCode {
  return RelayError.fromUnknown(error).code;
}

/** Durable database-to-Temporal handoff owned by the worker process. */
export class OutboxDispatcher {
  readonly #options: OutboxDispatcherOptions;
  #running: Promise<void> | null = null;
  #stopRequested = false;
  #wake: (() => void) | null = null;

  constructor(options: OutboxDispatcherOptions) {
    this.#options = options;
  }

  async runOnce(): Promise<OutboxRunResult> {
    const events = await claimOutboxEvents(this.#options.prisma, {
      now: this.#options.clock.now(),
      limit: this.#options.batchSize ?? DEFAULT_BATCH_SIZE,
      leaseMs: this.#options.leaseMs ?? DEFAULT_LEASE_MS,
    });
    let dispatched = 0;
    let failed = 0;
    let deadLettered = 0;

    for (const event of events) {
      try {
        const result = await dispatchWorkflowOutbox(this.#options.scheduler, event);
        await markOutboxDispatched(this.#options.prisma, event, result, this.#options.clock.now());
        dispatched += 1;
      } catch (error: unknown) {
        failed += 1;
        const code = errorCode(error);
        const outcome = await recordOutboxFailure(
          this.#options.prisma,
          event,
          code,
          this.#options.clock.now(),
        );
        if (outcome.deadLettered) {
          deadLettered += 1;
          this.#options.logger.error(
            { outboxEventId: event.id, kind: event.kind, attempts: outcome.attempts, code },
            'outbox.dead_lettered',
          );
        } else {
          this.#options.logger.warn(
            { outboxEventId: event.id, kind: event.kind, attempts: outcome.attempts, code },
            'outbox.dispatch_failed',
          );
        }
      }
    }

    return { claimed: events.length, dispatched, failed, deadLettered };
  }

  start(): void {
    if (this.#running !== null) return;
    this.#stopRequested = false;
    this.#running = this.#loop();
  }

  async stop(): Promise<void> {
    this.#stopRequested = true;
    this.#wake?.();
    await this.#running;
    this.#running = null;
  }

  async #loop(): Promise<void> {
    while (!this.#stopRequested) {
      try {
        await this.runOnce();
      } catch (error: unknown) {
        this.#options.logger.error({ code: errorCode(error) }, 'outbox.poll_failed');
      }
      if (!this.#stopRequested) {
        await this.#wait();
      }
    }
  }

  #wait(): Promise<void> {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, this.#options.pollMs ?? DEFAULT_POLL_MS);
      this.#wake = () => {
        clearTimeout(timer);
        resolve();
      };
    }).finally(() => {
      this.#wake = null;
    });
  }
}
