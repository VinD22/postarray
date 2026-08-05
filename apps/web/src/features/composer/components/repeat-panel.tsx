'use client';

/**
 * Repeat.
 *
 * A cadence on its own is not a valid repeat: an end date or an occurrence
 * count is required, and the panel says so before it can be saved. The first
 * occurrences are listed with their real dates so nobody has to imagine what
 * "every 14 days" means from today.
 */

import { useMemo, type ReactNode } from 'react';
import {
  Field,
  Input,
  RadioGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatDate } from '@relay/i18n';
import { REPEAT_CADENCE_DAYS, type RepeatCadenceDays } from '@relay/contracts';

import { useComposer } from '../composer-context.js';
import { repeatOccurrences } from '../state/selectors.js';
import { RadioRow, SwitchRow } from './form-rows.js';

const MAX_OCCURRENCES = 52;
const PREVIEW_LIMIT = 4;

export function RepeatPanel(): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, dispatch } = useComposer();
  const schedule = state.master.schedule;
  const repeat = schedule?.repeat ?? null;
  const zone = schedule?.ianaTimeZone ?? bootstrap.workspaceTimeZone;

  const occurrences = useMemo(() => {
    if (!schedule || !repeat) {
      return [];
    }
    return repeatOccurrences(
      schedule.instant,
      repeat.cadenceDays,
      repeat.endDate,
      repeat.count,
      MAX_OCCURRENCES,
    );
  }, [repeat, schedule]);

  const endMissing = repeat !== null && repeat.endDate === null && repeat.count === null;
  const endMode = repeat?.count !== null && repeat?.count !== undefined ? 'count' : 'date';

  return (
    <section aria-labelledby="composer-repeat-heading" className="flex flex-col gap-3">
      <h3 id="composer-repeat-heading" className="text-title-sm text-text-primary">
        {t.full('composer.repeat.title')}
      </h3>

      {schedule === null ? (
        <p className="text-body-sm text-text-tertiary">
          {t.full('composerWeb.summary.notScheduled')}
        </p>
      ) : (
        <>
          <SwitchRow
            checked={repeat !== null}
            label={t.full('composerWeb.repeat.enable')}
            description={t.full('composerWeb.repeat.duplicateCheck')}
            onCheckedChange={(checked) =>
              dispatch({
                type: 'schedule/repeat',
                repeat: checked ? { cadenceDays: 7, endDate: null, count: 4 } : null,
              })
            }
          />

          {repeat === null ? null : (
            <>
              <Field label={t.full('composerWeb.repeat.cadenceLabel')}>
                {(control) => (
                  <Select
                    value={String(repeat.cadenceDays)}
                    onValueChange={(value) =>
                      dispatch({
                        type: 'schedule/repeat',
                        repeat: { ...repeat, cadenceDays: Number(value) as RepeatCadenceDays },
                      })
                    }
                  >
                    <SelectTrigger id={control.id}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REPEAT_CADENCE_DAYS.map((days) => (
                        <SelectItem key={days} value={String(days)}>
                          {t.full('composer.repeat.everyDays', { count: days })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>

              <RadioGroup
                value={endMode}
                aria-label={t.full('composer.repeat.endLabel')}
                onValueChange={(value) =>
                  dispatch({
                    type: 'schedule/repeat',
                    repeat:
                      value === 'count'
                        ? { ...repeat, endDate: null, count: repeat.count ?? 4 }
                        : {
                            ...repeat,
                            count: null,
                            endDate: repeat.endDate ?? isoDatePlusDays(30),
                          },
                  })
                }
                className="flex flex-col"
              >
                <RadioRow value="date" label={t.full('composer.repeat.endOnDate')} />
                <RadioRow value="count" label={t.full('composer.repeat.endAfterCount')} />
              </RadioGroup>

              {endMode === 'date' ? (
                <Field
                  label={t.full('composer.schedule.dateLabel')}
                  required
                  error={endMissing ? t.full('composer.repeat.endRequired') : undefined}
                >
                  {(control) => (
                    <Input
                      id={control.id}
                      type="date"
                      value={repeat.endDate ?? ''}
                      aria-describedby={control['aria-describedby']}
                      onChange={(event) =>
                        dispatch({
                          type: 'schedule/repeat',
                          repeat: {
                            ...repeat,
                            count: null,
                            endDate: event.target.value.length === 0 ? null : event.target.value,
                          },
                        })
                      }
                    />
                  )}
                </Field>
              ) : (
                <Field
                  label={t.full('composerWeb.repeat.occurrenceLabel')}
                  required
                  description={t.full('composerWeb.repeat.maximum', { limit: MAX_OCCURRENCES })}
                  error={endMissing ? t.full('composer.repeat.endRequired') : undefined}
                >
                  {(control) => (
                    <Input
                      id={control.id}
                      type="number"
                      inputMode="numeric"
                      min={2}
                      max={MAX_OCCURRENCES}
                      value={repeat.count ?? ''}
                      aria-describedby={control['aria-describedby']}
                      onChange={(event) => {
                        const parsed = Number(event.target.value);
                        dispatch({
                          type: 'schedule/repeat',
                          repeat: {
                            ...repeat,
                            endDate: null,
                            count: Number.isFinite(parsed)
                              ? Math.min(Math.max(parsed, 1), MAX_OCCURRENCES)
                              : null,
                          },
                        });
                      }}
                    />
                  )}
                </Field>
              )}

              {occurrences.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <p className="text-label text-text-tertiary">
                    {t.full('composerWeb.repeat.occurrenceList')}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {occurrences.slice(0, PREVIEW_LIMIT).map((instant) => (
                      <li key={instant} className="text-body-sm text-text-secondary tabular-nums">
                        {formatDate(t.locale, instant, { timeZone: zone, dateStyle: 'full' })}
                      </li>
                    ))}
                  </ul>
                  {occurrences.length > PREVIEW_LIMIT ? (
                    <p className="text-body-sm text-text-tertiary">
                      {t.full('composerWeb.repeat.occurrenceMore', {
                        count: occurrences.length - PREVIEW_LIMIT,
                      })}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {endMissing ? (
                <Notice tone="warning" title={t.full('composer.repeat.endRequired')} />
              ) : null}
            </>
          )}
        </>
      )}
    </section>
  );
}

function isoDatePlusDays(days: number): string {
  const date = new Date(Date.now() + days * 86_400_000);
  return date.toISOString().slice(0, 10);
}
