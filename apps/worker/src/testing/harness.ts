import type { ActivityContext } from '../activities/types';
import type { ChildWorkflowDescriptor, SignalInbox } from '../runtime/types';

import { ActivitySimulator, type SimulatorOptions } from './activity-simulator';
import {
  ContinueAsNewSignal,
  FakeWorkflowRuntime,
  createRecorder,
  type CommandRecorder,
  type WorkflowCommand,
} from './fake-runtime';
import { VirtualClock, drive } from './virtual-clock';
import { parseInstant } from '../runtime/deterministic';

/** Everything a workflow test needs, assembled in one call. */

export const TEST_EPOCH_MS = parseInstant('2026-03-01T09:00:00.000Z');

export const TEST_CONTEXT: ActivityContext = {
  workspaceId: 'ws_test',
  correlationId: 'corr_test',
  actorId: 'user_test',
  actorType: 'user',
  surface: 'web',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

/** A signal delivered at a virtual instant relative to the run start. */
export interface SignalScriptEntry {
  readonly afterMs: number;
  readonly apply: (inbox: SignalInbox) => void;
}

export interface HarnessOptions {
  readonly workflowId: string;
  readonly startMs?: number;
  readonly simulator?: ActivitySimulator;
  readonly simulatorOptions?: SimulatorOptions;
  readonly signals?: readonly SignalScriptEntry[];
}

export interface HarnessRun<TOutput> {
  readonly output: TOutput;
  readonly commands: readonly WorkflowCommand[];
  readonly simulator: ActivitySimulator;
  readonly runtime: FakeWorkflowRuntime;
  readonly clock: VirtualClock;
  readonly continuedAsNew: unknown | null;
}

export interface HarnessSetup {
  readonly clock: VirtualClock;
  readonly recorder: CommandRecorder;
  readonly simulator: ActivitySimulator;
  readonly runtime: FakeWorkflowRuntime;
}

export function createHarness(options: HarnessOptions): HarnessSetup {
  const startMs = options.startMs ?? TEST_EPOCH_MS;
  const clock = new VirtualClock(startMs);
  const recorder = createRecorder();
  const simulator =
    options.simulator ??
    new ActivitySimulator({
      now: () => clock.now(),
      ...options.simulatorOptions,
      recorder,
    });
  const runtime = new FakeWorkflowRuntime({
    clock,
    workflowId: options.workflowId,
    recorder,
    activities: simulator,
  });
  for (const entry of options.signals ?? []) {
    if (entry.afterMs <= 0) {
      // A signal that arrived before the workflow started, for example a cancel
      // that raced the worker picking the task up.
      entry.apply(runtime.signals);
      continue;
    }
    clock.schedule({
      atMs: startMs + entry.afterMs,
      apply: () => {
        entry.apply(runtime.signals);
      },
    });
  }
  return { clock, recorder, simulator, runtime };
}

/**
 * Run a workflow to completion in virtual time. A `continueAsNew` is captured
 * rather than thrown, so a test can assert on the input the next run receives.
 */
export async function runWorkflow<TInput, TOutput>(
  descriptor: ChildWorkflowDescriptor<TInput, TOutput>,
  input: TInput,
  options: HarnessOptions,
): Promise<HarnessRun<TOutput | null>> {
  const setup = createHarness(options);
  const work = descriptor.run(setup.runtime, setup.simulator, input);

  let output: TOutput | null = null;
  let continuedAsNew: unknown | null = null;
  try {
    output = await drive(setup.clock, work);
  } catch (error: unknown) {
    if (error instanceof ContinueAsNewSignal) {
      continuedAsNew = error.input;
    } else {
      throw error;
    }
  }

  return {
    output,
    commands: setup.recorder.commands,
    simulator: setup.simulator,
    runtime: setup.runtime,
    clock: setup.clock,
    continuedAsNew,
  };
}

/** The activity call sequence, which is what a replay assertion compares. */
export function activitySequence(commands: readonly WorkflowCommand[]): string[] {
  return commands
    .filter((command) => command.kind === 'activity')
    .map((command) => (command.kind === 'activity' ? command.name : ''));
}
