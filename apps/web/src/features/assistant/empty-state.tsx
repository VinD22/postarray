'use client';

import type { ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { EmptyState } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

/** The four openings. Real sentences a person could say out loud, in order. */
const PROMPT_KEYS = [
  'assistantWeb.empty.promptPlan',
  'assistantWeb.empty.promptWeek',
  'assistantWeb.empty.promptFailures',
  'assistantWeb.empty.promptCaption',
] as const;

/**
 * The first thing anyone sees here.
 *
 * A blank box is an exam. This says what the assistant is for, shows four
 * things people actually ask in their own words, and says plainly that nothing
 * is written without them. Clicking one fills the input rather than sending it,
 * so the first turn is still the person's own.
 */
export function AssistantEmptyState({
  onPrompt,
}: {
  readonly onPrompt: (prompt: string) => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <EmptyState
      title={t('assistantWeb.empty.title')}
      description={t('assistantWeb.empty.body')}
      example={
        <div className="flex flex-col gap-2">
          <p className="text-label text-text-tertiary">{t('assistantWeb.empty.promptsLabel')}</p>
          <ul className="flex flex-col gap-2">
            {PROMPT_KEYS.map((key) => {
              const prompt = t(key);
              return (
                <li key={key}>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => onPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                </li>
              );
            })}
          </ul>
          <p className="text-body-sm text-text-secondary">{t('assistantWeb.empty.reassurance')}</p>
        </div>
      }
    />
  );
}
