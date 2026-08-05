import type { WorkflowCommand } from './fake-runtime.js';

/**
 * Replay verification.
 *
 * Temporal guarantees correctness only if a workflow re-executed against its
 * own history issues exactly the same commands in exactly the same order. The
 * classic ways to break that are `Date.now`, `Math.random`, iteration over a
 * `Set` built from a network response, and a `Promise.race` whose winner is
 * decided by wall-clock latency.
 *
 * These helpers turn "the workflow is deterministic" into an assertion: run the
 * same workflow twice against the same recorded inputs and compare the command
 * streams token for token.
 */

export interface ReplayMismatch {
  readonly index: number;
  readonly recorded: string;
  readonly replayed: string;
}

/** A stable one line form of a command, used for comparison and diffs. */
export function describeCommand(command: WorkflowCommand): string {
  switch (command.kind) {
    case 'activity':
      return `activity:${command.name}`;
    case 'sleep':
      return `sleep:${String(command.ms)}`;
    case 'condition':
      return `condition:${command.timeoutMs === null ? 'none' : String(command.timeoutMs)}:${
        command.satisfied ? 'signal' : 'timeout'
      }`;
    case 'child':
      return `child:${command.name}:${command.workflowId}`;
    case 'signalChild':
      return `signalChild:${command.workflowId}:${command.signal}`;
    case 'continueAsNew':
      return 'continueAsNew';
  }
}

/** The full command stream as comparable strings. */
export function describeHistory(commands: readonly WorkflowCommand[]): string[] {
  return commands.map(describeCommand);
}

/** Only the activity invocations, in order. */
export function activityHistory(commands: readonly WorkflowCommand[]): string[] {
  return commands
    .filter((command) => command.kind === 'activity')
    .map((command) => (command.kind === 'activity' ? command.name : ''));
}

/** Every difference between a recorded run and a replayed run. */
export function diffHistories(
  recorded: readonly WorkflowCommand[],
  replayed: readonly WorkflowCommand[],
): ReplayMismatch[] {
  const left = describeHistory(recorded);
  const right = describeHistory(replayed);
  const mismatches: ReplayMismatch[] = [];
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const recordedEntry = left[index] ?? '<end of history>';
    const replayedEntry = right[index] ?? '<end of history>';
    if (recordedEntry !== replayedEntry) {
      mismatches.push({ index, recorded: recordedEntry, replayed: replayedEntry });
    }
  }
  return mismatches;
}

/**
 * True when `expected` appears inside `actual` in order, allowing other entries
 * between them. Used where a test cares about ordering but not about every
 * intermediate persistence call.
 */
export function containsSubsequence(
  actual: readonly string[],
  expected: readonly string[],
): boolean {
  let cursor = 0;
  for (const entry of actual) {
    if (cursor < expected.length && entry === expected[cursor]) {
      cursor += 1;
    }
  }
  return cursor === expected.length;
}

/** How many times an activity was invoked in a command stream. */
export function countActivity(
  commands: readonly WorkflowCommand[],
  name: string,
): number {
  return commands.filter((command) => command.kind === 'activity' && command.name === name).length;
}
