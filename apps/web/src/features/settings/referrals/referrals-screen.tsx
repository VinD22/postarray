'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';
import { EmptyState, MetricValue, Notice, PageHeader } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

import { Sticker } from '@/features/marketing/components/loud/sticker';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

import { AsyncBoundary } from '../lib/async-boundary';
import { billingGateway } from '../lib/gateway';
import { useFormatters } from '../lib/formatters';
import { settingsKey, useWorkspaceId } from '../lib/keys';
import { SettingsPanel, SettingsStack } from '../components/section';

/** How long the "Copied" confirmation stays up before it reverts. */
const COPIED_VISIBLE_MS = 1500;

const STATE_KEYS = {
  pending: 'billing.referral.commissionPending',
  approved: 'billing.referral.commissionApproved',
  reversed: 'billing.referral.commissionReversed',
} as const;

export function ReferralsScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.referrals');
  const formatters = useFormatters();
  const { announce } = useAnnouncer();
  const workspaceId = useWorkspaceId();
  const REFERRAL_KEY = settingsKey(workspaceId, 'referrals');

  const referral = useQuery({ queryKey: REFERRAL_KEY, queryFn: () => billingGateway.referral() });
  const [copyFailed, setCopyFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const motionOk = useMotionOk();
  const copiedTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current);
      }
    },
    [],
  );

  const data = referral.data;

  async function copyLink(): Promise<void> {
    if (data === undefined) {
      return;
    }
    try {
      await navigator.clipboard.writeText(data.link);
      setCopyFailed(false);
      announce(t('a11y.announce.copiedToClipboard'));
      // The referral link is the one playful moment WP-11 allows on an
      // otherwise calm settings surface: the button's own label
      // check-morphs and a "Copied" `Sticker` pops in beside it for a
      // beat, then both revert — the same transient, self-clearing
      // confirmation pattern as the composer's `Mod+s` "Saved" flash.
      setCopied(true);
      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current);
      }
      copiedTimer.current = window.setTimeout(() => {
        setCopied(false);
        copiedTimer.current = null;
      }, COPIED_VISIBLE_MS);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <>
      <PageHeader title={section} description={t('settings.ui.referral.description')} />

      <SettingsStack>
        <AsyncBoundary
          section={section}
          isPending={referral.isPending}
          error={referral.error}
          onRetry={() => void referral.refetch()}
          skeletonRows={4}
        >
          {data === undefined ? null : (
            <>
              <Notice
                tone="neutral"
                title={t('billing.referral.disclosure')}
                description={t('billing.referral.payout', { schedule: data.payoutSchedule })}
                actions={
                  <Button variant="ghost" size="sm" asChild>
                    <a href={data.termsUrl} target="_blank" rel="noreferrer noopener">
                      {t('settings.ui.referral.termsLink')}
                      <span className="sr-only">{t('a11y.label.externalLink')}</span>
                    </a>
                  </Button>
                }
              />

              <SettingsPanel title={t('settings.ui.referral.linkLabel')}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    readOnly
                    value={data.link}
                    aria-label={t('settings.ui.referral.linkLabel')}
                    className="font-mono sm:max-w-lg"
                  />
                  <Button variant="secondary" onClick={() => void copyLink()}>
                    {copied ? (
                      <span
                        className={cn(
                          'flex items-center gap-2',
                          motionOk && 'relay-pop-in',
                        )}
                      >
                        <Check aria-hidden="true" className="size-4" />
                        {t('settings.ui.referral.linkCopied')}
                      </span>
                    ) : (
                      t('action.copyLink')
                    )}
                  </Button>
                  {copied ? (
                    // Purely decorative: `announce()` above already puts the
                    // "copied" fact in the accessible live region, so this
                    // visual echo does not get a second one.
                    <Sticker
                      tone="cta"
                      ariaHidden
                      className={motionOk ? 'relay-pop-in' : undefined}
                    >
                      {t('settings.ui.referral.linkCopied')}
                    </Sticker>
                  ) : null}
                </div>
                {copyFailed ? (
                  <p className="text-body-sm text-warning-fg">{t('settings.ui.copyFailed')}</p>
                ) : null}
              </SettingsPanel>

              <SettingsPanel title={t('settings.ui.referral.balance')}>
                <MetricValue
                  label={t('settings.ui.referral.balance')}
                  availability={data.approvedTotal === null ? 'pending' : 'available'}
                  value={
                    data.approvedTotal === null ? undefined : formatters.money(data.approvedTotal)
                  }
                  unavailableText={t('common.unavailable')}
                  reason={
                    data.approvedTotal === null
                      ? t('settings.ui.referral.balanceUnavailableReason')
                      : undefined
                  }
                  size="lg"
                />
              </SettingsPanel>

              <SettingsPanel
                title={t('billing.referral.attributed', { count: data.signups.length })}
              >
                {data.signups.length === 0 ? (
                  <EmptyState
                    compact
                    title={t('settings.ui.referral.emptyTitle')}
                    description={t('settings.ui.referral.emptyBody')}
                    example={t('settings.ui.referral.emptyExample')}
                  />
                ) : (
                  <TableContainer>
                    <Table>
                      <TableCaption className="sr-only">
                        {t('settings.ui.referral.tableCaption')}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead scope="col">
                            {t('settings.ui.referral.column.signup')}
                          </TableHead>
                          <TableHead scope="col">{t('settings.ui.referral.column.date')}</TableHead>
                          <TableHead scope="col">
                            {t('settings.ui.referral.column.state')}
                          </TableHead>
                          <TableHead scope="col" numeric>
                            {t('settings.ui.referral.column.amount')}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.signups.map((signup) => (
                          <TableRow key={signup.id}>
                            <TableRowHeader>{signup.label}</TableRowHeader>
                            <TableCell>{formatters.date(signup.startedAt)}</TableCell>
                            <TableCell>{t(STATE_KEYS[signup.state])}</TableCell>
                            <TableCell numeric>
                              {signup.amount === null
                                ? t('common.unavailable')
                                : formatters.money(signup.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </SettingsPanel>
            </>
          )}
        </AsyncBoundary>
      </SettingsStack>
    </>
  );
}
