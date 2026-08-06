'use client';

/**
 * Alt text as a first class field.
 *
 * Two exits, both explicit: write a description, or waive it with a reason.
 * There is no silent skip, and the accounts that require it are named so the
 * consequence of waiving is visible before the choice is made.
 */

import { useState, type ReactNode } from 'react';
import { Button, Field, Input, Textarea } from '@relay/design-system/primitives';
import { CapabilityBadge, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatDate } from '@relay/i18n';

import { Sticker } from '@/features/marketing/components/loud/sticker';
import { altTextLimit, altTextRequiredBy, type AccountRule } from '../state/media-rules';
import { CheckRow } from '../../composer/components/form-rows';
import type { MediaAsset } from '../types';

export interface AltTextFormProps {
  readonly asset: MediaAsset;
  readonly rules: readonly AccountRule[];
  readonly onSave: (input: {
    altText: string | null;
    waived: boolean;
    waivedReason: string | null;
  }) => Promise<void>;
  /** Present only when a text assistant is configured for this workspace. */
  readonly onSuggest?: () => Promise<string>;
}

export function AltTextForm({ asset, rules, onSave, onSuggest }: AltTextFormProps): ReactNode {
  const t = useTranslations();
  const [altText, setAltText] = useState(asset.altText ?? '');
  const [waived, setWaived] = useState(asset.altTextWaived);
  const [reason, setReason] = useState(asset.altTextWaivedReason ?? '');
  const [busy, setBusy] = useState(false);

  const limit = altTextLimit(rules);
  const requiredBy = altTextRequiredBy(asset, rules);
  const unsupportedBy = rules.filter((rule) => rule.capabilities.media.altText !== 'supported');

  const save = (): void => {
    setBusy(true);
    void onSave({
      altText: waived ? null : altText.trim().length === 0 ? null : altText.trim(),
      waived,
      waivedReason: waived ? reason.trim() : null,
    }).finally(() => setBusy(false));
  };

  return (
    <section aria-labelledby="alt-text-heading" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 id="alt-text-heading" className="text-title-sm text-text-primary">
          {t.full('mediaLib.alt.heading')}
        </h3>
        {altText.trim().length === 0 && !waived ? (
          <Sticker tone="pop" rotate={-3}>
            {t.full('mediaLib.alt.nudge')}
          </Sticker>
        ) : null}
      </div>
      <p className="text-body-sm text-text-secondary">{t.full('mediaLib.alt.help')}</p>

      {requiredBy.length > 0 ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t.full('mediaLib.alt.requiredBy', { accounts: requiredBy.join(', ') })}
        />
      ) : null}

      <Field
        label={t.full('composer.media.altText.label')}
        description={
          limit === null ? undefined : t.full('mediaLib.alt.count', { used: altText.length, limit })
        }
        disabled={waived}
      >
        {(control) => (
          <Textarea
            id={control.id}
            value={altText}
            disabled={waived}
            aria-describedby={control['aria-describedby']}
            maxLength={limit ?? undefined}
            placeholder={t.full('composer.media.altText.placeholder')}
            autoGrow
            minRows={3}
            maxRows={8}
            onChange={(event) => setAltText(event.target.value)}
          />
        )}
      </Field>

      <CheckRow
        checked={waived}
        onCheckedChange={setWaived}
        label={t.full('mediaLib.alt.waive')}
        description={t.full('mediaLib.alt.waiveHelp')}
      />

      {waived ? (
        <Field label={t.full('mediaLib.alt.waiveReason')} required>
          {(control) => (
            <Input
              id={control.id}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          )}
        </Field>
      ) : null}

      {asset.altTextWaived && asset.altTextWaivedByName ? (
        <p className="text-body-sm text-text-tertiary">
          {t.full('mediaLib.alt.waived', {
            name: asset.altTextWaivedByName,
            date: formatDate(t.locale, asset.createdAt, { timeZone: 'UTC', dateStyle: 'medium' }),
            reason: asset.altTextWaivedReason ?? '',
          })}
        </p>
      ) : null}

      {unsupportedBy.map((rule) => (
        <div key={rule.connectionId} className="flex flex-col gap-1">
          <CapabilityBadge
            state={
              rule.capabilities.media.altText === 'not_implemented'
                ? 'not_implemented'
                : 'unsupported'
            }
            label={rule.accountLabel}
          />
          <p className="text-body-sm text-text-secondary">
            {t.full('mediaLib.alt.unsupported', { provider: rule.capabilities.provider })}
          </p>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          loading={busy}
          loadingLabel={t.full('composer.autosave.saving')}
          disabled={waived && reason.trim().length === 0}
          onClick={save}
        >
          {t.full('action.saveChanges')}
        </Button>
        {onSuggest ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setBusy(true);
              onSuggest()
                .then((suggested) => {
                  setAltText(suggested);
                  setWaived(false);
                })
                .finally(() => setBusy(false));
            }}
          >
            {t.full('composer.media.altText.generate')}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
