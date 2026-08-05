import type { MessageKey } from '@relay/i18n/translate';

/**
 * The public status page data.
 *
 * This is a real page shell with a real shape, not an invented dashboard. No
 * surface is reported as healthy before it is carrying traffic: a surface that
 * is still being built reports `not_live`, which is a different sentence from
 * "operating normally" and is the only honest thing to say today.
 *
 * TODO(web): replace the static array with `api.health.get()` once the health
 * endpoint is deployed. The shape below matches its response so the page does
 * not need rewriting.
 */

export type StatusLevel =
  | 'operational'
  | 'degraded'
  | 'partial'
  | 'outage'
  | 'maintenance'
  | 'not_live';

export const STATUS_LEVEL_LABEL_KEY: Readonly<Record<StatusLevel, MessageKey>> = {
  operational: 'web.status.level.operational',
  degraded: 'web.status.level.degraded',
  partial: 'web.status.level.partial',
  outage: 'web.status.level.outage',
  maintenance: 'web.status.level.maintenance',
  not_live: 'web.status.level.notLive',
};

export interface StatusEntry {
  readonly id: string;
  readonly nameKey: MessageKey;
  readonly level: StatusLevel;
}

export interface Incident {
  readonly id: string;
  readonly title: string;
  readonly startedAt: string;
  readonly resolvedAt: string | null;
  readonly impact: string;
  readonly cause: string;
  readonly followUp: string;
}

export const STATUS_CHECKED_AT = '2026-08-04T09:00:00.000Z';

export const SURFACE_STATUS: readonly StatusEntry[] = [
  { id: 'web', nameKey: 'web.status.surface.web', level: 'not_live' },
  { id: 'api', nameKey: 'web.status.surface.api', level: 'not_live' },
  { id: 'mcp', nameKey: 'web.status.surface.mcp', level: 'not_live' },
  { id: 'cli', nameKey: 'web.status.surface.cli', level: 'not_live' },
  { id: 'webhooks', nameKey: 'web.status.surface.webhooks', level: 'not_live' },
  { id: 'publishing', nameKey: 'web.status.surface.publishing', level: 'not_live' },
  { id: 'media', nameKey: 'web.status.surface.media', level: 'not_live' },
  { id: 'analytics', nameKey: 'web.status.surface.analytics', level: 'not_live' },
  { id: 'links', nameKey: 'web.status.surface.links', level: 'not_live' },
  { id: 'checkout', nameKey: 'web.status.surface.checkout', level: 'not_live' },
];

/**
 * Incident history is deliberately empty. It fills from real events only.
 * Seeding it with a plausible looking outage would be a fabricated record.
 */
export const INCIDENTS: readonly Incident[] = [];
