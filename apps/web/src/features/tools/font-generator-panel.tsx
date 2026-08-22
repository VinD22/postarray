'use client';

import { useId, useMemo, useState, type ReactElement } from 'react';
import { Field, Textarea } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import type { MessageKey } from '@relay/i18n/translate';

import { CopyButton } from './result-parts';
import { styleText, type UnicodeStyleId } from './unicode-styles';

/**
 * The Unicode text styler, shared by every page in the text-style cluster.
 *
 * One input, every requested style rendered from it, one copy control per
 * style. The pages differ only in which styles they pass and in the sentence
 * they pass as `platformNoteKey`; none of them re-implements the mapping, which
 * lives in `unicode-styles.ts`.
 *
 * Two pieces of copy are not optional and not configurable, because they are
 * the honest part of this tool: the accessibility caveat and the statement that
 * nothing typed here leaves the tab. They render above the input on every page.
 */

export interface FontGeneratorPanelProps {
  readonly styles: readonly UnicodeStyleId[];
  /**
   * What this page can honestly say about the platform it is named after. Never
   * a claim that a style "works" somewhere: support varies by app, device and
   * day, and we have measured none of it.
   */
  readonly platformNoteKey: MessageKey;
}

export function FontGeneratorPanel(props: FontGeneratorPanelProps): ReactElement {
  const t = useTranslations();
  const headingId = useId();
  const [body, setBody] = useState('');

  const preview = body === '' ? t.full('web.toolDirectory.fontGenerator.sample') : body;
  const samples = useMemo(() => styleText(preview, props.styles), [preview, props.styles]);

  return (
    <div className="flex max-w-[46rem] flex-col gap-8">
      <div className="border-border-bold flex flex-col gap-3 border-2 p-5">
        <h2 className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.fontGenerator.accessibility.title')}
        </h2>
        <p className="text-body-md text-text-secondary leading-[1.6]">
          {t.full('web.toolDirectory.fontGenerator.accessibility.body')}
        </p>
        <p className="text-body-md text-text-secondary leading-[1.6]">
          {t.full('web.toolDirectory.fontGenerator.accessibility.advice')}
        </p>
      </div>

      <p className="text-body-md text-text-secondary max-w-[68ch] leading-[1.6]">
        {t.full(props.platformNoteKey)}
      </p>

      <Field
        label={t.full('web.toolDirectory.fontGenerator.field.draft.label')}
        description={t.full('web.toolDirectory.fontGenerator.field.draft.help')}
      >
        {(control) => (
          <Textarea
            id={control.id}
            aria-describedby={control['aria-describedby']}
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        )}
      </Field>

      <section aria-labelledby={headingId} className="flex flex-col gap-3">
        <h2 id={headingId} className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.fontGenerator.result.title')}
        </h2>
        <p className="text-body-sm text-text-tertiary">
          {body === ''
            ? t.full('web.toolDirectory.fontGenerator.result.sampleNote')
            : t.full('web.toolDirectory.fontGenerator.result.liveNote')}
        </p>

        <ul className="border-border-bold border-t-2">
          {samples.map((sample) => (
            <li key={sample.id} className="border-border-default flex flex-col gap-2 border-b py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-body-lg text-text-primary">{t.full(sample.nameKey)}</h3>
              </div>
              <output
                aria-label={t.full('web.toolDirectory.fontGenerator.result.label', {
                  style: t.full(sample.nameKey),
                })}
                className="text-body-lg text-text-primary block break-words whitespace-pre-wrap"
              >
                {sample.text}
              </output>
              <p className="text-body-sm text-text-tertiary">{t.full(sample.noteKey)}</p>
              <div>
                <CopyButton value={sample.text} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
