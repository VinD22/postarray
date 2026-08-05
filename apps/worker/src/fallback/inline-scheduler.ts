import { RelayError, ERROR_CODES } from '@relay/contracts';
import type { HealthCheck } from '@relay/observability';

import type { WorkerActivities } from '../activities/types.js';
import { MESSAGE_KEYS } from '../messages.js';
import type { ChildWorkflowDescriptor, WorkflowLog, WorkflowStatusView } from '../runtime/types.js';

import {
  ContinueAsNewRequest,
  RealtimeWorkflowRuntime,
  applyInlineSignal,
} from './realtime-runtime.js';
import { nowIso } from '../runtime/clock.js';

/**
 * The degraded local scheduler.
 *
 * When `TEMPORAL_ADDRESS` is unset or unreachable the product still has to work
 * on a laptop: a developer schedules a post for two minutes' time and expects
 * it to publish. This scheduler runs the same workflow bodies in process, so
 * the behaviour under test is the real behaviour.
 *
 * What it does not do is survive anything. There is no durable history, so a
 * process restart loses every pending run, and there is no cross-process
 * deduplication, so two copies of this scheduler would publish twice. It
 * therefore:
 *
 * - refuses to start when `NODE_ENV` is `production`;
 * - reports itself as a failing check in the health report, never as `pass`;
 * - logs a warning naming the missing variable every time it accepts work.
 */

export class InlineSchedulerNotPermittedError extends RelayError {
  constructor() {
    super(ERROR_CODES.INTERNAL, {
      messageKey: MESSAGE_KEYS.worker.degradedInlineScheduler,
      details: { reason: 'inline_scheduler_in_production' },
    });
    this.name = 'InlineSchedulerNotPermittedError';
  }
}

export interface InlineRun {
  readonly workflowId: string;
  readonly workflowType: string;
  readonly startedAt: string;
  status(): WorkflowStatusView | null;
  signal(name: string, payload?: unknown): void;
  cancel(reason: string): void;
  result(): Promise<unknown>;
}

export interface InlineSchedulerOptions {
  readonly activities: WorkerActivities;
  readonly log: WorkflowLog;
  readonly isProduction: boolean;
  /** Why Temporal is not available. Surfaced in the health report. */
  readonly reason: string;
}

export class InlineScheduler {
  private readonly runs = new Map<string, InlineRun>();
  private readonly controller = new AbortController();
  private readonly options: InlineSchedulerOptions;
  private started = false;
  private acceptedCount = 0;

  constructor(options: InlineSchedulerOptions) {
    if (options.isProduction) {
      throw new InlineSchedulerNotPermittedError();
    }
    this.options = options;
  }

  start(): void {
    this.started = true;
    this.options.log.warn('worker.inline_scheduler_started', {
      messageKey: MESSAGE_KEYS.worker.degradedInlineScheduler,
      reason: this.options.reason,
    });
  }

  get isRunning(): boolean {
    return this.started;
  }

  get acceptedWorkflowCount(): number {
    return this.acceptedCount;
  }

  /**
   * Start a workflow in process. A duplicate workflow id returns the existing
   * run, mirroring Temporal's deduplication by workflow id.
   */
  startWorkflow<TInput, TOutput>(
    descriptor: ChildWorkflowDescriptor<TInput, TOutput>,
    workflowId: string,
    input: TInput,
  ): InlineRun {
    const existing = this.runs.get(workflowId);
    if (existing !== undefined) {
      return existing;
    }

    const runtime = new RealtimeWorkflowRuntime({
      workflowId,
      activities: this.options.activities,
      log: this.options.log,
      abortSignal: this.controller.signal,
    });

    const log = this.options.log;
    const execute = async (): Promise<unknown> => {
      try {
        return await descriptor.run(runtime, this.options.activities, input);
      } catch (error: unknown) {
        if (error instanceof ContinueAsNewRequest) {
          // Continuation is a Temporal server feature. The fallback runs one
          // generation and says so, rather than pretending a repeating series
          // will keep going after this process exits.
          log.warn('worker.inline_continuation_not_supported', {
            messageKey: MESSAGE_KEYS.worker.degradedInlineScheduler,
            workflowId,
            workflowType: descriptor.name,
          });
          return null;
        }
        throw error;
      }
    };

    const promise = execute();
    promise.catch((error: unknown) => {
      this.options.log.error('worker.inline_workflow_failed', {
        workflowId,
        workflowType: descriptor.name,
        error: error instanceof Error ? error.name : 'unknown',
      });
    });

    this.acceptedCount += 1;
    this.options.log.warn('worker.inline_workflow_accepted', {
      messageKey: MESSAGE_KEYS.worker.degradedInlineScheduler,
      workflowId,
      workflowType: descriptor.name,
    });

    const run: InlineRun = {
      workflowId,
      workflowType: descriptor.name,
      startedAt: nowIso(),
      status: () => runtime.currentStatus(),
      signal: (name: string, payload?: unknown) => {
        applyInlineSignal(runtime.signals, name, payload);
      },
      cancel: (reason: string) => {
        runtime.signals.onCancel({ reason, requestedAt: nowIso() });
      },
      result: () => promise,
    };
    this.runs.set(workflowId, run);
    return run;
  }

  get(workflowId: string): InlineRun | undefined {
    return this.runs.get(workflowId);
  }

  list(): readonly InlineRun[] {
    return [...this.runs.values()];
  }

  signal(workflowId: string, name: string, payload?: unknown): boolean {
    const run = this.runs.get(workflowId);
    if (run === undefined) {
      return false;
    }
    run.signal(name, payload);
    return true;
  }

  /** Stop accepting work and release every pending timer. */
  async shutdown(): Promise<void> {
    this.started = false;
    this.controller.abort();
    await Promise.allSettled([...this.runs.values()].map((run) => run.result()));
    this.runs.clear();
  }

  /**
   * The health check. Always `fail`, never `warn` and never `pass`: a product
   * running on this scheduler is not doing durable execution, and the status
   * page has to say so.
   */
  healthCheck(): HealthCheck {
    return {
      name: 'temporal.inline_fallback',
      status: 'fail',
      detail: `inline scheduler active: ${this.options.reason}`,
      observedAt: nowIso(),
    };
  }
}
