'use client';

/**
 * Every attempt, with its sanitized provider response behind a disclosure.
 *
 * The response is stored with tokens, headers and personal data removed, and
 * the panel says so before it shows anything. It is collapsed by default
 * because most readers want the reason, not the payload, but it is present
 * because the reader who needs the payload cannot get it anywhere else.
 */

import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Code,
  DefinitionList,
  Notice,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useCalendarFormat } from '@/features/calendar/format';
import type { PublicationReceipt } from './types';

export interface ReceiptAttemptsProps {
  receipt: PublicationReceipt;
  provider: string;
}

export function ReceiptAttempts({ receipt, provider }: ReceiptAttemptsProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();

  const attempts = [...receipt.attempts].sort((a, b) => a.attemptNumber - b.attemptNumber);
  const failures = attempts.filter((attempt) => attempt.errorCode !== null);

  if (attempts.length <= 1 && failures.length === 0) {
    return (
      <p className="text-body-md text-text-secondary">{t('web.receipt.attempt.none')}</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-sm text-text-secondary">
        {t('receipt.attempts.count', { count: attempts.length })}
      </p>

      <Accordion type="multiple" className="flex flex-col">
        {attempts.map((attempt) => {
          const failed = attempt.errorCode !== null;
          const duration =
            attempt.finishedAt === null
              ? null
              : new Date(attempt.finishedAt).getTime() -
                new Date(attempt.startedAt).getTime();

          return (
            <AccordionItem key={attempt.id} value={attempt.id}>
              <AccordionTrigger>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-body-md font-medium text-text-primary">
                    {t('web.receipt.attempt.heading', { number: attempt.attemptNumber })}
                  </span>
                  {failed ? (
                    <Badge tone="destructive">{attempt.errorCode}</Badge>
                  ) : (
                    <Badge tone="success">{t(`state.${attempt.resultState}.label`)}</Badge>
                  )}
                  <span className="text-body-sm tabular-nums text-text-tertiary">
                    {format.dateTime(attempt.startedAt)}
                  </span>
                </span>
              </AccordionTrigger>

              <AccordionContent>
                <div className="flex flex-col gap-3 pb-3">
                  <DefinitionList
                    layout="columns"
                    items={[
                      {
                        id: 'started',
                        term: t('web.receipt.attempt.startedLabel'),
                        definition: (
                          <time dateTime={attempt.startedAt} className="tabular-nums">
                            {format.dateTime(attempt.startedAt)}
                          </time>
                        ),
                      },
                      ...(duration === null
                        ? []
                        : [
                            {
                              id: 'duration',
                              term: t('common.duration'),
                              definition: format.duration(duration),
                            },
                          ]),
                      ...(attempt.httpStatus === null
                        ? []
                        : [
                            {
                              id: 'status',
                              term: t('web.receipt.attempt.httpStatus'),
                              definition: (
                                <span className="tabular-nums">{attempt.httpStatus}</span>
                              ),
                            },
                          ]),
                      ...(attempt.providerRequestId === null
                        ? []
                        : [
                            {
                              id: 'request',
                              term: t('web.receipt.attempt.providerRequestId'),
                              definition: <Code>{attempt.providerRequestId}</Code>,
                            },
                          ]),
                      {
                        id: 'retry',
                        term: t('receipt.attempts.classification'),
                        definition: attempt.retryable
                          ? t('web.receipt.attempt.retryable')
                          : t('web.receipt.attempt.notRetryable'),
                        ...(attempt.nextRetryAt
                          ? {
                              hint: t('web.receipt.attempt.nextRetry', {
                                time: format.dateTime(attempt.nextRetryAt),
                              }),
                            }
                          : {}),
                      },
                    ]}
                  />

                  {failed && attempt.errorClass ? (
                    <Notice
                      tone="warning"
                      title={t('receipt.attempts.remediation')}
                      description={t(`web.receipt.remediation.${attempt.errorClass}`, {
                        provider,
                      })}
                    />
                  ) : null}

                  <details className="flex flex-col gap-1">
                    <summary className="cursor-pointer text-body-sm text-text-accent">
                      {t('web.receipt.attempt.responseSummary')}
                    </summary>
                    <p className="pt-1 text-body-sm text-text-tertiary">
                      {t('receipt.attempts.responseRedacted')}
                    </p>
                    <Code block className="mt-1 text-body-sm">
                      {JSON.stringify(attempt.sanitizedResponse, null, 2)}
                    </Code>
                  </details>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
