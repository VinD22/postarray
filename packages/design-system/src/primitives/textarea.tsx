'use client';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
} from 'react';
import { cn } from '../utils/cn.js';
import { focusRing, transitionBase } from '../utils/style-constants.js';
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect.js';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  invalid?: boolean;
  /**
   * Grow with the content instead of showing an inner scrollbar. The composer
   * uses this so a draft is readable in full while it is being written.
   */
  autoGrow?: boolean;
  /** Rows before growing starts. Also the collapsed height. */
  minRows?: number;
  /** Stop growing here and scroll instead. Keeps a long draft from taking the page. */
  maxRows?: number;
}

/**
 * A multi line text field.
 *
 * Auto-grow measures with `scrollHeight` after resetting the height, which is
 * the only way to shrink again when text is deleted. It runs in a layout
 * effect so the user never sees an intermediate height.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    invalid = false,
    autoGrow = false,
    minRows = 3,
    maxRows = 16,
    onChange,
    rows,
    style,
    ...props
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement, []);

  const resize = useCallback(() => {
    const node = innerRef.current;
    if (!node || !autoGrow) return;
    const styles = window.getComputedStyle(node);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 21;
    const paddingBlock =
      Number.parseFloat(styles.paddingBlockStart) +
      Number.parseFloat(styles.paddingBlockEnd);
    const borderBlock =
      Number.parseFloat(styles.borderBlockStartWidth) +
      Number.parseFloat(styles.borderBlockEndWidth);

    node.style.blockSize = 'auto';
    const contentHeight = node.scrollHeight;
    const maxHeight = lineHeight * maxRows + paddingBlock + borderBlock;
    const minHeight = lineHeight * minRows + paddingBlock + borderBlock;
    const next = Math.min(Math.max(contentHeight, minHeight), maxHeight);
    node.style.blockSize = `${next}px`;
    node.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
  }, [autoGrow, maxRows, minRows]);

  useIsomorphicLayoutEffect(() => {
    resize();
  }, [resize, props.value, props.defaultValue]);

  return (
    <textarea
      ref={innerRef}
      rows={rows ?? minRows}
      aria-invalid={invalid || undefined}
      onChange={(event) => {
        onChange?.(event);
        resize();
      }}
      style={style}
      className={cn(
        'w-full min-w-0 rounded-md border bg-surface-raised px-2.5 py-1.5',
        'text-body-md text-text-primary placeholder:text-text-tertiary',
        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-disabled',
        'read-only:bg-surface-sunken',
        autoGrow ? 'resize-none' : 'resize-y',
        invalid ? 'border-destructive-border' : 'border-border-strong',
        focusRing,
        transitionBase,
        className,
      )}
      {...props}
    />
  );
});
