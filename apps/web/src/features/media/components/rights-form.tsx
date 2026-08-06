'use client';

/**
 * Rights and consent.
 *
 * A file with no declaration cannot be scheduled, which is stated on the form
 * rather than discovered at publish time. Consent for people who appear is a
 * separate question from ownership, because they are separate obligations.
 */

import { useState, type ReactNode } from 'react';
import { Button, Field, Input, RadioGroup } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatDate } from '@relay/i18n';

import { CheckRow, RadioRow } from '../../composer/components/form-rows';
import type { MediaAsset, RightsDeclaration, RightsOwner } from '../types';

export interface RightsFormProps {
  readonly asset: MediaAsset;
  readonly onSave: (
    declaration: Omit<RightsDeclaration, 'declaredByName' | 'declaredAt'>,
  ) => Promise<void>;
}

export function RightsForm({ asset, onSave }: RightsFormProps): ReactNode {
  const t = useTranslations();
  const existing = asset.rights;
  const [owner, setOwner] = useState<RightsOwner>(existing?.owner ?? 'workspace');
  const [licenseReference, setLicenseReference] = useState(existing?.licenseReference ?? '');
  const [peopleAppear, setPeopleAppear] = useState(existing?.peopleAppear ?? false);
  const [peopleConsented, setPeopleConsented] = useState(existing?.peopleConsented ?? false);
  const [containsMusic, setContainsMusic] = useState(existing?.containsMusic ?? false);
  const [confirmed, setConfirmed] = useState(existing !== null);
  const [busy, setBusy] = useState(false);

  const blocked = peopleAppear && !peopleConsented;
  const canSave = confirmed && !blocked;

  return (
    <section aria-labelledby="rights-heading" className="flex flex-col gap-3">
      <h3 id="rights-heading" className="text-title-sm text-text-primary">
        {t.full('mediaLib.rights.heading')}
      </h3>

      {existing ? (
        <p className="text-body-sm text-text-tertiary">
          {t.full('mediaLib.rights.declared', {
            name: existing.declaredByName ?? t.full('common.unavailable'),
            date: formatDate(t.locale, existing.declaredAt, {
              timeZone: 'UTC',
              dateStyle: 'medium',
            }),
          })}
        </p>
      ) : (
        <Notice
          tone="warning"
          liveness="status"
          title={t.full('mediaLib.rights.undeclared')}
          description={t.full('mediaLib.rights.blocking')}
        />
      )}

      <RadioGroup
        value={owner}
        aria-label={t.full('mediaLib.rights.ownerLabel')}
        onValueChange={(value) => setOwner(value as RightsOwner)}
        className="flex flex-col"
      >
        <RadioRow value="workspace" label={t.full('mediaLib.rights.ownerSelf')} />
        <RadioRow value="licensed" label={t.full('mediaLib.rights.ownerLicensed')} />
        <RadioRow value="ugc" label={t.full('mediaLib.rights.ownerUgc')} />
      </RadioGroup>

      {owner === 'workspace' ? null : (
        <Field label={t.full('mediaLib.rights.licenseLabel')}>
          {(control) => (
            <Input
              id={control.id}
              value={licenseReference}
              onChange={(event) => setLicenseReference(event.target.value)}
            />
          )}
        </Field>
      )}

      <CheckRow
        checked={peopleAppear}
        onCheckedChange={setPeopleAppear}
        label={t.full('mediaLib.rights.peopleLabel')}
      />
      {peopleAppear ? (
        <CheckRow
          checked={peopleConsented}
          onCheckedChange={setPeopleConsented}
          label={t.full('mediaLib.rights.peopleConsent')}
        />
      ) : null}
      <CheckRow
        checked={containsMusic}
        onCheckedChange={setContainsMusic}
        label={t.full('mediaLib.rights.musicLabel')}
      />
      <CheckRow
        checked={confirmed}
        onCheckedChange={setConfirmed}
        label={t.full('mediaLib.rights.confirm')}
      />

      <Button
        variant="primary"
        size="sm"
        disabled={!canSave}
        loading={busy}
        loadingLabel={t.full('composer.autosave.saving')}
        onClick={() => {
          setBusy(true);
          void onSave({
            owner,
            licenseReference: licenseReference.trim().length === 0 ? null : licenseReference.trim(),
            peopleAppear,
            peopleConsented,
            containsMusic,
          }).finally(() => setBusy(false));
        }}
      >
        {t.full('action.saveChanges')}
      </Button>
    </section>
  );
}
