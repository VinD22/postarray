'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@/components/link';
import {
  Button,
  RadioGroup,
  RadioGroupItem,
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
import { EmptyState, Notice, PageHeader } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { SettingsPanel, SettingsStack } from '../settings/components/section';
import { AsyncBoundary } from '../settings/lib/async-boundary';
import { billingGateway } from '../settings/lib/gateway';
import { useFormatters } from '../settings/lib/formatters';
import { settingsKey, useWorkspaceId } from '../settings/lib/keys';
import { useSettingsMutation } from '../settings/lib/use-settings-mutation';
import { CancelDialog } from './cancel-dialog';
import { TrialSummary } from './trial-summary';
import { UsagePanel } from './usage-panel';

export function BillingScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.billing');
  const formatters = useFormatters();
  const { announce } = useAnnouncer();
  const workspaceId = useWorkspaceId();
  const BILLING_KEY = settingsKey(workspaceId, 'billing');
  const USAGE_KEY = settingsKey(workspaceId, 'billing', 'usage');
  const INVOICES_KEY = settingsKey(workspaceId, 'billing', 'invoices');

  const billing = useQuery({ queryKey: BILLING_KEY, queryFn: () => billingGateway.state() });
  const usage = useQuery({ queryKey: USAGE_KEY, queryFn: () => billingGateway.usage() });
  const invoices = useQuery({ queryKey: INVOICES_KEY, queryFn: () => billingGateway.invoices() });

  const [cancelling, setCancelling] = useState(false);

  const openPortal = useSettingsMutation({
    section,
    mutationFn: async () => {
      const url = await billingGateway.portalLink();
      window.open(url, '_blank', 'noopener,noreferrer');
      return url;
    },
    successMessage: t('billing.subscription.portal'),
  });

  const startCheckout = useSettingsMutation({
    section,
    mutationFn: async (interval: 'monthly' | 'annual') => {
      const url = await billingGateway.checkout(interval);
      window.location.assign(url);
      return url;
    },
  });

  const state = billing.data;

  function chooseInterval(next: 'monthly' | 'annual'): void {
    announce(
      t('billing.ui.intervalChangedAnnouncement', {
        interval:
          next === 'annual'
            ? t('billing.plan.interval.annual')
            : t('billing.plan.interval.monthly'),
      }),
    );
    void startCheckout.run(next);
  }

  return (
    <>
      <PageHeader title={section} description={t('billing.ui.description')} />

      <SettingsStack>
        <AsyncBoundary
          section={section}
          isPending={billing.isPending}
          error={billing.error}
          onRetry={() => void billing.refetch()}
          skeletonRows={4}
          skeletonColumns={2}
        >
          {state === undefined ? null : state.status === 'none' || state.status === 'incomplete' ? (
            <EmptyState
              title={t('billing.ui.noSubscriptionTitle')}
              description={t('billing.ui.noSubscriptionBody')}
              example={t('billing.ui.noSubscriptionExample')}
              action={
                <Button
                  variant="primary"
                  loading={startCheckout.isSaving}
                  onClick={() => chooseInterval('monthly')}
                >
                  {t('action.upgrade')}
                </Button>
              }
            />
          ) : (
            <>
              <SettingsPanel
                title={t('billing.ui.statusHeading')}
                actions={
                  state.portalUrl === null ? null : (
                    <Button
                      variant="secondary"
                      loading={openPortal.isSaving}
                      onClick={() => void openPortal.run(undefined)}
                    >
                      {t('billing.subscription.portal')}
                    </Button>
                  )
                }
                footnote={t('billing.ui.portalHelp')}
              >
                <TrialSummary
                  state={state}
                  openingPortal={openPortal.isSaving}
                  onOpenPortal={() => void openPortal.run(undefined)}
                />
              </SettingsPanel>

              <SettingsPanel
                title={t('billing.ui.planHeading')}
                description={t('billing.plan.single')}
              >
                <ul className="text-body-md text-text-secondary flex max-w-[68ch] list-disc flex-col gap-1 ps-5">
                  <li>{t('billing.ui.allowanceChannels')}</li>
                  <li>{t('billing.plan.includes.members')}</li>
                  <li>{t('billing.plan.includes.posts')}</li>
                  <li>{t('billing.plan.includes.connectors')}</li>
                  <li>{t('billing.plan.includes.analytics')}</li>
                  <li>{t('billing.plan.includes.api')}</li>
                  <li>{t('billing.plan.includes.automation')}</li>
                  <li>{t('billing.plan.includes.ai')}</li>
                  <li>{t('billing.plan.includes.support')}</li>
                </ul>

                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-body-md text-text-secondary max-w-[68ch]">
                    {t('billing.ui.allowanceFairUse')}{' '}
                    <a
                      className="text-text-accent underline underline-offset-2"
                      href="/legal/fair-use"
                    >
                      {t('billing.ui.readFairUse')}
                    </a>
                  </p>
                  <p className="text-body-md text-text-secondary max-w-[68ch]">
                    {t('billing.ui.allowanceMetered')}
                  </p>
                  <p className="text-body-md text-text-secondary max-w-[68ch]">
                    {t('billing.ui.allowanceNoMedia')}
                  </p>
                </div>

                {state.activeChannels > state.channelAllowance ? (
                  <Notice
                    tone="warning"
                    title={t('billing.downgrade.overLimit', {
                      count: state.activeChannels - state.channelAllowance,
                    })}
                    actions={
                      <Button size="sm" variant="secondary" asChild>
                        <Link href="/connections">{t('billing.ui.overChannelLimitAction')}</Link>
                      </Button>
                    }
                  />
                ) : null}
              </SettingsPanel>

              <SettingsPanel
                title={t('billing.ui.intervalHeading')}
                description={t('billing.ui.intervalChangeHelp')}
              >
                <RadioGroup
                  value={state.interval ?? 'monthly'}
                  onValueChange={(value) =>
                    chooseInterval(value === 'annual' ? 'annual' : 'monthly')
                  }
                  className="flex flex-col"
                >
                  <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
                    <RadioGroupItem className="mt-1" value="monthly" />
                    <span className="flex flex-col">
                      <span>{t('billing.ui.monthlyOption')}</span>
                    </span>
                  </label>
                  <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
                    <RadioGroupItem className="mt-1" value="annual" />
                    <span className="flex flex-col">
                      <span>{t('billing.ui.annualOption')}</span>
                      <span className="text-body-sm text-text-secondary">
                        {t('billing.ui.annualFraming')}
                      </span>
                    </span>
                  </label>
                </RadioGroup>
              </SettingsPanel>

              <SettingsPanel
                title={t('billing.ui.usageHeading')}
                actions={
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/docs/billing/metered-usage">{t('billing.ui.readMeteredPolicy')}</a>
                  </Button>
                }
              >
                <AsyncBoundary
                  section={t('billing.ui.usageHeading')}
                  isPending={usage.isPending}
                  error={usage.error}
                  onRetry={() => void usage.refetch()}
                >
                  {usage.data === undefined ? null : <UsagePanel usage={usage.data} />}
                </AsyncBoundary>
              </SettingsPanel>

              <SettingsPanel
                title={t('billing.ui.invoicesHeading')}
                footnote={t('billing.ui.invoicesInPortal')}
              >
                <AsyncBoundary
                  section={t('billing.ui.invoicesHeading')}
                  isPending={invoices.isPending}
                  error={invoices.error}
                  onRetry={() => void invoices.refetch()}
                >
                  {(invoices.data ?? []).length === 0 ? (
                    <p className="text-body-md text-text-secondary">
                      {t('billing.ui.invoicesEmpty')}
                    </p>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableCaption className="sr-only">
                          {t('billing.ui.invoicesCaption')}
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead scope="col">{t('billing.ui.invoiceColumn.date')}</TableHead>
                            <TableHead scope="col">
                              {t('billing.ui.invoiceColumn.description')}
                            </TableHead>
                            <TableHead scope="col" numeric>
                              {t('billing.ui.invoiceColumn.amount')}
                            </TableHead>
                            <TableHead scope="col">{t('billing.ui.invoiceColumn.state')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(invoices.data ?? []).map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableRowHeader className="whitespace-nowrap">
                                {formatters.date(invoice.issuedAt)}
                              </TableRowHeader>
                              <TableCell>
                                {invoice.url === null ? (
                                  invoice.description
                                ) : (
                                  <a
                                    className="text-text-accent underline underline-offset-2"
                                    href={invoice.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    {invoice.description}
                                    <span className="sr-only">{t('a11y.label.externalLink')}</span>
                                  </a>
                                )}
                              </TableCell>
                              <TableCell numeric>{formatters.money(invoice.amount)}</TableCell>
                              <TableCell>{t(`billing.ui.invoiceState.${invoice.state}`)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </AsyncBoundary>
              </SettingsPanel>

              <SettingsPanel
                title={t('billing.ui.cancelHeading')}
                description={t('billing.ui.cancelBody')}
              >
                {state.canceledAt === null ? (
                  <div>
                    <Button variant="secondary" onClick={() => setCancelling(true)}>
                      {t('billing.ui.cancelStart')}
                    </Button>
                  </div>
                ) : (
                  <Notice
                    tone="neutral"
                    liveness="status"
                    title={
                      state.status === 'trialing'
                        ? t('billing.ui.cancelConfirmedBeforeConversion')
                        : state.accessUntil === null
                          ? t('billing.ui.canceledNotice')
                          : t('billing.ui.cancelConfirmedAfterConversion', {
                              date: formatters.exactDate(state.accessUntil),
                            })
                    }
                    description={t('billing.cancel.keepData')}
                    actions={
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={openPortal.isSaving}
                        onClick={() => void openPortal.run(undefined)}
                      >
                        {t('billing.ui.resume')}
                      </Button>
                    }
                  />
                )}
              </SettingsPanel>
            </>
          )}
        </AsyncBoundary>
      </SettingsStack>

      {state === undefined ? null : (
        <CancelDialog
          open={cancelling}
          onOpenChange={setCancelling}
          state={state}
          onConfirm={() => {
            setCancelling(false);
            announce(t('billing.ui.cancelAnnouncement'));
            void openPortal.run(undefined);
          }}
        />
      )}
    </>
  );
}
