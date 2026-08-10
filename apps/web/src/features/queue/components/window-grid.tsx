'use client';

import type { ReactElement } from 'react';
import type { QueueWindow } from '@relay/contracts';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import { HOURS_IN_DAY, WEEKDAYS, isHourSelected, toClock, MINUTES_PER_HOUR } from '../rule-draft';

/**
 * The weekly availability grid.
 *
 * Every cell is a real toggle button with an accessible name and an
 * `aria-pressed` state. There is no drag gesture here at all, so there is
 * nothing to provide a keyboard equivalent for, and the state is never carried
 * by colour alone: a selected cell also says so in its accessible name and
 * carries a filled marker.
 */

export interface WindowGridProps {
  readonly windows: readonly QueueWindow[];
  readonly onToggle: (weekday: number, hour: number) => void;
  readonly disabled?: boolean;
}

export function WindowGrid({ windows, onToggle, disabled = false }: WindowGridProps): ReactElement {
  const t = useTranslations();
  const hours = Array.from({ length: HOURS_IN_DAY }, (_value, hour) => hour);

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-0.5">
        <caption className="text-body-sm text-text-tertiary pb-2 text-start">
          {t.full('queue.windows.gridLabel')}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="text-body-sm text-text-tertiary px-1 text-start">
              {t.full('queue.windows.weekday')}
            </th>
            {hours.map((hour) => (
              <th
                key={hour}
                scope="col"
                className="text-body-sm text-text-tertiary px-1 tabular-nums"
              >
                {String(hour).padStart(2, '0')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEKDAYS.map((weekday) => (
            <tr key={weekday}>
              <th
                scope="row"
                className="text-body-sm text-text-secondary pe-2 text-start whitespace-nowrap"
              >
                {t.full(`queue.weekday.${weekday}` as 'queue.weekday.1')}
              </th>
              {hours.map((hour) => {
                const selected = isHourSelected(windows, weekday, hour);
                return (
                  <td key={hour}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      disabled={disabled}
                      onClick={() => onToggle(weekday, hour)}
                      className={cn(
                        'border-border-default focus-visible:outline-border-focus size-6 border-2 focus-visible:outline-2 focus-visible:outline-offset-2',
                        selected ? 'bg-accent-default' : 'bg-surface-default',
                      )}
                    >
                      <span className="sr-only">
                        {t.full('queue.windows.toggleCell', {
                          weekday: t.full(`queue.weekday.${weekday}` as 'queue.weekday.1'),
                          hour: toClock(hour * MINUTES_PER_HOUR),
                        })}
                      </span>
                      <span aria-hidden className="block text-center leading-none">
                        {selected ? '▪' : ''}
                      </span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-body-sm text-text-tertiary pt-2">{t.full('queue.windows.help')}</p>
    </div>
  );
}
