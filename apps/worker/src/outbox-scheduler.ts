import {
  publishWorkflowId,
  ruleWorkflowId,
  type Clock,
  type SchedulerPort,
} from '@relay/application';
import type { RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import { TemporalScheduler } from '@relay/runtime';

import { analyticsSyncDescriptor } from './workflows/core/analytics-sync.core';
import { automationRuleDescriptor } from './workflows/core/automation-rule.core';
import { publishPostDescriptor } from './workflows/core/publish-post.core';
import type { RunningWorker } from './worker';

const SIX_HOURS_MS = 6 * 60 * 60_000;

export interface WorkerSchedulerOptions {
  readonly worker: RunningWorker;
  readonly config: RelayConfig;
  readonly clock: Clock;
  readonly logger: Logger;
}

/**
 * The outbox-facing scheduler. Production delegates to Temporal. Local fallback
 * runs the same workflow bodies through the worker's explicit degraded mode.
 */
export class WorkerScheduler implements SchedulerPort {
  readonly #worker: RunningWorker;
  readonly #temporal: TemporalScheduler | null;
  readonly #clock: Clock;

  constructor(options: WorkerSchedulerOptions) {
    this.#worker = options.worker;
    this.#clock = options.clock;
    const address = options.config.temporal.address;
    this.#temporal =
      options.worker.mode === 'durable' && address !== undefined
        ? new TemporalScheduler({
            address,
            namespace: options.config.temporal.namespace,
            taskQueue: options.config.temporal.taskQueue,
            clock: options.clock,
            logger: options.logger,
            ...(options.config.temporal.apiKey === undefined
              ? {}
              : { apiKey: options.config.temporal.apiKey }),
          })
        : null;
  }

  async schedulePublish(input: Parameters<SchedulerPort['schedulePublish']>[0]) {
    if (this.#temporal !== null) return this.#temporal.schedulePublish(input);
    const workflowId = publishWorkflowId(input.workspaceId, input.jobId);
    this.#inline().startWorkflow(publishPostDescriptor, workflowId, input.workflowInput);
    return { workflowId, runId: `${workflowId}:inline` };
  }

  async cancelPublish(input: Parameters<SchedulerPort['cancelPublish']>[0]): Promise<void> {
    if (this.#temporal !== null) return this.#temporal.cancelPublish(input);
    this.#requireSignal(publishWorkflowId(input.workspaceId, input.jobId), 'cancel', {
      reason: input.reason,
      requestedAt: this.#clock.now().toISOString(),
    });
  }

  async reschedulePublish(input: Parameters<SchedulerPort['reschedulePublish']>[0]): Promise<void> {
    if (this.#temporal !== null) return this.#temporal.reschedulePublish(input);
    this.#requireSignal(publishWorkflowId(input.workspaceId, input.jobId), 'reschedule', {
      instant: input.executeAt.toISOString(),
      ianaTimeZone: input.ianaTimeZone,
      confirmedDst: true,
    });
  }

  async signalPublish(input: Parameters<SchedulerPort['signalPublish']>[0]): Promise<void> {
    if (this.#temporal !== null) return this.#temporal.signalPublish(input);
    this.#requireSignal(
      publishWorkflowId(input.workspaceId, input.jobId),
      input.signal,
      input.payload,
    );
  }

  async scheduleAnalyticsSync(
    input: Parameters<SchedulerPort['scheduleAnalyticsSync']>[0],
  ): Promise<void> {
    if (this.#temporal !== null) return this.#temporal.scheduleAnalyticsSync(input);
    const workflowId = `analytics:${input.workspaceId}:${input.connectionId}${
      input.receiptId === undefined ? '' : `:${input.receiptId}`
    }`;
    this.#inline().startWorkflow(analyticsSyncDescriptor, workflowId, {
      ctx: input.ctx,
      connectionId: input.connectionId,
      provider: input.provider,
      receiptId: input.receiptId ?? null,
      publishedAt: input.publishedAt ?? null,
      pendingOffsetsMs: [],
      steadyIntervalMs: SIX_HOURS_MS,
      iterationsThisRun: 0,
      totalIterations: 0,
    });
  }

  async startRuleRun(input: Parameters<SchedulerPort['startRuleRun']>[0]) {
    if (this.#temporal !== null) return this.#temporal.startRuleRun(input);
    const workflowId = ruleWorkflowId(input.workspaceId, input.ruleId, input.runId);
    this.#inline().startWorkflow(automationRuleDescriptor, workflowId, {
      ctx: input.ctx,
      ruleId: input.ruleId,
      runId: input.runId,
      sourceKey: input.sourceKey,
      event: input.event,
      dryRun: input.dryRun ?? false,
    });
    return { workflowId };
  }

  async describe(input: Parameters<SchedulerPort['describe']>[0]) {
    if (this.#temporal !== null) return this.#temporal.describe(input);
    const run = this.#inline().get(publishWorkflowId(input.workspaceId, input.jobId));
    if (run === undefined) return null;
    const status = run.status();
    return { status: status?.state ?? 'RUNNING', historyLength: 0 };
  }

  close(): Promise<void> {
    return this.#temporal?.close() ?? Promise.resolve();
  }

  #inline() {
    const inline = this.#worker.inlineScheduler;
    if (inline === null) {
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { provider: 'scheduler', reason: 'worker_scheduler_unavailable' },
      });
    }
    return inline;
  }

  #requireSignal(
    workflowId: string,
    signal: string,
    payload?: Readonly<Record<string, unknown>>,
  ): void {
    if (!this.#inline().signal(workflowId, signal, payload)) {
      throw new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE, {
        details: { provider: 'scheduler', operation: 'signal_workflow' },
      });
    }
  }
}
