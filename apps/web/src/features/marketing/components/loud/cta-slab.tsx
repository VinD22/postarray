import type { ReactNode } from 'react';
import { Link } from '@/components/link';
import { MagneticButton } from '@/components/motion';
import { cn } from '@relay/design-system/utils';

import { Band } from './band';
import { LoudDisplay } from './display';

/**
 * The full-bleed closing CTA band, reused as the final section of every
 * marketing page.
 *
 * `Band tone="cta"` supplies the yellow fill (folded toward a deep ochre in
 * dark theme, see `globals.css`) and the mandatory ink `cta-on` text; the
 * button is deliberately `variant="primary"` (blue) rather than `variant="cta"`
 * (also yellow), so it reads as a distinct control against the band instead
 * of blending into it. `MagneticButton` gates its own pull behind
 * `(pointer: fine)` and reduced motion, so touch and reduced-motion visitors
 * get a plain, inert button.
 */
export interface CtaSlabProps {
  /** Already-translated. Passed straight to `LoudDisplay`. */
  readonly title: string;
  readonly body?: ReactNode;
  readonly cta: { readonly href: string; readonly label: string };
  readonly footnote?: ReactNode;
  readonly id?: string;
  readonly className?: string;
}

export function CtaSlab({ title, body, cta, footnote, id, className }: CtaSlabProps): ReactNode {
  return (
    <Band tone="cta" id={id} className={className}>
      <div className="max-w-[46rem] space-y-6">
        <LoudDisplay as="h2" size="xl">
          {title}
        </LoudDisplay>
        {body ? <p className={cn('text-body-lg max-w-[62ch] leading-[1.6]')}>{body}</p> : null}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <MagneticButton asChild variant="primary" className="text-body-lg h-11 px-5">
            <Link href={cta.href}>{cta.label}</Link>
          </MagneticButton>
        </div>
        {footnote ? <p className="text-body-md max-w-[62ch] leading-[1.6]">{footnote}</p> : null}
      </div>
    </Band>
  );
}
