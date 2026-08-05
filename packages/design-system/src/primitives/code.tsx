'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils/cn';

export interface CodeProps extends ComponentPropsWithoutRef<'code'> {
  /** A block instead of an inline run. Blocks scroll inside themselves. */
  block?: boolean;
}

/**
 * Monospace for what is genuinely code, an identifier, or a measured value:
 * an external post id, an idempotency key, a content hash, a JSON payload.
 * Never as a stylistic device to make a heading look technical.
 *
 * Direction is forced to left-to-right because an identifier or a URL does not
 * mirror in an RTL locale, and `unicode-bidi: isolate` keeps it from dragging
 * the surrounding sentence with it.
 */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { className, block = false, ...props },
  ref,
) {
  const element = (
    <code
      ref={ref}
      dir="ltr"
      className={cn(
        'text-code font-mono [unicode-bidi:isolate]',
        block
          ? 'block p-3 whitespace-pre'
          : 'border-border-subtle bg-surface-sunken rounded-xs border px-1 py-0.5',
        className,
      )}
      {...props}
    />
  );

  if (!block) return element;

  return (
    <pre className="relay-scrollbar border-border-default bg-surface-sunken text-text-primary overflow-x-auto rounded-md border">
      {element}
    </pre>
  );
});
