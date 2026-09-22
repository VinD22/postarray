'use client';

/**
 * The GSAP motion core. This is the ONLY file in the codebase that imports
 * `gsap` directly (with its plugin siblings `gsap-scroll.ts` and
 * `gsap-split.ts`) — every animated component under `components/motion/`
 * imports its primitives from here, never from the `gsap` package itself, so
 * plugin registration only ever happens once.
 *
 * Two non-negotiable rules for every motion component built on top of this
 * module (see `apps/web/src/components/motion/README.md` for the full
 * write-up):
 *
 * 1. The global 1ms reduced-motion CSS override (see `theme.css`) does NOT
 *    reach GSAP — GSAP writes inline styles from a rAF loop, which the CSS
 *    override cannot touch. Every component must branch on
 *    `usePrefersReducedMotion()` (via `useMotionOk`, below) or
 *    `gsap.matchMedia` and render the finished, static state instead of
 *    animating to it.
 * 2. Never author hidden initial state in markup (no `opacity-0` classes,
 *    no `hidden` attributes gated on JS). Server HTML is the finished page —
 *    it is what search engines, no-JS clients and reduced-motion users see.
 *    Hide or offset an element only from inside `useGSAP`, via `gsap.set()`
 *    or `.from()`, scoped to the component with the `useGSAP({ scope })`
 *    container-ref pattern.
 */
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';

// Only the core, the React hook and Flip (the nav indicator and the composer
// rail use it) are registered here, because this module is reachable from the
// signed-in app. ScrollTrigger and SplitText are marketing plugins: they are
// registered by `./gsap-scroll` and `./gsap-split`, which only the scroll- and
// headline-driven components import, so the app bundle does not carry them.
gsap.registerPlugin(useGSAP, Flip);

export { gsap, useGSAP, Flip };
