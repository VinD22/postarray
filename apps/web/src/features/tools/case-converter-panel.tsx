'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Button, Field, Textarea } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { CASE_CONVERSION_MODES, convertCase, type CaseConversionMode } from './case-converter';
import { CopyButton } from './result-parts';

/**
 * The case converter.
 *
 * The conversion itself lives in `case-converter.ts`, which is where a URL, a
 * hashtag and an @mention are found and kept out of every mode's transform.
 * This component only holds the mode choice and shows the result.
 */

export function CaseConverterPanel(): ReactElement {
  const t = useTranslations();
  const [body, setBody] = useState('');
  const [mode, setMode] = useState<CaseConversionMode>('sentence');

  const result = useMemo(() => convertCase(body, mode), [body, mode]);

  return (
    <div className="flex max-w-[46rem] flex-col gap-6">
      <Field
        label={t.full('web.toolDirectory.caseConverter.field.draft.label')}
        description={t.full('web.toolDirectory.caseConverter.field.draft.help')}
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

      <fieldset>
        <legend className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.caseConverter.field.mode.label')}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {CASE_CONVERSION_MODES.map((candidate) => (
            <Button
              key={candidate}
              type="button"
              variant={mode === candidate ? 'primary' : 'secondary'}
              size="sm"
              aria-pressed={mode === candidate}
              onClick={() => setMode(candidate)}
            >
              {t.full(`web.toolDirectory.caseConverter.field.mode.${candidate}`)}
            </Button>
          ))}
        </div>
      </fieldset>

      <section aria-labelledby="case-converter-result-heading" className="flex flex-col gap-3">
        <h2 id="case-converter-result-heading" className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.caseConverter.result.title')}
        </h2>

        {body === '' ? (
          <p className="text-body-sm text-text-tertiary">
            {t.full('web.toolDirectory.caseConverter.result.empty')}
          </p>
        ) : (
          <>
            <output
              aria-label={t.full('web.toolDirectory.caseConverter.result.label')}
              aria-live="polite"
              className="border-border-bold text-body-md text-text-primary block border-2 p-4 whitespace-pre-wrap"
            >
              {result.text}
            </output>
            <div className="flex flex-wrap items-center gap-3">
              <CopyButton value={result.text} />
              {result.preservedCount > 0 ? (
                <p className="text-body-sm text-text-tertiary">
                  {t.full('web.toolDirectory.caseConverter.result.preserved', {
                    count: result.preservedCount,
                  })}
                </p>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
