'use client';

import { useMemo, useState, type ReactElement } from 'react';
import {
  Field,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { CHARACTER_COUNTER_PAGES, splitThread, type CharacterCounterPage } from './thread-splitter';
import { CopyButton, SourceNote, StatusTag } from './result-parts';

/**
 * The thread splitter.
 *
 * No fetch, no storage. The split itself lives in `thread-splitter.ts`, which
 * reuses the same counting rules the per platform character counters use, so
 * this component only holds the form and renders whatever `splitThread`
 * decided.
 */

function defaultSlug(): string {
  const preferred = CHARACTER_COUNTER_PAGES.find((page) => page.slug === 'x');
  return preferred?.slug ?? CHARACTER_COUNTER_PAGES[0]?.slug ?? '';
}

export function ThreadSplitterPanel(): ReactElement {
  const t = useTranslations();
  const [body, setBody] = useState('');
  const [slug, setSlug] = useState(defaultSlug);

  const page = useMemo<CharacterCounterPage | undefined>(
    () => CHARACTER_COUNTER_PAGES.find((candidate) => candidate.slug === slug),
    [slug],
  );

  const result = useMemo(
    () => (page === undefined ? { limit: 0, parts: [] } : splitThread(body, page)),
    [body, page],
  );

  return (
    <div className="flex max-w-[46rem] flex-col gap-6">
      <Field
        label={t.full('web.toolDirectory.threadSplitter.field.draft.label')}
        description={t.full('web.toolDirectory.threadSplitter.field.draft.help')}
      >
        {(control) => (
          <Textarea
            id={control.id}
            aria-describedby={control['aria-describedby']}
            rows={10}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        )}
      </Field>

      <Field label={t.full('web.toolDirectory.threadSplitter.field.network.label')}>
        {(control) => (
          <Select value={slug} onValueChange={setSlug}>
            <SelectTrigger id={control.id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHARACTER_COUNTER_PAGES.map((candidate) => (
                <SelectItem key={candidate.slug} value={candidate.slug}>
                  {t.full(candidate.nameKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      {page === undefined ? null : (
        <section aria-labelledby="thread-splitter-result-heading" className="flex flex-col gap-4">
          <h2 id="thread-splitter-result-heading" className="text-title-sm text-text-primary">
            {t.full('web.toolDirectory.threadSplitter.result.title')}
          </h2>

          {body.trim() === '' ? (
            <p className="text-body-sm text-text-tertiary">
              {t.full('web.toolDirectory.threadSplitter.result.empty')}
            </p>
          ) : (
            <ol aria-live="polite" className="flex flex-col gap-6">
              {result.parts.map((part) => {
                const status = part.over > 0 ? 'fail' : 'pass';
                return (
                  <li key={part.index} className="border-border-default border-t pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-body-lg text-text-primary">
                        {t.full('web.toolDirectory.threadSplitter.result.partLabel', {
                          index: part.index,
                          total: result.parts.length,
                        })}
                      </h3>
                      <StatusTag status={status} label={t(`web.tools.preflight.status.${status}`)} />
                    </div>
                    <p className="text-body-md text-text-primary mt-2 whitespace-pre-wrap">
                      {part.text}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <p className="text-body-sm text-text-secondary tabular-nums">
                        {t.full('web.tools.preflight.count.label', {
                          count: part.count,
                          limit: part.limit,
                          unit: page.countingUnit,
                        })}
                      </p>
                      <CopyButton value={part.text} />
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <SourceNote source={page.source} />
        </section>
      )}
    </div>
  );
}
