/**
 * A virtual clock and a cooperative driver.
 *
 * Workflow bodies never touch the wall clock, so a test can run a 30 day
 * durable timer in microseconds and still exercise the exact code path
 * production takes. Nothing here touches the network, the filesystem or a real
 * timer beyond `setImmediate`, which is only used to drain the microtask queue.
 */

interface PendingTimer {
  readonly id: number;
  readonly atMs: number;
  readonly fire: () => void;
}

interface PendingWaiter {
  readonly id: number;
  readonly predicate: () => boolean;
  readonly deadlineMs: number | null;
  readonly resolve: (satisfied: boolean) => void;
}

/** A signal delivery scheduled at a virtual instant. */
export interface ScriptedEvent {
  readonly atMs: number;
  readonly apply: () => void;
  fired?: boolean;
}

export class VirtualClock {
  private currentMs: number;
  private sequence = 0;
  private timers: PendingTimer[] = [];
  private waiters: PendingWaiter[] = [];
  private readonly events: ScriptedEvent[] = [];

  constructor(startMs: number) {
    this.currentMs = startMs;
  }

  now(): number {
    return this.currentMs;
  }

  schedule(event: ScriptedEvent): void {
    this.events.push({ ...event, fired: false });
  }

  sleep(ms: number): Promise<void> {
    if (ms <= 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.sequence += 1;
      this.timers.push({ id: this.sequence, atMs: this.currentMs + ms, fire: resolve });
    });
  }

  awaitCondition(predicate: () => boolean, timeoutMs?: number): Promise<boolean> {
    if (predicate()) {
      return Promise.resolve(true);
    }
    if (timeoutMs !== undefined && timeoutMs <= 0) {
      return Promise.resolve(false);
    }
    return new Promise<boolean>((resolve) => {
      this.sequence += 1;
      this.waiters.push({
        id: this.sequence,
        predicate,
        deadlineMs: timeoutMs === undefined ? null : this.currentMs + timeoutMs,
        resolve,
      });
    });
  }

  /** Resolve every waiter whose predicate is now satisfied. */
  settle(): void {
    const satisfied = this.waiters.filter((waiter) => waiter.predicate());
    if (satisfied.length === 0) {
      return;
    }
    const satisfiedIds = new Set(satisfied.map((waiter) => waiter.id));
    this.waiters = this.waiters.filter((waiter) => !satisfiedIds.has(waiter.id));
    for (const waiter of satisfied) {
      waiter.resolve(true);
    }
  }

  /** The next virtual instant at which anything can happen, or null. */
  nextEventMs(): number | null {
    const candidates: number[] = [];
    for (const timer of this.timers) {
      candidates.push(timer.atMs);
    }
    for (const waiter of this.waiters) {
      if (waiter.deadlineMs !== null) {
        candidates.push(waiter.deadlineMs);
      }
    }
    for (const event of this.events) {
      if (event.fired !== true) {
        candidates.push(event.atMs);
      }
    }
    if (candidates.length === 0) {
      return null;
    }
    return candidates.reduce((lowest, value) => (value < lowest ? value : lowest));
  }

  /** Move to `targetMs`, firing scripted events, timers and deadlines in order. */
  advanceTo(targetMs: number): void {
    this.currentMs = Math.max(this.currentMs, targetMs);

    for (const event of this.events) {
      if (event.fired !== true && event.atMs <= this.currentMs) {
        event.fired = true;
        event.apply();
      }
    }

    const dueTimers = this.timers.filter((timer) => timer.atMs <= this.currentMs);
    this.timers = this.timers.filter((timer) => timer.atMs > this.currentMs);
    for (const timer of dueTimers) {
      timer.fire();
    }

    const expired = this.waiters.filter(
      (waiter) => waiter.deadlineMs !== null && waiter.deadlineMs <= this.currentMs,
    );
    const expiredIds = new Set(expired.map((waiter) => waiter.id));
    this.waiters = this.waiters.filter((waiter) => !expiredIds.has(waiter.id));
    for (const waiter of expired) {
      waiter.resolve(waiter.predicate());
    }
  }

  get pendingTimerCount(): number {
    return this.timers.length;
  }

  get pendingWaiterCount(): number {
    return this.waiters.length;
  }
}

/** Yield to the event loop so every pending microtask runs. */
export function drainMicrotasks(): Promise<void> {
  return new Promise<void>((resolve) => {
    setImmediate(resolve);
  });
}

export class WorkflowDeadlockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowDeadlockError';
  }
}

/** Guard against a runaway loop in a test. Generous, but finite. */
const MAX_DRIVE_STEPS = 20_000;

/**
 * Run `work` to completion against `clock`, advancing virtual time whenever the
 * workflow has nothing left to do in the present.
 */
export async function drive<T>(clock: VirtualClock, work: Promise<T>): Promise<T> {
  type Settled<V> = { readonly kind: 'value'; readonly value: V } | { readonly kind: 'error'; readonly error: unknown };
  const box: { current: Settled<T> | null } = { current: null };

  void work.then(
    (result) => {
      box.current = { kind: 'value', value: result };
    },
    (error: unknown) => {
      box.current = { kind: 'error', error };
    },
  );

  const isSettled = (): boolean => box.current !== null;

  for (let step = 0; step < MAX_DRIVE_STEPS; step += 1) {
    await drainMicrotasks();
    if (isSettled()) {
      break;
    }
    clock.settle();
    await drainMicrotasks();
    if (isSettled()) {
      break;
    }
    const next = clock.nextEventMs();
    if (next === null) {
      await drainMicrotasks();
      if (isSettled()) {
        break;
      }
      throw new WorkflowDeadlockError(
        'the workflow is awaiting something that can never happen in virtual time',
      );
    }
    clock.advanceTo(next);
  }

  const outcome: Settled<T> | null = box.current;
  if (outcome === null) {
    throw new WorkflowDeadlockError('the workflow did not finish within the step budget');
  }
  if (outcome.kind === 'error') {
    throw outcome.error;
  }
  return outcome.value;
}
