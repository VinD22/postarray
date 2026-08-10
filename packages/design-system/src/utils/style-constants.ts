/**
 * Shared class fragments. Defining these once is what keeps focus, disabled and
 * density behaviour identical across every control instead of drifting per file.
 */

/**
 * One focus treatment for the whole product: two device pixels of accent, set
 * outside the control's own border so it stays visible on any surface, and
 * still visible under Windows high contrast mode.
 */
export const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-[color:var(--border-focus)]';

/** Focus ring drawn inside the control, for full-bleed rows and table cells. */
export const focusRingInset =
  'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 ' +
  'focus-visible:outline-[color:var(--border-focus)]';

export const disabledState =
  'disabled:cursor-not-allowed disabled:text-text-disabled ' +
  'disabled:border-border-subtle disabled:bg-surface-sunken';

export const dataDisabledState =
  'data-[disabled]:cursor-not-allowed data-[disabled]:text-text-disabled';

/** Functional transition. 120ms, and removed entirely under reduced motion. */
export const transitionBase =
  'transition-[background-color,border-color,color,box-shadow] ' +
  'duration-[--duration-fast] ease-[--ease-standard] motion-reduce:transition-none';

/** Minimum touch target on coarse pointers, per WCAG 2.2 target size. */
export const touchTarget = 'min-h-11 md:min-h-0';

/** Control heights. Product density is tight and predictable. */
export const controlHeight = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-10',
} as const;

export type ControlSize = keyof typeof controlHeight;

/** The one surface recipe: hairline border, tonal fill, small radius, no shadow. */
export const panelSurface = 'bg-surface-raised border border-border-default rounded-lg';

/**
 * The emphasised surface recipe. Editorial edition: still a hairline border
 * and a tonal fill, separated from `panelSurface` only by a soft, diffuse
 * lift rather than by a 2px ink outline and an offset block.
 *
 * The name survives because ~40 call sites outside this package still ask for
 * it; visually it is now a near-twin of `panelSurface`. Prefer `panelSurface`
 * in new code and reach for this only when a panel genuinely needs to float
 * above its neighbours.
 */
export const panelPoster = 'bg-surface-raised border border-border-default rounded-lg shadow-raised';

/**
 * Press feedback. Editorial edition: a quiet 1px vertical settle plus the
 * shadow softening, rather than the surface translating into an offset block.
 * The press is vertical only, so nothing needs mirroring under `[dir='rtl']`
 * (see `.relay-pressable` in theme.css).
 */
export const pressable = 'relay-pressable';

/**
 * The elevation ramp for committing actions: quiet at rest, a soft lift on
 * hover, flat again when disabled. `--shadow-*` resolves to diffuse editorial
 * shadows, so this is a change in depth, never a glow or an offset block.
 * `transitionBase` already animates `box-shadow` and already opts out under
 * `prefers-reduced-motion`.
 */
export const elevationRamp = 'shadow-raised hover:shadow-hard disabled:shadow-none';
