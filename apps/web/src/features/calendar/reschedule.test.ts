import { describe, expect, it } from 'vitest';

import { fromWallClock, toWallClock } from './date-range';
import {
  buildProposal,
  canReschedule,
  collectWarnings,
  countNearbyEntries,
  hasExternalPost,
  isBlocked,
  keyboardStep,
} from './reschedule';
import type { CalendarEntry } from './types';

const BERLIN = 'Europe/Berlin';

function entry(overrides: Partial<CalendarEntry> = {}): CalendarEntry {
  return {
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
