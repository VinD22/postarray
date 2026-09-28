import { describe, expect, it } from 'vitest';

import { explainFailure, isFailedState } from './insight-failures';
import { lastCompletedWeek } from './insight-digest';
import { deterministicNextTest, toReading } from './insight-post';

const created = new Date('2026-09-20T10:00:00Z');

function reading(args: Record<string, unknown>) {
  const parsed = toReading({
    id: 'insight_1',
    messageArgs: args,
    evidenceIds: ['receipt_a', 'receipt_b'],
    sampleSize: 6,
    createdAt: created,
  });
  if (parsed === null) throw new Error('expected a reading');
  return parsed;
}

describe('failure explanations', () => {
  it('prefers the specific code over the class', () => {
    const view = explainFailure({ errorClass: 'permanent_provider', errorCode: 'MEDIA_TOO_LARGE' });
    expect(view.messageKey).toBe('insight.failure.mediaTooLarge.message');
    expect(view.action).toBe('edit');
  });

  it('sends an expired connection to reconnect', () => {
    expect(explainFailure({ errorClass: 'user_action_required', errorCode: null }).action).toBe(
      'reconnect',
    );
  });

  it('never leaves a failure unexplained', () => {
    const view = explainFailure({ errorClass: null, errorCode: 'SOMETHING_NEW' });
    expect(view.messageKey).toBe('insight.failure.unknown.message');
    expect(view.fixKey).toBe('insight.failure.unknown.fix');
  });

  it('treats only terminal failure states as failed', () => {
    expect(isFailedState('failed_permanently')).toBe(true);
    expect(isFailedState('retry_scheduled')).toBe(false);
    expect(isFailedState('published')).toBe(false);
  });
});

describe('post feedback readings', () => {
  it('ignores rows without a window', () => {
    expect(
      toReading({
        id: 'x',
        messageArgs: {},
        evidenceIds: [],
        sampleSize: null,
        createdAt: created,
      }),
    ).toBeNull();
  });

  it('keeps an unavailable subject as null, never zero', () => {
    const view = reading({
      window: 'seven_days',
      verdict: 'insufficient_data',
      subjectValue: null,
    });
    expect(view.subjectValue).toBeNull();
    expect(deterministicNextTest(view)).toBeNull();
  });

  it('suggests one variable, taken from the first confounder', () => {
    const view = reading({
      window: 'twenty_four_hours',
      verdict: 'below',
      metric: 'reach',
      subjectValue: 40,
      medianValue: 80,
      confounderKeys: ['analytics.definition.notComparable', 'analytics.feedback.association'],
    });
    const next = deterministicNextTest(view);
    expect(next?.messageKey).toBe('insight.nextTest.media');
    expect(next?.metric).toBe('reach');
    expect(next?.evidenceIds).toEqual(['receipt_a']);
  });

  it('asks to repeat an above-median post with one change', () => {
    const view = reading({ window: 'seven_days', verdict: 'above', subjectValue: 120 });
    expect(deterministicNextTest(view)?.messageKey).toBe('insight.nextTest.repeat');
  });
});

describe('digest window', () => {
  it('returns the last completed Monday-to-Sunday week', () => {
    // Wednesday 23 September 2026.
    const week = lastCompletedWeek(new Date('2026-09-23T12:00:00Z'), 'UTC', 1);
    expect(week).toEqual({ windowStart: '2026-09-14', windowEnd: '2026-09-20' });
  });

  it('respects a Sunday week start and the workspace zone', () => {
    // Still Sunday 20 September in Los Angeles.
    const week = lastCompletedWeek(new Date('2026-09-21T03:00:00Z'), 'America/Los_Angeles', 0);
    expect(week).toEqual({ windowStart: '2026-09-13', windowEnd: '2026-09-19' });
  });
});
