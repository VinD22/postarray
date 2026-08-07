import { describe, expect, it } from 'vitest';

import { en } from '@relay/i18n';

import {
  ACTION_KIND_DEFINITIONS,
  formatActionItemValues,
  providerDotKey,
} from './action-center-catalog';

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

  it('formats service instants for people and preserves demo-ready relative text', () => {
    const item = {
      id: 'connection_expiring:conn_01',
      kind: 'connection_expiring' as const,
      urgency: 'soon' as const,
      category: 'connections' as const,
      subject: 'Example account',
      provider: 'linkedin' as const,
      createdAt: '2026-08-06T08:00:00.000Z',
      dueAt: '2026-08-08T08:00:00.000Z',
      snoozedUntil: null,
      href: '/connections/conn_01',
      values: { account: 'Example account', date: '2026-08-08T08:00:00.000Z' },
    };
    const format = {
      dateTime: (value: string) =>
        value.startsWith('2026-08-08') ? 'August 8, 2026 at 08:00' : value,
    };

    expect(formatActionItemValues(item, format, 'Unavailable')).toEqual({
      account: 'Example account',
      date: 'August 8, 2026 at 08:00',
    });
    expect(
      formatActionItemValues({ ...item, values: { ...item.values, date: 'in 2 days' } }, format, 'Unavailable'),
    ).toEqual({ account: 'Example account', date: 'in 2 days' });
    expect(
      formatActionItemValues({ ...item, values: { ...item.values, date: 'unavailable' } }, format, 'Unavailable'),
    ).toEqual({ account: 'Example account', date: 'Unavailable' });
  });
});
