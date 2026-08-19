'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { Field, Input } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { findInvisibleCharacters, INVISIBLE_CHARACTERS } from './invisible-characters';
import { CopyButton } from './result-parts';

/**
 * The invisible character copier.
 *
 * A copy button per character and a paste-test field that reads back what
 * actually landed on the clipboard. `findInvisibleCharacters` runs entirely on
 * the pasted text already in this tab; nothing about the paste is sent
 * anywhere or logged.
 */

export function InvisibleCharacterPanel(): ReactElement {
  const t = useTranslations();
  const [pasted, setPasted] = useState('');
  const matches = useMemo(() => findInvisibleCharacters(pasted), [pasted]);

  return (
    <div className="flex max-w-[46rem] flex-col gap-8">
      <ul className="border-border-bold border-t-2">
        {INVISIBLE_CHARACTERS.map((entry) => (
          <li key={entry.id} className="border-border-default flex flex-col gap-2 border-b py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-body-lg text-text-primary">{t.full(entry.nameKey)}</h3>
              <span className="text-body-sm text-text-tertiary font-mono">{entry.codepoint}</span>
            </div>
            <p className="text-body-sm text-text-secondary">{t.full(entry.explainerKey)}</p>
            <div>
              <CopyButton value={entry.char} />
            </div>
          </li>
        ))}
      </ul>

      <section aria-labelledby="invisible-character-paste-test-heading" className="flex flex-col gap-3">
        <h2 id="invisible-character-paste-test-heading" className="text-title-sm text-text-primary">
          {t.full('web.toolDirectory.invisibleCharacter.pasteTest.title')}
        </h2>
        <Field
          label={t.full('web.toolDirectory.invisibleCharacter.pasteTest.field.label')}
          description={t.full('web.toolDirectory.invisibleCharacter.pasteTest.field.help')}
        >
          {(control) => (
            <Input
              id={control.id}
              aria-describedby={control['aria-describedby']}
              value={pasted}
              onChange={(event) => setPasted(event.target.value)}
            />
          )}
        </Field>

        <p aria-live="polite" className="text-body-sm text-text-secondary">
          {pasted === ''
            ? t.full('web.toolDirectory.invisibleCharacter.pasteTest.result.empty')
            : matches.length === 0
              ? t.full('web.toolDirectory.invisibleCharacter.pasteTest.result.none')
              : matches
                  .map((match) =>
                    t.full('web.toolDirectory.invisibleCharacter.pasteTest.result.found', {
                      name: t.full(match.entry.nameKey),
                      count: match.count,
                    }),
                  )
                  .join(' ')}
        </p>
      </section>
    </div>
  );
}
