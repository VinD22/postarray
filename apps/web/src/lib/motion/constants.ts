/**
 * GSAP motion constants.
 *
 * These mirror the CSS motion tokens declared in
 * `packages/design-system/src/tokens/theme.css` (`--duration-*` / `--ease-*`).
 * GSAP timelines run in JS and cannot read CSS custom properties, so the two
 * sets of values are kept in sync by hand — if theme.css's motion tokens
 * change, update this file to match.
 *
 * Durations are in seconds (GSAP's native unit); theme.css states the same
 * values in milliseconds.
 */

// --- Durations -------------------------------------------------------------
// Functional tier — in-app, mirrors --duration-instant/-fast/-base/-slow.
export const DURATION_INSTANT = 0.08; // --duration-instant: 80ms
export const DURATION_FAST = 0.12; // --duration-fast: 120ms
export const DURATION_BASE = 0.16; // --duration-base: 160ms
export const DURATION_SLOW = 0.2; // --duration-slow: 200ms

// Expressive tier — marketing/overlay choreography, mirrors
// --duration-expressive-sm/-md/-lg.
export const EXPRESSIVE_SM = 0.4; // --duration-expressive-sm: 400ms
export const EXPRESSIVE_MD = 0.65; // --duration-expressive-md: 650ms
export const EXPRESSIVE_LG = 0.9; // --duration-expressive-lg: 900ms

// --- Eases -------------------------------------------------------------
// GSAP eases are named strings/functions, not CSS cubic-beziers — these are
// GSAP's closest built-in equivalents to the curves of the same name in
// theme.css.
export const EASE_STANDARD = 'power2.out'; // ~ --ease-standard
export const EASE_ENTRANCE = 'power3.out'; // ~ --ease-entrance
export const EASE_EXIT = 'power2.in'; // ~ --ease-exit
export const EASE_OUT_BACK = 'back.out(1.7)'; // ~ --ease-out-back
export const EASE_OUT_EXPO = 'expo.out'; // ~ --ease-out-expo
