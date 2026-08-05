'use client';

/**
 * Two tiny compositions used throughout the composer: a checkbox with a real
 * label and an optional explanation, and the same for a radio. They exist so
 * every control in this feature has its label tied to it by `htmlFor` rather
 * than by proximity, and so the touch target is the whole row.
 */

import { useId, type ReactNode } from 'react';
import { Checkbox, Label, RadioGroupItem, Switch } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

interface RowShellProps {
  readonly control: ReactNode;
  readonly id: string;
  readonly label: ReactNode;
  readonly description?: ReactNode;
  readonly className?: string;
}

function RowShell({ control, id, label, description, className }: RowShellProps): ReactNode {
  const descriptionId = `${id}-description`;
  return (
    <div className={cn('flex min-h-11 items-start gap-2.5 py-1', className)}>
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center">{control}</span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <Label htmlFor={id} className="text-body-md text-text-primary cursor-pointer">
          {label}
        </Label>
        {description ? (
          <span id={descriptionId} className="text-body-sm text-text-tertiary">
            {description}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export interface CheckRowProps {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly label: ReactNode;
  readonly description?: ReactNode;
  readonly disabled?: boolean;
  readonly id?: string;
}

export function CheckRow({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  id,
}: CheckRowProps): ReactNode {
  const generated = useId();
  const controlId = id ?? generated;
  return (
    <RowShell
      id={controlId}
      label={label}
      description={description}
      control={
        <Checkbox
          id={controlId}
          checked={checked}
          disabled={disabled}
          aria-describedby={description ? `${controlId}-description` : undefined}
          onCheckedChange={(next) => onCheckedChange(next === true)}
        />
      }
    />
  );
}

export interface RadioRowProps {
  readonly value: string;
  readonly label: ReactNode;
  readonly description?: ReactNode;
  readonly disabled?: boolean;
}

export function RadioRow({ value, label, description, disabled }: RadioRowProps): ReactNode {
  const controlId = `radio-${value}-${useId()}`;
  return (
    <RowShell
      id={controlId}
      label={label}
      description={description}
      control={
        <RadioGroupItem
          id={controlId}
          value={value}
          disabled={disabled}
          aria-describedby={description ? `${controlId}-description` : undefined}
        />
      }
    />
  );
}

export interface SwitchRowProps {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly label: ReactNode;
  readonly description?: ReactNode;
  readonly disabled?: boolean;
}

export function SwitchRow({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
}: SwitchRowProps): ReactNode {
  const controlId = useId();
  return (
    <RowShell
      id={controlId}
      label={label}
      description={description}
      className="items-center"
      control={
        <Switch
          id={controlId}
          checked={checked}
          disabled={disabled}
          aria-describedby={description ? `${controlId}-description` : undefined}
          onCheckedChange={onCheckedChange}
        />
      }
    />
  );
}
