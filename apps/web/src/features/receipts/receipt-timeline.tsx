'use client';

/**
 * The receipt timeline.
 *
 * The steps come from `buildTimeline`. This component only translates and
 * formats them, which keeps the ordering rules testable and keeps the
 * rendering honest: an identifier is monospace, a permalink is a real link
 * that says it opens elsewhere, and a failure reason is the sanitized code
 * plus the remediation sentence for its class, never a provider payload.
 */

import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { Code, Timeline, type TimelineEvent } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useCalendarFormat } from '@/features/calendar/format';
import type { TimelineStep } from './timeline-model';

export interface ReceiptTimelineProps {
  steps: readonly TimelineStep[];
  provider: string;
}

export function ReceiptTimeline({ steps, provider }: ReceiptTimelineProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();

  const events: TimelineEvent[] = steps.map((step) => ({
    id: step.id,
    title: t(step.messageKey, formatValues(step, format)),
    ...(step.at
      ? { timestamp: format.dateTime(step.at), isoTimestamp: step.at }
      : {}),
    outcome: step.outcome,
    ...(step.detail ? { detail: <StepDetail step={step} provider={provider} /> } : {}),
  }));

  return <Timeline label={t('receipt.timeline.title')} events={events} />;
}

/**
 * Any value that is a timestamp is formatted in the workspace zone before it
 * reaches the message, because ICU cannot know which zone a bare instant means.
 */
function formatValues(
  step: TimelineStep,
  format: ReturnType<typeof useCalendarFormat>,
): Record<string, string | number> {
  const values: Record<string, string | number> = { ...step.values };
  if (typeof values.time === 'string' && values.time.length > 0) {
    values.time = format.dateTime(values.time);
  }
  if (typeof values.local === 'string' && values.local.length > 0) {
    // `scheduledLocalTime` is already wall clock in the stored zone.
    values.local = values.local.replace('T', ' ');
  }
  return values;
}

function StepDetail({ step, provider }: { step: TimelineStep; provider: string }): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const detail = step.detail;
  if (!detail) return null;

  return (
    <dl className="mt-1 flex flex-col gap-1">
      {detail.externalPostId ? (
        <Row term={t('receipt.externalId')}>
          <Code>{detail.externalPostId}</Code>
        </Row>
      ) : null}

      {detail.permalink ? (
        <Row term={t('receipt.permalink')}>
          <a
            href={detail.permalink}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 break-all text-text-accent"
          >
            {detail.permalink}
            <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
            <span className="sr-only">{t('a11y.label.externalLink')}</span>
          </a>
        </Row>
      ) : null}

      {detail.capabilityVersion ? (
        <Row term={t('web.receipt.provenance.capabilityVersion')}>
          <Code>{detail.capabilityVersion}</Code>
        </Row>
      ) : null}

      {detail.checksum ? (
        <Row term={t('receipt.contentHash')}>
          <Code className="break-all">{detail.checksum}</Code>
        </Row>
      ) : null}

      {detail.idempotencyKey ? (
        <Row term={t('receipt.idempotencyKey')}>
          <Code className="break-all">{detail.idempotencyKey}</Code>
        </Row>
      ) : null}

      {detail.errorCode ? (
        <>
          <Row term={t('receipt.attempts.classification')}>
            <Code>{detail.errorCode}</Code>
          </Row>
          {detail.errorClass ? (
            <Row term={t('receipt.attempts.remediation')}>
              <span className="text-text-secondary">
                {t(`web.receipt.remediation.${detail.errorClass}`, { provider })}
              </span>
            </Row>
          ) : null}
        </>
      ) : null}

      {detail.httpStatus === undefined ? null : (
        <Row term={t('web.receipt.attempt.httpStatus')}>
          <span className="tabular-nums text-text-secondary">{detail.httpStatus}</span>
        </Row>
      )}

      {detail.providerRequestId ? (
        <Row term={t('web.receipt.attempt.providerRequestId')}>
          <Code>{detail.providerRequestId}</Code>
        </Row>
      ) : null}

      {detail.nextRetryAt ? (
        <Row term={t('web.receipt.attempt.nextRetryLabel')}>
          <time dateTime={detail.nextRetryAt} className="tabular-nums text-text-secondary">
            {format.dateTime(detail.nextRetryAt)}
          </time>
        </Row>
      ) : null}
    </dl>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }): ReactNode {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <dt className="shrink-0 text-label text-text-tertiary sm:w-40">{term}</dt>
      <dd className="min-w-0 text-body-sm">{children}</dd>
    </div>
  );
}
