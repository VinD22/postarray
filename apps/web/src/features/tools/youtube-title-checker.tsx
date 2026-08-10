'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Field, Input } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { PUBLISHING_LIMITS } from '@/features/marketing/data/publishing-limits';

import { countGraphemes, takeGraphemes } from './text-count';
import { SourceNote, StatusTag } from './result-parts';

/**
 * The YouTube title length checker.
 *
 * The ceiling is read from the generated dataset, so this component cannot
 * drift from what the uploader would enforce. The "front of the title" preview
 * is deliberately labelled as a rough reading width, not as a truncation point:
 * YouTube does not publish where it cuts, so printing a number there would be
 * an invented fact.
 */

/** Roughly what a narrow surface has room for. Presentation only, never a limit. */
const FRONT_LOADED_CHARACTERS = 45;

export function YouTubeTitleChecker(): ReactElement {
  const t = useTranslations();
  const [title, setTitle] = useState('');
  const limits = PUBLISHING_LIMITS.youtube;
  const limit = limits.maxTitleLength;

  const count = useMemo(() => countGraphemes(title), [title]);

  if (limit === null) {
    return (
      <p className="text-body-md text-text-tertiary">
        {t.full('web.tools.youtubeTitle.result.unavailable')}
      </p>
    );
  }

  const over = count - limit;

  return (
    <div className="flex max-w-[46rem] flex-col gap-6">
      <Field
        label={t.full('web.tools.youtubeTitle.field.title.label')}
        description={t.full('web.tools.youtubeTitle.field.title.help')}
      >
        {(control) => (
          <Input
            id={control.id}
            aria-describedby={control['aria-describedby']}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        )}
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <StatusTag
          status={over > 0 ? 'fail' : 'pass'}
          label={
            over > 0
              ? t.full('web.tools.preflight.status.fail')
              : t.full('web.tools.preflight.status.pass')
          }
        />
        <p aria-live="polite" className="text-body-md text-text-primary tabular-nums">
          {t.full('web.tools.youtubeTitle.result.count', { count, limit })}
        </p>
      </div>

      <p className="text-body-sm text-text-secondary">
        {over > 0
          ? t.full('web.tools.youtubeTitle.result.over', { over })
          : t.full('web.tools.youtubeTitle.result.fits')}
      </p>

      {title === '' ? null : (
        <p className="text-body-sm text-text-tertiary">
          {t.full('web.tools.youtubeTitle.result.front', {
            count: FRONT_LOADED_CHARACTERS,
            preview: takeGraphemes(title, FRONT_LOADED_CHARACTERS),
          })}
        </p>
      )}

      <SourceNote source={limits.source} />
    </div>
  );
}
