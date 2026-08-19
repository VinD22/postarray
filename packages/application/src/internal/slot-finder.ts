import {
  QUEUE_DEFAULT_STEP_MINUTES,
  QUEUE_SEARCH_HORIZON_DAYS,
  SLOT_REASON_KEYS,
  type QueueRuleDefinition,
  type QueueWindow,
  type SlotProposal,
  type SlotReason,
} from '@relay/contracts';

import { localDateIn, localDateTimeIn, pad, partsOf, resolveWallClock } from './zone-time';

/**
 * Queue slot mathematics. Pure: no database, no clock, no I/O.
 *
 * Everything the decision needs is an argument, which is what makes the
 * daylight-saving behaviour exhaustively testable instead of aspirational.
 *
 * Two deliberate choices, both load bearing:
 *
 *  1. A local time that does not exist, because the zone sprang forward over
 *     it, is skipped forward minute by minute to the first wall clock that does
 *     exist inside the same window. It is never thrown and never silently
 *     resolved to the wrong instant.
 *  2. A local time that occurs twice, because the zone fell back over it,
 *     always resolves to the FIRST occurrence, that is the one still on the
 *     pre-transition offset. First is the one a person means when they say
 *     "01:30" on that morning, it is stable under recomputation, and it is
 *     always the earlier instant so it can never jump a post later than the
 *     wall clock the user was shown.
 *
 * "Maximum per day" counts calendar days in the RULE's zone. The rollover is
 * local midnight there, not UTC midnight.
 */

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;
/** No zone in the tz database jumps more than this over a transition. */
const MAX_SPRING_FORWARD_MINUTES = 240;

export interface OccupiedSlot {
  readonly instant: string;
  readonly connectionId?: string | null;
}

/** A rule as the finder sees it: the definition plus, optionally, its row id. */
export type SlotFinderRule = QueueRuleDefinition & { readonly id?: string };

export interface SlotFinderInput {
  readonly rules: readonly SlotFinderRule[];
  readonly occupied: readonly OccupiedSlot[];
  /** Live reservations. They hold their instant exactly like a job does. */
  readonly reserved: readonly OccupiedSlot[];
  readonly after: Date;
  /** Used by the labelled fallback when the project has no rules yet. */
  readonly fallbackTimeZone: string;
  readonly horizonDays?: number;
}

function reason(key: string, values: Record<string, string | number> = {}): SlotReason {
  return { key, values };
}

function stepMinutesOf(rule: QueueRuleDefinition): number {
  return rule.minimumGapMinutes > 0 ? rule.minimumGapMinutes : QUEUE_DEFAULT_STEP_MINUTES;
}

function inBlackout(rule: QueueRuleDefinition, localDate: string): boolean {
  return rule.blackouts.some((span) => span.from <= localDate && localDate <= span.to);
}

function relevant(rule: QueueRuleDefinition, entries: readonly OccupiedSlot[]): readonly Date[] {
  const scoped =
    rule.connectionIds.length === 0
      ? entries
      : entries.filter(
          (entry) =>
            entry.connectionId === undefined ||
            entry.connectionId === null ||
            rule.connectionIds.includes(entry.connectionId),
        );
  return scoped
    .map((entry) => new Date(entry.instant))
    .filter((instant) => !Number.isNaN(instant.getTime()));
}

interface RuleCandidate {
  readonly instant: Date;
  readonly window: QueueWindow;
  readonly minuteOfDay: number;
  readonly dstNonexistentSkipped: boolean;
  readonly dstAmbiguous: boolean;
  readonly blackoutsSkipped: number;
}

/**
 * The earliest instant this one rule is willing to offer, or null when the
 * horizon runs out. Windows are scanned in local date order so the first
 * acceptable candidate is genuinely the earliest.
 */
export function nextCandidateForRule(
  rule: QueueRuleDefinition,
  taken: readonly Date[],
  after: Date,
  horizonDays: number,
): RuleCandidate | null {
  if (!rule.enabled || rule.windows.length === 0 || rule.maximumPerDay === 0) {
    return null;
  }
  const zone = rule.ianaTimeZone;
  const gapMs = rule.minimumGapMinutes * MINUTE_MS;
  const step = stepMinutesOf(rule);
  const perDay = new Map<string, number>();
  for (const instant of taken) {
    const key = localDateIn(instant, zone);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }

  let blackoutsSkipped = 0;
  const startParts = partsOf(after, zone);
  const cursor = Date.UTC(startParts.year, startParts.month - 1, startParts.day);

  for (let day = 0; day <= horizonDays; day += 1) {
    const dayDate = new Date(cursor + day * DAY_MS);
    const year = dayDate.getUTCFullYear();
    const month = dayDate.getUTCMonth() + 1;
    const dayOfMonth = dayDate.getUTCDate();
    // getUTCDay is 0 for Sunday; ISO weekday is 7.
    const weekday = dayDate.getUTCDay() === 0 ? 7 : dayDate.getUTCDay();
    const localDate = `${pad(year, 4)}-${pad(month)}-${pad(dayOfMonth)}`;

    const windows = rule.windows
      .filter((window) => window.weekday === weekday)
      .toSorted((left, right) => left.startMinute - right.startMinute);
    if (windows.length === 0) {
      continue;
    }
    if (inBlackout(rule, localDate)) {
      blackoutsSkipped += 1;
      continue;
    }

    for (const window of windows) {
      for (
        let minuteOfDay = window.startMinute;
        minuteOfDay <= window.endMinute;
        minuteOfDay += step
      ) {
        const placed = placeInWindow({ year, month, day: dayOfMonth, minuteOfDay }, window, zone);
        if (placed === null) {
          continue;
        }
        if (placed.instant.getTime() <= after.getTime()) {
          continue;
        }
        if (rule.maximumPerDay !== null) {
          const used = perDay.get(localDateIn(placed.instant, zone)) ?? 0;
          if (used >= rule.maximumPerDay) {
            break;
          }
        }
        if (collides(placed.instant, taken, gapMs)) {
          continue;
        }
        return {
          instant: placed.instant,
          window,
          minuteOfDay,
          dstNonexistentSkipped: placed.skipped,
          dstAmbiguous: placed.ambiguous,
          blackoutsSkipped,
        };
      }
    }
  }
  return null;
}

/** Resolve one candidate minute, skipping forward over a spring-forward gap. */
function placeInWindow(
  wall: { year: number; month: number; day: number; minuteOfDay: number },
  window: QueueWindow,
  timeZone: string,
): { instant: Date; skipped: boolean; ambiguous: boolean } | null {
  for (let bump = 0; bump <= MAX_SPRING_FORWARD_MINUTES; bump += 1) {
    const minuteOfDay = wall.minuteOfDay + bump;
    if (minuteOfDay > window.endMinute) {
      return null;
    }
    const resolved = resolveWallClock({ ...wall, minuteOfDay }, timeZone);
    if (resolved.kind === 'nonexistent') {
      continue;
    }
    return {
      instant: resolved.instant,
      skipped: bump > 0,
      ambiguous: resolved.kind === 'ambiguous',
    };
  }
  return null;
}

function collides(candidate: Date, taken: readonly Date[], gapMs: number): boolean {
  return taken.some((instant) => {
    const distance = Math.abs(instant.getTime() - candidate.getTime());
    return gapMs === 0 ? distance === 0 : distance < gapMs;
  });
}

/** Slots are on the hour. The first hour with nothing scheduled for the project. */
const FALLBACK_SLOT_MINUTES = 60;
const FALLBACK_SEARCH_HOURS = 24 * 30;

/**
 * The pre-queue behaviour, kept as an explicitly labelled fallback rather than
 * deleted. A project with no rules still gets a slot, and the reason says in so
 * many words that no rules are configured.
 */
export function fallbackSlot(
  occupied: readonly OccupiedSlot[],
  after: Date,
  timeZone: string,
): SlotProposal {
  const start = new Date(after.getTime());
  start.setUTCMinutes(0, 0, 0);
  start.setUTCHours(start.getUTCHours() + 1);

  const busy = new Set(
    occupied
      .map((entry) => new Date(entry.instant))
      .filter((instant) => !Number.isNaN(instant.getTime()))
      .map((instant) => instant.toISOString()),
  );

  for (let hour = 0; hour < FALLBACK_SEARCH_HOURS; hour += 1) {
    const candidate = new Date(start.getTime() + hour * FALLBACK_SLOT_MINUTES * MINUTE_MS);
    if (!busy.has(candidate.toISOString())) {
      return toProposal(candidate, timeZone, null, [
        reason(SLOT_REASON_KEYS.noRulesConfigured),
        reason(SLOT_REASON_KEYS.fallbackFirstFreeHour),
      ]);
    }
  }
  const horizon = new Date(start.getTime() + FALLBACK_SEARCH_HOURS * 3_600_000);
  return toProposal(horizon, timeZone, null, [
    reason(SLOT_REASON_KEYS.noRulesConfigured),
    reason(SLOT_REASON_KEYS.horizonExhausted, { days: 30 }),
  ]);
}

function toProposal(
  instant: Date,
  timeZone: string,
  queueRuleId: string | null,
  reasons: readonly SlotReason[],
): SlotProposal {
  return {
    instant: instant.toISOString(),
    ianaTimeZone: timeZone,
    localDateTime: localDateTimeIn(instant, timeZone),
    queueRuleId,
    reasons: [...reasons],
  };
}

function windowLabel(window: QueueWindow): { start: string; end: string } {
  const asClock = (minutes: number): string =>
    `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  return { start: asClock(window.startMinute), end: asClock(window.endMinute) };
}

/**
 * The proposal, with the reasons that produced it.
 *
 * Rules are considered in priority order, highest first. The first rule that
 * can offer anything wins, even when a lower-priority rule could offer an
 * earlier instant: a person who set a priority meant it, and the reason list
 * says which rule was used so the choice is never a mystery.
 */
export function findNextSlot(input: SlotFinderInput): SlotProposal {
  const horizonDays = input.horizonDays ?? QUEUE_SEARCH_HORIZON_DAYS;
  const active = input.rules.filter((rule) => rule.enabled);
  if (active.length === 0) {
    return fallbackSlot(
      [...input.occupied, ...input.reserved],
      input.after,
      input.fallbackTimeZone,
    );
  }

  const ordered = active.toSorted((left, right) =>
    left.priority === right.priority
      ? left.name.localeCompare(right.name)
      : right.priority - left.priority,
  );

  for (const rule of ordered) {
    const taken = relevant(rule, [...input.occupied, ...input.reserved]);
    const candidate = nextCandidateForRule(rule, taken, input.after, horizonDays);
    if (candidate === null) {
      continue;
    }
    const label = windowLabel(candidate.window);
    const reasons: SlotReason[] = [
      reason(SLOT_REASON_KEYS.matchedRule, { name: rule.name, zone: rule.ianaTimeZone }),
      reason(SLOT_REASON_KEYS.matchedWindow, {
        weekday: candidate.window.weekday,
        start: label.start,
        end: label.end,
        zone: rule.ianaTimeZone,
      }),
      rule.minimumGapMinutes > 0
        ? reason(SLOT_REASON_KEYS.minimumGap, { minutes: rule.minimumGapMinutes })
        : reason(SLOT_REASON_KEYS.noMinimumGap),
      rule.maximumPerDay === null
        ? reason(SLOT_REASON_KEYS.dailyCapUnlimited)
        : reason(SLOT_REASON_KEYS.dailyCap, { limit: rule.maximumPerDay }),
    ];
    if (candidate.blackoutsSkipped > 0) {
      reasons.push(reason(SLOT_REASON_KEYS.blackoutSkipped, { days: candidate.blackoutsSkipped }));
    }
    if (candidate.dstNonexistentSkipped) {
      reasons.push(reason(SLOT_REASON_KEYS.dstNonexistentSkipped, { zone: rule.ianaTimeZone }));
    }
    if (candidate.dstAmbiguous) {
      reasons.push(reason(SLOT_REASON_KEYS.dstAmbiguousFirst, { zone: rule.ianaTimeZone }));
    }
    if (rule.connectionIds.length > 0) {
      reasons.push(reason(SLOT_REASON_KEYS.connectionScoped, { count: rule.connectionIds.length }));
    }
    if (ordered.length > 1) {
      reasons.push(reason(SLOT_REASON_KEYS.priorityChosen, { priority: rule.priority }));
    }
    return toProposal(candidate.instant, rule.ianaTimeZone, rule.id ?? null, reasons);
  }

  return fallbackSlot([...input.occupied, ...input.reserved], input.after, input.fallbackTimeZone);
}
