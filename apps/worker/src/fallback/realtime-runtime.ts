import type { WorkerActivities } from '../activities/types.js';
import {
  SignalInbox,
  type ChildWorkflowDescriptor,
  type ChildWorkflowHandle,
  type ChildWorkflowOptions,
  type WorkflowLog,
  type WorkflowRuntime,
  type WorkflowStatusView,
} from '../runtime/types.js';
import { nowMs, nowIso } from '../runtime/clock.js';

/**
 * A `WorkflowRuntime` backed by the real clock and ordinary timers.
 *
 * This exists for one reason: local development without a Temporal server. It
 * gives up everything Temporal provides, most importantly durability across a
 * restart, so it is only ever used behind the honestly degraded inline
 * scheduler and never in production.
 */

export interface RealtimeRuntimeOptions {
  readonly workflowId: string;
  readonly runId?: string;
  readonly activities: WorkerActivities;
  readonly log: WorkflowLog;
  readonly signals?: SignalInbox;
  readonly onStatus?: (workflowId: string, view: WorkflowStatusView) => void;
  readonly abortSignal?: AbortSignal;
}

export class ContinueAsNewRequest extends Error {
  readonly input: unknown;

  constructor(input: unknown) {
    super('CONTINUE_AS_NEW');
    this.name = 'ContinueAsNewRequest';
    this.input = input;
  }
}

/** Polling interval for conditions. Coarse on purpose: this is a fallback. */
const CONDITION_POLL_MS = 50;

export class RealtimeWorkflowRuntime implements WorkflowRuntime {
  readonly workflowId: string;
  readonly runId: string;
  readonly signals: SignalInbox;
  readonly log: WorkflowLog;

  private readonly activities: WorkerActivities;
  private readonly onStatus: ((workflowId: string, view: WorkflowStatusView) => void) | undefined;
  private readonly abortSignal: AbortSignal | undefined;
  private readonly children = new Map<string, SignalInbox>();
  private latest: WorkflowStatusView | null = null;

  constructor(options: RealtimeRuntimeOptions) {
    this.workflowId = options.workflowId;
    this.runId = options.runId ?? `${options.workflowId}:inline`;
    this.signals = options.signals ?? new SignalInbox();
    this.log = options.log;
    this.activities = options.activities;
    this.onStatus = options.onStatus;
    this.abortSignal = options.abortSignal;
  }

  now(): number {
    return nowMs();
  }

  sleep(ms: number): Promise<void> {
    if (ms <= 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, ms);
      timer.unref?.();
      this.abortSignal?.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true },
      );
    });
  }

  async awaitCondition(predicate: () => boolean, timeoutMs?: number): Promise<boolean> {
    const deadline = timeoutMs === undefined ? null : nowMs() + timeoutMs;
    for (;;) {
      if (predicate()) {
        return true;
      }
      if (this.abortSignal?.aborted === true) {
        return false;
      }
      if (deadline !== null && nowMs() >= deadline) {
        return predicate();
      }
      const remaining = deadline === null ? CONDITION_POLL_MS : deadline - nowMs();
      await this.sleep(Math.min(CONDITION_POLL_MS, Math.max(1, remaining)));
    }
  }

  isCancelled(): boolean {
    return this.signals.cancelled !== null || this.abortSignal?.aborted === true;
  }

  startChild<TInput, TOutput>(
    descriptor: ChildWorkflowDescriptor<TInput, TOutput>,
    options: ChildWorkflowOptions<TInput>,
  ): Promise<ChildWorkflowHandle<TOutput>> {
    const childSignals = new SignalInbox();
    this.children.set(options.workflowId, childSignals);
    const child = new RealtimeWorkflowRuntime({
      workflowId: options.workflowId,
      activities: this.activities,
      log: this.log,
      signals: childSignals,
      ...(this.onStatus === undefined ? {} : { onStatus: this.onStatus }),
      ...(this.abortSignal === undefined ? {} : { abortSignal: this.abortSignal }),
    });
    const promise = descriptor.run(child, this.activities, options.input);
    return Promise.resolve({
      workflowId: options.workflowId,
      result: () => promise,
      signal: (name: string, payload?: unknown): Promise<void> => {
        applyInlineSignal(childSignals, name, payload);
        return Promise.resolve();
      },
    });
  }

  continueAsNew(input: unknown): Promise<never> {
    return Promise.reject(new ContinueAsNewRequest(input));
  }

  publishStatus(view: WorkflowStatusView): void {
    this.latest = view;
    this.onStatus?.(this.workflowId, view);
  }

  currentStatus(): WorkflowStatusView | null {
    return this.latest;
  }

  childInbox(workflowId: string): SignalInbox | undefined {
    return this.children.get(workflowId);
  }
}

/** Apply a signal to an inline inbox by name. Unknown names are ignored. */
export function applyInlineSignal(
  inbox: SignalInbox,
  name: string,
  payload?: unknown,
): void {
  const record: Record<string, unknown> =
    typeof payload === 'object' && payload !== null ? { ...payload } : {};
  switch (name) {
    case 'cancel': {
      const reason = typeof record['reason'] === 'string' ? record['reason'] : 'user_requested';
      inbox.onCancel({ reason, requestedAt: nowIso() });
      return;
    }
    case 'pause':
      inbox.onPause();
      return;
    case 'resume':
      inbox.onResume();
      return;
    case 'killSwitch':
      inbox.onKillSwitch();
      return;
    case 'reschedule': {
      const instant = record['instant'];
      const zone = record['ianaTimeZone'];
      if (typeof instant === 'string' && typeof zone === 'string') {
        inbox.onReschedule({
          instant,
          ianaTimeZone: zone,
          confirmedDst: record['confirmedDst'] === true,
        });
      }
      return;
    }
    case 'providerConfirmation': {
      const targetId = record['targetId'];
      const externalPostId = record['externalPostId'];
      if (typeof targetId === 'string' && typeof externalPostId === 'string') {
        inbox.onProviderConfirmation({
          targetId,
          attemptId: typeof record['attemptId'] === 'string' ? record['attemptId'] : null,
          externalPostId,
          permalink: typeof record['permalink'] === 'string' ? record['permalink'] : null,
          observedAt:
            typeof record['observedAt'] === 'string'
              ? record['observedAt']
              : nowIso(),
        });
      }
      return;
    }
    default:
      return;
  }
}
