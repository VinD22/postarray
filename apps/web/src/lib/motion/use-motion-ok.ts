'use client';

import { useMediaQuery, usePrefersReducedMotion } from '@relay/design-system/hooks';

/**
 * Whether a GSAP animation is allowed to run at all.
 *
 * `usePrefersReducedMotion` defaults to `true` on the server (see its own
 * doc comment), so the safe, static, finished state is always what
 * server-rendered HTML and first paint show — motion only switches on once
 * the client confirms the user did not ask to avoid it.
 *
 * Pass `requireFinePointer: true` for interactions that only make sense with
 * a mouse or trackpad (magnetic pulls, hover-driven flourishes) — this adds
 * a `(pointer: fine)` check so coarse/touch pointers get the inert,
 * passthrough state instead of a half-working gesture.
 */
export function useMotionOk(options?: { readonly requireFinePointer?: boolean }): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFinePointer = useMediaQuery('(pointer: fine)', false);

  if (options?.requireFinePointer) {
    return !prefersReducedMotion && isFinePointer;
  }

  return !prefersReducedMotion;
}
