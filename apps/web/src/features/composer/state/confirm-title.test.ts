import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n/messages';

import { confirmTitleKey } from './confirm-title';

describe('confirmTitleKey', () => {
  it('says publishing when there is no scheduled time', () => {
    expect(en[confirmTitleKey(null)]).toBe('Confirm before publishing');
  });

  it('says scheduling when a time is set', () => {
    expect(en[confirmTitleKey('2026-10-01T09:00:00Z')]).toBe('Confirm before scheduling');
  });
});
