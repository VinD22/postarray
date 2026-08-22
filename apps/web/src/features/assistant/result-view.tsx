'use client';

import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '@/features/settings/lib/formatters';
import type { AssistantResult } from './lib/run-tool';

function Panel({ title, children }: { title: string; children: ReactNode }): ReactNode {
  return (
    <section className="border-border-default bg-surface-sunken flex flex-col gap-3 rounded-lg border p-4">
      <h3 className="text-title-sm text-text-primary font-display font-bold">{title}</h3>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }): ReactNode {
  return <p className="text-body-md text-text-secondary">{text}</p>;
}

/**
 * What a read tool came back with.
 *
 * Everything here is a proposal or a record of something that already exists.
 * No panel offers to act: acting is a separate, deliberate turn with its own
 * confirmation, and a count the API could not give us stays unavailable rather
 * than being drawn as a zero.
 */
export function AssistantResultView({ result }: { readonly result: AssistantResult }): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  if (result.kind === 'needs-post') {
    return <Notice tone="neutral" title={t('assistantWeb.subject.needed')} />;
  }

  if (result.kind === 'composer-only') {
    return <Notice tone="neutral" title={t('assistantWeb.subject.composerOnly')} />;
  }

  if (result.kind === 'plan') {
    return (
      <Panel title={t('assistantWeb.result.planTitle')}>
        {result.data.posts.length === 0 ? (
          <Empty text={t('assistantWeb.result.planEmpty')} />
        ) : (
          <ol className="flex flex-col gap-3">
            {result.data.posts.map((post) => (
              <li
                key={`${post.dayOffset}-${post.localTime}-${post.angle}`}
                className="flex flex-col gap-1"
              >
                <span className="text-label text-text-tertiary tabular-nums">
                  {t('assistantWeb.result.planSlot', {
                    day: post.dayOffset + 1,
                    time: post.localTime,
                  })}
                </span>
                <span className="text-body-md text-text-primary font-medium">{post.angle}</span>
                <span className="text-body-md text-text-secondary whitespace-pre-wrap">
                  {post.body}
                </span>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    );
  }

  if (result.kind === 'week') {
    return (
      <Panel title={t('assistantWeb.result.weekTitle')}>
        {result.data.entries.length === 0 ? (
          <Empty text={t('assistantWeb.result.weekEmpty')} />
        ) : (
          <ul className="flex flex-col gap-2">
            {result.data.entries.map((entry) => (
              <li key={`${entry.contentItemId}-${entry.instant}`} className="flex flex-col">
                <span className="text-body-md text-text-primary font-medium">
                  {entry.title ?? t('assistantWeb.subject.untitled')}
                </span>
                <span className="text-body-sm text-text-secondary tabular-nums">
                  {t('assistantWeb.confirm.timeValue', {
                    dateTime: formatters.dateTime(entry.instant),
                    timeZone: entry.ianaTimeZone,
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
        {result.data.hasMore ? (
          <p className="text-body-sm text-text-tertiary">{t('assistantWeb.result.weekMore')}</p>
        ) : null}
      </Panel>
    );
  }

  if (result.kind === 'failures') {
    return (
      <Panel title={t('assistantWeb.result.failuresTitle')}>
        {result.data.entries.length === 0 ? (
          <Empty text={t('assistantWeb.result.failuresEmpty')} />
        ) : (
          <ul className="flex flex-col gap-2">
            {result.data.entries.map((entry) => (
              <li key={entry.id} className="flex flex-col">
                <span className="text-body-md text-text-primary">{t(entry.reasonKey)}</span>
                <span className="text-body-sm text-text-tertiary tabular-nums">
                  {formatters.dateTime(entry.occurredAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    );
  }

  if (result.kind === 'captions') {
    return (
      <Panel title={t('assistantWeb.result.captionsTitle')}>
        {result.data.options.length === 0 ? (
          <Empty text={t('assistantWeb.result.captionsEmpty')} />
        ) : (
          <ul className="flex flex-col gap-3">
            {result.data.options.map((option) => (
              <li key={option.body} className="flex flex-col gap-1">
                <span className="text-body-md text-text-primary whitespace-pre-wrap">
                  {option.body}
                </span>
                <span className="text-body-sm text-text-secondary">{option.rationale}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    );
  }

  if (result.kind !== 'fit') {
    return null;
  }

  return (
    <Panel title={t('assistant.turn.check_platform_fit')}>
      <ul className="flex flex-col gap-2">
        {result.data.warnings.map((warning) => (
          <li key={warning.code} className="flex flex-col">
            <span className="text-body-md text-text-primary">{warning.explanation}</span>
            {warning.suggestion === null ? null : (
              <span className="text-body-sm text-text-secondary">{warning.suggestion}</span>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
