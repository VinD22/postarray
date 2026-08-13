import { formatDateTime, formatTime, formatTimeZoneLabel } from '@relay/i18n';
import type { Translator } from '@relay/i18n/translate';

import type { ProviderId } from '@/lib/api/types';

import {
  DEMO_CHECKS,
  DEMO_DIGEST_LINE_KEYS,
  DEMO_SCHEDULED_AT,
  DEMO_TIME_ZONE,
  DEMO_VARIANTS,
  DEMO_WEEKDAYS,
} from './sample';

/**
 * The demonstration, resolved once on the server.
 *
 * Every panel below takes finished strings rather than message keys. Two
 * reasons: the animated hero panel is a client component and this keeps the
 * catalog on the server where it belongs, and a panel that cannot look a
 * string up cannot quietly invent one.
 *
 * Times are formatted with an explicit locale and an explicit IANA zone, which
 * is the same rule the product itself follows. A demonstration that rendered a
 * schedule in the build machine's zone would be teaching the one mistake this
 * product exists to prevent.
 */

export interface DemoVariantView {
  readonly id: string;
  readonly provider: ProviderId;
  readonly account: string;
  readonly body: string;
  readonly check: string;
  /** Local wall clock time in the project zone, for example "09:15". */
  readonly time: string;
  readonly weekday: number;
}

export interface DemoWeekdayView {
  readonly weekday: number;
  readonly name: string;
  readonly entries: readonly DemoVariantView[];
}

export interface DemoCheckView {
  readonly id: string;
  /** What the check is called, in the composer's own words. */
  readonly label: string;
  /** What it measures, so a tick is never a bare green mark. */
  readonly detail: string;
}

export interface DemoContent {
  readonly project: string;
  /** Human readable zone label with its offset, never a bare IANA identifier. */
  readonly zoneLabel: string;
  readonly master: string;
  readonly variants: readonly DemoVariantView[];
  readonly week: readonly DemoWeekdayView[];
  /** The first version's date and time, already formatted in the project zone. */
  readonly scheduledAt: string;
  readonly author: string;
  readonly approver: string;
  readonly policy: string;
  /** The three checks the composer genuinely runs. Never an invented fourth. */
  readonly checks: readonly DemoCheckView[];
  /**
   * The digest, as sentences about what the product did.
   *
   * Deliberately never a number: no post in this sample has published, so any
   * engagement figure here would be fabricated. Sentences describe behaviour
   * the demonstration actually shows, which is the honest half of a digest.
   */
  readonly digest: readonly string[];
}

export function demoContent(t: Translator, locale: string): DemoContent {
  const zoneLabel = formatTimeZoneLabel(locale, DEMO_TIME_ZONE, { at: DEMO_SCHEDULED_AT });

  const variants: readonly DemoVariantView[] = DEMO_VARIANTS.map((variant) => ({
    id: variant.id,
    provider: variant.provider,
    account: t.format(variant.accountKey),
    body: t.format(variant.bodyKey),
    check: t.format(variant.checkKey),
    time: formatTime(locale, variant.at, { timeZone: DEMO_TIME_ZONE }),
    weekday: variant.weekday,
  }));

  const week: readonly DemoWeekdayView[] = DEMO_WEEKDAYS.map((weekday) => ({
    weekday,
    name: t.format(`queue.weekday.${weekday}`),
    entries: variants.filter((variant) => variant.weekday === weekday),
  }));

  return {
    project: t.t('web.demo.sample.project'),
    zoneLabel,
    master: t.t('web.demo.sample.master'),
    variants,
    week,
    scheduledAt: formatDateTime(locale, DEMO_SCHEDULED_AT, {
      timeZone: DEMO_TIME_ZONE,
      dateStyle: 'full',
    }),
    author: t.t('web.demo.sample.actor'),
    approver: t.t('web.demo.sample.approver'),
    policy: t.t('web.demo.sample.policy'),
    checks: DEMO_CHECKS.map((check) => ({
      id: check.id,
      label: t.format(check.labelKey),
      detail: t.format(check.detailKey),
    })),
    digest: DEMO_DIGEST_LINE_KEYS.map((key) => t.format(key)),
  };
}
