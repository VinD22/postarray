'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

const sizeClass: Record<AvatarSize, string> = {
  xs: 'size-5 text-[0.625rem]',
  sm: 'size-6 text-label',
  md: 'size-8 text-body-sm',
  lg: 'size-10 text-body-md',
};

export interface AvatarProps
  extends Omit<ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, 'children'> {
  src?: string | undefined;
  /**
   * The full alternative text, from the message catalog. For a connected
   * account this should identify the exact account, not just the platform.
   */
  alt: string;
  /**
   * The fallback shown while the image loads or if it fails. Pass initials
   * derived from the account name by the caller, since initial extraction is
   * locale sensitive and does not belong in a component.
   */
  fallback: ReactNode;
  size?: AvatarSize;
  /** A small provider dot pinned to the block-end inline-end corner. */
  badge?: ReactNode;
}

/**
 * An account or person image.
 *
 * A square with an 6px radius rather than a circle: these are brand and page
 * avatars as often as they are people, and a circle crops a logo badly. The
 * fallback is a tonal surface with initials, never a coloured hash, because a
 * random colour per account carries no meaning and multiplies the palette.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, src, alt, fallback, size = 'md', badge, ...props },
  ref,
) {
  return (
    <span className="relative inline-flex shrink-0">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          'inline-flex shrink-0 select-none items-center justify-center overflow-hidden',
          'rounded-md border border-border-subtle bg-surface-sunken',
          sizeClass[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <AvatarPrimitive.Image
            src={src}
            alt={alt}
            className="size-full object-cover"
          />
        ) : null}
        <AvatarPrimitive.Fallback
          delayMs={src ? 200 : 0}
          className="flex size-full items-center justify-center font-medium text-text-secondary"
        >
          {src ? fallback : <span aria-label={alt}>{fallback}</span>}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {badge ? (
        <span className="absolute -bottom-0.5 -end-0.5 flex items-center justify-center rounded-full bg-surface-canvas p-0.5">
          {badge}
        </span>
      ) : null}
    </span>
  );
});
