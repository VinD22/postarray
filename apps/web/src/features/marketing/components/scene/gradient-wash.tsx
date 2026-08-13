import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import type { SceneAccent } from './color-band';

/**
 * A decorative duotone wash, painted behind a band's content.
 *
 * ## What the gradient policy allows, and what this component therefore is
 *
 * The written gradient policy in `packages/design-system/src/tokens/theme.css`
 * (read its header before touching this file) is not test-enforceable, because
 * a gradient has no single colour to measure. It is four rules, and this
 * component is shaped by all four:
 *
 *  1. **Body text never sits on a gradient.** So this is not a background for
 *     a section: it is an EDGE. It occupies a band at one end of its parent
 *     and fades to fully transparent before the content column starts. The
 *     `full` variant exists for regions with no running copy at all (a
 *     scene's stage, a band whose only child is display type) and is named so
 *     a reviewer notices it.
 *  2. **Display text over a gradient passes AA against both stops.** Nothing
 *     is placed inside this element, so text-over-gradient is a call-site
 *     decision the doc above governs, not something this file can do wrong.
 *  3. **Texture stays at or below 8%.** There is no texture here at all.
 *  4. **Duotone stops stay inside one accent family, or pair a documented
 *     surface token with a documented accent token.** Every stop below is a
 *     `--color-*` token: the family's subtle tint to the family's default,
 *     with no arbitrary hex anywhere.
 *
 * It renders `aria-hidden` and `pointer-events-none`, and its parent must be
 * positioned (`relative`) — it is a layer, never a container.
 */
export type GradientWashPlacement = 'top' | 'bottom' | 'full';

/**
 * Stops per family, subtle tint to family default, expressed as Tailwind
 * gradient utilities over documented tokens. The `to-transparent` third stop
 * is what keeps running copy off the ramp for the two edge placements.
 */
const RAMP_CLASS: Record<SceneAccent, string> = {
  warm: 'from-accent-warm/25 via-accent-warm-subtle/40',
  cool: 'from-accent-cool/25 via-accent-cool-subtle/40',
  neutral: 'from-border-strong/15 via-surface-sunken/40',
};

const PLACEMENT_CLASS: Record<GradientWashPlacement, string> = {
  top: 'inset-inline-0 top-0 h-48 bg-gradient-to-b to-transparent',
  bottom: 'inset-inline-0 bottom-0 h-48 bg-gradient-to-t to-transparent',
  full: 'inset-0 bg-gradient-to-b to-transparent',
};

export interface GradientWashProps {
  readonly accent: SceneAccent;
  /** `full` only where there is no running copy. See the doc comment. */
  readonly placement?: GradientWashPlacement;
  readonly className?: string;
}

export function GradientWash({
  accent,
  placement = 'top',
  className,
}: GradientWashProps): ReactNode {
  return (
    <div
      aria-hidden="true"
      data-scene-wash={accent}
      className={cn(
        'pointer-events-none absolute',
        PLACEMENT_CLASS[placement],
        RAMP_CLASS[accent],
        className,
      )}
    />
  );
}
