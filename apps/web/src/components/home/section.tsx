'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@relay/design-system/utils';

/**
 * A Home section.
 *
 * A heading, an optional count, an optional link out, and rows. Deliberately
 * not a card: Home is a queue read top to bottom, and a grid of panels turns a
 * scan into a hunt.
 */
export function HomeSection({
  id,
  title,
  meta,
  link,
  children,
  className,
}: {
  readonly id: string;
  readonly title: string;
  readonly meta?: ReactNode;
  readonly link?: { readonly href: string; readonly label: string } | undefined;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={id} className="text-title-sm text-text-primary">
          {title}
        </h2>
        {meta === undefined ? null : <p className="text-body-sm text-text-tertiary">{meta}</p>}
      </div>

      {children}

      {link === undefined ? null : (
        <p>
          <Link
            href={link.href}
            className="text-body-sm text-text-accent inline-flex min-h-9 items-center font-medium hover:underline"
          >
            {link.label}
          </Link>
        </p>
      )}
    </section>
  );
}
