'use client';

/**
 * The text area plus the counters that constrain it.
 *
 * The counters sit directly under the field, one line per selected target, so
 * the limit that matters is never a toast somewhere else on the screen. Each
 * one names its account and its own limit, because the limit differs per
 * account type on the same provider.
 */

import { useId, type ReactNode } from 'react';
import { Textarea, VisuallyHidden } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';
import type { CapabilitySnapshot } from '@relay/contracts';

import { readCounter } from '../state/capability-rules.js';

export interface CounterTarget {
  readonly connectionId: string;
  readonly accountLabel: string;
  readonly capabilities: CapabilitySnapshot;
}

export interface BodyFieldProps {
  readonly label: string;
  readonly description?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly counters: readonly CounterTarget[];
  readonly toolbar?: ReactNode;
  readonly disabled?: boolean;
  readonly minRows?: number;
  readonly id?: string;
}

export function BodyField({
  label,
  description,
  value,
  onChange,
  placeholder,
  counters,
  toolbar,
  disabled = false,
  minRows = 6,
  id,
}: BodyFieldProps): ReactNode {
  const t = useTranslations();
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const countersId = `${fieldId}-counters`;
  const descriptionId = `${fieldId}-description`;
  const anyOver = counters.some(
    (target) => readCounter(value, target.capabilities).level === 'over',
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={fieldId} className="text-label text-text-secondary">
          {label}
        </label>
        {toolbar}
      </div>

      {description ? (
        <p id={descriptionId} className="text-body-sm text-text-tertiary">
          {description}
        </p>
      ) : null}

      <Textarea
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        invalid={anyOver}
        autoGrow
        minRows={minRows}
        maxRows={24}
        aria-describedby={cn(description ? descriptionId : undefined, countersId)}
        className="text-body-lg leading-relaxed"
      />

      {/*
        A live region, polite: the number changes on every keystroke and must not
        interrupt typing, but a screen reader user still needs to hear when a
        target crosses its limit.
      */}
      <ul id={countersId} className="flex flex-col gap-1" aria-live="polite">
        {counters.map((target) => {
          const reading = readCounter(value, target.capabilities);
          return (
            <li
              key={target.connectionId}
              className="text-label flex items-baseline justify-between gap-3"
            >
              <span className="text-text-tertiary min-w-0 truncate">{target.accountLabel}</span>
              <span
                className={cn(
                  'shrink-0 tabular-nums',
                  reading.level === 'over'
                    ? 'text-destructive-fg'
                    : reading.level === 'near'
                      ? 'text-warning-fg'
                      : 'text-text-tertiary',
                )}
              >
                {reading.level === 'over'
                  ? t.full('composer.editor.characterCountOver', {
                      over: reading.used - reading.limit,
                      limit: reading.limit,
                    })
                  : t.full('composer.editor.characterCount', {
                      used: reading.used,
                      limit: reading.limit,
                    })}
                <VisuallyHidden>
                  {t.full('a11y.label.characterCount', {
                    used: reading.used,
                    limit: reading.limit,
                  })}
                </VisuallyHidden>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
