/**
 * Holding a scheduled post, and letting it go again.
 *
 * Pure, so the dialog, the detail sheet and the tests all reason about a hold
 * the same way. The server is still the authority: everything here decides what
 * to *offer*, never what happened.
 *
 * The sentence this module exists to make impossible to get wrong: pausing
 * stops what has not happened yet. It does not retract, delete or edit a post
 * that already reached a platform, and nothing in this file should ever offer a
 * control that implies otherwise.
 */

import type { IsoInstant, PublishState } from '@/lib/api/types';

/** Who stopped the clock. Kept apart because they are cleared differently. */
export type HoldReason = 'user' | 'billing';

export interface PublishHoldView {
  readonly reason: HoldReason;
  readonly since: IsoInstant;
  readonly byUserId: string | null;
}

/** Why a pause is not on offer, or null when it is. */
export type PauseRefusal = 'already_published' | 'in_flight' | 'terminal';

/** States in which an external post already exists on the platform. */
const EXTERNALLY_VISIBLE: readonly PublishState[] = [
  'published',
  'partially_published',
  'deleted_externally',
];

/** States with no outgoing edge. Nothing left to stop. */
const FINISHED: readonly PublishState[] = ['failed_permanently', 'canceled', 'deleted_externally'];

/** States in which stopping the clock still means something. */
export const PAUSABLE_STATES: readonly PublishState[] = [
  'validation_needed',
  'approval_requested',
  'approved',
  'scheduled',
  'action_required',
  'retry_scheduled',
];

export function pauseRefusal(state: PublishState): PauseRefusal | null {
  if (EXTERNALLY_VISIBLE.includes(state)) {
    return 'already_published';
  }
  if (FINISHED.includes(state)) {
    return 'terminal';
  }
  return PAUSABLE_STATES.includes(state) ? null : 'in_flight';
}

export function canPause(state: PublishState): boolean {
  return pauseRefusal(state) === null;
}

/** The message key explaining a refusal, so the sheet never invents prose. */
export const REFUSAL_MESSAGE_KEYS: Readonly<Record<PauseRefusal, string>> = {
  already_published: 'calendar.hold.blocked.published',
  in_flight: 'calendar.hold.blocked.inFlight',
  terminal: 'calendar.hold.blocked.finished',
};

/**
 * What the entry detail sheet should offer.
 *
 * `none` means neither control belongs on this entry. `pause` and `resume` are
 * the two live actions. `billing` is deliberately its own outcome rather than a
 * disabled Resume: a hold placed by the entitlement path is cleared by paying,
 * and offering a greyed-out Resume would suggest the person is one permission
 * away from fixing it.
 */
export type HoldControl = 'none' | 'pause' | 'resume' | 'billing';

export function holdControlFor(input: {
  readonly state: PublishState;
  readonly hold: PublishHoldView | null;
}): HoldControl {
  if (input.hold?.reason === 'billing') {
    return 'billing';
  }
  if (input.hold?.reason === 'user') {
    return 'resume';
  }
  return canPause(input.state) ? 'pause' : 'none';
}

/**
 * Whether resuming needs a new time.
 *
 * True once the instant the post was due at has passed while it was held.
 * Resuming onto it would dispatch the moment the signal landed, which is the
 * outcome the person paused to prevent, so the dialog asks for a time instead
 * and the server refuses without one.
 */
export function resumeNeedsNewTime(scheduledAt: string, now: Date): boolean {
  const due = new Date(scheduledAt).getTime();
  return Number.isNaN(due) || due <= now.getTime();
}

/**
 * The message key for a refusal that came back from the server.
 *
 * Mapped explicitly rather than by string interpolation, so a key that is not
 * in this table falls through to the generic error surface instead of rendering
 * a missing translation.
 */
const SERVER_REFUSALS: Readonly<Record<string, string>> = {
  'errors.job_already_published': 'calendar.hold.blocked.published',
  'errors.job_already_dispatching': 'calendar.hold.blocked.inFlight',
  'errors.job_not_pausable': 'calendar.hold.blocked.finished',
  'errors.job_paused_by_billing': 'calendar.hold.blocked.billing',
  'errors.resume_requires_new_time': 'calendar.hold.resumeMissedBody',
};

export function refusalMessageKey(messageKey: string | undefined): string | null {
  if (messageKey === undefined) {
    return null;
  }
  return SERVER_REFUSALS[messageKey] ?? null;
}
