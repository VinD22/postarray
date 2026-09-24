'use client';

import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  DefinitionList,
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  SkeletonText,
} from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { normalizedMetricNameSchema } from '@relay/contracts';

import { Link } from '@/components/link';
import {
  usePostFeedback,
  type FeedbackVerdict,
  type PostChannelFeedback,
  type PostFeedbackReading,
} from '@/features/analytics/insights-queries';
import { metricLabelKey } from '@/features/analytics/metrics';
import { useValueFormat } from '@/features/analytics/use-value-format';

import { ExperimentSection } from './experiment-section';

/** A metric's label, or the word for unavailable when this build has no copy for it. */
function metricKey(name: string): string {
  const parsed = normalizedMetricNameSchema.safeParse(name);
  return parsed.success ? metricLabelKey(parsed.data) : 'insight.howItDid.reading.unavailable';
}

/**
 * "How it did": per destination, what happened after the post went out.
 *
 * Delivery first (scheduled, sent, live link), then the readings at 24 hours
 * and 7 days against the account's own median for the same platform, the
 * things that differed, a verdict in words, and at most one next test that
 * changes one variable. A failed destination gets a plain explanation and the
 * one thing that fixes it instead.
 *
 * Every number the server did not report renders as the word "Unavailable",
 * never as zero. Nothing here is a score, and nothing compares this workspace
 * with anybody else's.
 */

const CONFOUNDER_KEY: Readonly<Record<string, string>> = {
  'analytics.feedback.association': 'insight.howItDid.confounder.hour',
  'analytics.definition.notComparable': 'insight.howItDid.confounder.media',
  'analytics.feedback.doNotInfer': 'insight.howItDid.confounder.link',
  'analytics.feedback.smallSample': 'insight.howItDid.confounder.smallSample',
  'analytics.feedback.notComparableFormats': 'insight.howItDid.confounder.formats',
};

const VERDICT_TONE: Readonly<Record<FeedbackVerdict, 'success' | 'warning' | 'neutral'>> = {
  above: 'success',
  below: 'warning',
  similar: 'neutral',
  insufficient_data: 'neutral',
};

export interface HowItDidPanelProps {
  readonly contentItemId: string;
  /** Where "Edit the post" goes. Omitted hides that action. */
  readonly editHref?: string;
}

export function HowItDidPanel({ contentItemId, editHref }: HowItDidPanelProps): ReactNode {
  const t = useTranslations();
  const query = usePostFeedback(contentItemId);

  return (
    <section aria-labelledby="how-it-did" className="flex flex-col gap-4">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 id="how-it-did" className="text-title-sm text-text-primary">
          {t('insight.howItDid.title')}
        </h2>
        <p className="text-body-md text-text-secondary">{t('insight.howItDid.intro')}</p>
      </div>

      {query.isPending ? (
        <LoadingState label={t('insight.howItDid.loading')}>
          <SkeletonText lines={4} />
        </LoadingState>
      ) : query.isError ? (
        <ErrorState
          title={t('insight.howItDid.errorTitle')}
          description={t('insight.howItDid.errorBody')}
          onRetry={() => void query.refetch()}
          retryLabel={t('action.retry')}
        />
      ) : query.data.channels.length === 0 ? (
        <EmptyState
          compact
          title={t('insight.howItDid.title')}
          description={t('insight.howItDid.empty')}
        />
      ) : (
        <ol className="flex flex-col gap-6">
          {query.data.channels.map((channel) => (
            <li
              key={channel.publishJobId}
              className="border-border-subtle flex flex-col gap-3 border-t pt-4"
            >
              <ChannelFeedback
                channel={channel}
                {...(editHref === undefined ? {} : { editHref })}
              />
            </li>
          ))}
        </ol>
      )}

      {query.data ? (
        <ExperimentSection
          contentItemId={contentItemId}
          published={query.data.channels.some((channel) => channel.receiptId !== null)}
        />
      ) : null}
    </section>
  );
}

function ChannelFeedback({
  channel,
  editHref,
}: {
  readonly channel: PostChannelFeedback;
  readonly editHref?: string;
}): ReactNode {
  const t = useTranslations();
  const format = useValueFormat();
  const when = (iso: string | null): ReactNode =>
    iso === null ? (
      t('insight.howItDid.timeline.notYet')
    ) : (
      <time dateTime={iso} className="tabular-nums">
        {format.dateTime(iso)}
      </time>
    );

  return (
    <>
      <h3 className="text-body-lg text-text-primary font-medium">
        {t(`web.provider.${channel.provider}`)}
      </h3>

      <DefinitionList
        layout="columns"
        items={[
          {
            id: 'scheduled',
            term: t('insight.howItDid.timeline.scheduled'),
            definition: when(channel.scheduledFor),
          },
          {
            id: 'sent',
            term: t('insight.howItDid.timeline.sent'),
            definition: when(channel.dispatchedAt),
          },
          {
            id: 'live',
            term: t('insight.howItDid.timeline.live'),
            definition:
              channel.permalink === null ? (
                when(channel.publishedAt)
              ) : (
                <a
                  href={channel.permalink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-text-accent inline-flex items-center gap-1 underline-offset-2 hover:underline"
                >
                  {t('insight.howItDid.timeline.openLink')}
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                </a>
              ),
          },
        ]}
      />

      {channel.failure ? (
        <Notice
          tone="destructive"
          title={t(channel.failure.messageKey)}
          description={t(channel.failure.fixKey)}
          actions={
            <FailureAction
              action={channel.failure.action}
              {...(editHref === undefined ? {} : { editHref })}
            />
          }
        />
      ) : null}

      {channel.pendingReasonKey ? (
        <p className="text-body-md text-text-secondary max-w-[70ch]">
          {t(channel.pendingReasonKey)}
        </p>
      ) : null}

      {channel.readings.map((reading) => (
        <Reading key={reading.insightId} reading={reading} />
      ))}

      {channel.readings.length > 0 ? (
        <p className="text-body-sm text-text-tertiary max-w-[70ch]">
          {t('insight.howItDid.caveat')}
        </p>
      ) : null}

      {channel.nextTest ? (
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h4 className="text-body-md text-text-primary font-medium">
            {t('insight.howItDid.nextTest.title')}
          </h4>
          <p className="text-body-md text-text-secondary">
            {t(channel.nextTest.messageKey, channel.nextTest.messageArgs)}
          </p>
          <DefinitionList
            items={[
              {
                id: 'next-metric',
                term: t('insight.howItDid.reading.metric'),
                definition: t(metricKey(channel.nextTest.metric)),
              },
            ]}
          />
          <p className="text-body-sm text-text-tertiary">
            {t(`insight.howItDid.nextTest.source.${channel.nextTest.source}`)}
          </p>
        </div>
      ) : null}
    </>
  );
}

function Reading({ reading }: { readonly reading: PostFeedbackReading }): ReactNode {
  const t = useTranslations();
  const format = useValueFormat();
  const unavailable = t('insight.howItDid.reading.unavailable');
  const confounders = [
    ...new Set(
      reading.confounderKeys.map(
        (key) => CONFOUNDER_KEY[key] ?? 'insight.howItDid.confounder.other',
      ),
    ),
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="text-body-md text-text-primary font-medium">
          {t(`insight.howItDid.window.${reading.window}`)}
        </h4>
        <span
          className={
            VERDICT_TONE[reading.verdict] === 'warning'
              ? 'text-body-sm text-warning-fg font-medium'
              : VERDICT_TONE[reading.verdict] === 'success'
                ? 'text-body-sm text-success-fg font-medium'
                : 'text-body-sm text-text-secondary font-medium'
          }
        >
          {t(`insight.post_feedback.${reading.verdict}`)}
        </span>
      </div>
      <DefinitionList
        layout="columns"
        items={[
          {
            id: 'metric',
            term: t('insight.howItDid.reading.metric'),
            definition: t(metricKey(reading.metric)),
          },
          {
            id: 'subject',
            term: t('insight.howItDid.reading.subject'),
            definition:
              reading.subjectValue === null ? unavailable : format.count(reading.subjectValue),
            ...(reading.subjectValue === null
              ? { hint: t('insight.howItDid.reading.unavailableReason') }
              : {}),
          },
          {
            id: 'median',
            term: t('insight.howItDid.reading.median'),
            definition:
              reading.medianValue === null ? unavailable : format.count(reading.medianValue),
          },
          {
            id: 'change',
            term: t('insight.howItDid.reading.change'),
            definition:
              reading.effectSize === null ? unavailable : format.signedPercent(reading.effectSize),
          },
        ]}
      />
      {reading.sampleSize === null ? null : (
        <p className="text-body-sm text-text-tertiary tabular-nums">
          {t('insight.howItDid.reading.sample', { count: reading.sampleSize })}
        </p>
      )}
      {reading.smallSample ? (
        <p className="text-body-sm text-warning-fg max-w-[70ch]">
          {t('insight.howItDid.smallSample')}
        </p>
      ) : null}
      {confounders.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p className="text-body-sm text-text-secondary font-medium">
            {t('insight.howItDid.confounders.title')}
          </p>
          <ul className="text-body-sm text-text-secondary marker:text-text-tertiary flex max-w-[70ch] list-disc flex-col gap-1 ps-5">
            {confounders.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function FailureAction({
  action,
  editHref,
}: {
  readonly action: 'reconnect' | 'edit' | 'retry' | 'wait' | null;
  readonly editHref?: string;
}): ReactNode {
  const t = useTranslations();
  if (action === 'reconnect') {
    return (
      <Button size="sm" variant="secondary" asChild>
        <Link href="/connections">{t('insight.howItDid.action.reconnect')}</Link>
      </Button>
    );
  }
  if (action === 'edit' && editHref !== undefined) {
    return (
      <Button size="sm" variant="secondary" asChild>
        <Link href={editHref}>{t('insight.howItDid.action.edit')}</Link>
      </Button>
    );
  }
  // Retry lives on the receipt, where it is idempotent per target. This panel
  // never offers a second publish button of its own.
  return null;
}
