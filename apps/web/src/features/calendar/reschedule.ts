/**
 * What happens when a post is moved.
 *
 * Moving a post is never a silent write. This module turns a drop target or a
 * keyboard step into a proposal plus the exact list of things the person
 * should know before they confirm: the clocks changing between the two times,
 * other posts already close to the new slot, a campaign window the new time
 * falls outside, a lead time the provider cannot meet, and a time in the past.
 *
 * It is pure, so the confirmation dialog and its tests exercise the same code
 * that the drag handler does.
 */

import { crossesOffsetChange, getTimeZoneOffsetMinutes } from '@relay/i18n';
import type { PublishState } from '@/lib/api/types';
import {
  addMinutes,
  calendarDayDelta,
  fromWallClock,
  shiftSchedule,
  toWallClock,
} from './date-range';
import type { CalendarEntry, RescheduleProposal, RescheduleWarning } from './types';

/** Slot granularity for a keyboard move, in minutes. */
export const KEYBOARD_STEP_MINUTES = 15;

/** How close another post must be to count as a cadence conflict. */
export const CONFLICT_WINDOW_MINUTES = 60;

/**
 * Media preparation lead time, in seconds, by media kind.
 *
 * These are Relay's own pipeline minimums, not provider claims: a video has to
 * be fetched, transcoded and uploaded to a container before the platform will
 * accept it, and scheduling one for ninety seconds from now would fail at
 * dispatch instead of at the moment the person could still fix it.
 */
export const MEDIA_LEAD_TIME_SECONDS: Readonly<Record<CalendarEntry['mediaKind'], number>> = {
  text: 60,
  image: 120,
  carousel: 180,
  document: 180,
  video: 600,
};

/** States in which an external post already exists on the platform. */
const EXTERNALLY_VISIBLE: readonly PublishState[] = [
  'published',
  'partially_published',
  'deleted_externally',
];

export function hasExternalPost(state: PublishState): boolean {
  return EXTERNALLY_VISIBLE.includes(state);
}

/** States that cannot be rescheduled at all. */
const IMMOVABLE: readonly PublishState[] = [
  'preparing_media',
  'dispatching',
  'provider_processing',
  'canceled',
];

export function canReschedule(state: PublishState): boolean {
  return !IMMOVABLE.includes(state);
}

export interface ProposalInput {
  readonly entry: CalendarEntry;
  /** Whole calendar days to move, at the same local time. */
  readonly days?: number;
  /** Exact minutes to move, after the day shift. */
  readonly minutes?: number;
  /** An absolute target, used by the drop handler and the date picker. */
  readonly toInstant?: Date;
  readonly timeZone: string;
}

/** Build a proposal from a drag drop, a keyboard step or an explicit time. */
export function buildProposal(input: ProposalInput): RescheduleProposal {
  const from = new Date(input.entry.scheduledAt);
  const to =
    input.toInstant ??
    shiftSchedule(from, input.timeZone, {
      ...(input.days === undefined ? {} : { days: input.days }),
      ...(input.minutes === undefined ? {} : { minutes: input.minutes }),
    });

  const fromOffset = getTimeZoneOffsetMinutes(input.timeZone, from);
  const toOffset = getTimeZoneOffsetMinutes(input.timeZone, to);
  const elapsedMinutes = Math.round((to.getTime() - from.getTime()) / 60_000);
  // Local time is UTC plus the offset east of UTC, so the wall clock delta is the
  // elapsed time plus the change in offset. Getting this sign backwards only shows
  // up when the move crosses a daylight saving boundary, which is exactly when the
  // confirmation dialog's claim about keeping the local time has to be right.
  const wallClockDelta = elapsedMinutes + (toOffset - fromOffset);

  return {
    entry: input.entry,
    fromInstant: from.toISOString(),
    toInstant: to.toISOString(),
    keepsLocalTime: wallClockDelta % 1440 === 0,
  };
}

/**
 * A calendar cell a post can be dropped on.
 *
 * `instant` is what the cell stands for: the start of its day in a month or an
 * agenda cell, the start of its hour in the time grid. `granularity` is the
 * promise the cell makes, and the month promise is the load bearing one: a
 * month cell changes the date and leaves the wall clock time alone.
 */
export interface DropTarget {
  readonly instant: Date;
  readonly granularity: 'day' | 'slot';
}

/**
 * Where a drop lands.
 *
 * A day drop is routed through `shiftSchedule` with a whole number of days,
 * which is the path `ArrowRight` takes, so the two produce the same proposal
 * and survive a daylight saving edge for the same reason. A slot drop rebuilds
 * the wall clock reading instead, date and hour from the cell, minute from the
 * post: the band is a claim about the clock, not about elapsed time.
 */
export function dropInstant(entry: CalendarEntry, target: DropTarget, timeZone: string): Date {
  const from = new Date(entry.scheduledAt);
  const days = calendarDayDelta(from, target.instant, timeZone);

  if (target.granularity === 'day') {
    return shiftSchedule(from, timeZone, days === 0 ? {} : { days });
  }

  const fromWall = toWallClock(from, timeZone);
  const targetWall = toWallClock(target.instant, timeZone);
  return fromWallClock({ ...targetWall, minute: fromWall.minute }, timeZone);
}

export interface DropProposalInput {
  readonly entry: CalendarEntry;
  readonly target: DropTarget;
  readonly timeZone: string;
}

/**
 * The proposal a drop asks for. Nothing is written: this is the same value the
 * keyboard path produces, handed to the same confirmation dialog.
 */
export function buildDropProposal(input: DropProposalInput): RescheduleProposal {
  return buildProposal({
    entry: input.entry,
    timeZone: input.timeZone,
    toInstant: dropInstant(input.entry, input.target, input.timeZone),
  });
}

/** A campaign window, when the entry belongs to one. */
export interface CampaignWindow {
  readonly name: string;
  readonly startsAt: string;
  readonly endsAt: string;
}

export interface WarningInput {
  readonly proposal: RescheduleProposal;
  readonly timeZone: string;
  /** Other entries on the same connection, used for the cadence check. */
  readonly siblingEntries: readonly CalendarEntry[];
  readonly campaign?: CampaignWindow | undefined;
  /** Injected so the check is deterministic in tests. */
  readonly now: Date;
}

/**
 * Everything the person should read before confirming.
 *
 * Order is deliberate: blocking problems first, then the daylight saving note,
 * then the softer cadence and campaign warnings. A dialog that buries "that
 * time has already passed" under three advisories has failed.
 */
export function collectWarnings(input: WarningInput): readonly RescheduleWarning[] {
  const warnings: RescheduleWarning[] = [];
  const to = new Date(input.proposal.toInstant);
  const from = new Date(input.proposal.fromInstant);

  if (to.getTime() <= input.now.getTime()) {
    warnings.push({ id: 'in-the-past', kind: 'in_the_past', values: {}, blocking: true });
  }

  const leadSeconds = MEDIA_LEAD_TIME_SECONDS[input.proposal.entry.mediaKind];
  const availableSeconds = Math.floor((to.getTime() - input.now.getTime()) / 1000);
  if (availableSeconds > 0 && availableSeconds < leadSeconds) {
    warnings.push({
      id: 'short-lead-time',
      kind: 'short_lead_time',
      values: {
        availableSeconds,
        requiredSeconds: leadSeconds,
        provider: input.proposal.entry.provider,
      },
      blocking: false,
    });
  }

  if (crossesOffsetChange(input.timeZone, from, to)) {
    warnings.push({
      id: 'dst',
      kind: 'dst',
      values: {
        fromOffsetMinutes: getTimeZoneOffsetMinutes(input.timeZone, from),
        toOffsetMinutes: getTimeZoneOffsetMinutes(input.timeZone, to),
      },
      blocking: false,
    });
  }

  const conflicts = countNearbyEntries(
    input.siblingEntries,
    input.proposal.entry,
    to,
    CONFLICT_WINDOW_MINUTES,
  );
  if (conflicts > 0) {
    warnings.push({
      id: 'account-conflict',
      kind: 'account_conflict',
      values: {
        count: conflicts,
        account: input.proposal.entry.accountLabel,
        windowMinutes: CONFLICT_WINDOW_MINUTES,
      },
      blocking: false,
    });
  }

  if (input.campaign) {
    const start = new Date(input.campaign.startsAt).getTime();
    const end = new Date(input.campaign.endsAt).getTime();
    if (to.getTime() < start || to.getTime() > end) {
      warnings.push({
        id: 'campaign-window',
        kind: 'campaign_window',
        values: {
          campaign: input.campaign.name,
          startsAt: input.campaign.startsAt,
          endsAt: input.campaign.endsAt,
        },
        blocking: false,
      });
    }
  }

  return warnings;
}

/** Posts on the same connection within `windowMinutes` of the target time. */
export function countNearbyEntries(
  entries: readonly CalendarEntry[],
  subject: CalendarEntry,
  target: Date,
  windowMinutes: number,
): number {
  const lower = addMinutes(target, -windowMinutes).getTime();
  const upper = addMinutes(target, windowMinutes).getTime();
  return entries.filter((candidate) => {
    if (candidate.contentItemId === subject.contentItemId) return false;
    if (candidate.accountLabel !== subject.accountLabel) return false;
    if (candidate.provider !== subject.provider) return false;
    if (candidate.state === 'canceled') return false;
    const at = new Date(candidate.scheduledAt).getTime();
    return at >= lower && at <= upper;
  }).length;
}

/** True when at least one warning stops the move outright. */
export function isBlocked(warnings: readonly RescheduleWarning[]): boolean {
  return warnings.some((warning) => warning.blocking);
}

/**
 * Arrow key to a slot step. Returned as days plus minutes, never as pixels.
 *
 * The inline axis mirrors in a right to left interface, because "the next day"
 * is drawn to the left there and an arrow that moved the post the other way
 * would be the same bug as a mirrored back button.
 */
export function keyboardStep(
  key: string,
  view: 'day' | 'week' | 'month' | 'list',
  direction: 'ltr' | 'rtl' = 'ltr',
): { readonly days?: number; readonly minutes?: number } | null {
  const forward = direction === 'rtl' ? -1 : 1;
  switch (key) {
    case 'ArrowUp':
      return view === 'month' ? { days: -7 } : { minutes: -KEYBOARD_STEP_MINUTES };
    case 'ArrowDown':
      return view === 'month' ? { days: 7 } : { minutes: KEYBOARD_STEP_MINUTES };
    case 'ArrowLeft':
      return { days: -forward };
    case 'ArrowRight':
      return { days: forward };
    case 'PageUp':
      return { days: -7 };
    case 'PageDown':
      return { days: 7 };
    default:
      return null;
  }
}
