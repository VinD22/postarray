import { describe, expect, it } from 'vitest';
import {
  CONTRAST_THRESHOLD_AA,
  contrastRatio,
  meetsContrastAA,
  parseHexColor,
  pickReadableForeground,
  relativeLuminance,
} from './contrast.js';
import {
  darkTheme,
  documentedContrastPairs,
  lightTheme,
  PROVIDER_KEYS,
  themes,
  typeScale,
  type ContrastPair,
  type ThemeName,
} from './tokens.js';

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  it('returns 1 for a colour against itself', () => {
    expect(contrastRatio('#12585F', '#12585F')).toBeCloseTo(1, 10);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#1B1917', '#FAF9F7')).toBeCloseTo(
      contrastRatio('#FAF9F7', '#1B1917'),
      10,
    );
  });

  it('accepts shorthand hex', () => {
    expect(contrastRatio('#fff', '#000')).toBeCloseTo(21, 5);
  });

  it('rejects a value that is not a hex colour', () => {
    expect(() => parseHexColor('rgb(0,0,0)')).toThrow();
  });

  it('computes relative luminance at the endpoints', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 10);
  });
});

describe('meetsContrastAA', () => {
  it('applies 4.5:1 to body and 3:1 to large text and UI boundaries', () => {
    expect(CONTRAST_THRESHOLD_AA.body).toBe(4.5);
    expect(CONTRAST_THRESHOLD_AA['large-text']).toBe(3);
    expect(CONTRAST_THRESHOLD_AA['ui-boundary']).toBe(3);
  });

  it('does not round a near miss up into a pass', () => {
    // #767676 on white is 4.54; #777777 is 4.48 and must fail body.
    expect(meetsContrastAA('#767676', '#FFFFFF', 'body')).toBe(true);
    expect(meetsContrastAA('#777777', '#FFFFFF', 'body')).toBe(false);
    expect(meetsContrastAA('#777777', '#FFFFFF', 'large-text')).toBe(true);
  });
});

describe('pickReadableForeground', () => {
  it('picks the candidate with the higher ratio', () => {
    expect(
      pickReadableForeground(lightTheme.surface.canvas, [
        lightTheme.text.primary,
        lightTheme.text.inverted,
      ]),
    ).toBe(lightTheme.text.primary);
    expect(
      pickReadableForeground(darkTheme.surface.canvas, [
        darkTheme.text.inverted,
        darkTheme.text.primary,
      ]),
    ).toBe(darkTheme.text.primary);
  });
});

/**
 * The merge gate. Every documented token pair must clear WCAG 2.2 AA in both
 * themes. A failure here means a token change made the product less legible,
 * and it blocks the merge rather than becoming a follow-up ticket.
 */
describe.each<ThemeName>(['light', 'dark'])('WCAG 2.2 AA gate: %s theme', (themeName) => {
  const theme = themes[themeName];

  const cases: [string, ContrastPair][] = documentedContrastPairs.map((pair) => [
    pair.id,
    pair,
  ]);

  it.each(cases)(
    '%s',
    (_id, pair) => {
      const foreground = pair.foreground(theme);
      const background = pair.background(theme);
      const ratio = contrastRatio(foreground, background);
      const required = CONTRAST_THRESHOLD_AA[pair.purpose];

      expect(
        ratio,
        `${pair.id} in ${themeName}: ${foreground} on ${background} is ` +
          `${ratio.toFixed(2)}:1, needs ${required}:1 (${pair.purpose})`,
      ).toBeGreaterThanOrEqual(required);
    },
  );

  it('documents at least one pair for every semantic text token', () => {
    const ids = documentedContrastPairs.map((p) => p.id).join('\n');
    for (const key of ['primary', 'secondary', 'tertiary', 'accent', 'disabled']) {
      expect(ids).toContain(`text.${key} on surface.canvas`);
    }
  });

  it('documents every provider identity colour', () => {
    const ids = documentedContrastPairs.map((p) => p.id);
    for (const provider of PROVIDER_KEYS) {
      expect(ids).toContain(`brand.${provider} on surface.canvas`);
    }
  });

  it('keeps every surface distinguishable from the one above it', () => {
    // Tonal steps replace shadows, so each step must be visible but quiet.
    const steps: readonly [string, string][] = [
      [theme.surface.canvas, theme.surface.raised],
      [theme.surface.canvas, theme.surface.sunken],
      [theme.surface.raised, theme.surface.hover],
      [theme.surface.hover, theme.surface.active],
    ];
    for (const [a, b] of steps) {
      const ratio = contrastRatio(a, b);
      expect(ratio).toBeGreaterThan(1.01);
      expect(ratio).toBeLessThan(1.6);
    }
  });
});

describe('type scale', () => {
  it('descends monotonically through the title and body ramps', () => {
    const rem = (value: string): number => Number.parseFloat(value);
    expect(rem(typeScale.display.fontSize)).toBeGreaterThan(
      rem(typeScale.titleLg.fontSize),
    );
    expect(rem(typeScale.titleLg.fontSize)).toBeGreaterThan(
      rem(typeScale.titleMd.fontSize),
    );
    expect(rem(typeScale.titleMd.fontSize)).toBeGreaterThan(
      rem(typeScale.titleSm.fontSize),
    );
    expect(rem(typeScale.bodyLg.fontSize)).toBeGreaterThan(
      rem(typeScale.bodyMd.fontSize),
    );
    expect(rem(typeScale.bodyMd.fontSize)).toBeGreaterThan(
      rem(typeScale.bodySm.fontSize),
    );
    expect(rem(typeScale.bodySm.fontSize)).toBeGreaterThan(
      rem(typeScale.label.fontSize),
    );
  });

  it('never tracks tighter than -0.04em', () => {
    for (const step of Object.values(typeScale)) {
      expect(Number.parseFloat(step.letterSpacing)).toBeGreaterThanOrEqual(-0.04);
    }
  });

  it('keeps the smallest step at or above 12px so it survives 200% zoom', () => {
    const smallest = Math.min(
      ...Object.values(typeScale).map((s) => Number.parseFloat(s.fontSize)),
    );
    expect(smallest * 16).toBeGreaterThanOrEqual(12);
  });
});
