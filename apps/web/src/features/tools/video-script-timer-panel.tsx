'use client';

import { useMemo, useState, type ReactElement } from 'react';
import {
  Field,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  Textarea,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import {
  countWords,
  estimateSpokenDuration,
  SCRIPT_PACES,
  SHORT_VIDEO_DURATIONS_SECONDS,
  wordBudgetsForPace,
} from './video-script-timer';

/**
 * The video script timer.
 *
 * Pure arithmetic on a word count: no dataset, no network. The two paces are
 * a stated assumption, not a platform fact, and the copy says so; see
 * `video-script-timer.ts` for why there is no third, more "precise" pace on
 * offer.
 */

export function VideoScriptTimerPanel(): ReactElement {
  const t = useTranslations();
  const [script, setScript] = useState('');
  const wordCount = useMemo(() => countWords(script), [script]);

  const durations = useMemo(
    () => SCRIPT_PACES.map((pace) => estimateSpokenDuration(wordCount, pace)),
    [wordCount],
  );

  const budgetsByPace = useMemo(
    () => SCRIPT_PACES.map((pace) => ({ pace, budgets: wordBudgetsForPace(pace, wordCount) })),
    [wordCount],
  );

  return (
    <div className="flex max-w-[46rem] flex-col gap-8">
      <Field
        label={t.full('web.toolDirectory.videoScriptTimer.field.script.label')}
        description={t.full('web.toolDirectory.videoScriptTimer.field.script.help')}
      >
        {(control) => (
          <Textarea
            id={control.id}
            aria-describedby={control['aria-describedby']}
            rows={10}
            value={script}
            onChange={(event) => setScript(event.target.value)}
          />
        )}
      </Field>

      <section aria-labelledby="video-timer-duration-heading" className="flex flex-col gap-3">
        <h2 id="video-timer-duration-heading" className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.videoScriptTimer.result.wordCount', { count: wordCount })}
        </h2>
        <ul aria-live="polite" className="border-border-default border-t">
          {durations.map((estimate) => (
            <li
              key={estimate.paceId}
              className="border-border-subtle flex flex-wrap items-baseline justify-between gap-2 border-b py-3"
            >
              <span className="text-body-md text-text-primary">
                {t.full(`web.toolDirectory.videoScriptTimer.pace.${estimate.paceId}`, {
                  wpm: estimate.wordsPerMinute,
                })}
              </span>
              <span className="text-body-md text-text-secondary tabular-nums">
                {t.full('web.toolDirectory.videoScriptTimer.result.duration', {
                  seconds: Math.round(estimate.seconds),
                })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="video-timer-budget-heading" className="flex flex-col gap-3">
        <h2 id="video-timer-budget-heading" className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.videoScriptTimer.result.budgetTitle')}
        </h2>
        <p className="text-body-sm text-text-tertiary">
          {t.full('web.toolDirectory.videoScriptTimer.result.budgetHelp')}
        </p>
        <TableContainer>
          <Table density="comfortable">
            <TableCaption className="sr-only">
              {t.full('web.toolDirectory.videoScriptTimer.result.budgetTitle')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t.full('web.toolDirectory.videoScriptTimer.result.durationColumn')}
                </TableHead>
                {SCRIPT_PACES.map((pace) => (
                  <TableHead key={pace.id}>
                    {t.full(`web.toolDirectory.videoScriptTimer.pace.${pace.id}`, {
                      wpm: pace.wordsPerMinute,
                    })}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {SHORT_VIDEO_DURATIONS_SECONDS.map((seconds, rowIndex) => (
                <TableRow key={seconds}>
                  <TableRowHeader>
                    {t.full('web.toolDirectory.videoScriptTimer.result.durationValue', { seconds })}
                  </TableRowHeader>
                  {budgetsByPace.map(({ pace, budgets }) => {
                    const budget = budgets[rowIndex];
                    return (
                      <TableCell key={pace.id} className="tabular-nums">
                        {budget === undefined
                          ? ''
                          : t.full('web.toolDirectory.videoScriptTimer.result.budgetCell', {
                              budget: budget.wordBudget,
                              remainingAbs: Math.abs(budget.wordsRemaining),
                              status: budget.wordsRemaining < 0 ? 'over' : 'left',
                            })}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </div>
  );
}
