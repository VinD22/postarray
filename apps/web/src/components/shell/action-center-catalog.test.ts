import { describe, expect, it } from 'vitest';

import { en } from '@relay/i18n';

import { ACTION_KIND_DEFINITIONS, providerDotKey } from './action-center-catalog';

const KINDS = Object.keys(ACTION_KIND_DEFINITIONS);

describe('action center catalogue', () => {
  it('covers all eleven queue types from the product behaviour research', () => {
    expect(KINDS).toHaveLength(11);
    expect(KINDS).toEqual(
      expect.arrayContaining([
        'connection_expiring',
        'connection_action_required',
        'validation_failed',
        'approval_overdue',
        'schedule_conflict',
        'provider_incident',
        'comment_failed',
        'analytics_stale',
        'rss_stalled',
        'webhook_failing',
        'usage_balance',
      ]),
    );
  });

  it('gives every kind a real catalog sentence and a real verb', () => {
    for (const [kind, definition] of Object.entries(ACTION_KIND_DEFINITIONS)) {
      expect(definition.messageKey, `${kind} message`).toSatisfy((key: string) => key in en);
      expect(definition.actionKey, `${kind} action`).toSatisfy((key: string) => key in en);
    }
  });

  it('never ends a row in a vague verb', () => {
    const vague = ['View', 'Details', 'More', 'Open'];
    for (const definition of Object.values(ACTION_KIND_DEFINITIONS)) {
      const label = (en as Record<string, string>)[definition.actionKey] ?? '';
      expect(vague).not.toContain(label);
    }
  });

  it('only returns an identity dot for a provider the design system has a colour for', () => {
    expect(providerDotKey('linkedin')).toBe('linkedin');
    expect(providerDotKey(null)).toBeUndefined();
    expect(providerDotKey('fake')).toBeUndefined();
  });
});
