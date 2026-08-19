'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Field, Progress, Textarea } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import {
  measurePost,
  type CharacterCounterPage,
  type CharacterCountStatus,
} from './character-counter';
import { SourceNote, StatusTag } from './result-parts';

/**
 * The per platform character counter.
 *
 * Everything is state in this component. There is no fetch, no server action,
 * no storage and no analytics event, which is the promise the page makes above
 * it: what a person pastes here is a draft they have not published yet, and it
 * never leaves the tab. The measurement lives in `character-counter.ts` so the
 * counting rules can be tested without rendering, and so this component cannot
 * quietly acquire a rule of its own.
 */

const PROGRESS_TONE: Readonly<Record<CharacterCountStatus, 'accent' | 'warning' | 'destructive'>> =
  {
    pass: 'accent',
    warning: 'warning',
    fail: 'destructive',
  };

export function CharacterCounterPanel({
  page,
}: {
  readonly page: CharacterCounterPage;
}): ReactElement {
  const t = useTranslations();
  const [body, setBody] = useState('');
  const result = useMemo(() => measurePost(body, page), [body, page]);

  const countSentence = t.full('web.tools.preflight.count.label', {
    count: result.count,
    limit: result.limit,
    unit: page.countingUnit,
  });

  return (
    <div className="flex max-w-[46rem] flex-col gap-6">
      <Field
        label={t.full('web.toolDirectory.counter.field.draft.label')}
        description={t.full('web.toolDirectory.counter.field.draft.help')}
      >
        {(control) => (
          <Textarea
            id={control.id}
            aria-describedby={control['aria-describedby']}
            rows={8}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        )}
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <StatusTag
          status={result.status}
          label={t(`web.tools.preflight.status.${result.status}`)}
        />
        <p aria-live="polite" className="text-body-md text-text-primary tabular-nums">
          {countSentence}
        </p>
      </div>

      <Progress
        label={t.full('web.toolDirectory.counter.progress.label')}
        valueText={countSentence}
        value={Math.min(result.count, result.limit)}
        max={result.limit}
        tone={PROGRESS_TONE[result.status]}
      />

      <p className="text-body-sm text-text-secondary">
        {body === ''
          ? t.full('web.toolDirectory.counter.result.empty')
          : result.over > 0
            ? t.full('web.tools.preflight.finding.textOver', { over: result.over })
            : t.full('web.toolDirectory.counter.result.remaining', {
                remaining: result.remaining,
              })}
      </p>

      {result.linkCount === 0 ? null : (
        <p className="text-body-sm text-text-tertiary">
          {t.full('web.toolDirectory.counter.result.links', { links: result.linkCount })}{' '}
          {result.linkCost === null
            ? t.full('web.tools.preflight.finding.linkActual')
            : t.full('web.tools.preflight.finding.linkFixed', { cost: result.linkCost })}
        </p>
      )}

      <SourceNote source={page.source} />
    </div>
  );
}
