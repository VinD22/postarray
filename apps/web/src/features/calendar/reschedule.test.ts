import { describe, expect, it } from 'vitest';

import { addDays, fromWallClock, startOfDay, toWallClock } from './date-range';
import {
  buildDropProposal,
  buildProposal,
  canReschedule,
  collectWarnings,
  countNearbyEntries,
  dropInstant,
  hasExternalPost,
  isBlocked,
  keyboardStep,
} from './reschedule';
import type { CalendarEntry } from './types';

const BERLIN = 'Europe/Berlin';

function entry(overrides: Partial<CalendarEntry> = {}): CalendarEntry {
  return {
    publishJobId: 'job_01j000000000000000000001',
    contentItemId: 'post_01j000000000000000000001',
    title: 'Scheduled first comments are live',
    scheduledAt: '2026-08-06T07:30:00.000Z',
    timeZone: BERLIN,
    state: 'scheduled',
    approvalState: 'approved',
    provider: 'x',
    accountLabel: '@acme',
    targetCount: 1,
    mediaKind: 'image',
    ...overrides,
  };
}

describe('buildProposal', () => {
  it('moves a whole day and keeps the local time', () => {
    const proposal = buildProposal({ entry: entry(), days: 1, timeZone: BERLIN });
    expect(proposal.keepsLocalTime).toBe(true);
    expect(toWallClock(new Date(proposal.toInstant), BERLIN)).toMatchObject({
      day: 7,
      hour: 9,
      minute: 30,
    });
  });

  it('keeps the local time across the autumn clock change', () => {
    const october = entry({
      scheduledAt: fromWallClock(
        { year: 2026, month: 10, day: 24, hour: 9, minute: 30 },
        BERLIN,
      ).toISOString(),
    });
    const proposal = buildProposal({ entry: october, days: 1, timeZone: BERLIN });
    expect(proposal.keepsLocalTime).toBe(true);
    expect(toWallClock(new Date(proposal.toInstant), BERLIN).hour).toBe(9);
  });

  it('reports a minute move as not keeping the local time', () => {
    const proposal = buildProposal({ entry: entry(), minutes: 15, timeZone: BERLIN });
    expect(proposal.keepsLocalTime).toBe(false);
  });

  it('accepts an absolute target instant', () => {
    const target = new Date('2026-09-01T12:00:00.000Z');
    const proposal = buildProposal({ entry: entry(), toInstant: target, timeZone: BERLIN });
    expect(proposal.toInstant).toBe(target.toISOString());
  });
});

describe('buildDropProposal', () => {
  /** The month cell for the day `days` after the entry, as the grid renders it. */
  function dayCell(subject: CalendarEntry, days: number): Date {
    return startOfDay(addDays(new Date(subject.scheduledAt), days, BERLIN), BERLIN);
  }

  it('produces exactly the proposal the equivalent key press produces', () => {
    const subject = entry();
    const step = keyboardStep('ArrowRight', 'month');
    const byKeyboard = buildProposal({ entry: subject, ...step, timeZone: BERLIN });
    const byDrop = buildDropProposal({
      entry: subject,
      target: { instant: dayCell(subject, 1), granularity: 'day' },
      timeZone: BERLIN,
    });

    expect(byDrop).toEqual(byKeyboard);
    expect(byDrop.entry).toBe(subject);
    expect(byDrop.fromInstant).toBe(byKeyboard.fromInstant);
    expect(byDrop.toInstant).toBe(byKeyboard.toInstant);
    expect(byDrop.keepsLocalTime).toBe(byKeyboard.keepsLocalTime);
  });

  it('matches the keyboard week step too, from the other end of the grid', () => {
    const subject = entry();
    const byKeyboard = buildProposal({ entry: subject, days: 7, timeZone: BERLIN });
    const byDrop = buildDropProposal({
      entry: subject,
      target: { instant: dayCell(subject, 7), granularity: 'day' },
      timeZone: BERLIN,
    });
    expect(byDrop).toEqual(byKeyboard);
  });

  it('keeps the wall clock time when a month drop crosses the autumn clock change', () => {
    const october = entry({
      scheduledAt: fromWallClock(
        { year: 2026, month: 10, day: 24, hour: 9, minute: 30 },
        BERLIN,
      ).toISOString(),
    });
    const proposal = buildDropProposal({
      entry: october,
      target: { instant: dayCell(october, 1), granularity: 'day' },
      timeZone: BERLIN,
    });

    expect(proposal.keepsLocalTime).toBe(true);
    expect(toWallClock(new Date(proposal.toInstant), BERLIN)).toMatchObject({
      day: 25,
      hour: 9,
      minute: 30,
    });
  });

  it('takes the hour from a time grid cell and the minute from the post', () => {
    const subject = entry();
    const band = fromWallClock({ year: 2026, month: 8, day: 7, hour: 14, minute: 0 }, BERLIN);
    const proposal = buildDropProposal({
      entry: subject,
      target: { instant: band, granularity: 'slot' },
      timeZone: BERLIN,
    });

    expect(toWallClock(new Date(proposal.toInstant), BERLIN)).toMatchObject({
      day: 7,
      hour: 14,
      minute: 30,
    });
    expect(proposal.keepsLocalTime).toBe(false);
  });

  it('agrees with the keyboard when a slot drop lands on the same hour a day later', () => {
    const subject = entry();
    const sameBandTomorrow = fromWallClock(
      { year: 2026, month: 8, day: 7, hour: 9, minute: 0 },
      BERLIN,
    );
    const byDrop = buildDropProposal({
      entry: subject,
      target: { instant: sameBandTomorrow, granularity: 'slot' },
      timeZone: BERLIN,
    });
    expect(byDrop).toEqual(buildProposal({ entry: subject, days: 1, timeZone: BERLIN }));
  });

  it('proposes no change when the post is dropped back on its own cell', () => {
    const subject = entry();
    const proposal = buildDropProposal({
      entry: subject,
      target: { instant: dayCell(subject, 0), granularity: 'day' },
      timeZone: BERLIN,
    });
    expect(proposal.toInstant).toBe(proposal.fromInstant);
    expect(proposal.keepsLocalTime).toBe(true);
  });

  it('resolves a day cell through the same helper the arrow keys use', () => {
    const subject = entry();
    expect(
      dropInstant(
        subject,
        { instant: dayCell(subject, -3), granularity: 'day' },
        BERLIN,
      ).toISOString(),
    ).toBe(buildProposal({ entry: subject, days: -3, timeZone: BERLIN }).toInstant);
  });
});

describe('collectWarnings', () => {
  const now = new Date('2026-08-01T09:00:00.000Z');

  it('warns about the clocks changing between the two times', () => {
    const october = entry({
      scheduledAt: fromWallClock(
        { year: 2026, month: 10, day: 24, hour: 9, minute: 30 },
        BERLIN,
      ).toISOString(),
    });
    const proposal = buildProposal({ entry: october, days: 1, timeZone: BERLIN });
    const warnings = collectWarnings({
      proposal,
      timeZone: BERLIN,
      siblingEntries: [],
      now,
    });
    const dst = warnings.find((warning) => warning.kind === 'dst');
    expect(dst).toBeDefined();
    expect(dst?.values.fromOffsetMinutes).toBe(120);
    expect(dst?.values.toOffsetMinutes).toBe(60);
    expect(isBlocked(warnings)).toBe(false);
  });

  it('blocks a move into the past', () => {
    const proposal = buildProposal({ entry: entry(), days: -30, timeZone: BERLIN });
    const warnings = collectWarnings({ proposal, timeZone: BERLIN, siblingEntries: [], now });
    expect(isBlocked(warnings)).toBe(true);
    expect(warnings[0]?.kind).toBe('in_the_past');
  });

  it('warns when video preparation cannot finish in time, without blocking', () => {
    const soon = new Date(now.getTime() + 4 * 60_000);
    const proposal = buildProposal({
      entry: entry({ mediaKind: 'video' }),
      toInstant: soon,
      timeZone: BERLIN,
    });
    const warnings = collectWarnings({ proposal, timeZone: BERLIN, siblingEntries: [], now });
    const lead = warnings.find((warning) => warning.kind === 'short_lead_time');
    expect(lead?.blocking).toBe(false);
    expect(lead?.values.requiredSeconds).toBe(600);
  });

  it('counts other posts on the same account inside the cadence window', () => {
    const subject = entry();
    const proposal = buildProposal({ entry: subject, days: 1, timeZone: BERLIN });
    const neighbours: CalendarEntry[] = [
      entry({
        contentItemId: 'post_01j000000000000000000002',
        scheduledAt: new Date(new Date(proposal.toInstant).getTime() + 20 * 60_000).toISOString(),
      }),
      entry({
        contentItemId: 'post_01j000000000000000000003',
        scheduledAt: new Date(new Date(proposal.toInstant).getTime() + 5 * 3_600_000).toISOString(),
      }),
      entry({
        contentItemId: 'post_01j000000000000000000004',
        accountLabel: '@other',
        scheduledAt: proposal.toInstant,
      }),
    ];
    const warnings = collectWarnings({
      proposal,
      timeZone: BERLIN,
      siblingEntries: neighbours,
      now,
    });
    const conflict = warnings.find((warning) => warning.kind === 'account_conflict');
    expect(conflict?.values.count).toBe(1);
  });

  it('warns when the new time falls outside the campaign window', () => {
    const proposal = buildProposal({ entry: entry(), days: 40, timeZone: BERLIN });
    const warnings = collectWarnings({
      proposal,
      timeZone: BERLIN,
      siblingEntries: [],
      now,
      campaign: {
        name: 'Q3 launch',
        startsAt: '2026-08-01T00:00:00.000Z',
        endsAt: '2026-08-31T23:59:59.000Z',
      },
    });
    expect(warnings.some((warning) => warning.kind === 'campaign_window')).toBe(true);
  });

  it('does not warn about a campaign when the time stays inside the window', () => {
    const proposal = buildProposal({ entry: entry(), days: 1, timeZone: BERLIN });
    const warnings = collectWarnings({
      proposal,
      timeZone: BERLIN,
      siblingEntries: [],
      now,
      campaign: {
        name: 'Q3 launch',
        startsAt: '2026-08-01T00:00:00.000Z',
        endsAt: '2026-08-31T23:59:59.000Z',
      },
    });
    expect(warnings.some((warning) => warning.kind === 'campaign_window')).toBe(false);
  });
});

describe('countNearbyEntries', () => {
  it('ignores the post being moved and canceled posts', () => {
    const subject = entry();
    const target = new Date(subject.scheduledAt);
    const count = countNearbyEntries(
      [subject, entry({ contentItemId: 'post_01j000000000000000000009', state: 'canceled' })],
      subject,
      target,
      60,
    );
    expect(count).toBe(0);
  });
});

describe('state guards', () => {
  it('knows which states already have an external post', () => {
    expect(hasExternalPost('published')).toBe(true);
    expect(hasExternalPost('partially_published')).toBe(true);
    expect(hasExternalPost('deleted_externally')).toBe(true);
    expect(hasExternalPost('scheduled')).toBe(false);
  });

  it('refuses to move a post that is mid flight', () => {
    expect(canReschedule('dispatching')).toBe(false);
    expect(canReschedule('preparing_media')).toBe(false);
    expect(canReschedule('provider_processing')).toBe(false);
    expect(canReschedule('scheduled')).toBe(true);
    // A published post can still be moved; the dialog asks how.
    expect(canReschedule('published')).toBe(true);
  });
});

describe('keyboardStep', () => {
  it('maps the vertical axis to slots in the week view and to weeks in month', () => {
    expect(keyboardStep('ArrowDown', 'week')).toEqual({ minutes: 15 });
    expect(keyboardStep('ArrowDown', 'month')).toEqual({ days: 7 });
  });

  it('mirrors the inline axis in a right to left interface', () => {
    expect(keyboardStep('ArrowRight', 'week', 'ltr')).toEqual({ days: 1 });
    expect(keyboardStep('ArrowRight', 'week', 'rtl')).toEqual({ days: -1 });
  });

  it('ignores keys that are not a move', () => {
    expect(keyboardStep('Enter', 'week')).toBeNull();
  });
});
