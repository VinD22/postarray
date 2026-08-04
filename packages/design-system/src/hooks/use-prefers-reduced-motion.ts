import { useMediaQuery } from './use-media-query.js';

/**
 * True when the operating system asks for reduced motion.
 *
 * CSS already neutralises transitions globally (see theme.css). This hook is
 * for the cases CSS cannot reach: scroll animation, a canvas draw loop, or a
 * decision to jump straight to an end state instead of tweening to it.
 *
 * The server assumes reduced motion, so the first paint is never a movement
 * the user asked not to see.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', true);
}
