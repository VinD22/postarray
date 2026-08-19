import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

/**
 * A two line display headline, and the page's one coloured phrase.
 *
 * Built for the home page and moved here the day a second page wanted it (see
 * `bento.tsx`'s doc comment for the rest of that note). Every page that
 * renders one still gets its own rule: read either line on its own and it is
 * still a sentence, and there is exactly one of these per page.
 *
 * ## Why this is not `EditorialDisplay`
 *
 * `EditorialDisplay` takes `children: string`, because the `LineMaskHeadline`
 * behind its `reveal` prop needs a plain string to split. A headline with an
 * emphasised phrase inside it is markup, not a string, so it cannot go through
 * that component without either losing the emphasis or losing the split. This
 * renders the same display steps, level, with no client JavaScript at all,
 * which is what the LCP element on this page should be anyway: the finished
 * heading in server HTML, not a heading waiting for a timeline.
 *
 * ## Two sentences, never two fragments
 *
 * `lead` and `accent` are two complete, independently translated sentences,
 * set as two lines of one `<h1>`. They are deliberately NOT a sentence split
 * around a coloured span: `AGENTS.md` forbids concatenating translated
 * fragments, and a split sentence would force every locale to keep the
 * emphasised words in the same position, which no locale can promise. Read
 * either line on its own and it is still a sentence.
 *
 * ## One accent phrase, and why vermilion is safe here
 *
 * Exactly one phrase, because a second one stops the first meaning anything.
 * `--accent-action-*` is the action accent, and its documented contrast against
 * every page surface is recorded in `theme.css` (5.24:1 on the light canvas,
 * 6.84:1 on the dark one), so it clears AA for body text, let alone for display
 * type. It is a text colour here and never a fill: the page's one vermilion
 * SURFACE is still the primary button, which is the rule the design system
 * actually states.
 */
export interface HeroHeadlineProps {
  /** The first line, already translated. A whole sentence. */
  readonly lead: string;
  /** The second line, already translated, set in the action accent. */
  readonly accent: string;
  readonly id?: string;
  readonly className?: string;
}

export function HeroHeadline({ lead, accent, id, className }: HeroHeadlineProps): ReactNode {
  return (
    <h1
      id={id}
      className={cn(
        'font-display text-display-xl text-text-primary text-balance',
        // The two lines are one heading, so they share a leading rather than
        // stacking as two paragraphs. `text-display-xl` already sets 0.98.
        className,
      )}
    >
      <span className="block">{lead}</span>
      <span data-accent-phrase="true" className="text-accent-action block">
        {accent}
      </span>
    </h1>
  );
}
