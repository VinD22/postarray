import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ColorBand } from './color-band';
import { GradientWash } from './gradient-wash';
import { MAX_STICKER_TILT_DEGREES, Sticker, clampTilt } from './sticker';
import { TourIndicator } from './tour-indicator';

/**
 * The scene vocabulary's compositions.
 *
 * These are server components with no timeline of their own, so what is worth
 * testing is not that they render — it is the four promises the budget and the
 * design policy are relying on them to keep, each of which a future edit could
 * quietly break: the band publishes the accent the cursor reads, the wash is
 * inert decoration, the sticker cannot be silently over-rotated, and the
 * indicator never signals position by colour alone.
 */
describe('ColorBand', () => {
  it('publishes its accent family on the DOM for the cursor to adopt', () => {
    // `custom-cursor.tsx` walks up to the nearest `[data-scene-accent]`. If
    // this attribute goes, the cursor silently stops recolouring and nothing
    // else fails, which is exactly the kind of regression a test should own.
    render(
      <ColorBand accent="cool" ariaLabel="Band">
        <p>Inside</p>
      </ColorBand>,
    );

    expect(screen.getByLabelText('Band')).toHaveAttribute('data-scene-accent', 'cool');
  });

  it('tints the ground without inverting the ink', () => {
    // The whole distinction from the inverted band: ground changes, text
    // colour does not. Two inverted moments per page is the failure this
    // keeps `inverted-band.test.ts` from having to police twice.
    render(
      <ColorBand accent="warm" ariaLabel="Band">
        <p>Inside</p>
      </ColorBand>,
    );

    const band = screen.getByLabelText('Band');
    expect(band.className).toContain('bg-accent-warm-subtle');
    expect(band.className).toContain('text-text-primary');
    expect(band.className).not.toContain('bg-surface-inverted');
  });
});

describe('GradientWash', () => {
  it('is inert decoration: hidden from assistive tech and from the pointer', () => {
    const { container } = render(<GradientWash accent="warm" />);
    const wash = container.firstElementChild;

    expect(wash).toHaveAttribute('aria-hidden', 'true');
    expect(wash?.className).toContain('pointer-events-none');
  });

  it('fades to transparent on the two edge placements, so copy never sits on the ramp', () => {
    // Rule 1 of the gradient policy. `full` is the named exception and is
    // only for regions with no running copy.
    for (const placement of ['top', 'bottom'] as const) {
      const { container } = render(<GradientWash accent="cool" placement={placement} />);
      expect(container.firstElementChild?.className).toContain('to-transparent');
    }
  });
});

describe('Sticker', () => {
  it('clamps rotation to 3 degrees in both directions', () => {
    expect(clampTilt(40)).toBe(MAX_STICKER_TILT_DEGREES);
    expect(clampTilt(-40)).toBe(-MAX_STICKER_TILT_DEGREES);
    expect(clampTilt(2)).toBe(2);
  });

  it('carries a fact and the source that fact can be checked against', () => {
    // The v1 sticker was deleted for being decorative. `fact` and `source`
    // are both required props, so an empty sticker is a type error rather
    // than a review comment; this asserts both actually reach the page.
    render(<Sticker fact="8 connectors live" source="Changelog" />);

    expect(screen.getByText('8 connectors live')).toBeInTheDocument();
    expect(screen.getByText('Changelog')).toBeInTheDocument();
  });
});

describe('TourIndicator', () => {
  it('states the position as visible text, never by the filled dot alone', () => {
    render(<TourIndicator total={3} activeIndex={1} positionLabel="2 of 3" />);

    // Visible text, not an aria-label: the requirement is that a reader who
    // cannot tell the dots apart still learns where they are.
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
  });

  it('marks exactly one beat active', () => {
    const { container } = render(
      <TourIndicator total={4} activeIndex={2} positionLabel="3 of 4" />,
    );

    expect(container.querySelectorAll('[data-active="true"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-active="false"]')).toHaveLength(3);
  });
});
