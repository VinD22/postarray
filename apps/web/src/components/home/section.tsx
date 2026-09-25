'use client';

import { Link } from '@/components/link';
import type { ReactNode } from 'react';

import { cn } from '@relay/design-system/utils';

/**
 * A Home section.
 *
 * A heading, an optional count, an optional link out, and rows. Deliberately
 * not a card: Home is a queue read top to bottom, and a grid of panels turns a
 * scan into a hunt.
 *
 * `data-stagger-item` marks every instance as a participant in the one-time
 * mount stagger `HomeScreen` wraps its content in (see `<StaggerList>` in
 * `home-screen.tsx`) — this is the only place that attribute is set, so it
 * never leaks into an unrelated `StaggerList` scope.
 */
export function HomeSection({
  id,
  title,
  meta,
  summary,
  link,
  children,
  className,
  emphasis = false,
}: {
  readonly id: string;
  readonly title: string;
  readonly meta?: ReactNode;
  /** One short sentence that helps interpret the section before its rows. */
  readonly summary?: ReactNode;
  readonly link?: { readonly href: string; readonly label: string } | undefined;
  readonly children: ReactNode;
  readonly className?: string;
  /** Adds a stronger scale to the first decision block without changing its semantics. */
  readonly emphasis?: boolean;
}) {
  return (
    <section
      aria-labelledby={id}
      data-stagger-item
      className={cn('flex flex-col gap-6', className)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2
            id={id}
            className={cn(
              'font-display text-title-lg text-text-primary tracking-[-0.025em]',
              emphasis && 'text-[clamp(1.9rem,1.6rem+1vw,2.5rem)] leading-tight',
            )}
          >
            {title}
          </h2>
          {meta === undefined ? null : <p className="text-body-sm text-text-tertiary">{meta}</p>}
        </div>
        {summary === undefined ? null : (
          <p className="text-body-md text-text-secondary max-w-[62ch] text-pretty">{summary}</p>
        )}
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
