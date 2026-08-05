import type { WorkerActivities } from '../../activities/types.js';
import { MESSAGE_KEYS } from '../../messages.js';
import { parseInstant, toIsoInstant } from '../../runtime/deterministic.js';
import type { ChildWorkflowDescriptor, WorkflowRuntime } from '../../runtime/types.js';
import type { RepeatPostWorkflowInput, RepeatPostWorkflowOutput } from '../inputs.js';

import { publishPostDescriptor } from './publish-post.core.js';

/**
 * A repeating series.
 *
 * Each occurrence gets its own publish job, its own workflow and therefore its
 * own receipt. The series never reuses a receipt and never mutates an earlier
 * one, so "posted 4 times" means four independent pieces of evidence.
 *
 * The next instant is computed by an activity in the series time zone rather
 * than by adding milliseconds here, so a cadence that crosses a daylight saving
 * boundary keeps the user's chosen wall-clock time.
 *
 * The workflow calls `continueAsNew` after each occurrence so a 52 week series
 * does not accumulate an unbounded history.
 */

export async function runRepeatPost(
  runtime: WorkflowRuntime,
  activities: WorkerActivities,
  input: RepeatPostWorkflowInput,
): Promise<RepeatPostWorkflowOutput> {
  const { ctx } = input;

  const finish = (reasonKey: string): RepeatPostWorkflowOutput => ({
    seriesId: input.seriesId,
    completedOccurrences: input.completedOccurrences,
    stoppedReasonKey: reasonKey,
  });

  runtime.publishStatus({
    workflowId: runtime.workflowId,
    state: 'running',
    phase: `occurrence:${String(input.occurrenceIndex)}`,
    paused: runtime.signals.paused,
    cancelRequested: runtime.signals.cancelled !== null,
    scheduledInstant: null,
    attempts: input.completedOccurrences,
    updatedAt: toIsoInstant(runtime.now()),
    targets: [],
  });

  if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
    return finish(MESSAGE_KEYS.repeat.seriesCanceled);
  }

  const plan = await activities.planRepeatOccurrence({
    ctx,
    seriesId: input.seriesId,
    contentItemId: input.contentItemId,
    occurrenceIndex: input.occurrenceIndex,
    cadenceDays: input.cadenceDays,
    firstInstant: input.firstInstant,
    ianaTimeZone: input.ianaTimeZone,
    endDate: input.endDate,
    count: input.count,
  });

  if (!plan.shouldRun) {
    return finish(plan.reasonKey ?? MESSAGE_KEYS.repeat.seriesComplete);
  }

  // Wait for this occurrence. Cancellation and pause are honoured throughout.
  for (;;) {
    if (runtime.signals.cancelled !== null || runtime.signals.killSwitchThrown) {
      return finish(MESSAGE_KEYS.repeat.seriesCanceled);
    }
    if (runtime.signals.paused) {
      await runtime.awaitCondition(
        () => !runtime.signals.paused || runtime.signals.cancelled !== null,
      );
      continue;
    }
    const remaining = parseInstant(plan.instant) - runtime.now();
    if (remaining <= 0) {
      break;
    }
    await runtime.awaitCondition(
      () => runtime.signals.cancelled !== null || runtime.signals.paused,
      remaining,
    );
  }

  const occurrence = await activities.createOccurrenceJob({
    ctx,
    seriesId: input.seriesId,
    contentItemId: input.contentItemId,
    occurrenceIndex: input.occurrenceIndex,
    instant: plan.instant,
    localDateTime: plan.localDateTime,
    ianaTimeZone: input.ianaTimeZone,
    idempotencyKey: `repeat:${input.seriesId}:${String(input.occurrenceIndex)}`,
  });

  if (occurrence.targets.length > 0) {
    const child = await runtime.startChild(publishPostDescriptor, {
      workflowId: `publish:${ctx.workspaceId}:${occurrence.publishJobId}`,
      input: {
        ctx,
        publishJobId: occurrence.publishJobId,
        contentItemId: input.contentItemId,
        contentVersionId: occurrence.contentVersionId,
        contentVersionChecksum: occurrence.contentVersionChecksum,
        idempotencyKey: `repeat:${input.seriesId}:${String(input.occurrenceIndex)}`,
        executeAt: plan.instant,
        scheduledLocalTime: plan.localDateTime,
        ianaTimeZone: input.ianaTimeZone,
        targets: occurrence.targets.map((target) => ({
          ...target,
          threadDelaysSeconds: [],
        })),
        immediate: true,
      },
    });
    await child.result();
  }

  const completed = input.completedOccurrences + 1;
  if (input.count !== null && completed >= input.count) {
    return finish(MESSAGE_KEYS.repeat.seriesCountReached);
  }

  return runtime.continueAsNew({
    ...input,
    occurrenceIndex: input.occurrenceIndex + 1,
    completedOccurrences: completed,
  } satisfies RepeatPostWorkflowInput);
}

export const repeatPostDescriptor: ChildWorkflowDescriptor<
  RepeatPostWorkflowInput,
  RepeatPostWorkflowOutput
> = {
  name: 'repeatPostWorkflow',
  run: runRepeatPost,
};
