'use client';

import type { ReactNode } from 'react';
import { Checkbox, Code } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { Scope } from '@relay/contracts';

import { scopeDescriptionKey, scopeGroups } from '../lib/scope-groups.js';

export interface ScopePickerProps {
  selected: readonly Scope[];
  onChange: (scopes: readonly Scope[]) => void;
  disabled?: boolean;
  /** Restrict the offered scopes, for example to what a role can delegate. */
  available?: readonly Scope[];
}

/**
 * Choosing scopes, grouped by consequence.
 *
 * The three groups are always rendered as three headed lists with their own
 * explanation, in the same order, whether one scope or seventeen are offered.
 * A user who skims sees the consequential group as a separate block rather
 * than as one more checkbox in a long column.
 */
export function ScopePicker({
  selected,
  onChange,
  disabled = false,
  available,
}: ScopePickerProps): ReactNode {
  const t = useTranslations();
  const groups = scopeGroups(available);

  function toggle(scope: Scope, checked: boolean): void {
    onChange(checked ? [...selected, scope] : selected.filter((entry) => entry !== scope));
  }

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <fieldset key={group.risk} className="flex flex-col gap-2 border-0 p-0">
          <legend className="flex flex-col gap-0.5 pb-1">
            <span className="text-body-md text-text-primary font-medium">{t(group.titleKey)}</span>
            <span className="text-body-sm text-text-secondary max-w-[62ch]">
              {t(group.helpKey)}
            </span>
          </legend>
          <ul className="flex flex-col">
            {group.scopes.map((scope) => (
              <li key={scope}>
                <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
                  <Checkbox
                    className="mt-1"
                    disabled={disabled}
                    checked={selected.includes(scope)}
                    onCheckedChange={(checked) => toggle(scope, checked === true)}
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span>{t(scopeDescriptionKey(scope))}</span>
                    <Code className="w-fit">{scope}</Code>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ))}

      <Notice tone="neutral" title={t('developer.ui.apps.noBundling')} />
    </div>
  );
}
