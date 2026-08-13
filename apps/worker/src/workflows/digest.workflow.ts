import { ERROR_CODES, RelayError } from '@relay/contracts';

import { createTemporalRuntime, workerActivities } from './temporal-runtime';
import { runWeeklyDigest } from './core/digest.core';
import type {
  DigestActivities,
  WeeklyDigestWorkflowInput,
  WeeklyDigestWorkflowOutput,
} from './core/digest.core';

/**
 * The weekly digest: "what has been happening".
 *
 * Workflow id: `digest:{workspaceId}:{windowStart}`, so a week is built once
 * however many times it is requested, and an on-demand rebuild is the same id
 * with `replaceExisting`.
 */

/**
 * Checked narrowing onto the digest activity slice.
 *
 * `WorkerActivities` is implemented by `@relay/application`, which this phase
 * does not touch, so the two digest activities are declared in the core file
 * and verified here at runtime rather than forced through a cast. When the
 * gateway gains them this reduces to a no-op; until then it fails loudly with a
 * stable error code instead of throwing `undefined is not a function` deep
 * inside a workflow task.
 */
export function assertDigestActivities(candidate: unknown): DigestActivities {
  // `unknown` rather than `Partial<DigestActivities>`: the gateway does not
  // declare these two yet, so a narrower parameter type would only be true
  // because a cast made it true. Probing the value is the honest version of
  // the same check, and it keeps working unchanged once the gateway declares
  // them.
  const probe = (candidate ?? {}) as Partial<DigestActivities>;
  const build = probe.buildWeeklyDigest;
  const send = probe.sendWeeklyDigestEmail;
  if (typeof build !== 'function' || typeof send !== 'function') {
    throw new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED, {
      messageKey: 'error.not_implemented.message',
      details: {
        buildWeeklyDigest: typeof build === 'function',
        sendWeeklyDigestEmail: typeof send === 'function',
      },
    });
  }
  return { buildWeeklyDigest: build, sendWeeklyDigestEmail: send };
}

export async function weeklyDigestWorkflow(
  input: WeeklyDigestWorkflowInput,
): Promise<WeeklyDigestWorkflowOutput> {
  const runtime = createTemporalRuntime();
  return runWeeklyDigest(runtime, assertDigestActivities(workerActivities), input);
}
