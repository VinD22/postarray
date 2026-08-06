'use client';

/**
 * The post page and its publication receipt.
 *
 * This is the screen that has to be right. A person opens it after something
 * went wrong, or before they sign off on something that went well, and in
 * both cases they need a document rather than a dashboard: what was published,
 * where, when, on whose approval, from which surface, at what cost, and what
 * every attempt did.
 *
 * The one rule that shapes everything below: a campaign whose targets diverged
 * is `Partially published`. It lists the external posts that already exist, it
 * never claims a total failure, and it never offers an action that would
 * republish a target that already succeeded.
 */

import { useMemo, type ReactNode } from 'react';
import { Download, ExternalLink, Printer, RefreshCw } from 'lucide-react';
import {
  Badge,
  Button,
  Code,
  DefinitionList,
  EmptyState,
  ErrorState,
  FreshnessLabel,
  LoadingState,
  Notice,
  OfflineBanner,
  PageHeader,
  PartialSuccessNotice,
  PermissionDenied,
  SkeletonList,
  SkeletonText,
  StatusPill,
  cn,
} from '@relay/design-system';
import { formatCurrency } from '@relay/i18n';
import { useTranslations } from '@relay/i18n/react';
import { ApiError } from '@/lib/api/error';
import { useCalendarFormat } from '@/features/calendar/format';
import {
  AccountIdentity,
  useAccountTypeName,
  useProviderName,
} from '@/features/connections/provider';
import { ReceiptAttempts } from './receipt-attempts';
import { ReceiptItems } from './receipt-items';
import { ReceiptTimeline } from './receipt-timeline';
import { buildTimeline, dispatchLatencyMs } from './timeline-model';
import { usePostDetail, useRetryTarget } from './use-receipt';
import { buildCampaignTargets, campaignOutcome, canExportReceipt } from './types';
import type { CampaignTargetView, PostDetail } from './types';

export interface ReceiptScreenProps {
  contentItemId: string;
  calendarHref: string;
}

export function ReceiptScreen({ contentItemId, calendarHref }: ReceiptScreenProps): ReactNode {
  const t = useTranslations();
  const query = usePostDetail(contentItemId);

  if (query.isPending) {
    return (
      <LoadingState label={t('web.receipt.loading')} className="px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6">
          <SkeletonText lines={2} />
          <SkeletonList rows={6} avatar={false} />
        </div>
      </LoadingState>
    );
  }

  if (query.isError) {
    const error = ApiError.is(query.error) ? query.error : null;

    if (error?.isOffline) {
      return (
        <div className="px-4 py-6 md:px-6">
          <OfflineBanner
            title={t('web.calendar.offline.title')}
            description={t('web.calendar.offline.body')}
            actions={
              <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
                {t('action.refresh')}
              </Button>
            }
          />
        </div>
      );
    }

    if (error?.isAuthorization) {
      return (
        <div className="px-4 py-6 md:px-6">
          <PermissionDenied
            title={t('permission.denied.title')}
            description={t('web.receipt.export.denied', {
              role: String(error.details.currentRole ?? t('common.unknown')),
            })}
          />
        </div>
      );
    }

    if (error?.code === 'NOT_FOUND') {
      return (
        <div className="px-4 py-6 md:px-6">
          <EmptyState
            title={t('web.receipt.notFound.title')}
            description={t('web.receipt.notFound.body')}
            action={
              <Button variant="secondary" asChild>
                <a href={calendarHref}>{t('calendar.title')}</a>
              </Button>
            }
          />
        </div>
      );
    }

    return (
      <div className="px-4 py-6 md:px-6">
        <ErrorState
          title={t('web.receipt.error.title')}
          description={t('web.receipt.error.body')}
          onRetry={() => void query.refetch()}
          retryLabel={t('action.retry')}
          retrying={query.isFetching}
          {...(error?.correlationId
            ? { reference: { label: t('receipt.correlationId'), value: error.correlationId } }
            : {})}
        />
      </div>
    );
  }

  return <PostDocument detail={query.data} calendarHref={calendarHref} />;
}

/* ------------------------------------------------------------------------- */

function PostDocument({
  detail,
  calendarHref,
}: {
  detail: PostDetail;
  calendarHref: string;
}): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const accountTypeName = useAccountTypeName();
  const retry = useRetryTarget();

  const { receipt, job, item } = detail;
  const targets = useMemo(
    () => buildCampaignTargets(item.targets, detail.receiptSummaries),
    [item.targets, detail.receiptSummaries],
  );
  const outcome = campaignOutcome(targets);
  const isCampaign = targets.length > 1;
  const exportAllowed = canExportReceipt(detail.viewerRole);
  const title = item.title.trim() || t('web.calendar.entry.untitled');
  const accountLabel =
    receipt === null
      ? (item.targets[0]?.accountLabel ?? '')
      : (targets.find((target) => target.receiptId === receipt.id)?.accountLabel ??
        item.targets[0]?.accountLabel ??
        '');

  const steps = useMemo(() => {
    if (!receipt) return [];
    return buildTimeline({
      receipt,
      provider: providerName(receipt.provider),
      createdByName: item.createdByName,
      approverName: detail.approverName,
      preparedMediaCount: null,
      analyticsSyncedAt: receipt.lastAnalyticsSyncAt,
      idempotencyKey: job?.idempotencyKey ?? null,
    });
  }, [receipt, providerName, item.createdByName, detail.approverName, job]);

  // The roll-up wins over a single target's state, because a campaign with one
  // failed target is partially published even when the receipt on screen is a
  // success. Never label the whole thing by the target you happen to be on.
  const state =
    isCampaign && outcome === 'partially_published'
      ? ('partially_published' as const)
      : (receipt?.root.state ?? job?.state ?? item.state);

  return (
    <article className="flex min-h-full flex-col">
      <PageHeader
        breadcrumb={{
          label: t('a11y.region.navigation'),
          items: [
            { id: 'calendar', label: t('web.receipt.breadcrumb.calendar'), href: calendarHref },
            { id: 'post', label: title },
          ],
        }}
        title={title}
        description={t('receipt.subtitle')}
        actions={
          receipt ? (
            <ExportControls allowed={exportAllowed} role={detail.viewerRole} receipt={receipt} />
          ) : null
        }
      />

      <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
        {/* ---- What happened -------------------------------------------- */}
        <section aria-labelledby="receipt-summary" className="flex flex-col gap-3">
          <SectionHeading id="receipt-summary">{t('web.receipt.section.summary')}</SectionHeading>

          <div className="flex flex-wrap items-center gap-3">
            <StatusPill state={state} label={t(`state.${state}.label`)} showActivity />
            {receipt ? (
              <AccountIdentity
                provider={receipt.provider}
                accountLabel={accountLabel}
                secondary={accountTypeName(receipt.accountType)}
              />
            ) : null}
          </div>

          {isCampaign && outcome === 'partially_published' ? (
            // The 2px warning border lives here, outside the primitive, for
            // the same reason `attention-bar.tsx` keeps its own emphasis
            // outside `Notice`: this is the single most consequential state
            // in the publishing flow, and it earns the loud poster outline
            // that `Notice` deliberately does not carry everywhere else.
            <div className="border-warning-border overflow-hidden rounded-lg border-2">
              <PartialSuccess
                targets={targets}
                onRetry={retry}
                jobId={receipt?.publishJobId ?? job?.id ?? null}
              />
            </div>
          ) : null}

          {!receipt ? (
            <Notice
              tone="info"
              title={t('web.receipt.notFound.title')}
              description={t('web.receipt.notFound.body')}
            />
          ) : null}
        </section>

        {receipt ? (
          <>
            {/* ---- Timeline ---------------------------------------------- */}
            <section aria-labelledby="receipt-timeline" className="flex flex-col gap-3">
              <SectionHeading id="receipt-timeline">
                {t('web.receipt.section.timeline')}
              </SectionHeading>
              <p className="text-body-sm text-text-secondary">
                {t('receipt.times.latency', {
                  duration: format.duration(Math.abs(dispatchLatencyMs(receipt))),
                })}
              </p>
              <ReceiptTimeline steps={steps} provider={providerName(receipt.provider)} />
            </section>

            {/* ---- Root and follow up items ------------------------------ */}
            <section aria-labelledby="receipt-items" className="flex flex-col gap-3">
              <SectionHeading id="receipt-items">{t('web.receipt.section.items')}</SectionHeading>
              <ReceiptItems receipt={receipt} provider={providerName(receipt.provider)} />
            </section>

            {/* ---- Attempts ---------------------------------------------- */}
            <section aria-labelledby="receipt-attempts" className="flex flex-col gap-3">
              <SectionHeading id="receipt-attempts">
                {t('web.receipt.section.attempts')}
              </SectionHeading>
              <ReceiptAttempts receipt={receipt} provider={providerName(receipt.provider)} />
            </section>

            {/* ---- Provenance -------------------------------------------- */}
            <section aria-labelledby="receipt-provenance" className="flex flex-col gap-3">
              <SectionHeading id="receipt-provenance">
                {t('web.receipt.section.provenance')}
              </SectionHeading>
              <DefinitionList
                layout="responsive"
                items={[
                  {
                    id: 'surface',
                    term: <Term>{t('receipt.surface.label')}</Term>,
                    definition: t(`receipt.surface.${surfaceKey(receipt.creationSurface)}`),
                  },
                  {
                    id: 'author',
                    term: <Term>{t('common.createdBy')}</Term>,
                    definition: item.createdByName,
                    hint: t('common.createdOn', { date: format.date(item.createdAt) }),
                  },
                  {
                    id: 'version',
                    term: <Term>{t('receipt.contentVersion')}</Term>,
                    definition: <Code>{receipt.contentVersionId}</Code>,
                  },
                  {
                    id: 'checksum',
                    term: <Term>{t('receipt.contentHash')}</Term>,
                    definition: <Code className="break-all">{receipt.contentVersionChecksum}</Code>,
                  },
                  {
                    id: 'capability',
                    term: <Term>{t('web.receipt.provenance.capabilityVersion')}</Term>,
                    definition: <Code>{receipt.capabilityVersion}</Code>,
                    hint: t('web.receipt.provenance.capabilityHint'),
                  },
                  {
                    id: 'idempotency',
                    term: <Term>{t('receipt.idempotencyKey')}</Term>,
                    definition: job ? (
                      <Code className="break-all">{job.idempotencyKey}</Code>
                    ) : (
                      <span className="text-text-tertiary">{t('common.unavailable')}</span>
                    ),
                  },
                  {
                    id: 'account',
                    term: <Term>{t('web.receipt.provenance.externalAccount')}</Term>,
                    definition: <Code>{receipt.externalAccountId}</Code>,
                  },
                  {
                    id: 'approval',
                    term: <Term>{t('approval.title')}</Term>,
                    definition:
                      receipt.approval.state === 'not_required'
                        ? t('web.receipt.approval.notRequired')
                        : receipt.approval.decidedBy && receipt.approval.decidedAt
                          ? t('approval.decision.approvedBy', {
                              name: receipt.approval.decidedBy,
                              date: format.dateTime(receipt.approval.decidedAt),
                            })
                          : t(`state.approval.${receipt.approval.state}.label`),
                    hint: receipt.approval.policyKey
                      ? t('web.receipt.approval.policy', { policy: receipt.approval.policyKey })
                      : t('web.receipt.approval.unknownPolicy'),
                  },
                  {
                    id: 'written',
                    term: <Term>{t('web.receipt.provenance.writtenLabel')}</Term>,
                    definition: (
                      <time dateTime={receipt.createdAt} className="tabular-nums">
                        {format.dateTime(receipt.createdAt)}
                      </time>
                    ),
                  },
                ]}
              />
            </section>

            {/* ---- Provider usage ---------------------------------------- */}
            <section aria-labelledby="receipt-cost" className="flex flex-col gap-3">
              <SectionHeading id="receipt-cost">{t('web.receipt.section.cost')}</SectionHeading>
              <CostPanel receipt={receipt} provider={providerName(receipt.provider)} />
            </section>

            {/* ---- Analytics freshness ----------------------------------- */}
            <section aria-labelledby="receipt-analytics" className="flex flex-col gap-2">
              <SectionHeading id="receipt-analytics">
                {t('web.receipt.section.analytics')}
              </SectionHeading>
              <p className="text-body-sm text-text-secondary max-w-[70ch]">
                {t('web.receipt.analytics.explain')}
              </p>
              {receipt.lastAnalyticsSyncAt ? (
                <FreshnessLabel
                  level={freshnessLevel(receipt.lastAnalyticsSyncAt)}
                  text={t('receipt.analytics.lastSync', {
                    relativeTime: format.relative(receipt.lastAnalyticsSyncAt),
                  })}
                  isoTimestamp={receipt.lastAnalyticsSyncAt}
                />
              ) : (
                <FreshnessLabel level="never" text={t('web.receipt.analytics.never')} />
              )}
            </section>
          </>
        ) : null}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------------- */

function SectionHeading({ id, children }: { id: string; children: ReactNode }): ReactNode {
  return (
    <h2 id={id} className="text-title-sm text-text-primary">
      {children}
    </h2>
  );
}

/**
 * A provenance fact's term, in the display face. This is the document a
 * person forwards to a client: "what, where, when" reads like a receipt's
 * own printed labels, not a generic settings row.
 */
function Term({ children }: { children: ReactNode }): ReactNode {
  return <span className="font-display text-label tracking-wide">{children}</span>;
}

function PartialSuccess({
  targets,
  onRetry,
  jobId,
}: {
  targets: readonly CampaignTargetView[];
  onRetry: ReturnType<typeof useRetryTarget>;
  jobId: string | null;
}): ReactNode {
  const t = useTranslations();
  const providerName = useProviderName();

  // The split is by "does an external post exist", not by state name. A target
  // in `deleted_externally` still produced a post, and grouping it with the
  // failures would tell somebody nothing was ever published to that account.
  const published = targets.filter((target) => target.hasExternalPost);
  const failed = targets.filter((target) => !target.hasExternalPost);

  return (
    <PartialSuccessNotice
      title={t('receipt.partial.title')}
      description={t('receipt.partial.body', {
        published: published.length,
        failed: failed.length,
      })}
      succeededLabel={t('calendar.queue.published')}
      failedLabel={t('calendar.queue.failed')}
      targets={targets.map((target) => ({
        id: target.variantId,
        account: t('receipt.target', {
          account: target.accountLabel,
          provider: providerName(target.provider),
        }),
        outcome: target.hasExternalPost ? 'succeeded' : 'failed',
        detail: target.hasExternalPost ? (
          target.permalink ? (
            <a
              href={target.permalink}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text-accent inline-flex items-center gap-1 break-all"
            >
              {target.permalink}
              <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
              <span className="sr-only">{t('a11y.label.externalLink')}</span>
            </a>
          ) : (
            t('receipt.permalinkUnavailable', { provider: providerName(target.provider) })
          )
        ) : (
          t(`state.${target.state}.label`)
        ),
      }))}
      actions={
        jobId && failed.length > 0 ? (
          <div className="flex flex-col items-start gap-1">
            <div className="flex flex-wrap gap-2">
              {failed.map((target) => (
                <Button
                  key={target.variantId}
                  variant="secondary"
                  size="sm"
                  iconStart={<RefreshCw aria-hidden="true" className="size-3.5" />}
                  loading={onRetry.isPending && onRetry.variables?.variantId === target.variantId}
                  onClick={() =>
                    onRetry.mutate({ publishJobId: jobId, variantId: target.variantId })
                  }
                >
                  {t('action.retryTarget', { account: target.accountLabel })}
                </Button>
              ))}
            </div>
            <p className="text-body-sm text-text-secondary">{t('web.receipt.partial.retryHint')}</p>
          </div>
        ) : null
      }
    />
  );
}

function CostPanel({
  receipt,
  provider,
}: {
  receipt: NonNullable<PostDetail['receipt']>;
  provider: string;
}): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const cost = receipt.cost;

  if (!cost) {
    return (
      <p className="text-body-md text-text-secondary">
        {t('web.receipt.cost.notMetered', { provider })}
      </p>
    );
  }

  // Money is integer minor units plus an ISO 4217 code. The exponent comes
  // from the runtime, because JPY has none and USD has two.
  const money = (minor: number): string => formatCurrency(format.locale, minor, cost.currency);

  return (
    <DefinitionList
      layout="columns"
      items={[
        {
          id: 'estimated',
          term: t('web.receipt.cost.estimatedLabel'),
          definition: <span className="tabular-nums">{money(cost.estimatedMinor)}</span>,
        },
        {
          id: 'actual',
          term: t('web.receipt.cost.actualLabel'),
          definition:
            cost.actualMinor === null ? (
              <span className="text-text-tertiary">{t('receipt.cost.pending')}</span>
            ) : (
              <span className="tabular-nums">{money(cost.actualMinor)}</span>
            ),
          ...(cost.reconciledAt
            ? { hint: t('web.receipt.cost.reconciledAt', { time: format.date(cost.reconciledAt) }) }
            : {}),
        },
      ]}
    />
  );
}

/**
 * Download and share.
 *
 * The JSON is built from the receipt already on screen rather than fetched
 * from an export endpoint, so what a person downloads is exactly what they
 * were looking at. The PDF is the browser's own print to file, which is why
 * the page is laid out as a document: a receipt is the thing people forward to
 * a client, and it has to survive leaving the product.
 */
function ExportControls({
  allowed,
  role,
  receipt,
}: {
  allowed: boolean;
  role: string;
  receipt: NonNullable<PostDetail['receipt']>;
}): ReactNode {
  const t = useTranslations();

  if (!allowed) {
    return (
      <p className={cn('text-body-sm text-text-tertiary max-w-[36ch]')}>
        {t('web.receipt.export.denied', { role })}
      </p>
    );
  }

  const downloadJson = (): void => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${receipt.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <Badge tone="outline" className="print:inline-flex">
        <Code>{receipt.id}</Code>
      </Badge>
      <Button
        variant="secondary"
        iconStart={<Download aria-hidden="true" className="size-4" />}
        onClick={downloadJson}
      >
        {t('receipt.export.json')}
      </Button>
      <Button
        variant="secondary"
        iconStart={<Printer aria-hidden="true" className="size-4" />}
        onClick={() => window.print()}
      >
        {t('receipt.export.pdf')}
      </Button>
    </div>
  );
}

/** `automation_rule` and `agent` map onto the two catalog keys we publish. */
function surfaceKey(surface: PostDetail['item']['createdSurface']): string {
  return surface === 'automation_rule' || surface === 'agent' ? 'automation' : surface;
}

/** Freshness bands for an analytics sync. Hours, not opinions. */
function freshnessLevel(syncedAt: string): 'fresh' | 'aging' | 'stale' {
  const ageMs = Date.now() - new Date(syncedAt).getTime();
  if (ageMs < 2 * 3_600_000) return 'fresh';
  if (ageMs < 12 * 3_600_000) return 'aging';
  return 'stale';
}
