import {
  bulkImportWorkflowId,
  dataDeletionWorkflowId,
  publishWorkflowId,
  dataExportWorkflowId,
  ruleWorkflowId,
  type Clock,
  type SchedulerPort,
} from '@relay/application';
import type { RelayConfig } from '@relay/config';
import { ERROR_CODES, RelayError } from '@relay/contracts';
import type { Logger } from '@relay/observability';
import { TemporalScheduler } from '@relay/runtime';

import { analyticsSyncDescriptor } from './workflows/core/analytics-sync.core';
import { bulkImportDescriptor } from './workflows/core/bulk-import.core';
import { automationRuleDescriptor } from './workflows/core/automation-rule.core';
import { dataExportDescriptor } from './workflows/core/data-export.core';
import { dataDeletionDescriptor } from './workflows/core/data-deletion.core';
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

  /**
   * Hold a scheduled campaign where it is.
   *
   * The publish workflow's wait loop is already interruptible by `pause`, so
   * delivery is one signal. There is nothing to undo and nothing to send: a
   * pause stops work that has not happened, and never retracts an external
   * post. A workflow that has already left the wait loop simply ignores it,
   * which is why the application service refuses to pause a job that is
   * mid-dispatch rather than pretending this signal could stop it.
   */
  async pausePublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
  }): Promise<void> {
    if (this.#temporal !== null) {
      return this.#temporal.signalPublish({ ...input, signal: 'pause' });
    }
    this.#requireSignal(publishWorkflowId(input.workspaceId, input.jobId), 'pause');
  }

  /**
   * Let a held campaign continue, optionally at a new instant.
   *
   * The ordering is the whole content of this method. When a new instant is
   * supplied it is delivered as a reschedule *first*, and only then is the
   * workflow released. Signalling resume first would let the wait loop observe
   * an instant that passed while the job was held and dispatch immediately,
   * which is exactly what the person who paused it was preventing.
   */
  async resumePublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly executeAt?: Date;
    readonly ianaTimeZone?: string;
  }): Promise<void> {
    if (input.executeAt !== undefined && input.ianaTimeZone !== undefined) {
      await this.reschedulePublish({
        jobId: input.jobId,
        workspaceId: input.workspaceId,
        executeAt: input.executeAt,
        ianaTimeZone: input.ianaTimeZone,
      });
    }
    if (this.#temporal !== null) {
      return this.#temporal.signalPublish({
        jobId: input.jobId,
        workspaceId: input.workspaceId,
        signal: 'resume',
      });
    }
    this.#requireSignal(publishWorkflowId(input.workspaceId, input.jobId), 'resume');
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

  async scheduleDataExport(input: Parameters<SchedulerPort['scheduleDataExport']>[0]) {
    if (this.#temporal !== null) return this.#temporal.scheduleDataExport(input);
    const workflowId = dataExportWorkflowId(input.workspaceId, input.exportId);
    this.#inline().startWorkflow(dataExportDescriptor, workflowId, input.workflowInput);
    return { workflowId, runId: `${workflowId}:inline` };
  }

  async scheduleDataDeletion(input: Parameters<SchedulerPort['scheduleDataDeletion']>[0]) {
    if (this.#temporal !== null) return this.#temporal.scheduleDataDeletion(input);
    const workflowId = dataDeletionWorkflowId(input.workspaceId, input.requestId);
    this.#inline().startWorkflow(dataDeletionDescriptor, workflowId, input.workflowInput);
    return { workflowId, runId: `${workflowId}:inline` };
  }

  /**
   * Bulk CSV import.
   *
   * Temporal has no bulk-import method of its own yet, so a durable deployment
   * runs the same workflow body through the worker's inline scheduler. That is
   * honest: the run is real and idempotent, it simply does not get Temporal's
   * durable retries until the shared scheduler learns this workflow. The
   * workflow id is deterministic per job either way, so a retried upload joins
   * the run that already exists rather than starting a second one.
   */
  async scheduleBulkImport(input: {
    readonly importJobId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly workflowInput: Parameters<typeof bulkImportDescriptor.run>[2];
  }): Promise<{ readonly workflowId: string; readonly runId: string }> {
    const workflowId = bulkImportWorkflowId(input.workspaceId, input.importJobId);
    this.#inline().startWorkflow(bulkImportDescriptor, workflowId, input.workflowInput);
    return { workflowId, runId: `${workflowId}:inline` };
  }

  async cancelDataDeletion(
    input: Parameters<SchedulerPort['cancelDataDeletion']>[0],
  ): Promise<void> {
    if (this.#temporal !== null) return this.#temporal.cancelDataDeletion(input);
    this.#requireSignal(dataDeletionWorkflowId(input.workspaceId, input.requestId), 'cancel', {
      reason: input.reason,
      requestedAt: this.#clock.now().toISOString(),
    });
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
