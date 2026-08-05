/**
 * WCAG 2.2 relative luminance and contrast maths.
 *
 * Kept dependency free so the contrast gate can run anywhere: the test suite,
 * a canvas renderer picking a legible label colour, or a chart axis deciding
 * whether a series colour needs a darker variant.
 */

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Parses `#rgb` or `#rrggbb` into 0-255 channels. Throws on anything else. */
export function parseHexColor(hex: string): Rgb {
  const match = hex.trim().match(HEX_PATTERN);
  if (!match) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  const body = match[1] ?? '';
  const full =
    body.length === 3
      ? body
          .split('')
          .map((c) => c + c)
          .join('')
      : body;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

function channelLuminance(value255: number): number {
  const channel = value255 / 255;
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(color: string | Rgb): number {
  const { r, g, b } = typeof color === 'string' ? parseHexColor(color) : color;
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** WCAG contrast ratio between two opaque colours. Always >= 1. */
export function contrastRatio(foreground: string | Rgb, background: string | Rgb): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ContrastPurpose = 'body' | 'large-text' | 'ui-boundary';

/** AA thresholds. 4.5:1 for body copy, 3:1 for large text and UI boundaries. */
export const CONTRAST_THRESHOLD_AA: Readonly<Record<ContrastPurpose, number>> = {
  body: 4.5,
  'large-text': 3,
  'ui-boundary': 3,
};

export function meetsContrastAA(
  foreground: string | Rgb,
  background: string | Rgb,
  purpose: ContrastPurpose = 'body',
): boolean {
  // Truncate to two decimals first so a 4.4996 reading is not reported as a pass.
  const ratio = Math.floor(contrastRatio(foreground, background) * 100) / 100;
  return ratio >= CONTRAST_THRESHOLD_AA[purpose];
}

/**
 * Picks whichever of two candidate foregrounds reads better on `background`.
 * Used by canvas and chart consumers that cannot rely on the CSS cascade.
 */
export function pickReadableForeground(
  background: string | Rgb,
  candidates: readonly [string, string],
): string {
  const [first, second] = candidates;
  return contrastRatio(first, background) >= contrastRatio(second, background) ? first : second;
}
