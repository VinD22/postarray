'use client';

/**
 * The receipt timeline.
 *
 * The steps come from `buildTimeline`. This component only translates and
 * formats them, which keeps the ordering rules testable and keeps the
 * rendering honest: an identifier is monospace, a permalink is a real link
 * that says it opens elsewhere, and a failure reason is the sanitized code
 * plus the remediation sentence for its class, never a provider payload.
 *
 * The rendering itself is a vertical ink line with a node per step — the same
 * bespoke technique `automation`'s rule-version history reuses from here,
 * rather than the design system's plainer `Timeline` pattern (which stays the
 * quiet default everywhere that isn't the document a person screenshots and
 * forwards). `start-*` placement only, so the line and its nodes mirror
 * correctly under `dir="rtl"` with no separate rule. Nodes enter with the
 * list's own stagger rather than each drawing independently, so a receipt
 * with twelve steps does not turn into twelve separate animations.
 */

import type { ReactNode } from 'react';
import { AlertTriangle, Check, Circle, Clock, ExternalLink, RotateCcw, X } from 'lucide-react';
import { Code, cn } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useCalendarFormat } from '@/features/calendar/format';
import { StaggerList } from '@/components/motion';
import type { TimelineStep } from './timeline-model';

type StepOutcome = TimelineStep['outcome'];

const NODE_ICON: Readonly<Record<StepOutcome, ReactNode>> = {
  completed: <Check aria-hidden="true" className="size-3" strokeWidth={3} />,
  current: <Clock aria-hidden="true" className="size-3" />,
  pending: <Circle aria-hidden="true" className="size-2" />,
  retried: <RotateCcw aria-hidden="true" className="size-3" />,
  warning: <AlertTriangle aria-hidden="true" className="size-3" />,
  failed: <X aria-hidden="true" className="size-3" strokeWidth={3} />,
};

// Success reads as the brand accent (this is the document a person forwards
// to a client, and "it worked" should look like the product's own colour,
// not a generic green). Failure is destructive. Everything in between stays
// on the neutral ink line so it never competes with those two.
const NODE_CLASS: Readonly<Record<StepOutcome, string>> = {
  completed: 'border-border-bold bg-accent text-accent-on',
  current: 'border-border-bold bg-accent-subtle text-text-accent',
  pending: 'border-border-default bg-surface-canvas text-text-tertiary',
  retried: 'border-border-bold bg-warning-bg text-warning-fg',
  warning: 'border-border-bold bg-warning-bg text-warning-fg',
  failed: 'border-border-bold bg-destructive-solid text-destructive-on',
};

export interface ReceiptTimelineProps {
  steps: readonly TimelineStep[];
  provider: string;
}

export function ReceiptTimeline({ steps, provider }: ReceiptTimelineProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();

  return (
    <StaggerList selector="[data-stagger-item]" stagger={0.05} y={10}>
      <ol aria-label={t('receipt.timeline.title')} className="relative flex flex-col ps-6">
        <span
          aria-hidden="true"
          className="border-border-bold absolute inset-y-1 start-[7px] border-s-2"
        />
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li
              key={step.id}
              data-stagger-item
              className={cn('relative flex flex-col gap-0.5', isLast ? 'pb-0' : 'pb-4')}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute start-[-24px] top-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2',
                  NODE_CLASS[step.outcome],
                )}
              >
                {NODE_ICON[step.outcome]}
              </span>

              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="text-body-md text-text-primary font-medium">
                  {t(step.messageKey, formatValues(step, format))}
                </p>
                {step.at ? (
                  <time
                    dateTime={step.at}
                    className="text-body-sm text-text-tertiary tabular-nums"
                  >
                    {format.dateTime(step.at)}
                  </time>
                ) : null}
              </div>

              {step.detail ? <StepDetail step={step} provider={provider} /> : null}
            </li>
          );
        })}
      </ol>
    </StaggerList>
  );
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
            className="text-text-accent inline-flex items-center gap-1 break-all"
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
          <span className="text-text-secondary tabular-nums">{detail.httpStatus}</span>
        </Row>
      )}

      {detail.providerRequestId ? (
        <Row term={t('web.receipt.attempt.providerRequestId')}>
          <Code>{detail.providerRequestId}</Code>
        </Row>
      ) : null}

      {detail.nextRetryAt ? (
        <Row term={t('web.receipt.attempt.nextRetryLabel')}>
          <time dateTime={detail.nextRetryAt} className="text-text-secondary tabular-nums">
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
      <dt className="text-label text-text-tertiary shrink-0 sm:w-40">{term}</dt>
      <dd className="text-body-sm min-w-0">{children}</dd>
    </div>
  );
}
