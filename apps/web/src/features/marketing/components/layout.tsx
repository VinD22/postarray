import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * The marketing layout grammar.
 *
 * The public site is built from horizontal rules and a two column editorial
 * grid, not from cards. A section is a band of the page separated by a
 * hairline; its heading sits in the narrow start column and its argument runs
 * in the wide one. At small sizes the two columns stack, which is the natural
 * reading order and needs no reordering.
 *
 * Everything here uses logical properties, no fixed width on a text container
 * and no maximum height, so a 40 percent longer translation and a right to
 * left direction both work without a second stylesheet.
 */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div className={cn('mx-auto w-full max-w-[82rem] px-5 sm:px-7 lg:px-10 2xl:px-14', className)}>
      {children}
    </div>
  );
}

export interface SectionProps {
  children: ReactNode;
  /** Renders the hairline that separates this band from the one above it. */
  divided?: boolean;
  className?: string;
  id?: string;
  /** Accessible name for the region, when the section has no visible heading. */
  ariaLabel?: string;
}

export function Section({
  children,
  divided = true,
  className,
  id,
  ariaLabel,
}: SectionProps): ReactNode {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(divided && 'border-t border-border-default', className)}
    >
      <Container>
        <div className="py-14 md:py-20 lg:py-24">{children}</div>
      </Container>
    </section>
  );
}

/**
 * The editorial split: heading and standfirst in the start column, the
 * argument in the end column. Below the large breakpoint it is one column,
 * which is what a phone actually wants.
 */
export function Split({
  aside,
  children,
  className,
}: {
  aside: ReactNode;
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div className={cn('grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:gap-y-0', className)}>
      <div className="lg:col-span-4">{aside}</div>
      <div className="min-w-0 lg:col-span-7 lg:col-start-6">{children}</div>
    </div>
  );
}

export function Display({
  children,
  className,
  as: Component = 'h1',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'p';
}): ReactNode {
  return (
    <Component
      className={cn(
        'font-serif text-[clamp(2.05rem,1.15rem+3.4vw,3.75rem)] leading-[1.06]',
        'tracking-[-0.022em] text-pretty text-text-primary',
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function Heading({
  children,
  className,
  as: Component = 'h2',
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3';
  id?: string;
}): ReactNode {
  return (
    <Component
      id={id}
      className={cn(
        'font-serif text-[clamp(1.45rem,1.15rem+0.95vw,2rem)] leading-[1.16]',
        'tracking-[-0.016em] text-pretty text-text-primary',
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function Subheading({
  children,
  className,
  as: Component = 'h3',
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: 'h3' | 'h4';
  id?: string;
}): ReactNode {
  return (
    <Component
      id={id}
      className={cn('text-title-md text-text-primary', className)}
    >
      {children}
    </Component>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }): ReactNode {
  return (
    <p
      className={cn(
        'max-w-[58ch] text-[1.0625rem] leading-[1.62] text-text-secondary md:text-[1.125rem]',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Body({ children, className }: { children: ReactNode; className?: string }): ReactNode {
  return (
    <p className={cn('max-w-[68ch] text-body-lg leading-[1.65] text-text-secondary', className)}>
      {children}
    </p>
  );
}

/** A short monospaced fact: a date, a version, a price, an identifier. */
export function Meta({ children, className }: { children: ReactNode; className?: string }): ReactNode {
  return (
    <span className={cn('font-mono text-body-sm tabular-nums text-text-tertiary', className)}>
      {children}
    </span>
  );
}

/**
 * A definition list rendered as hairline separated rows.
 *
 * This is the site answer to the three card row: six facts about one thing are
 * six rows, which scan faster, translate without breaking a grid, and reflow to
 * one column without losing the pairing.
 */
export function FactList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <dl className={cn('border-t border-border-default', className)}>{children}</dl>
  );
}

export function Fact({
  term,
  children,
  className,
}: {
  term: ReactNode;
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div
      className={cn(
        'grid gap-1 border-b border-border-subtle py-4',
        'sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8',
        className,
      )}
    >
      <dt className="text-body-md text-text-tertiary">{term}</dt>
      <dd className="min-w-0 text-body-lg leading-[1.6] text-text-primary">{children}</dd>
    </div>
  );
}

/**
 * An ordered argument: numbered only where the order carries meaning, which on
 * this site is the publishing sequence and nothing else.
 */
export function Steps({ children }: { children: ReactNode }): ReactNode {
  return <ol className="border-t border-border-default">{children}</ol>;
}

export function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: ReactNode;
  children: ReactNode;
}): ReactNode {
  return (
    <li className="grid gap-2 border-b border-border-subtle py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
      <span aria-hidden="true" className="font-mono text-body-sm tabular-nums text-text-tertiary">
        {String(index).padStart(2, '0')}
      </span>
      <div className="min-w-0 space-y-2">
        <Subheading as="h3">{title}</Subheading>
        <p className="max-w-[68ch] text-body-lg leading-[1.65] text-text-secondary">{children}</p>
      </div>
    </li>
  );
}

/** A plain bulleted list with the site rhythm. */
export function List({
  items,
  className,
}: {
  items: readonly ReactNode[];
  className?: string;
}): ReactNode {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key -- static editorial copy
        <li key={index} className="flex gap-3 text-body-lg leading-[1.6] text-text-secondary">
          <span
            aria-hidden="true"
            className="mt-[0.6em] size-[5px] shrink-0 rounded-full bg-border-strong"
          />
          <span className="min-w-0 max-w-[66ch]">{item}</span>
        </li>
      ))}
    </ul>
  );
}
