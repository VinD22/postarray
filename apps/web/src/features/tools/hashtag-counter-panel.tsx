'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Field, Textarea } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { countHashtagsAndMentions } from './hashtag-counter';
import { StatusTag } from './result-parts';

/**
 * The hashtag and mention counter.
 *
 * Counts and flags duplicates, both facts about the pasted text itself. It
 * does not check the total against a platform ceiling: the generated
 * publishing-limits dataset every other tool on this site reads from has no
 * hashtag count field, so there is no sourced number to check against here.
 * `web.toolDirectory.hashtagCounter.result.noLimitData` says so plainly rather
 * than this component quietly typing in the commonly cited "30".
 */

export function HashtagCounterPanel(): ReactElement {
  const t = useTranslations();
  const [body, setBody] = useState('');
  const result = useMemo(() => countHashtagsAndMentions(body), [body]);
  const empty = body.trim() === '';

  return (
    <div className="flex max-w-[46rem] flex-col gap-6">
      <Field
        label={t.full('web.toolDirectory.hashtagCounter.field.draft.label')}
        description={t.full('web.toolDirectory.hashtagCounter.field.draft.help')}
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

      <section
        aria-labelledby="hashtag-counter-result-heading"
        aria-live="polite"
        className="flex flex-col gap-4"
      >
        <h2 id="hashtag-counter-result-heading" className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.hashtagCounter.result.title')}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-border-default border-t pt-3">
            <p className="text-title-md text-text-primary tabular-nums">{result.hashtagCount}</p>
            <p className="text-body-sm text-text-tertiary">
              {t.full('web.toolDirectory.hashtagCounter.result.hashtags')}
            </p>
            {result.duplicateHashtags.length > 0 ? (
              <p className="text-body-sm text-text-secondary mt-1">
                {t.full('web.toolDirectory.hashtagCounter.result.uniqueHashtags', {
                  count: result.uniqueHashtagCount,
                })}
              </p>
            ) : null}
          </div>
          <div className="border-border-default border-t pt-3">
            <p className="text-title-md text-text-primary tabular-nums">{result.mentionCount}</p>
            <p className="text-body-sm text-text-tertiary">
              {t.full('web.toolDirectory.hashtagCounter.result.mentions')}
            </p>
          </div>
        </div>

        {result.duplicateHashtags.length > 0 ? (
          <div>
            <h3 className="text-body-lg text-text-primary">
              {t.full('web.toolDirectory.hashtagCounter.result.duplicatesTitle')}
            </h3>
            <ul className="border-border-default mt-2 border-t">
              {result.duplicateHashtags.map((group) => (
                <li
                  key={group.text.toLocaleLowerCase()}
                  className="border-border-subtle flex items-center justify-between gap-3 border-b py-2"
                >
                  <span className="text-body-md text-text-primary font-mono">{group.text}</span>
                  <StatusTag
                    status="warning"
                    label={t.full('web.toolDirectory.hashtagCounter.result.duplicateCount', {
                      count: group.count,
                    })}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : empty ? null : (
          <p className="text-body-sm text-text-secondary">
            {t.full('web.toolDirectory.hashtagCounter.result.noDuplicates')}
          </p>
        )}

        <p className="text-body-sm text-text-tertiary">
          {t.full('web.toolDirectory.hashtagCounter.result.noLimitData')}
        </p>
      </section>
    </div>
  );
}
