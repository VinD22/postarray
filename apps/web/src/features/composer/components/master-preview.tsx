'use client';

/**
 * The preview column while the master draft is open.
 *
 * It used to render nothing until a single target was opened, so the column
 * next to the draft people spend most of their time in was empty. It now draws
 * the real platform preview for one selected account, chosen here without
 * leaving the master draft. The preview itself is the same `PreviewHost` the
 * per-target view uses, so nothing about the rendering is duplicated.
 */

import { useState, type ReactNode } from 'react';
import {
  Field,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { PreviewHost } from '../previews/preview-host';
import { PROVIDER_LABEL } from './provider-identity';

export function MasterPreview(): ReactNode {
  const t = useTranslations();
  const { summaries } = useComposer();
  const [chosen, setChosen] = useState<string | null>(null);

  if (summaries.length === 0) {
    return (
      <p className="text-body-sm text-text-tertiary">{t.full('composerWeb.preview.noTargets')}</p>
    );
  }

  // A removed target falls back to the first one rather than to nothing.
  const summary = summaries.find((entry) => entry.connectionId === chosen) ?? summaries[0] ?? null;
  if (summary === null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {summaries.length > 1 ? (
        <Field label={t.full('composerWeb.preview.pickTarget')}>
          {(control) => (
            <Select value={summary.connectionId} onValueChange={setChosen}>
              <SelectTrigger id={control.id} aria-describedby={control['aria-describedby']}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {summaries.map((entry) => (
                  <SelectItem key={entry.connectionId} value={entry.connectionId}>
                    {t.full('composer.preview.forAccount', {
                      account: entry.account.displayName,
                      provider: PROVIDER_LABEL[entry.account.provider],
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      ) : null}
      <PreviewHost summary={summary} />
    </div>
  );
}
