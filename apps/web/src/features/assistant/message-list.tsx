'use client';

import type { ReactNode } from 'react';
import { Badge } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import type { AssistantProvenance } from '@relay/contracts';

import { useMotionOk } from '@/lib/motion/use-motion-ok';

export interface AssistantMessage {
  readonly id: string;
  readonly author: 'person' | 'assistant';
  /** Already translated, or the person's own words. Never a raw key. */
  readonly text: string;
  readonly provenance?: AssistantProvenance | null;
  readonly body?: ReactNode;
}

/**
 * The conversation, as a list.
 *
 * Turn taking is carried by real headings rather than by alignment or colour,
 * so it survives a screen reader and a narrow screen. Every assistant turn
 * wears the same label: a suggestion. There is no styling branch that could
 * ever present one as a statement about what has already happened.
 */
export function AssistantMessageList({
  messages,
}: {
  readonly messages: readonly AssistantMessage[];
}): ReactNode {
  const t = useTranslations();
  const motionOk = useMotionOk();

  return (
    <ol className="flex flex-col gap-5">
      {messages.map((message) => (
        <li
          key={message.id}
          className="flex flex-col gap-2"
          data-motion={motionOk ? 'enter' : undefined}
        >
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-label text-text-tertiary uppercase">
              {message.author === 'person'
                ? t('assistantWeb.turn.you')
                : t('assistantWeb.turn.assistant')}
            </h2>
            {message.author === 'assistant' ? (
              <Badge tone="neutral">{t('assistantWeb.turn.suggestionBadge')}</Badge>
            ) : null}
          </div>

          <p
            className={
              message.author === 'person'
                ? 'text-body-md text-text-primary whitespace-pre-wrap'
                : 'text-body-lg text-text-primary'
            }
          >
            {message.text}
          </p>

          {message.author === 'assistant' ? (
            <p className="text-body-sm text-text-tertiary">
              {t('assistantWeb.turn.suggestionNote')}
            </p>
          ) : null}

          {message.body}

          {message.provenance === null || message.provenance === undefined ? null : (
            <p className="text-label text-text-tertiary">
              {message.provenance.degraded
                ? t('assistantWeb.turn.degraded')
                : t('assistantWeb.turn.provenance', {
                    provider: message.provenance.provider,
                    model: message.provenance.model,
                  })}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
