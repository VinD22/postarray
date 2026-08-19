import { createElement, type ElementType, type ReactNode } from 'react';
import { Reveal } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

import { Container } from '../layout';

/**
 * The editorial section: generous block padding, an optional hairline top
 * rule, an optional inverted ink tone.
 *
 * This replaces the loud system's `Band`, which offered five colour-blocked
 * tones and stamped a torn-paper zigzag between them. An editorial page has
 * exactly two grounds: paper and ink.
 *
 * ## One inverted band per page
 *
 * `tone="inverted"` is the single dramatic moment on a page, not a rhythm. On
 * every page migrated so far that moment is the closing `ClosingCta`, so no
 * other section on those pages sets it. This cannot be enforced by a runtime
 * counter — React Server Components render concurrently across requests, so a
 * module-level tally would be shared state between two visitors' pages — so it
 * is enforced by `inverted-band.test.ts`, which reads the marketing page
 * sources and fails when one page declares more than one inverted band.
 *
 * ## Entry motion
 *
 * `reveal` (on by default) fades and rises the section's content by 12px as it
 * scrolls into view, via the shared `Reveal` component, which branches on
 * `useMotionOk` and renders the finished, static layout for reduced-motion and
 * no-JS visitors. Turn it off for a section whose own children already own
 * their entry animation (a `StaggerList`, a pinned scene), so the same content
 * is not animated twice.
 */
export type EditorialSectionTone = 'canvas' | 'inverted';

const TONE_CLASS: Record<EditorialSectionTone, string> = {
  canvas: 'bg-surface-canvas text-text-primary',
  inverted: 'bg-surface-inverted text-text-inverted',
};

export interface EditorialSectionProps {
  readonly tone?: EditorialSectionTone;
  /** Draws the hairline that separates this section from the one above it. */
  readonly rule?: boolean;
  /** Renders as `<section>` by default; `<div>` when nested inside another landmark. */
  readonly as?: 'section' | 'div';
  /** Fades and rises the content on scroll entry. */
  readonly reveal?: boolean;
  readonly id?: string;
  /** Accessible name for the region, when the section has no visible heading. */
  readonly ariaLabel?: string;
  readonly className?: string;
  /** Extra classes on the padded content wrapper, not the full-bleed section. */
  readonly containerClassName?: string;
  readonly children: ReactNode;
}

export function EditorialSection({
  tone = 'canvas',
  rule = false,
  as = 'section',
  reveal = true,
  id,
  ariaLabel,
  className,
  containerClassName,
  children,
}: EditorialSectionProps): ReactNode {
  const Tag = as as ElementType;
  const body = <div className={cn('py-20 md:py-28 lg:py-32', containerClassName)}>{children}</div>;

  return createElement(
    Tag,
    {
      id,
      'aria-label': ariaLabel,
      'data-tone': tone,
      className: cn(
        'relative w-full',
        // The rule is the section's own inline-start-to-end hairline, drawn
        // inside the width cap rather than edge to edge, so it reads as an
        // editorial rule rather than as a table border.
        rule && 'border-border-default border-t',
        TONE_CLASS[tone],
        className,
      ),
    },
    <Container>{reveal ? <Reveal y={12}>{body}</Reveal> : body}</Container>,
  );
}
