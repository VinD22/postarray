'use client';

import { useState, type ReactElement } from 'react';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import type { LimitSource } from '@/features/marketing/data/publishing-limits-types';

/**
 * Small pieces shared by more than one tool.
 *
 * `StatusTag` never carries meaning in colour alone: the word is the status and
 * the border weight is the emphasis. `SourceNote` is the reason these pages can
 * state a number at all, so it renders on every row that has one.
 */

export type ResultTone = 'pass' | 'warning' | 'fail' | 'unavailable';

const TONE_CLASSES: Readonly<Record<ResultTone, string>> = {
  pass: 'border-border-default text-text-secondary',
  warning: 'border-warning-border text-warning-fg',
  fail: 'border-destructive-border text-destructive-fg',
  unavailable: 'border-border-subtle text-text-tertiary',
};

export function StatusTag({
  status,
  label,
}: {
  readonly status: ResultTone;
  readonly label: string;
}): ReactElement {
  return (
    <span
      className={cn(
        'text-body-sm rounded-sm border px-2 py-0.5 font-mono uppercase',
        TONE_CLASSES[status],
      )}
    >
      {label}
    </span>
  );
}

export function SourceNote({ source }: { readonly source: LimitSource | null }): ReactElement {
  const t = useTranslations();
  if (source === null) {
    return (
      <p className="text-body-sm text-text-tertiary">{t.full('web.tools.shared.unavailable')}</p>
    );
  }
  return (
    <p className="text-body-sm text-text-tertiary">
      <a
        href={source.url}
        rel="nofollow noopener"
        className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t.full('web.tools.shared.sourceLink')}
      </a>{' '}
      <span>{t.full('web.tools.shared.sourceRead', { date: source.readOn })}</span>
    </p>
  );
}

/**
 * A copy control that tells the truth when the browser refuses.
 *
 * The clipboard API is unavailable in a non-secure context and can be blocked
 * by permissions policy, so a silent failure would be a lie. The fallback state
 * asks the reader to select the text instead.
 */
export function CopyButton({ value }: { readonly value: string }): ReactElement {
  const t = useTranslations();
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button type="button" variant="secondary" size="sm" onClick={() => void copy()}>
        {state === 'copied' ? t.full('web.tools.shared.copied') : t.full('web.tools.shared.copy')}
      </Button>
      <p aria-live="polite" className="text-body-sm text-text-tertiary">
        {state === 'failed' ? t.full('web.tools.shared.copyFailed') : ''}
      </p>
    </div>
  );
}
