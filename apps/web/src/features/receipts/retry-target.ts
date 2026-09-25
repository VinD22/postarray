/**
 * Whether one failed target can be retried, and why not when it cannot.
 *
 * The screen used to answer this with a single sentence for every case: retry
 * is unavailable. It said the same thing to somebody whose post was cancelled
 * on purpose, somebody whose post is being retried automatically right now, and
 * somebody who could have fixed the problem with one click. Three different
 * situations, one shrug.
 *
 * A retry is scoped to a single variant, never to the campaign, because the
 * accounts that already published must not be published to twice. That is the
 * exact failure partial publication exists to avoid, so the job id and the
 * variant id are both required before the button appears at all.
 */

import type { PublishState } from '@/lib/api/types';

import type { CampaignTargetView } from './types';

/** Reasons a retry is not offered. Each one is a different sentence. */
export type RetryBlock =
  'alreadyPublished' | 'noJob' | 'inFlight' | 'retryScheduled' | 'canceled' | 'actionRequired';

export type RetryDecision =
  | { readonly kind: 'available'; readonly publishJobId: string; readonly variantId: string }
  | { readonly kind: 'blocked'; readonly reason: RetryBlock };

/** States in which an attempt is still running, so a retry would duplicate it. */
const IN_FLIGHT_STATES: readonly PublishState[] = [
  'preparing_media',
  'dispatching',
  'provider_processing',
];

/**
 * Decide, from the target and the campaign's publish job.
 *
 * `publishJobId` is read from a receipt, and a receipt only exists once some
 * target produced an external post. A campaign where nothing published has no
 * job id to retry against, which is a real and separate reason rather than the
 * same blanket sentence.
 */
export function decideRetry(
  target: CampaignTargetView,
  publishJobId: string | null,
): RetryDecision {
  if (target.hasExternalPost) {
    return { kind: 'blocked', reason: 'alreadyPublished' };
  }
  if (IN_FLIGHT_STATES.includes(target.state)) {
    return { kind: 'blocked', reason: 'inFlight' };
  }
  if (target.state === 'retry_scheduled') {
    return { kind: 'blocked', reason: 'retryScheduled' };
  }
  if (target.state === 'canceled') {
    return { kind: 'blocked', reason: 'canceled' };
  }
  if (target.state === 'action_required') {
    return { kind: 'blocked', reason: 'actionRequired' };
  }
  if (publishJobId === null) {
    return { kind: 'blocked', reason: 'noJob' };
  }
  return { kind: 'available', publishJobId, variantId: target.variantId };
}

/** The catalog key for one blocked reason. */
export function retryBlockKey(reason: RetryBlock): string {
  return `web.receipt.retry.blocked.${reason}`;
}
