import type { MessageKey } from '@relay/i18n/translate';

import type { ProviderId } from '@/lib/api/types';

/**
 * The sample content the demonstration is filled with.
 *
 * Three rules hold over everything in this file.
 *
 * 1. It is obviously sample content. The company does not exist, its handles
 *    sit on the reserved `.example` domain, and the frame every panel renders
 *    inside says so in words a screen reader reads with the panel.
 * 2. There is not a single engagement number here, and there is nowhere to put
 *    one. No follower count, no reach figure, no score. The design system
 *    forbids a fabricated dashboard and this is exactly where one would grow.
 * 3. Every instant is a fixed literal, never `new Date()`. The marketing site
 *    is prerendered and served from cache, so a demonstration whose times
 *    depended on render time would show a different week to two readers and a
 *    stale one to everybody after the first day.
 *
 * Platform names come from the catalog and the identity dots from the product's
 * own `ProviderMark`, so the only branding on screen is the platform's own
 * name in text. There is no third party logo anywhere in the demonstration.
 */

/** The zone the sample project keeps. Every time below is read in it. */
export const DEMO_TIME_ZONE = 'Europe/Berlin';

/** The Monday the sample week starts on, as an ISO instant. */
export const DEMO_WEEK_START = '2026-09-14T00:00:00Z';

/** ISO weekday numbers, Monday first, matching the `queue.weekday.*` keys. */
export const DEMO_WEEKDAYS = [1, 2, 3, 4, 5] as const;

export interface DemoVariantSample {
  readonly id: string;
  readonly provider: ProviderId;
  readonly accountKey: MessageKey;
  readonly bodyKey: MessageKey;
  readonly checkKey: MessageKey;
  /** The instant this version is scheduled for. Fixed, never computed. */
  readonly at: string;
  /** ISO weekday of `at` in `DEMO_TIME_ZONE`, so the week strip needs no date maths. */
  readonly weekday: number;
}

/**
 * Three accounts, not ten. The point being demonstrated is that one draft
 * becomes several platform-native versions, and three of them make that point
 * while still fitting beside a headline on a phone.
 */
export const DEMO_VARIANTS: readonly DemoVariantSample[] = [
  {
    id: 'x',
    provider: 'x',
    accountKey: 'web.demo.sample.x.account',
    bodyKey: 'web.demo.sample.x.body',
    checkKey: 'web.demo.sample.x.check',
    at: '2026-09-15T07:15:00Z',
    weekday: 2,
  },
  {
    id: 'linkedin',
    provider: 'linkedin',
    accountKey: 'web.demo.sample.linkedin.account',
    bodyKey: 'web.demo.sample.linkedin.body',
    checkKey: 'web.demo.sample.linkedin.check',
    at: '2026-09-15T11:00:00Z',
    weekday: 2,
  },
  {
    id: 'instagram',
    provider: 'instagram',
    accountKey: 'web.demo.sample.instagram.account',
    bodyKey: 'web.demo.sample.instagram.body',
    checkKey: 'web.demo.sample.instagram.check',
    at: '2026-09-16T15:30:00Z',
    weekday: 3,
  },
];

/** The instant the whole set is scheduled from: the first version's time. */
export const DEMO_SCHEDULED_AT = DEMO_VARIANTS[0]?.at ?? '2026-09-15T07:15:00Z';
