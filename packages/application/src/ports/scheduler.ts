import type { Clock, SchedulerPort } from '../types.js';

import { systemClock } from './clock.js';

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
  readonly workflowId: string;
  canceled: boolean;
  cancelReason: string | null;
}

/** Deterministic, so a replay of the same job never starts a second workflow. */
export function publishWorkflowId(workspaceId: string, jobId: string): string {
  return `publish:${workspaceId}:${jobId}`;
}

export class InMemoryScheduler implements SchedulerPort {
  readonly publishes = new Map<string, RecordedPublish>();
  readonly analyticsSyncs: { connectionId: string; receiptId: string | null; at: Date }[] = [];
  readonly ruleRuns: { ruleId: string; workspaceId: string; workflowId: string }[] = [];
  readonly signals: { jobId: string; signal: string }[] = [];
  readonly #clock: Clock;

  constructor(clock: Clock = systemClock) {
    this.#clock = clock;
  }

  async schedulePublish(input: {
    readonly jobId: string;
    readonly workspaceId: string;
    readonly executeAt: Date;
    readonly idempotencyKey: string;
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
      workflowId,
      canceled: false,
      cancelReason: null,
    });
    return { workflowId, runId: `${workflowId}:1` };
  }

  async cancelPublish(input: { readonly jobId: string; readonly reason: string }): Promise<void> {
    const existing = this.publishes.get(input.jobId);
    if (existing !== undefined) {
      existing.canceled = true;
      existing.cancelReason = input.reason;
    }
  }

  async reschedulePublish(input: {
    readonly jobId: string;
    readonly executeAt: Date;
  }): Promise<void> {
    const existing = this.publishes.get(input.jobId);
    if (existing !== undefined) {
      this.publishes.set(input.jobId, { ...existing, executeAt: input.executeAt });
    }
  }

  async signalPublish(input: { readonly jobId: string; readonly signal: string }): Promise<void> {
    this.signals.push({ jobId: input.jobId, signal: input.signal });
  }

  async scheduleAnalyticsSync(input: {
    readonly connectionId: string;
    readonly receiptId?: string;
    readonly at: Date;
  }): Promise<void> {
    this.analyticsSyncs.push({
      connectionId: input.connectionId,
      receiptId: input.receiptId ?? null,
      at: input.at,
    });
  }

  async startRuleRun(input: {
    readonly ruleId: string;
    readonly workspaceId: string;
  }): Promise<{ readonly workflowId: string }> {
    const workflowId = `rule:${input.workspaceId}:${input.ruleId}:${this.#clock
      .now()
      .toISOString()}`;
    this.ruleRuns.push({ ruleId: input.ruleId, workspaceId: input.workspaceId, workflowId });
    return { workflowId };
  }

  async describe(
    jobId: string,
  ): Promise<{ readonly status: string; readonly historyLength: number } | null> {
    const existing = this.publishes.get(jobId);
    if (existing === undefined) {
      return null;
    }
    return { status: existing.canceled ? 'CANCELED' : 'RUNNING', historyLength: 1 };
  }
}
