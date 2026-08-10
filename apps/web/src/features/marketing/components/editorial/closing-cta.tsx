import type { ReactNode } from 'react';
import { Link } from '@/components/link';
import { Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { EditorialDisplay } from './display';
import { EditorialSection } from './section';

/**
 * The closing band: inverted ink, a display headline, exactly one action.
 *
 * This is the page's single inverted moment (see `EditorialSection`'s own doc
 * comment and `inverted-band.test.ts`), which is why no other section on a
 * migrated page sets `tone="inverted"`.
 *
 * "Exactly one primary action" is a shape, not a convention: `cta` is a single
 * object, so a second button has nowhere to go. A page that genuinely needs
 * two closing paths has a hierarchy problem, not a props problem.
 *
 * The action is `variant="secondary"`, which is the correct commit treatment
 * on an inverted ground rather than a downgrade. `variant="primary"` is ink
 * filled (`bg-surface-inverted`, see `button.tsx`), which is the same fill as
 * this band, so a primary button here would be invisible in both themes.
 * Secondary resolves to a paper chip on the light theme's ink band and an ink
 * chip on the dark theme's paper band, and it is the only button present.
 */
export interface ClosingCtaProps {
  /** Already-translated. Passed straight to `EditorialDisplay`. */
  readonly title: string;
  readonly body?: ReactNode;
  readonly cta: { readonly href: string; readonly label: string };
  readonly footnote?: ReactNode;
  readonly id?: string;
  readonly className?: string;
}

export function ClosingCta({
  title,
  body,
  cta,
  footnote,
  id,
  className,
}: ClosingCtaProps): ReactNode {
  return (
    <EditorialSection tone="inverted" id={id} className={className}>
      <div className="max-w-[46rem] space-y-6">
        <EditorialDisplay as="h2" size="sm">
          {title}
        </EditorialDisplay>
        {body ? <p className={cn('text-body-lg max-w-[62ch] leading-[1.65]')}>{body}</p> : null}
        <div className="pt-2">
          <Button asChild variant="secondary" className="text-body-lg h-11 px-5">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </div>
        {footnote ? (
          <p className="text-body-md max-w-[62ch] leading-[1.6]">{footnote}</p>
        ) : null}
      </div>
    </EditorialSection>
  );
}
