'use client';

import {
  createContext,
  useContext,
  useId,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { Label } from './label.js';

/**
 * Field wires a label, a description, an error and a control together.
 *
 * It owns every id and every relationship so no screen forgets one:
 * `htmlFor` on the label, `aria-describedby` listing the description and then
 * the error, and `aria-invalid` on the control while an error is present. The
 * error is announced politely rather than assertively, because validation
 * fires while the user is still typing and an assertive region would interrupt
 * every keystroke.
 *
 * The control is a render prop so this works with any input, including third
 * party editors, without cloning children and guessing at their props.
 */

export interface FieldControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
  'aria-errormessage': string | undefined;
  required: boolean | undefined;
  disabled: boolean | undefined;
}

interface FieldContextValue extends FieldControlProps {
  descriptionId: string;
  errorId: string;
  hasError: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Lets a nested custom control opt into the same wiring as the render prop. */
export function useFieldControl(): FieldControlProps | null {
  const context = useContext(FieldContext);
  if (!context) return null;
  const { descriptionId: _d, errorId: _e, hasError: _h, ...control } = context;
  return control;
}

export interface FieldProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** The visible label, from the message catalog. */
  label: ReactNode;
  /** Extra guidance shown under the label, before the control. */
  description?: ReactNode;
  /** The validation message. Its presence is what makes the field invalid. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Rendered next to the label text when `required` is set. */
  requiredIndicator?: ReactNode;
  /** Rendered at the inline end of the label row: a counter, a reset action. */
  labelAction?: ReactNode;
  children: (props: FieldControlProps) => ReactNode;
}

export function Field({
  label,
  description,
  error,
  required,
  disabled,
  requiredIndicator,
  labelAction,
  className,
  children,
  ...props
}: FieldProps): ReactNode {
  const baseId = useId();
  const id = `${baseId}-control`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const hasError = Boolean(error);

  const describedBy =
    [description ? descriptionId : null, hasError ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  const control: FieldControlProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': hasError ? true : undefined,
    'aria-errormessage': hasError ? errorId : undefined,
    required: required || undefined,
    disabled: disabled || undefined,
  };

  const context: FieldContextValue = {
    ...control,
    descriptionId,
    errorId,
    hasError,
  };

  return (
    <FieldContext.Provider value={context}>
      <div className={cn('flex flex-col gap-1.5', className)} {...props}>
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor={id} required={required} requiredIndicator={requiredIndicator}>
            {label}
          </Label>
          {labelAction ? (
            <span className="text-label text-text-tertiary">{labelAction}</span>
          ) : null}
        </div>

        {description ? (
          <p id={descriptionId} className="text-body-sm text-text-secondary">
            {description}
          </p>
        ) : null}

        {children(control)}

        {/* The region is always mounted so the message is announced when it
            appears, rather than the container itself being announced. */}
        <div aria-live="polite" className="empty:hidden">
          {hasError ? (
            <p id={errorId} className="text-body-sm text-destructive-fg flex items-start gap-1.5">
              <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          ) : null}
        </div>
      </div>
    </FieldContext.Provider>
  );
}
