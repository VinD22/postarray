'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Checkbox, Field, Input } from '@relay/design-system/primitives';
import { formatDateTime, formatTimeZoneLabel } from '@relay/i18n/format';
import { useTranslations } from '@relay/i18n/react';

import { PLANNER_ZONES, planZones, wallTimeToInstant } from './zone-planner';
import { StatusTag } from './result-parts';

/**
 * The time zone and daylight saving planner.
 *
 * Zone names come from `Intl`, not from the message catalog, so the list stays
 * correct in every locale without a translation pass and without this file
 * asserting a zone label of its own. The arithmetic is in `zone-planner.ts`.
 */

const DEFAULT_ZONES: readonly string[] = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

export function ZonePlannerPanel({ sourceZone }: { readonly sourceZone: string }): ReactElement {
  const t = useTranslations();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [zone, setZone] = useState(sourceZone);
  const [audience, setAudience] = useState<readonly string[]>(DEFAULT_ZONES);

  const instant = useMemo(() => wallTimeToInstant(date, time, zone), [date, time, zone]);
  const rows = useMemo(
    () => (instant === null ? [] : planZones(instant, [...audience])),
    [instant, audience],
  );

  function toggle(candidate: string, checked: boolean): void {
    setAudience((current) =>
      checked ? [...current, candidate] : current.filter((entry) => entry !== candidate),
    );
  }

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.full('web.tools.timeZone.field.date.label')}>
            {(control) => (
              <Input
                id={control.id}
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            )}
          </Field>
          <Field label={t.full('web.tools.timeZone.field.time.label')}>
            {(control) => (
              <Input
                id={control.id}
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            )}
          </Field>
        </div>

        <Field label={t.full('web.tools.timeZone.field.zone.label')}>
          {(control) => (
            <select
              id={control.id}
              value={zone}
              onChange={(event) => setZone(event.target.value)}
              className="border-border-default bg-surface-raised text-body-md text-text-primary focus-visible:outline-border-focus min-h-11 w-full rounded-md border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {PLANNER_ZONES.map((candidate) => (
                <option key={candidate} value={candidate}>
                  {formatTimeZoneLabel(t.locale, candidate)}
                </option>
              ))}
            </select>
          )}
        </Field>

        <fieldset className="border-border-default border-t pt-4">
          <legend className="text-title-sm text-text-primary">
            {t.full('web.tools.timeZone.field.audience.label')}
          </legend>
          <p className="text-body-sm text-text-tertiary mt-1">
            {t.full('web.tools.timeZone.field.audience.help')}
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {PLANNER_ZONES.map((candidate) => (
              <li key={candidate} className="flex items-center gap-2">
                <Checkbox
                  id={`planner-zone-${candidate}`}
                  checked={audience.includes(candidate)}
                  onCheckedChange={(checked) => toggle(candidate, checked === true)}
                />
                <label
                  htmlFor={`planner-zone-${candidate}`}
                  className="text-body-sm text-text-secondary"
                >
                  {formatTimeZoneLabel(t.locale, candidate)}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>

      <section aria-labelledby="planner-results-heading" className="flex flex-col gap-4">
        <h2 id="planner-results-heading" className="text-title-sm text-text-primary">
          {t.full('web.tools.timeZone.result.title')}
        </h2>

        {instant === null ? (
          <p className="text-body-sm text-text-tertiary">
            {t.full('web.tools.timeZone.result.invalidDate')}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-body-sm text-text-tertiary">
            {t.full('web.tools.timeZone.result.empty')}
          </p>
        ) : (
          <ul className="border-border-default border-t">
            {rows.map((row) => (
              <li
                key={row.timeZone}
                className="border-border-subtle flex flex-col gap-2 border-b py-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-body-lg text-text-primary">
                    {formatTimeZoneLabel(t.locale, row.timeZone, { at: row.instant })}
                  </h3>
                  {row.shifts ? (
                    <StatusTag
                      status="warning"
                      label={t.full('web.tools.preflight.status.warning')}
                    />
                  ) : null}
                </div>
                <p className="text-body-sm text-text-secondary tabular-nums">
                  {formatDateTime(t.locale, row.instant, {
                    timeZone: row.timeZone,
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-body-sm text-text-tertiary tabular-nums">
                  {t.full('web.tools.timeZone.result.later', {
                    time: formatDateTime(t.locale, row.laterInstant, {
                      timeZone: row.timeZone,
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }),
                  })}
                </p>
                <p className="text-body-sm text-text-tertiary">
                  {row.shifts
                    ? t.full('web.tools.timeZone.result.shift')
                    : t.full('web.tools.timeZone.result.stable')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
