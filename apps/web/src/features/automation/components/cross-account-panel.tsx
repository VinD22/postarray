'use client';

import { useId, type ReactElement } from 'react';
import { Notice } from '@relay/design-system/patterns';
import {
  Checkbox,
  Field,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import type { CrossAccountSettings } from '../types';

/**
 * Publishing a prepared follow up from a second account.
 *
 * Off by default, and off means the section is one sentence and a switch. This
 * is the feature most easily turned into coordinated inauthentic behaviour, so
 * turning it on requires naming both accounts and ticking a statement that says
 * what the user is asserting: that this workspace controls both, and that the
 * follow up is not presented as independent endorsement.
 *
 * The confirmation is a checkbox with the account names interpolated into it,
 * not a generic "I agree". A statement you cannot read back is not a
 * preauthorization.
 */

export interface CrossAccountPanelProps {
  readonly settings: CrossAccountSettings;
  readonly onChange: (settings: CrossAccountSettings) => void;
  readonly accounts: readonly {
    readonly connectionId: string;
    readonly displayName: string;
  }[];
  /** True when an action in the rule needs this section resolved. */
  readonly required: boolean;
}

export function CrossAccountPanel({
  settings,
  onChange,
  accounts,
  required,
}: CrossAccountPanelProps): ReactElement {
  const t = useTranslations();
  const switchId = useId();
  const confirmId = useId();

  const nameOf = (connectionId: string | null): string =>
    accounts.find((account) => account.connectionId === connectionId)?.displayName ??
    t('automation.param.notSet');

  return (
    <section className="border-border-subtle flex flex-col gap-3 border-t pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-title-sm text-text-primary">{t('automation.crossAccount.title')}</h3>
        <span className="flex items-center gap-2">
          <Switch
            id={switchId}
            checked={settings.enabled}
            onCheckedChange={(checked) =>
              onChange({
                ...settings,
                enabled: checked === true,
                // Turning the section off withdraws the preauthorization too.
                preauthorized: checked === true ? settings.preauthorized : false,
              })
            }
          />
          <Label htmlFor={switchId}>{t('automation.crossAccount.enable')}</Label>
        </span>
      </div>

      {settings.enabled ? (
        <div className="flex flex-col gap-4">
          <p className="text-body-md text-text-secondary max-w-[70ch]">
            {t('automation.crossAccount.body')}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('automation.crossAccount.sourceAccount')} required>
              {(control) => (
                <Select
                  value={settings.sourceConnectionId ?? ''}
                  onValueChange={(value) =>
                    onChange({ ...settings, sourceConnectionId: value, preauthorized: false })
                  }
                >
                  <SelectTrigger id={control.id} size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.connectionId} value={account.connectionId}>
                        {account.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>

            <Field label={t('automation.crossAccount.followUpAccount')} required>
              {(control) => (
                <Select
                  value={settings.followUpConnectionId ?? ''}
                  onValueChange={(value) =>
                    onChange({
                      ...settings,
                      followUpConnectionId: value,
                      preauthorized: false,
                    })
                  }
                >
                  <SelectTrigger id={control.id} size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter((account) => account.connectionId !== settings.sourceConnectionId)
                      .map((account) => (
                        <SelectItem key={account.connectionId} value={account.connectionId}>
                          {account.displayName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id={confirmId}
              className="mt-0.5"
              checked={settings.preauthorized}
              disabled={
                settings.sourceConnectionId === null || settings.followUpConnectionId === null
              }
              onCheckedChange={(checked) =>
                onChange({ ...settings, preauthorized: checked === true })
              }
            />
            <Label htmlFor={confirmId} className="text-body-md max-w-[70ch]">
              {t('automation.crossAccount.preauthorize', {
                sourceAccount: nameOf(settings.sourceConnectionId),
                followUpAccount: nameOf(settings.followUpConnectionId),
              })}
            </Label>
          </div>

          <Notice tone="neutral" title={t('automation.crossAccount.duplicateCheck')} />

          {required && !settings.preauthorized ? (
            <Notice
              tone="warning"
              liveness="status"
              title={t('automation.crossAccount.preauthorizeRequired')}
            />
          ) : null}
        </div>
      ) : (
        <p className="text-body-md text-text-secondary max-w-[70ch]">
          {t('automation.crossAccount.off')}
        </p>
      )}
    </section>
  );
}
