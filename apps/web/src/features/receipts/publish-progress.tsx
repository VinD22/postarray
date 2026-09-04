'use client';

import { AlertTriangle, Check, Clock3 } from 'lucide-react';
import type { ReactNode } from 'react';

import { StatusPill, cn } from '@relay/design-system';
import { formatDateTime } from '@relay/i18n';
import { useTranslations } from '@relay/i18n/react';

import type { PublishJob } from './types';

const STEP_KEYS = [
  'web.receipt.progress.recorded',
  'web.receipt.progress.checked',
  'web.receipt.progress.sent',
  'web.receipt.progress.confirmed',
  'web.receipt.progress.receipt',
] as const;

type ProgressTone = 'ordinary' | 'attention';
type ProgressPhase = 'queued' | 'working' | 'confirming' | 'held' | 'attention' | 'canceled';

export function progressStepForState(state: PublishJob['state']): number {
  switch (state) {
    case 'preparing_media':
    case 'validation_needed':
      return 1;
    case 'dispatching':
    case 'retry_scheduled':
      return 2;
    case 'provider_processing':
    case 'action_required':
    case 'failed_permanently':
      return 3;
    case 'published':
    case 'partially_published':
    case 'deleted_externally':
      return 4;
    default:
      return 0;
  }
}

function phaseFor(job: PublishJob): ProgressPhase {
  if (job.hold !== null) return 'held';
  switch (job.state) {
    case 'preparing_media':
    case 'dispatching':
    case 'provider_processing':
    case 'retry_scheduled':
      return 'working';
    case 'published':
    case 'partially_published':
      return 'confirming';
    case 'validation_needed':
    case 'action_required':
    case 'failed_permanently':
    case 'deleted_externally':
      return 'attention';
    case 'canceled':
      return 'canceled';
    default:
      return 'queued';
  }
}

/**
 * Live handoff status between a successful commit request and its immutable
 * receipt. This is deliberately DOM, not canvas: publishing evidence must
 * remain readable without JavaScript motion, WebGL, colour or fine vision.
 */
export function PublishProgress({ job }: { readonly job: PublishJob }): ReactNode {
  const t = useTranslations();
  const current = progressStepForState(job.state);
  const phase = phaseFor(job);
  const tone: ProgressTone =
    phase === 'attention' || phase === 'canceled' ? 'attention' : 'ordinary';
  const scheduledTime = formatDateTime(t.locale, job.scheduledInstant, {
    timeZone: job.ianaTimeZone,
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <section
      aria-labelledby="publish-progress-title"
      aria-live="polite"
      className="border-border-default bg-surface-sunken overflow-hidden rounded-lg border"
    >
      <header className="border-border-subtle grid gap-4 border-b p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:p-6">
        <div>
          <p className="text-label text-text-tertiary font-semibold tracking-wide">
            {t('web.receipt.progress.eyebrow')}
          </p>
          <h3 id="publish-progress-title" className="text-title-md text-text-primary mt-1">
            {t(`web.receipt.progress.${phase}.title`)}
          </h3>
          <p className="text-body-sm text-text-secondary mt-2 max-w-[68ch] leading-relaxed">
            {t(`web.receipt.progress.${phase}.body`, {
              time: scheduledTime,
              timeZone: job.ianaTimeZone,
            })}
          </p>
        </div>
        <StatusPill state={job.state} label={t(`state.${job.state}.label`)} showActivity />
      </header>

      <ol className="grid gap-4 p-5 md:grid-cols-5 md:gap-0 md:p-6">
        {STEP_KEYS.map((key, index) => {
          const complete = index < current;
          const active = index === current;
          const attention = active && tone === 'attention';

          return (
            <li
              key={key}
              className="relative grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 md:grid-cols-1 md:justify-items-center md:gap-2 md:text-center"
            >
              {index < STEP_KEYS.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'border-border-default absolute start-[0.9375rem] top-8 h-[calc(100%+1rem)] border-s md:start-[calc(50%+1rem)] md:end-[calc(-50%+1rem)] md:top-[0.9375rem] md:h-0 md:border-s-0 md:border-t',
                    complete && 'border-accent',
                  )}
                />
              ) : null}

              <span
                aria-hidden="true"
                className={cn(
                  'relative z-(--z-index-raised) flex size-8 items-center justify-center rounded-md border',
                  complete && 'border-accent bg-accent text-accent-on',
                  active &&
                    !attention &&
                    'border-border-bold bg-surface-inverted text-text-inverted shadow-raised',
                  attention && 'border-destructive-border bg-destructive-solid text-destructive-on',
                  !complete &&
                    !active &&
                    'border-border-default bg-surface-canvas text-text-tertiary',
                )}
              >
                {complete ? <Check className="size-4" strokeWidth={2.5} /> : null}
                {active && !attention ? <Clock3 className="size-4" /> : null}
                {attention ? <AlertTriangle className="size-4" /> : null}
              </span>

              <span
                className={cn(
                  'text-body-sm pt-1 font-medium md:max-w-[9rem] md:pt-0',
                  active || complete ? 'text-text-primary' : 'text-text-tertiary',
                )}
              >
                {t(key)}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
