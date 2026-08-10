import type {
  Clock,
  DataDeletionWorkflowInput,
  DataExportWorkflowInput,
  PublishWorkflowInput,
  SchedulerPort,
} from '../types';

import { systemClock } from './clock';

/**
 * A scheduler that records intent instead of talking to Temporal.
 *
 * Used by tests and by the local development stack when no Temporal cluster is
 * configured. The workflow id it mints is the same deterministic value the real
 * adapter uses, so a durable-execution bug shows up here too.
 */

export interface RecordedPublish {
  readonly jobId: string;
  readonly workspaceId: string;
  readonly executeAt: Date;
  readonly idempotencyKey: string;
  readonly workflowInput: PublishWorkflowInput;
  readonly workflowId: string;
  canceled: boolean;
  cancelReason: string | null;
}

export interface RecordedDataExport {
  readonly exportId: string;
  readonly workspaceId: string;
  readonly executeAt: Date;
  readonly workflowInput: DataExportWorkflowInput;
  readonly workflowId: string;
}

export interface RecordedDataDeletion {
  readonly requestId: string;
  readonly workspaceId: string;
  readonly executeAt: Date;
  readonly workflowInput: DataDeletionWorkflowInput;
  readonly workflowId: string;
  canceled: boolean;
  cancelReason: string | null;
}

/** Deterministic, so a replay of the same job never starts a second workflow. */
export function publishWorkflowId(workspaceId: string, jobId: string): string {
  return `publish:${workspaceId}:${jobId}`;
}

export function ruleWorkflowId(workspaceId: string, ruleId: string, runId: string): string {
  return `rule:${workspaceId}:${ruleId}:${runId}`;
}

export function dataExportWorkflowId(workspaceId: string, exportId: string): string {
  return `export:${workspaceId}:${exportId}`;
}

export function dataDeletionWorkflowId(workspaceId: string, requestId: string): string {
  return `delete:${workspaceId}:${requestId}`;
}

/**
 * Deterministic per job, so a retried upload or a duplicated start signal joins
 * the run that already exists instead of beginning a second one.
 */
export function bulkImportWorkflowId(workspaceId: string, importJobId: string): string {
  return `import:${workspaceId}:${importJobId}`;
}

export class InMemoryScheduler implements SchedulerPort {
  readonly publishes = new Map<string, RecordedPublish>();
  readonly analyticsSyncs: { connectionId: string; receiptId: string | null; at: Date }[] = [];
  readonly ruleRuns: { ruleId: string; workspaceId: string; workflowId: string }[] = [];
  readonly dataExports = new Map<string, RecordedDataExport>();
  readonly dataDeletions = new Map<string, RecordedDataDeletion>();
  readonly signals: { jobId: string; signal: string }[] = [];
  constructor(_clock: Clock = systemClock) {}

  async schedulePublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly idempotencyKey: string;
    readonly workflowInput: PublishWorkflowInput;
  }): Promise<{ readonly workflowId: string; readonly runId: string }> {
    const workflowId = publishWorkflowId(input.workspaceId, input.jobId);
    const existing = this.publishes.get(input.jobId);
    if (existing !== undefined) {
      return { workflowId: existing.workflowId, runId: `${workflowId}:1` };
    }
    this.publishes.set(input.jobId, {
      jobId: input.jobId,
      workspaceId: input.workspaceId,
      executeAt: input.executeAt,
      idempotencyKey: input.idempotencyKey,
      workflowInput: input.workflowInput,
      workflowId,
      canceled: false,
      cancelReason: null,
    });
    return { workflowId, runId: `${workflowId}:1` };
  }

  async cancelPublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly reason: string;
  }): Promise<void> {
    const existing = this.publishes.get(input.jobId);
    if (existing !== undefined) {
      existing.canceled = true;
      existing.cancelReason = input.reason;
    }
  }

  async reschedulePublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly ianaTimeZone: string;
  }): Promise<void> {
    const existing = this.publishes.get(input.jobId);
    if (existing !== undefined) {
      this.publishes.set(input.jobId, { ...existing, executeAt: input.executeAt });
    }
  }

  async signalPublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly signal: string;
  }): Promise<void> {
    this.signals.push({ jobId: input.jobId, signal: input.signal });
  }

  async scheduleAnalyticsSync(input: {
    readonly ctx: Parameters<SchedulerPort['scheduleAnalyticsSync']>[0]['ctx'];
    readonly workspaceId: string;
    readonly connectionId: string;
    readonly provider: Parameters<SchedulerPort['scheduleAnalyticsSync']>[0]['provider'];
    readonly receiptId?: string;
    readonly publishedAt?: string;
    readonly at: Date;
  }): Promise<void> {
    this.analyticsSyncs.push({
      connectionId: input.connectionId,
      receiptId: input.receiptId ?? null,
      at: input.at,
    });
  }

  async startRuleRun(input: {
    readonly ctx: Parameters<SchedulerPort['startRuleRun']>[0]['ctx'];
    readonly ruleId: string;
    readonly workspaceId: string;
    readonly runId: string;
    readonly sourceKey: string;
    readonly event: Record<string, unknown>;
    readonly dryRun?: boolean;
  }): Promise<{ readonly workflowId: string }> {
    const workflowId = ruleWorkflowId(input.workspaceId, input.ruleId, input.runId);
    this.ruleRuns.push({ ruleId: input.ruleId, workspaceId: input.workspaceId, workflowId });
    return { workflowId };
  }

  async scheduleDataExport(
    input: Parameters<SchedulerPort['scheduleDataExport']>[0],
  ): Promise<{ readonly workflowId: string; readonly runId: string }> {
    const workflowId = dataExportWorkflowId(input.workspaceId, input.exportId);
    const existing = this.dataExports.get(input.exportId);
    if (existing !== undefined) {
      return { workflowId: existing.workflowId, runId: `${workflowId}:1` };
    }
    this.dataExports.set(input.exportId, {
      exportId: input.exportId,
      workspaceId: input.workspaceId,
      executeAt: input.executeAt,
      workflowInput: input.workflowInput,
      workflowId,
    });
    return { workflowId, runId: `${workflowId}:1` };
  }

  async scheduleDataDeletion(
    input: Parameters<SchedulerPort['scheduleDataDeletion']>[0],
  ): Promise<{ readonly workflowId: string; readonly runId: string }> {
    const workflowId = dataDeletionWorkflowId(input.workspaceId, input.requestId);
    const existing = this.dataDeletions.get(input.requestId);
    if (existing !== undefined) {
      return { workflowId: existing.workflowId, runId: `${workflowId}:1` };
    }
    this.dataDeletions.set(input.requestId, {
      requestId: input.requestId,
      workspaceId: input.workspaceId,
      executeAt: input.executeAt,
      workflowInput: input.workflowInput,
      workflowId,
      canceled: false,
      cancelReason: null,
    });
    return { workflowId, runId: `${workflowId}:1` };
  }

  async cancelDataDeletion(
    input: Parameters<SchedulerPort['cancelDataDeletion']>[0],
  ): Promise<void> {
    const existing = this.dataDeletions.get(input.requestId);
    if (existing !== undefined) {
      existing.canceled = true;
      existing.cancelReason = input.reason;
    }
  }

  async describe(input: {
    readonly jobId: string;
    readonly workspaceId: string;
  }): Promise<{ readonly status: string; readonly historyLength: number } | null> {
    const existing = this.publishes.get(input.jobId);
    if (existing === undefined) {
      return null;
    }
    return { status: existing.canceled ? 'CANCELED' : 'RUNNING', historyLength: 1 };
  }
}
