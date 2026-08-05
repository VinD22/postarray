'use client';

import type { ReactElement } from 'react';
import {
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import type { ParameterSpec } from '../catalog';
import type { ParameterValue } from '../types';

/**
 * The settings a chosen trigger, condition or action still needs.
 *
 * Every parameter is a labelled form control. There is no inline editable chip
 * inside the sentence, because a contenteditable span inside a paragraph is the
 * control screen reader users and keyboard users lose first, and this sentence
 * is the whole rule.
 *
 * Options for a `select` are supplied by the editor, which knows the workspace's
 * brands, templates, signatures and locales. This component knows nothing about
 * the product beyond the shape of a field.
 */

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export type OptionResolver = (parameterName: string) => readonly SelectOption[];

export interface ParameterFieldsProps {
  readonly specs: readonly ParameterSpec[];
  readonly values: Readonly<Record<string, ParameterValue>>;
  readonly onChange: (name: string, value: ParameterValue) => void;
  readonly options: OptionResolver;
  readonly idPrefix: string;
}

export function ParameterFields({
  specs,
  values,
  onChange,
  options,
  idPrefix,
}: ParameterFieldsProps): ReactElement | null {
  const t = useTranslations();

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {specs.map((spec) => {
        const value = values[spec.name];
        const label = t(spec.labelKey);
        const key = `${idPrefix}-${spec.name}`;

        if (spec.kind === 'select' || spec.kind === 'account' || spec.kind === 'metric') {
          const list = options(spec.name);
          return (
            <Field key={key} label={label} required={spec.required}>
              {(control) => (
                <Select
                  value={typeof value === 'string' ? value : ''}
                  onValueChange={(next) => onChange(spec.name, next)}
                >
                  <SelectTrigger
                    id={control.id}
                    size="sm"
                    aria-describedby={control['aria-describedby']}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {list.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          );
        }

        if (spec.kind === 'number' || spec.kind === 'duration') {
          return (
            <Field key={key} label={label} required={spec.required}>
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={typeof value === 'number' ? value : ''}
                  onChange={(event) =>
                    onChange(
                      spec.name,
                      event.target.value === '' ? null : Number(event.target.value),
                    )
                  }
                />
              )}
            </Field>
          );
        }

        return (
          <Field key={key} label={label} required={spec.required}>
            {(control) => (
              <Input
                {...control}
                type={spec.kind === 'time' ? 'time' : spec.kind === 'date' ? 'date' : 'text'}
                value={typeof value === 'string' ? value : ''}
                onChange={(event) => onChange(spec.name, event.target.value)}
              />
            )}
          </Field>
        );
      })}
    </div>
  );
}
