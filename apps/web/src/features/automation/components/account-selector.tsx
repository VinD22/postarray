'use client';

import type { ReactElement } from 'react';
import { Checkbox, Label, StatusDot } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { providerLabelKey } from '@/features/analytics/labels';

import type { ConnectionCapabilities } from '../action-availability';

/**
 * The accounts a rule may act on.
 *
 * This list is a hard boundary rather than a filter. Whatever the conditions
 * say, a rule cannot reach an account that is not ticked here, and the help
 * text says so, because a user reasoning about worst case behaviour needs one
 * place to look.
 */

export interface AccountSelectorProps {
  readonly accounts: readonly ConnectionCapabilities[];
  readonly selected: readonly string[];
  readonly onChange: (connectionIds: readonly string[]) => void;
}

export function AccountSelector({
  accounts,
  selected,
  onChange,
}: AccountSelectorProps): ReactElement {
  const t = useTranslations();

  return (
    <fieldset className="border-border-subtle flex flex-col gap-2 border-t pt-4">
      <legend className="text-title-sm text-text-primary">{t('automation.accounts.label')}</legend>
      <p className="text-body-md text-text-secondary max-w-[70ch]">
        {t('automation.accounts.help')}
      </p>

      {accounts.length === 0 ? (
        <p className="text-body-md text-text-secondary">{t('automation.accounts.none')}</p>
      ) : (
        <ul className="flex flex-col gap-1 pt-1">
          {accounts.map((account) => {
            const id = `rule-account-${account.connectionId}`;
            return (
              <li key={account.connectionId} className="flex min-h-11 items-center gap-2">
                <Checkbox
                  id={id}
                  checked={selected.includes(account.connectionId)}
                  onCheckedChange={() =>
                    onChange(
                      selected.includes(account.connectionId)
                        ? selected.filter((value) => value !== account.connectionId)
                        : [...selected, account.connectionId],
                    )
                  }
                />
                <Label htmlFor={id} className="text-body-md flex items-center gap-2">
                  <StatusDot provider={account.provider} />
                  {account.displayName}
                  <span className="text-text-tertiary">
                    {t(providerLabelKey(account.provider))}
                  </span>
                </Label>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}
