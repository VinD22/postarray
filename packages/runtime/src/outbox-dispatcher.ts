import {
  DOMAIN_EVENT_OUTBOX_KINDS,
  WORKFLOW_OUTBOX_KINDS,
  type Clock,
  type DomainEventService,
  type SchedulerPort,
} from '@relay/application';
import { RelayError, type ErrorCode } from '@relay/contracts';
import type { RelayPrismaClient } from '@relay/database';
import type { Logger } from '@relay/observability';

import { dispatchDomainEventOutbox } from './event-outbox-dispatch';
import {
  UnknownOutboxKindError,
  dispatchWorkflowOutbox,
  type OutboxDispatchResult,
} from './outbox-dispatch';
import {
  claimOutboxEvents,
  deadLetterOutboxEvent,
  markOutboxDispatched,
  recordOutboxFailure,
  type ClaimedOutboxEvent,
} from './outbox-repository';

const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_LEASE_MS = 5 * 60_000;
const DEFAULT_POLL_MS = 1_000;

export interface OutboxDispatcherOptions {
  readonly prisma: RelayPrismaClient;
  readonly clock: Clock;
  readonly logger: Logger;
  /**
   * The kinds this dispatcher claims. Two dispatchers share the table and must
   * never overlap: see DOMAIN_EVENT_OUTBOX_KINDS and WORKFLOW_OUTBOX_KINDS.
   */
  readonly kinds: readonly string[];
  /** What to do with one claimed row. Must be idempotent: rows can be redelivered. */
  readonly dispatch: (event: ClaimedOutboxEvent) => Promise<OutboxDispatchResult>;
  /** Names this dispatcher in log lines, so two loops are tellable apart. */
  readonly name: string;
  readonly batchSize?: number;
  readonly leaseMs?: number;
  readonly pollMs?: number;
}

/**
 * The dispatcher that hands workflow intents to Temporal. This is what the
 * class did for every row before domain events were given their own loop.
 */
export function createWorkflowOutboxDispatcher(options: {
  readonly prisma: RelayPrismaClient;
  readonly scheduler: SchedulerPort;
  readonly clock: Clock;
  readonly logger: Logger;
  readonly batchSize?: number;
  readonly leaseMs?: number;
  readonly pollMs?: number;
}): OutboxDispatcher {
  return new OutboxDispatcher({
    ...options,
    name: 'workflow',
    kinds: WORKFLOW_OUTBOX_KINDS,
    dispatch: (event) => dispatchWorkflowOutbox(options.scheduler, event),
  });
}

/**
 * The dispatcher that fans domain events out to customer webhook endpoints,
 * the notification writer and the realtime stream.
 *
 * This loop did not exist. Its rows were claimed by the workflow dispatcher,
 * which threw `unknown_outbox_kind` on every one of them, so outbound
 * webhooks and notifications were recorded and never delivered.
 */
export function createDomainEventOutboxDispatcher(options: {
  readonly prisma: RelayPrismaClient;
  readonly domainEvents: DomainEventService;
  readonly clock: Clock;
  readonly logger: Logger;
  readonly batchSize?: number;
  readonly leaseMs?: number;
  readonly pollMs?: number;
}): OutboxDispatcher {
  return new OutboxDispatcher({
    ...options,
    name: 'domain-event',
    kinds: DOMAIN_EVENT_OUTBOX_KINDS,
    dispatch: (event) => dispatchDomainEventOutbox(options.domainEvents, event),
  });
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
      kinds: this.#options.kinds,
    });
    let dispatched = 0;
    let failed = 0;
    let deadLettered = 0;

    for (const event of events) {
      try {
        const result = await this.#options.dispatch(event);
        await markOutboxDispatched(this.#options.prisma, event, result, this.#options.clock.now());
        dispatched += 1;
      } catch (error: unknown) {
        failed += 1;
        const code = errorCode(error);
        if (error instanceof UnknownOutboxKindError) {
          await deadLetterOutboxEvent(
            this.#options.prisma,
            event,
            code,
            this.#options.clock.now(),
          );
          deadLettered += 1;
          this.#options.logger.error(
            { dispatcher: this.#options.name, outboxEventId: event.id, kind: event.kind, code },
            'outbox.unknown_kind',
          );
          continue;
        }
        const outcome = await recordOutboxFailure(
          this.#options.prisma,
          event,
          code,
          this.#options.clock.now(),
        );
        if (outcome.deadLettered) {
          deadLettered += 1;
          this.#options.logger.error(
            {
              dispatcher: this.#options.name,
              outboxEventId: event.id,
              kind: event.kind,
              attempts: outcome.attempts,
              code,
            },
            'outbox.dead_lettered',
          );
        } else {
          this.#options.logger.warn(
            {
              dispatcher: this.#options.name,
              outboxEventId: event.id,
              kind: event.kind,
              attempts: outcome.attempts,
              code,
            },
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
        this.#options.logger.error(
          { dispatcher: this.#options.name, code: errorCode(error) },
          'outbox.poll_failed',
        );
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
