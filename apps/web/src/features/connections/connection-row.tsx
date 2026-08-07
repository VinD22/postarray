'use client';

/**
 * One connected account.
 *
 * A row, not a card. Everything the specification asks for is on it: the exact
 * account and its type, who connected it and when, the permission and
 * capability summary, token health and expiry where the provider tells us, the
 * last successful post and analytics sync, any production or beta limitation,
 * and the four actions.
 *
 * The health line is never colour alone. It carries an icon, a word and, when
 * something is wrong, the specific remediation for that state rather than a
 * generic "reconnect".
 */

import { useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  Clock3,
  HelpCircle,
  MoreHorizontal,
  PauseCircle,
} from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FreshnessLabel,
  IconButton,
  Notice,
  cn,
} from '@relay/design-system';
import { formatCurrency } from '@relay/i18n';
import { useTranslations } from '@relay/i18n/react';
import { useCalendarFormat } from '@/features/calendar/format';
import { initialsOf } from '@/lib/utils/initials';
import type { ProviderId } from '@/lib/api/types';
import { AccountIdentity, ProviderMark, useAccountTypeName, useProviderName } from './provider';
import { healthTone, missingPermissionCount, remediationAction, remediationKey } from './health';
import { isPaused, needsAction, type ConnectionRow as Row } from './types';

const healthIcon: Record<ReturnType<typeof healthTone>, ReactNode> = {
  ok: <CheckCircle2 aria-hidden="true" className="text-success-fg size-4" />,
  warning: <AlertTriangle aria-hidden="true" className="text-warning-fg size-4" />,
  destructive: <CircleSlash aria-hidden="true" className="text-destructive-fg size-4" />,
  neutral: <PauseCircle aria-hidden="true" className="text-text-tertiary size-4" />,
};

/**
 * The provider's identity colour, reused here as a decorative inline-start
 * bar (the same technique as the calendar's entry chip). It is never the
 * only carrier of the platform: the avatar badge and `AccountIdentity`'s
 * text beside it already name the platform for assistive technology, so
 * this bar is `aria-hidden` and purely reinforces what they already say.
 */
const providerBarClass: Record<ProviderId, string> = {
  x: 'bg-brand-x',
  linkedin: 'bg-brand-linkedin',
  instagram: 'bg-brand-instagram',
  facebook: 'bg-brand-facebook',
  youtube: 'bg-brand-youtube',
  tiktok: 'bg-brand-tiktok',
  threads: 'bg-brand-threads',
  bluesky: 'bg-brand-bluesky',
  fake: 'bg-brand-fake',
  mastodon: 'bg-brand-mastodon',
  telegram: 'bg-brand-telegram',
  reddit: 'bg-brand-reddit',
  wordpress: 'bg-brand-wordpress',
  medium: 'bg-brand-medium',
  devto: 'bg-brand-devto',
  pinterest: 'bg-brand-pinterest',
  discord: 'bg-brand-discord',
  slack: 'bg-brand-slack',
};

export interface ConnectionRowProps {
  row: Row;
  groupName: string | null;
  detailHref: string;
  onReconnect: (row: Row) => void;
  onPause: (row: Row) => void;
  onResume: (row: Row) => void;
  onDisconnect: (row: Row) => void;
  onInspectPermissions: (row: Row) => void;
  onMoveGroup: (row: Row) => void;
}

export function ConnectionRow({
  row,
  groupName,
  detailHref,
  onReconnect,
  onPause,
  onResume,
  onDisconnect,
  onInspectPermissions,
  onMoveGroup,
}: ConnectionRowProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const accountTypeName = useAccountTypeName();
  const [expanded, setExpanded] = useState(false);

  const tone = healthTone(row.health);
  const action = remediationAction(row.health);
  const incidentKey = remediationKey(row.health, row.provider);
  const missingPermissions = missingPermissionCount(row);
  const limitations = row.limitations ?? [];

  return (
    <li
      className={cn(
        'border-border-subtle relative flex flex-col gap-3 border-b px-4 py-4 md:px-6',
        needsAction(row.health) && 'bg-warning-bg/40',
        isPaused(row.health) && 'bg-surface-sunken',
      )}
    >
      {/* The platform's identity colour as a decorative inline-start bar —
          the calendar entry chip's technique. Never the only carrier: the
          avatar's corner badge and `AccountIdentity`'s own text already
          name the platform for assistive technology. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-1 start-0.5 w-[3px] rounded-full',
          providerBarClass[row.provider],
        )}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar
            alt={row.displayName}
            src={row.avatarUrl ?? undefined}
            fallback={initialsOf(row.displayName)}
            badge={
              <ProviderMark
                provider={row.provider}
                labelledBySibling={false}
                name={providerName(row.provider)}
              />
            }
          />

          <div className="flex min-w-0 flex-col gap-1.5">
            <AccountIdentity
              provider={row.provider}
              accountLabel={row.displayName}
              secondary={row.handle ?? undefined}
              hideMark
            />

            <p className="text-body-sm text-text-secondary flex flex-wrap items-center gap-x-2 gap-y-1">
              <Badge tone="outline">{accountTypeName(row.accountType)}</Badge>
              {groupName ? <Badge tone="neutral">{groupName}</Badge> : null}
              {row.beta ? <Badge tone="warning">{t('web.connection.row.beta')}</Badge> : null}
              <span>
                {t('connection.connectedBy', {
                  name: row.connectedByName ?? t('common.unavailable'),
                  date: format.date(row.connectedAt),
                })}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {/* The needs-a-person action reads as a slab, not a quiet button:
              this is the one thing standing between the account and its
              scheduled posts. Several can be on screen at once because each
              names a different account, unlike a page-level primary action —
              see `attention-bar.tsx` for the aggregate-banner case, which
              deliberately keeps its own actions quiet for the same reason
              in reverse. */}
          {action === 'reconnect' ? (
            <Button variant="cta" size="sm" onClick={() => onReconnect(row)}>
              {t('action.reconnect')}
            </Button>
          ) : null}
          {action === 'resume' ? (
            <Button variant="cta" size="sm" onClick={() => onResume(row)}>
              {t('action.resume')}
            </Button>
          ) : null}
          <Button variant="secondary" size="sm" onClick={() => onInspectPermissions(row)}>
            {t('web.connection.action.inspect')}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                size="sm"
                variant="secondary"
                label={t('web.connection.action.menu', { account: row.displayName })}
                icon={<MoreHorizontal aria-hidden="true" />}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={detailHref}>{t('web.connection.action.viewCapabilities')}</a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onMoveGroup(row)}>
                {t('web.connection.action.moveGroup')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isPaused(row.health) ? (
                <DropdownMenuItem onSelect={() => onResume(row)}>
                  {t('action.resume')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => onPause(row)}>
                  {t('action.pause')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem destructive onSelect={() => onDisconnect(row)}>
                {t('action.disconnect')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Health, expiry, last successful post, last analytics sync. */}
      <div className="text-body-sm flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex',
              // A healthy row settles once, on mount, the same "just checked
              // and it is fine" pulse `ConnectionHealth` uses on Home. A row
              // that needs a person stays still: motion is reserved for good
              // news here, never for drawing the eye to a problem twice.
              tone === 'ok' && 'relay-dot-settle motion-reduce:animate-none',
            )}
          >
            {healthIcon[tone]}
          </span>
          <span
            className={cn(
              'font-medium',
              tone === 'destructive'
                ? 'text-destructive-fg'
                : tone === 'warning'
                  ? 'text-warning-fg'
                  : 'text-text-primary',
            )}
          >
            {t(`connection.status.${statusKey(row.health)}`, {
              relativeTime: row.expiresAt ? format.relative(row.expiresAt) : '',
            })}
          </span>
        </span>

        <span className="text-text-secondary">
          {row.expiresAt
            ? t('web.connection.health.expiresIn', {
                relativeTime: format.relative(row.expiresAt),
                date: format.date(row.expiresAt),
              })
            : t('web.connection.health.noExpiry', { provider: providerName(row.provider) })}
        </span>

        <span className="text-text-secondary">
          {row.lastPublishedAt
            ? t('connection.lastPublished', { relativeTime: format.relative(row.lastPublishedAt) })
            : t('connection.lastPublishedNever')}
        </span>

        {row.lastAnalyticsSyncAt ? (
          <FreshnessLabel
            level={analyticsFreshness(row.lastAnalyticsSyncAt)}
            text={t('connection.lastAnalyticsSync', {
              relativeTime: format.relative(row.lastAnalyticsSyncAt),
            })}
            isoTimestamp={row.lastAnalyticsSyncAt}
          />
        ) : (
          <span className="text-text-tertiary inline-flex items-center gap-1">
            <HelpCircle aria-hidden="true" className="size-3.5" />
            {t('common.unavailable')}
          </span>
        )}

        {row.perCreateMinor !== null && row.perCreateMinor !== undefined && row.currency ? (
          <span className="text-text-secondary inline-flex items-center gap-1">
            <Clock3 aria-hidden="true" className="size-3.5" />
            {t('web.connection.row.metered', {
              amount: formatCurrency(format.locale, row.perCreateMinor, row.currency),
            })}
          </span>
        ) : null}
      </div>

      {/* The incident, with the exact next step. */}
      {incidentKey ? (
        <Notice
          tone={tone === 'destructive' ? 'destructive' : 'warning'}
          title={t('web.connection.incident.title')}
          description={
            <span className="flex flex-col gap-1">
              <span>
                {t(incidentKey, {
                  provider: providerName(row.provider),
                  account: row.displayName,
                  permission:
                    (row.permissions ?? []).find((permission) => !permission.granted)?.scope ?? '',
                  date: row.expiresAt ? format.date(row.expiresAt) : '',
                })}
              </span>
              {row.scheduledPostCount ? (
                <span>
                  {t('web.connection.incident.scheduledOnHold', {
                    count: row.scheduledPostCount,
                  })}
                </span>
              ) : null}
              <span>{t('web.connection.incident.nothingLost')}</span>
            </span>
          }
          actions={
            action === 'reconnect' ? (
              <Button variant="secondary" size="sm" onClick={() => onReconnect(row)}>
                {t('action.reconnect')}
              </Button>
            ) : null
          }
        />
      ) : null}

      {/* Limitations and permission summary, behind a disclosure so a healthy
          list of twenty accounts stays scannable. */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
          className="text-body-sm text-text-accent self-start underline-offset-2 hover:underline"
        >
          {expanded
            ? t('web.connection.row.collapse', { account: row.displayName })
            : t('web.connection.row.expand', { account: row.displayName })}
        </button>

        {expanded ? (
          <div className="border-border-subtle bg-surface-sunken flex flex-col gap-3 rounded-md border p-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-label text-text-tertiary">
                {t('web.connection.row.limitationHeading')}
              </h3>
              {limitations.length === 0 ? (
                <p className="text-body-sm text-text-secondary">
                  {t('web.connection.row.noLimitations')}
                </p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {limitations.map((limitation) => (
                    <li
                      key={limitation.id}
                      className={cn(
                        'text-body-sm',
                        limitation.severity === 'warning'
                          ? 'text-warning-fg'
                          : 'text-text-secondary',
                      )}
                    >
                      {t(limitation.messageKey, {
                        provider: providerName(row.provider),
                        account: row.displayName,
                        ...limitation.values,
                      })}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-label text-text-tertiary">{t('connection.permissions.title')}</h3>
              {missingPermissions > 0 ? (
                <p className="text-body-sm text-warning-fg">
                  {t('web.connection.permissions.missingWarning', {
                    count: missingPermissions,
                  })}
                </p>
              ) : null}
              <ul className="flex flex-wrap gap-1.5">
                {(row.permissions ?? []).map((permission) => (
                  <li key={permission.scope}>
                    <Badge tone={permission.granted ? 'success' : 'warning'}>
                      {permission.scope}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
}

/** Catalog keys use `expiringSoon` and `permissionMissing`, not snake case. */
function statusKey(health: Row['health']): string {
  switch (health) {
    case 'expiring_soon':
      return 'expiringSoon';
    case 'permission_missing':
      return 'permissionMissing';
    case 'review_pending':
      return 'reviewPending';
    default:
      return health;
  }
}

function analyticsFreshness(syncedAt: string): 'fresh' | 'aging' | 'stale' {
  const ageMs = Date.now() - new Date(syncedAt).getTime();
  if (ageMs < 3 * 3_600_000) return 'fresh';
  if (ageMs < 12 * 3_600_000) return 'aging';
  return 'stale';
}
