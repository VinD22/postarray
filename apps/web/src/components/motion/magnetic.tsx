'use client';

import { useRef, type ReactNode } from 'react';

import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { Button, type ButtonProps } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

export interface MagneticProps {
  readonly strength?: number;
  readonly maxOffset?: number;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Wraps its child in a container that pulls toward the pointer while the
 * pointer is over it, then eases back out with an elastic return.
 *
 * Fine-pointer devices only — `useMotionOk({ requireFinePointer: true })`
 * gates this on `(pointer: fine)` as well as reduced motion, so touch and
 * reduced-motion visitors get an inert passthrough: the child, untouched, no
 * listeners attached.
 *
 * The magnetic pull only ever transforms this wrapper (`x`/`y`), never
 * layout — see the header comment in `lib/motion/gsap.ts`.
 */
export function Magnetic({ strength = 0.25, maxOffset = 8, className, children }: MagneticProps) {
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk({ requireFinePointer: true });

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;

      const el = scope.current;
      const quickX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      const quickY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });

      const handlePointerMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const relativeX = event.clientX - (rect.left + rect.width / 2);
        const relativeY = event.clientY - (rect.top + rect.height / 2);
        quickX(gsap.utils.clamp(-maxOffset, maxOffset, relativeX * strength));
        quickY(gsap.utils.clamp(-maxOffset, maxOffset, relativeY * strength));
      };

      const handlePointerLeave = () => {
        quickX(0);
        quickY(0);
      };

      el.addEventListener('pointermove', handlePointerMove);
      el.addEventListener('pointerleave', handlePointerLeave);

      return () => {
        el.removeEventListener('pointermove', handlePointerMove);
        el.removeEventListener('pointerleave', handlePointerLeave);
      };
    },
    { scope, dependencies: [motionOk, strength, maxOffset] },
  );

  return (
    <div ref={scope} className={cn('inline-flex', className)}>
      {children}
    </div>
  );
}

export interface MagneticButtonProps extends ButtonProps {
  readonly strength?: number;
  readonly maxOffset?: number;
}

/**
 * Sugar for the common case: a `Button` with a `Magnetic` wrapper baked in.
 */
export function MagneticButton({ strength, maxOffset, ...buttonProps }: MagneticButtonProps) {
  return (
    <Magnetic strength={strength} maxOffset={maxOffset}>
      <Button {...buttonProps} />
    </Magnetic>
  );
}
