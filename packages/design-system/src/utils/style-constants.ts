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
 * The poster surface recipe: bold 2px ink outline, hard offset shadow. Used
 * where a control should read as a physical, cut-out panel rather than a
 * quiet tonal one — the CTA button, poster cards and other "loud" surfaces.
 */
export const panelPoster = 'bg-surface-raised border-2 border-border-bold rounded-lg shadow-hard';

/**
 * Physical press feedback: the surface translates toward its own hard shadow
 * on `:active` instead of the shadow moving, so the offset direction mirrors
 * for free under `[dir='rtl']` (see `--shadow-hard-x` in theme.css).
 */
export const pressable = 'relay-pressable';
