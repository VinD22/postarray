'use client';

import { useState, type ReactElement } from 'react';
import type { QueueWindow } from '@relay/contracts';
import {
  Button,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { WEEKDAYS, fromClock, toClock } from '../rule-draft';

/**
 * The typed equivalent of the grid.
 *
 * Everything the grid can express is also reachable here with a day picker and
 * two time fields, so a person who cannot or does not want to use the grid is
 * never stuck. Both edit the same window list.
 */

export interface WindowListProps {
  readonly windows: readonly QueueWindow[];
  readonly onAdd: (window: QueueWindow) => void;
  readonly onRemove: (index: number) => void;
}

export function WindowList({ windows, onAdd, onRemove }: WindowListProps): ReactElement {
  const t = useTranslations();
  const [weekday, setWeekday] = useState('1');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');

  const startMinute = fromClock(start);
  const endMinute = fromClock(end);
  const addable = startMinute !== null && endMinute !== null && startMinute <= endMinute;

  return (
    <section aria-labelledby="queue-windows-heading" className="flex flex-col gap-3">
      <h3 id="queue-windows-heading" className="text-title-sm text-text-primary">
        {t.full('queue.windows.heading')}
      </h3>

      {windows.length === 0 ? (
        <p className="text-body-sm text-text-tertiary">{t.full('queue.windows.empty')}</p>
      ) : (
        <ul className="flex flex-col">
          {windows.map((window, index) => (
            <li
              key={`${window.weekday}-${window.startMinute}-${window.endMinute}`}
              className="border-border-subtle flex items-center justify-between gap-3 border-b py-2 last:border-b-0"
            >
              <span className="text-body-sm text-text-secondary tabular-nums">
                {t.full('queue.windows.entry', {
                  weekday: t.full(`queue.weekday.${window.weekday}` as 'queue.weekday.1'),
                  start: toClock(window.startMinute),
                  end: toClock(window.endMinute),
                })}
              </span>
              <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
                {t.full('queue.windows.remove')}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-2.5 sm:grid-cols-4">
        <Field label={t.full('queue.windows.weekday')}>
          {(control) => (
            <Select value={weekday} onValueChange={setWeekday}>
              <SelectTrigger id={control.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    {t.full(`queue.weekday.${day}` as 'queue.weekday.1')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
        <Field label={t.full('queue.windows.start')}>
          {(control) => (
            <Input
              id={control.id}
              type="time"
              value={start}
              onChange={(event) => setStart(event.target.value)}
            />
          )}
        </Field>
        <Field label={t.full('queue.windows.end')}>
          {(control) => (
            <Input
              id={control.id}
              type="time"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            />
          )}
        </Field>
        <div className="flex items-end">
          <Button
            variant="secondary"
            disabled={!addable}
            onClick={() => {
              if (startMinute === null || endMinute === null) return;
              onAdd({ weekday: Number.parseInt(weekday, 10), startMinute, endMinute });
            }}
          >
            {t.full('queue.windows.add')}
          </Button>
        </div>
      </div>
    </section>
  );
}
