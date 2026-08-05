import type { PublishState } from '@relay/contracts';

import type { WorkerActivities } from '../activities/types.js';

/**
 * The deterministic surface a workflow is allowed to touch.
 *
 * Workflow bodies in this app are written against `WorkflowRuntime` rather than
 * against `@temporalio/workflow` directly. Two implementations exist: the
 * Temporal adapter used by the real worker, and the virtual clock harness used
 * by the replay and chaos suites. Neither exposes `Date.now`, `Math.random` or
 * any form of IO, so a workflow body physically cannot be non deterministic.
 */

export interface WorkflowLog {
  debug(message: string, fields?: Readonly<Record<string, unknown>>): void;
  info(message: string, fields?: Readonly<Record<string, unknown>>): void;
  warn(message: string, fields?: Readonly<Record<string, unknown>>): void;
  error(message: string, fields?: Readonly<Record<string, unknown>>): void;
}

export interface ChildWorkflowOptions<TInput> {
  /** Fully qualified, deterministic child workflow id. */
  readonly workflowId: string;
  readonly input: TInput;
  /** Milliseconds. Omitted means inherit the parent's run timeout. */
  readonly executionTimeoutMs?: number;
  readonly searchAttributes?: Readonly<Record<string, string>>;
}

export interface ChildWorkflowHandle<TOutput> {
  readonly workflowId: string;
  result(): Promise<TOutput>;
  signal(name: string, payload?: unknown): Promise<void>;
}

/**
 * A child workflow, described once so both implementations can use it: the
 * Temporal adapter starts `name` on the task queue, the harness calls `run`
 * in process with a nested runtime.
 */
export interface ChildWorkflowDescriptor<TInput, TOutput> {
  readonly name: string;
  run(runtime: WorkflowRuntime, activities: WorkerActivities, input: TInput): Promise<TOutput>;
  /**
   * Parses the value Temporal hands back when this workflow is started by name.
   * Required for any descriptor actually used as a child; a descriptor that is
   * only ever a root workflow may omit it.
   */
  parseResult?(value: unknown): TOutput;
}

export interface WorkflowRuntime {
  /** Deterministic workflow id. Also the seed for every derived jitter. */
  readonly workflowId: string;
  readonly runId: string;
  /** Replay safe current time in epoch milliseconds. */
  now(): number;
  /** Durable timer. Resolves after `ms` of workflow time. */
  sleep(ms: number): Promise<void>;
  /**
   * Resolves `true` when `predicate` becomes true, `false` when `timeoutMs`
   * elapses first. With no timeout it waits indefinitely.
   */
  awaitCondition(predicate: () => boolean, timeoutMs?: number): Promise<boolean>;
  /** True once the workflow has been asked to shut down by Temporal. */
  isCancelled(): boolean;
  startChild<TInput, TOutput>(
    descriptor: ChildWorkflowDescriptor<TInput, TOutput>,
    options: ChildWorkflowOptions<TInput>,
  ): Promise<ChildWorkflowHandle<TOutput>>;
  /** Signals `continueAsNew` to the caller. Implementations may throw. */
  continueAsNew(input: unknown): Promise<never>;
  /**
   * Signal state for this workflow execution. Workflow bodies only read it; the
   * Temporal adapter and the harness are the only writers.
   */
  readonly signals: SignalInbox;
  /**
   * Publish the value the `status` query should answer with. Calling this is
   * free of side effects outside the workflow, so it is replay safe.
   */
  publishStatus(view: WorkflowStatusView): void;
  readonly log: WorkflowLog;
}

/** The signal names every long lived workflow understands. */
export const WORKFLOW_SIGNALS = {
  cancel: 'cancel',
  pause: 'pause',
  resume: 'resume',
  reschedule: 'reschedule',
  killSwitch: 'killSwitch',
  providerConfirmation: 'providerConfirmation',
} as const;

export type WorkflowSignalName = (typeof WORKFLOW_SIGNALS)[keyof typeof WORKFLOW_SIGNALS];

/** The query names every long lived workflow answers. */
export const WORKFLOW_QUERIES = {
  status: 'status',
  targets: 'targets',
} as const;

export interface CancelRequest {
  readonly reason: string;
  readonly requestedAt: string;
}

export interface RescheduleRequest {
  readonly instant: string;
  readonly ianaTimeZone: string;
  /** True when a human confirmed the daylight saving shift this move implies. */
  readonly confirmedDst: boolean;
}

/**
 * Provider evidence that arrived out of band, normally through a provider
 * webhook the API forwarded as a signal. Carries no token and no post body.
 */
export interface ProviderConfirmation {
  readonly targetId: string;
  readonly attemptId: string | null;
  readonly externalPostId: string;
  readonly permalink: string | null;
  readonly observedAt: string;
}

/**
 * Mutable signal state. The Temporal workflow file installs handlers that
 * mutate this object; the harness mutates it from a scripted timeline. Workflow
 * bodies only ever read it, always through `awaitCondition`.
 */
export class SignalInbox {
  private revision = 0;
  private cancelRequest: CancelRequest | null = null;
  private rescheduleRequest: RescheduleRequest | null = null;
  private killed = false;
  private pausedFlag = false;
  private readonly confirmations = new Map<string, ProviderConfirmation>();

  /** Bumped by every signal so `awaitCondition` predicates can observe change. */
  get version(): number {
    return this.revision;
  }

  get cancelled(): CancelRequest | null {
    return this.cancelRequest;
  }

  get paused(): boolean {
    return this.pausedFlag;
  }

  get killSwitchThrown(): boolean {
    return this.killed;
  }

  /** Reads and clears the pending reschedule, so it is applied exactly once. */
  takeReschedule(): RescheduleRequest | null {
    const pending = this.rescheduleRequest;
    this.rescheduleRequest = null;
    return pending;
  }

  peekReschedule(): RescheduleRequest | null {
    return this.rescheduleRequest;
  }

  confirmationFor(targetId: string): ProviderConfirmation | undefined {
    return this.confirmations.get(targetId);
  }

  onCancel(request: CancelRequest): void {
    this.cancelRequest ??= request;
    this.revision += 1;
  }

  onPause(): void {
    this.pausedFlag = true;
    this.revision += 1;
  }

  onResume(): void {
    this.pausedFlag = false;
    this.revision += 1;
  }

  onReschedule(request: RescheduleRequest): void {
    this.rescheduleRequest = request;
    this.revision += 1;
  }

  onKillSwitch(): void {
    this.killed = true;
    this.revision += 1;
  }

  /**
   * A provider webhook may arrive more than once for the same publication. The
   * first evidence wins so a redelivery can never produce a second receipt.
   */
  onProviderConfirmation(confirmation: ProviderConfirmation): void {
    if (!this.confirmations.has(confirmation.targetId)) {
      this.confirmations.set(confirmation.targetId, confirmation);
    }
    this.revision += 1;
  }
}

/** What the `status` query returns. Safe to show to an operator or a user. */
export interface WorkflowStatusView {
  readonly workflowId: string;
  state: PublishState | 'running' | 'completed' | 'failed';
  phase: string;
  paused: boolean;
  cancelRequested: boolean;
  scheduledInstant: string | null;
  attempts: number;
  updatedAt: string;
  targets: readonly TargetStatusView[];
}

export interface TargetStatusView {
  readonly targetId: string;
  readonly connectionId: string;
  readonly provider: string;
  state: PublishState;
  externalPostId: string | null;
  permalink: string | null;
  attempts: number;
  lastErrorCode: string | null;
}
