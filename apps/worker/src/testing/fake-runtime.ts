import type { WorkerActivities } from '../activities/types.js';
import {
  SignalInbox,
  WORKFLOW_SIGNALS,
  type ChildWorkflowDescriptor,
  type ChildWorkflowHandle,
  type ChildWorkflowOptions,
  type WorkflowLog,
  type WorkflowRuntime,
  type WorkflowStatusView,
} from '../runtime/types.js';

import type { VirtualClock } from './virtual-clock.js';
import { toIsoInstant } from '../runtime/deterministic.js';

/**
 * The in-process `WorkflowRuntime`.
 *
 * It behaves like Temporal in every way the workflow bodies can observe: a
 * monotonic replay-safe clock, durable timers, conditions, child workflows with
 * their own signal inboxes, and `continueAsNew`. It behaves nothing like
 * Temporal in the way that matters for tests: it runs in microseconds and never
 * opens a socket.
 */

export class ContinueAsNewSignal extends Error {
  readonly input: unknown;

  constructor(input: unknown) {
    super('CONTINUE_AS_NEW');
    this.name = 'ContinueAsNewSignal';
    this.input = input;
  }
}

/** One recorded thing the workflow did. This is the replay history. */
export type WorkflowCommand =
  | { readonly kind: 'activity'; readonly name: string; readonly digest: string }
  | { readonly kind: 'sleep'; readonly ms: number }
  | { readonly kind: 'condition'; readonly timeoutMs: number | null; readonly satisfied: boolean }
  | { readonly kind: 'child'; readonly name: string; readonly workflowId: string }
  | { readonly kind: 'signalChild'; readonly workflowId: string; readonly signal: string }
  | { readonly kind: 'continueAsNew' };

export interface CommandRecorder {
  readonly commands: WorkflowCommand[];
  record(command: WorkflowCommand): void;
}

export function createRecorder(): CommandRecorder {
  const commands: WorkflowCommand[] = [];
  return {
    commands,
    record(command: WorkflowCommand): void {
      commands.push(command);
    },
  };
}

const silentLog: WorkflowLog = {
  debug(): void {
    /* the harness deliberately discards workflow logs */
  },
  info(): void {
    /* the harness deliberately discards workflow logs */
  },
  warn(): void {
    /* the harness deliberately discards workflow logs */
  },
  error(): void {
    /* the harness deliberately discards workflow logs */
  },
};

export interface FakeRuntimeOptions {
  readonly clock: VirtualClock;
  readonly workflowId: string;
  readonly runId?: string;
  readonly recorder: CommandRecorder;
  readonly activities: WorkerActivities;
  readonly signals?: SignalInbox;
}

export class FakeWorkflowRuntime implements WorkflowRuntime {
  readonly workflowId: string;
  readonly runId: string;
  readonly signals: SignalInbox;
  readonly log: WorkflowLog = silentLog;

  private readonly clock: VirtualClock;
  private readonly recorder: CommandRecorder;
  private readonly activities: WorkerActivities;
  private lastStatus: WorkflowStatusView | null = null;
  private readonly children = new Map<string, SignalInbox>();

  constructor(options: FakeRuntimeOptions) {
    this.clock = options.clock;
    this.workflowId = options.workflowId;
    this.runId = options.runId ?? `${options.workflowId}:run1`;
    this.recorder = options.recorder;
    this.activities = options.activities;
    this.signals = options.signals ?? new SignalInbox();
  }

  now(): number {
    return this.clock.now();
  }

  async sleep(ms: number): Promise<void> {
    this.recorder.record({ kind: 'sleep', ms });
    await this.clock.sleep(ms);
  }

  async awaitCondition(predicate: () => boolean, timeoutMs?: number): Promise<boolean> {
    const satisfied = await this.clock.awaitCondition(predicate, timeoutMs);
    this.recorder.record({
      kind: 'condition',
      timeoutMs: timeoutMs ?? null,
      satisfied,
    });
    return satisfied;
  }

  isCancelled(): boolean {
    return this.signals.cancelled !== null;
  }

  startChild<TInput, TOutput>(
    descriptor: ChildWorkflowDescriptor<TInput, TOutput>,
    options: ChildWorkflowOptions<TInput>,
  ): Promise<ChildWorkflowHandle<TOutput>> {
    this.recorder.record({
      kind: 'child',
      name: descriptor.name,
      workflowId: options.workflowId,
    });
    const childSignals = new SignalInbox();
    this.children.set(options.workflowId, childSignals);
    const childRuntime = new FakeWorkflowRuntime({
      clock: this.clock,
      workflowId: options.workflowId,
      recorder: this.recorder,
      activities: this.activities,
      signals: childSignals,
    });
    const promise = descriptor.run(childRuntime, this.activities, options.input);
    const recorder = this.recorder;
    const handle: ChildWorkflowHandle<TOutput> = {
      workflowId: options.workflowId,
      result(): Promise<TOutput> {
        return promise;
      },
      signal(name: string, payload?: unknown): Promise<void> {
        recorder.record({
          kind: 'signalChild',
          workflowId: options.workflowId,
          signal: name,
        });
        applySignal(childSignals, name, payload);
        return Promise.resolve();
      },
    };
    return Promise.resolve(handle);
  }

  continueAsNew(input: unknown): Promise<never> {
    this.recorder.record({ kind: 'continueAsNew' });
    return Promise.reject(new ContinueAsNewSignal(input));
  }

  publishStatus(view: WorkflowStatusView): void {
    this.lastStatus = view;
  }

  /** What the `status` query would answer with right now. */
  status(): WorkflowStatusView | null {
    return this.lastStatus;
  }

  /** The signal inbox of a child this runtime started, for assertions. */
  childSignals(workflowId: string): SignalInbox | undefined {
    return this.children.get(workflowId);
  }
}

/** Apply a signal by name, exactly as the Temporal handlers do. */
export function applySignal(inbox: SignalInbox, name: string, payload?: unknown): void {
  switch (name) {
    case WORKFLOW_SIGNALS.cancel: {
      const source = typeof payload === 'object' && payload !== null ? payload : {};
      const reason: unknown = Reflect.get(source, 'reason');
      const requestedAt: unknown = Reflect.get(source, 'requestedAt');
      inbox.onCancel({
        reason: typeof reason === 'string' ? reason : 'user_requested',
        requestedAt:
          typeof requestedAt === 'string' ? requestedAt : toIsoInstant(0),
      });
      return;
    }
    case WORKFLOW_SIGNALS.pause:
      inbox.onPause();
      return;
    case WORKFLOW_SIGNALS.resume:
      inbox.onResume();
      return;
    case WORKFLOW_SIGNALS.killSwitch:
      inbox.onKillSwitch();
      return;
    default:
      return;
  }
}
