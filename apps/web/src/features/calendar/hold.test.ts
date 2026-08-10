import { describe, expect, it } from 'vitest';

import {
  PAUSABLE_STATES,
  canPause,
  holdControlFor,
  pauseRefusal,
  refusalMessageKey,
  resumeNeedsNewTime,
  type PublishHoldView,
} from './hold';

const NOW = new Date('2026-06-05T10:00:00.000Z');

function hold(reason: PublishHoldView['reason']): PublishHoldView {
  return { reason, since: '2026-06-05T09:00:00.000Z', byUserId: 'user_1' };
}

describe('what the sheet offers', () => {
  it.each(PAUSABLE_STATES)('offers a pause on a %s entry', (state) => {
    expect(holdControlFor({ state, hold: null })).toBe('pause');
    expect(canPause(state)).toBe(true);
  });

  it.each(['published', 'partially_published', 'deleted_externally'] as const)(
    'offers nothing on a %s entry, because a pause retracts nothing',
    (state) => {
      expect(holdControlFor({ state, hold: null })).toBe('none');
      expect(pauseRefusal(state)).toBe('already_published');
    },
  );

  it.each(['preparing_media', 'dispatching', 'provider_processing'] as const)(
    'offers nothing on a %s entry, because it is already in flight',
    (state) => {
      expect(holdControlFor({ state, hold: null })).toBe('none');
      expect(pauseRefusal(state)).toBe('in_flight');
    },
  );

  it('offers a resume on an entry a person paused', () => {
    expect(holdControlFor({ state: 'scheduled', hold: hold('user') })).toBe('resume');
  });

  it('never offers a resume on a billing hold', () => {
    expect(holdControlFor({ state: 'scheduled', hold: hold('billing') })).toBe('billing');
  });

  it('keeps the billing outcome even on a state that would otherwise be pausable', () => {
    expect(holdControlFor({ state: 'approved', hold: hold('billing') })).toBe('billing');
  });
});

describe('resuming', () => {
  it('needs no new time while the instant is still ahead', () => {
    expect(resumeNeedsNewTime('2026-06-05T12:00:00.000Z', NOW)).toBe(false);
  });

  it('needs a new time once the instant has passed', () => {
    expect(resumeNeedsNewTime('2026-06-05T09:00:00.000Z', NOW)).toBe(true);
  });

  it('treats the exact instant as passed, so nothing goes out on the boundary', () => {
    expect(resumeNeedsNewTime('2026-06-05T10:00:00.000Z', NOW)).toBe(true);
  });

  it('asks for a new time rather than guessing when the instant is unreadable', () => {
    expect(resumeNeedsNewTime('not a date', NOW)).toBe(true);
  });
});

describe('server refusals', () => {
  it('maps the refusals this screen has copy for', () => {
    expect(refusalMessageKey('errors.job_paused_by_billing')).toBe(
      'calendar.hold.blocked.billing',
    );
    expect(refusalMessageKey('errors.job_already_published')).toBe(
      'calendar.hold.blocked.published',
    );
    expect(refusalMessageKey('errors.resume_requires_new_time')).toBe(
      'calendar.hold.resumeMissedBody',
    );
  });

  it('falls through for anything it does not recognise, rather than guessing a key', () => {
    expect(refusalMessageKey('errors.something_new')).toBeNull();
    expect(refusalMessageKey(undefined)).toBeNull();
  });
});
