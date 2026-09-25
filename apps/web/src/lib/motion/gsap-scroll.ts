'use client';

/**
 * GSAP with ScrollTrigger registered. Import from here, not from `./gsap`,
 * in any component that passes a `scrollTrigger` var, so the plugin only
 * ships with the modules that use it.
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { gsap, useGSAP } from './gsap';

// ScrollTrigger owns a browser-global synchronization timer. Registering it in
// Vitest leaves that timer alive after JSDOM is torn down, where its next tick
// no longer has requestAnimationFrame. Component tests exercise the accessible
// finished state, not scroll position, so keep that browser lifecycle out of
// the test runtime while retaining the same imports and types.
if (process.env.NODE_ENV !== 'test') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, useGSAP, ScrollTrigger };
