import type { QueueBlackout, QueueRuleInput, QueueRuleView, QueueWindow } from '@relay/contracts';

/**
 * The rule editor's state, kept pure so the window arithmetic can be tested
 * without a browser.
 *
 * The weekly grid is a set of hour cells. It is a set, never a drag gesture:
 * every cell is an ordinary toggle button, and the same edit is available from
 * the day and time fields below it. There is no pointer-only path in here.
 */

export const MINUTES_PER_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export interface RuleDraft {
  readonly name: string;
  readonly ianaTimeZone: string;
  readonly windows: readonly QueueWindow[];
  readonly minimumGapMinutes: number;
  /** Null is no ceiling. Zero is zero. The editor never conflates them. */
  readonly maximumPerDay: number | null;
  readonly blackouts: readonly QueueBlackout[];
  readonly connectionIds: readonly string[];
  readonly priority: number;
  readonly enabled: boolean;
}

export function emptyDraft(ianaTimeZone: string): RuleDraft {
  return {
    name: '',
    ianaTimeZone,
    windows: [],
    minimumGapMinutes: 0,
    maximumPerDay: null,
    blackouts: [],
    connectionIds: [],
    priority: 0,
    enabled: true,
  };
}

export function toDraft(rule: QueueRuleView): RuleDraft {
  return {
    name: rule.name,
    ianaTimeZone: rule.ianaTimeZone,
    windows: rule.windows,
    minimumGapMinutes: rule.minimumGapMinutes,
    maximumPerDay: rule.maximumPerDay,
    blackouts: rule.blackouts,
    connectionIds: rule.connectionIds,
    priority: rule.priority,
    enabled: rule.enabled,
  };
}

export function toInput(draft: RuleDraft, projectId: string): QueueRuleInput {
  return {
    projectId,
    name: draft.name.trim(),
    ianaTimeZone: draft.ianaTimeZone,
    windows: [...draft.windows],
    minimumGapMinutes: draft.minimumGapMinutes,
    maximumPerDay: draft.maximumPerDay,
    blackouts: [...draft.blackouts],
    connectionIds: [...draft.connectionIds],
    priority: draft.priority,
    enabled: draft.enabled,
  };
}

function sortWindows(windows: readonly QueueWindow[]): readonly QueueWindow[] {
  return [...windows].sort((left, right) =>
    left.weekday === right.weekday
      ? left.startMinute - right.startMinute
      : left.weekday - right.weekday,
  );
}

/** True when this weekday and hour is inside any window on the draft. */
export function isHourSelected(
  windows: readonly QueueWindow[],
  weekday: number,
  hour: number,
): boolean {
  const minute = hour * MINUTES_PER_HOUR;
  return windows.some(
    (window) =>
      window.weekday === weekday && window.startMinute <= minute && minute <= window.endMinute,
  );
}

/**
 * Add or remove one hour cell.
 *
 * Adjacent hours merge into one window and a removal splits one, so the stored
 * shape stays the same whether a person used the grid or typed the times.
 */
export function toggleHour(
  windows: readonly QueueWindow[],
  weekday: number,
  hour: number,
): readonly QueueWindow[] {
  const selected = new Set<number>();
  for (let candidate = 0; candidate < HOURS_IN_DAY; candidate += 1) {
    if (isHourSelected(windows, weekday, candidate)) {
      selected.add(candidate);
    }
  }
  if (selected.has(hour)) {
    selected.delete(hour);
  } else {
    selected.add(hour);
  }

  const others = windows.filter((window) => window.weekday !== weekday);
  return sortWindows([...others, ...spansOf(weekday, selected)]);
}

function spansOf(weekday: number, hours: ReadonlySet<number>): readonly QueueWindow[] {
  const ordered = [...hours].sort((left, right) => left - right);
  const spans: QueueWindow[] = [];
  let start: number | null = null;
  let previous: number | null = null;
  for (const hour of ordered) {
    if (start === null || previous === null) {
      start = hour;
    } else if (hour !== previous + 1) {
      spans.push(windowOf(weekday, start, previous));
      start = hour;
    }
    previous = hour;
  }
  if (start !== null && previous !== null) {
    spans.push(windowOf(weekday, start, previous));
  }
  return spans;
}

function windowOf(weekday: number, firstHour: number, lastHour: number): QueueWindow {
  return {
    weekday,
    startMinute: firstHour * MINUTES_PER_HOUR,
    endMinute: lastHour * MINUTES_PER_HOUR,
  };
}

export function addWindow(
  windows: readonly QueueWindow[],
  window: QueueWindow,
): readonly QueueWindow[] {
  return sortWindows([...windows, window]);
}

export function removeWindowAt(
  windows: readonly QueueWindow[],
  index: number,
): readonly QueueWindow[] {
  return windows.filter((_window, position) => position !== index);
}

export function addBlackout(
  blackouts: readonly QueueBlackout[],
  span: QueueBlackout,
): readonly QueueBlackout[] {
  return [...blackouts, span].sort((left, right) => left.from.localeCompare(right.from));
}

export function removeBlackoutAt(
  blackouts: readonly QueueBlackout[],
  index: number,
): readonly QueueBlackout[] {
  return blackouts.filter((_span, position) => position !== index);
}

/** `540` becomes `09:00`. Never localized: this is an input value, not copy. */
export function toClock(minutes: number): string {
  const hour = Math.floor(minutes / MINUTES_PER_HOUR);
  const minute = minutes % MINUTES_PER_HOUR;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function fromClock(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/u.exec(value);
  if (match === null) {
    return null;
  }
  const hour = Number.parseInt(match[1] ?? '', 10);
  const minute = Number.parseInt(match[2] ?? '', 10);
  if (hour > 23 || minute > 59) {
    return null;
  }
  return hour * MINUTES_PER_HOUR + minute;
}

export type DraftIssue = 'name_required' | 'windows_required' | 'gap_negative' | 'maximum_negative';

/** What still stands between this draft and a rule that can offer a slot. */
export function draftIssues(draft: RuleDraft): readonly DraftIssue[] {
  const issues: DraftIssue[] = [];
  if (draft.name.trim().length === 0) {
    issues.push('name_required');
  }
  if (draft.windows.length === 0) {
    issues.push('windows_required');
  }
  if (draft.minimumGapMinutes < 0) {
    issues.push('gap_negative');
  }
  if (draft.maximumPerDay !== null && draft.maximumPerDay < 0) {
    issues.push('maximum_negative');
  }
  return issues;
}
