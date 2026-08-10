'use client';

import { useState, type ReactElement } from 'react';
import type { QueueBlackout } from '@relay/contracts';
import { Button, Field, Input } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

/** Dates this project will not post on, read in the rule's own time zone. */

export interface BlackoutListProps {
  readonly blackouts: readonly QueueBlackout[];
  readonly onAdd: (span: QueueBlackout) => void;
  readonly onRemove: (index: number) => void;
}

export function BlackoutList({ blackouts, onAdd, onRemove }: BlackoutListProps): ReactElement {
  const t = useTranslations();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const addable = from.length > 0 && to.length > 0 && from <= to;

  return (
    <section aria-labelledby="queue-blackouts-heading" className="flex flex-col gap-3">
      <h3 id="queue-blackouts-heading" className="text-title-sm text-text-primary">
        {t.full('queue.blackouts.heading')}
      </h3>
      <p className="text-body-sm text-text-tertiary">{t.full('queue.blackouts.help')}</p>

      {blackouts.length === 0 ? (
        <p className="text-body-sm text-text-tertiary">{t.full('queue.blackouts.empty')}</p>
      ) : (
        <ul className="flex flex-col">
          {blackouts.map((span, index) => (
            <li
              key={`${span.from}-${span.to}`}
              className="border-border-subtle flex items-center justify-between gap-3 border-b py-2 last:border-b-0"
            >
              <span className="text-body-sm text-text-secondary tabular-nums">
                {t.full('queue.blackouts.entry', { from: span.from, to: span.to })}
              </span>
              <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
                {t.full('queue.blackouts.remove')}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-2.5 sm:grid-cols-3">
        <Field label={t.full('queue.blackouts.from')}>
          {(control) => (
            <Input
              id={control.id}
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          )}
        </Field>
        <Field label={t.full('queue.blackouts.to')}>
          {(control) => (
            <Input
              id={control.id}
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          )}
        </Field>
        <div className="flex items-end">
          <Button
            variant="secondary"
            disabled={!addable}
            onClick={() => {
              onAdd({ from, to });
              setFrom('');
              setTo('');
            }}
          >
            {t.full('queue.blackouts.add')}
          </Button>
        </div>
      </div>
    </section>
  );
}
