'use client';

/**
 * The character counter.
 *
 * Over the limit it changes colour, gains an icon and gains the word "over".
 * Three signals, because colour alone is not a signal for everybody, and the
 * one number on this screen that can stop a publish is not the place to make
 * an exception.
 *
 * It announces at three moments only: reaching ninety percent of the limit,
 * going over, and coming back under. Announcing per keystroke would make the
 * composer unusable with a screen reader open.
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import { crossedThreshold } from '../counter';
import type { PreviewCounter as Reading } from '../types';

export interface PreviewCounterProps {
  readonly counter: Reading;
  readonly providerName: string;
  readonly className?: string;
}

export function PreviewCounter({
  counter,
  providerName,
  className,
}: PreviewCounterProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const previous = useRef<Reading | null>(null);

  useEffect(() => {
    const crossing = crossedThreshold(previous.current, counter);
    previous.current = counter;
    if (crossing === 'near') {
      announce(
        t.full('composerWeb.preview.counter.nearAnnounce', {
          provider: providerName,
          remaining: counter.remaining,
        }),
      );
    } else if (crossing === 'over') {
      announce(
        t.full('composerWeb.preview.counter.overAnnounce', {
          provider: providerName,
          count: counter.used - counter.max,
        }),
        'assertive',
      );
    } else if (crossing === 'under') {
      announce(t.full('composerWeb.preview.counter.underAnnounce', { provider: providerName }));
    }
  }, [announce, counter, providerName, t]);

  return (
    <p
      data-over={counter.over ? '' : undefined}
      className={cn(
        'text-label flex items-center gap-1.5 tabular-nums',
        'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
        counter.over
          ? 'text-destructive-fg'
          : counter.nearLimit
            ? 'text-warning-fg'
            : 'text-text-tertiary',
        className,
      )}
    >
      {counter.over ? <AlertTriangle aria-hidden className="size-3.5" /> : null}
      <span>{t.full('composerWeb.preview.counter.label', {
        used: counter.used,
        limit: counter.max,
      })}</span>
      {counter.over ? (
        <span>
          {t.full('composerWeb.preview.counter.over', { count: counter.used - counter.max })}
        </span>
      ) : null}
    </p>
  );
}
