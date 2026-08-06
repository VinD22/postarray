import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The design system's `@theme` font-size scale (`theme.css`), i.e. every
 * `--text-*` entry that is a *size* token rather than a semantic *color*
 * token (the color ramp lives under `--color-text-*` and is unaffected by
 * this list). Tailwind v4 generates a `text-{name}` utility for both kinds
 * of token, and tailwind-merge's default config only recognizes the stock
 * keyword scale (`text-xs` … `text-9xl`) as font-size — any custom name like
 * `text-body-lg` falls through into the catch-all color group instead.
 *
 * Concretely, that made `cn(buttonVariants({ variant: 'cta' }), 'text-body-lg')`
 * silently drop `text-cta-on`: tailwind-merge treated it and `text-body-lg`
 * as the same "text color" conflict group and kept only the last one,
 * leaving CTA/primary/destructive buttons with unset (near-white) text on a
 * bright fill — as low as 1.24:1 contrast, found by the WP-12 Lighthouse
 * accessibility pass on `/`. Registering the scale here as its own
 * `font-size` group fixes every call site at once instead of patching each
 * one. Keep in sync with the `--text-*` size entries in
 * `tokens/theme.css`'s `@theme` block (13 today).
 */
const FONT_SIZE_TOKENS = [
  'display',
  'title-lg',
  'title-md',
  'title-sm',
  'body-lg',
  'body-md',
  'body-sm',
  'label',
  'code',
  'mono',
  'display-2xl',
  'display-xl',
  'display-lg',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...FONT_SIZE_TOKENS] }],
    },
  },
});

/**
 * Joins conditional class names and lets a later Tailwind utility win over an
 * earlier one in the same group. Every component takes a `className` prop and
 * merges it last, so a caller can always override a default.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };
