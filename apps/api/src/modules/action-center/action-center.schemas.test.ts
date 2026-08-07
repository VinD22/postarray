import { describe, expect, it } from 'vitest';

import { actionCenterQuerySchema, snoozeActionSchema } from './action-center.schemas';

describe('action center schemas', () => {
  it('does not coerce the false query string to true', () => {
    expect(actionCenterQuerySchema.parse({ includeSnoozed: 'false' }).includeSnoozed).toBe(false);
    expect(actionCenterQuerySchema.parse({ includeSnoozed: 'true' }).includeSnoozed).toBe(true);
  });

  it('requires an offset-qualified snooze instant', () => {
    expect(snoozeActionSchema.safeParse({ until: '2026-08-07T10:00:00+05:30' }).success).toBe(true);
    expect(snoozeActionSchema.safeParse({ until: '2026-08-07T10:00:00' }).success).toBe(false);
  });
});
