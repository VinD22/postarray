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
    <div
      className={cn(
        'mx-auto w-full max-w-[var(--layout-marketing-max)] px-[var(--layout-gutter)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A container that opts out of the marketing width cap entirely — for
 * marquees and pinned scenes that need the full viewport, not the editorial
 * measure the rest of the site holds to.
 */
export function FullBleed({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return <div className={cn('w-full', className)}>{children}</div>;
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
      className={cn(divided && 'border-border-default border-t', className)}
    >
      <Container>
        <div className="py-16 md:py-24 lg:py-32">{children}</div>
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
    <div className={cn('grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-0', className)}>
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
        'font-display text-[clamp(2.5rem,1.2rem+4.4vw,4.5rem)] leading-[1.02]',
        'text-text-primary font-medium tracking-[-0.02em] text-pretty',
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
        'font-display text-[clamp(1.6rem,1.15rem+1.2vw,2.25rem)] leading-[1.12]',
        'text-text-primary font-medium tracking-[-0.015em] text-pretty',
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
  /**
   * The element to render. The visual size is fixed; the level is chosen by
   * where the section sits in the document outline, so a top-level section on a
   * marketing page is an `h2` even though it looks identical to an `h3` nested
   * inside one. Heading order is an accessibility requirement, not a style.
   */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
}): ReactNode {
  return (
    <Component id={id} className={cn('text-title-md text-text-primary', className)}>
      {children}
    </Component>
  );
}

export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <p
      className={cn(
        'text-text-secondary max-w-[58ch] text-[1.0625rem] leading-[1.62] md:text-[1.125rem]',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Body({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <p className={cn('text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]', className)}>
      {children}
    </p>
  );
}

/** A short monospaced fact: a date, a version, a price, an identifier. */
export function Meta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <span className={cn('text-body-sm text-text-tertiary font-mono tabular-nums', className)}>
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
  return <dl className={cn('border-border-default border-t', className)}>{children}</dl>;
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
        'border-border-subtle grid gap-1 border-b py-4',
        'sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8',
        className,
      )}
    >
      <dt className="text-body-md text-text-tertiary">{term}</dt>
      <dd className="text-body-lg text-text-primary min-w-0 leading-[1.6]">{children}</dd>
    </div>
  );
}

/**
 * An ordered argument: numbered only where the order carries meaning, which on
 * this site is the publishing sequence and nothing else.
 */
export function Steps({ children }: { children: ReactNode }): ReactNode {
  return <ol className="border-border-default border-t">{children}</ol>;
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
    <li className="border-border-subtle grid gap-2 border-b py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
      <span aria-hidden="true" className="text-body-sm text-text-tertiary font-mono tabular-nums">
        {String(index).padStart(2, '0')}
      </span>
      <div className="min-w-0 space-y-2">
        <Subheading as="h3">{title}</Subheading>
        <p className="text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]">{children}</p>
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
        <li key={index} className="text-body-lg text-text-secondary flex gap-3 leading-[1.6]">
          <span
            aria-hidden="true"
            className="bg-border-strong mt-[0.6em] size-[5px] shrink-0 rounded-full"
          />
          <span className="max-w-[66ch] min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}
