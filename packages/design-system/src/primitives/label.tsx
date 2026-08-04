'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';

export interface LabelProps
  extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /**
   * Marks the field as required. The marker is decorative; the required state
   * itself is carried by the control's `required` attribute, and the visible
   * word comes from `requiredIndicator` so it can be translated.
   */
  required?: boolean;
  /** Rendered after the label text when `required` is set. */
  requiredIndicator?: ReactNode;
}

/**
 * A form label. Always paired with a control through `htmlFor`, never as a
 * floating placeholder: a placeholder that doubles as a label disappears the
 * moment someone starts typing, which is exactly when they need it.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, children, required, requiredIndicator, ...props },
  ref,
) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 text-label font-medium text-text-primary',
        'has-[+_:disabled]:text-text-disabled',
        className,
      )}
      {...props}
    >
      {children}
      {required && requiredIndicator ? (
        <span className="text-text-tertiary">{requiredIndicator}</span>
      ) : null}
    </LabelPrimitive.Root>
  );
});
