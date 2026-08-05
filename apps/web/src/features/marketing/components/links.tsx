import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

/**
 * Links on the public site.
 *
 * Underlines stay on. An underline is the only affordance that survives
 * greyscale, high contrast mode and a colour vision deficiency, and a marketing
 * page that hides it to look tidy makes its own citations invisible.
 */

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <Link
      href={href}
      className={cn(
        'text-text-primary underline decoration-border-strong decoration-1 underline-offset-[0.22em]',
        'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
        'hover:text-text-accent hover:decoration-accent',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
        className,
      )}
    >
      {children}
    </Link>
  );
}

/**
 * A link that leaves the site, most often to the official documentation a
 * claim came from. The destination is named in the link text, and the icon is
 * decorative because the accessible name already says where it goes.
 */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <a
      href={href}
      rel="noreferrer noopener"
      target="_blank"
      className={cn(
        'inline-flex items-baseline gap-1',
        'text-text-primary underline decoration-border-strong decoration-1 underline-offset-[0.22em]',
        'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
        'hover:text-text-accent hover:decoration-accent',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
        className,
      )}
    >
      <span className="min-w-0">{children}</span>
      <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0 translate-y-[0.1em]" />
    </a>
  );
}

/**
 * The call to action.
 *
 * Sized at 44px rather than the product 32px: this is a page a stranger reads
 * on a phone, not a toolbar a professional uses all day.
 */
export function Cta({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}): ReactNode {
  return (
    <Button asChild variant={variant} className={cn('h-11 px-5 text-body-lg', className)}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

/** A whole row that behaves as one link. Used by index lists, never by cards. */
export function RowLink({
  href,
  title,
  description,
  meta,
}: {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}): ReactNode {
  return (
    <li className="border-b border-border-subtle">
      <Link
        href={href}
        className={cn(
          'group grid min-h-11 items-baseline gap-x-8 gap-y-1 py-5',
          'sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]',
          'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          'hover:bg-surface-hover',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
        )}
      >
        <span className="flex items-baseline gap-2 text-title-sm text-text-primary">
          <span className="underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-colors duration-(--duration-fast) group-hover:decoration-accent">
            {title}
          </span>
        </span>
        <span className="min-w-0">
          {description ? (
            <span className="block max-w-[62ch] text-body-md leading-[1.6] text-text-secondary">
              {description}
            </span>
          ) : null}
          {meta ? <span className="mt-1 block">{meta}</span> : null}
        </span>
      </Link>
    </li>
  );
}
