import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { CelebrationBurst } from './celebration-burst';
import {
  hiddenStateClassesIn,
  mockMotionPreference,
  restoreMotionPreference,
} from './motion-test-media';

afterEach(restoreMotionPreference);

function pieces(container: HTMLElement): readonly HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>('.relay-confetti-piece')];
}

describe('CelebrationBurst with motion off', () => {
  it('renders nothing at all', () => {
    mockMotionPreference('reduce');
    const { container } = render(<CelebrationBurst tier="lg" />);

    // Deliberately not "renders a frozen burst": a finished confetti burst
    // carries no information, so the fallback is absence, not a static state.
    expect(container).toBeEmptyDOMElement();
  });
});

describe('CelebrationBurst server HTML', () => {
  it('is empty, and so carries no hidden-state class', () => {
    const markup = renderToStaticMarkup(<CelebrationBurst />);

    expect(markup).toBe('');
    expect(hiddenStateClassesIn(markup)).toEqual([]);
  });
});

describe('CelebrationBurst with motion on', () => {
  it('fires twelve pieces at tier sm and twenty-four at tier lg', () => {
    mockMotionPreference('no-preference');
    const small = render(<CelebrationBurst tier="sm" />);
    expect(pieces(small.container)).toHaveLength(12);

    const large = render(<CelebrationBurst tier="lg" />);
    expect(pieces(large.container)).toHaveLength(24);
  });

  it('colours pieces only from the three accent families', () => {
    mockMotionPreference('no-preference');
    const { container } = render(<CelebrationBurst tier="lg" />);

    const tones = new Set(
      pieces(container).flatMap((piece) => [...piece.classList].filter((c) => c.startsWith('bg-'))),
    );
    expect([...tones].sort()).toEqual(['bg-accent', 'bg-accent-cool', 'bg-accent-warm']);
  });

  it('places every piece deterministically, so a re-render cannot mismatch', () => {
    mockMotionPreference('no-preference');
    const first = render(<CelebrationBurst tier="lg" />);
    const second = render(<CelebrationBurst tier="lg" />);

    const geometry = (container: HTMLElement) =>
      pieces(container).map((piece) => piece.getAttribute('style'));

    expect(geometry(first.container)).toEqual(geometry(second.container));
  });

  it('fires once per trigger value, not once per render', () => {
    mockMotionPreference('no-preference');
    const { container, rerender } = render(<CelebrationBurst tier="sm" trigger="receipt-1" />);
    const firstStyles = pieces(container).map((piece) => piece.getAttribute('style'));

    rerender(<CelebrationBurst tier="sm" trigger="receipt-1" />);
    expect(pieces(container)).toHaveLength(12);
    expect(pieces(container).map((piece) => piece.getAttribute('style'))).toEqual(firstStyles);

    rerender(<CelebrationBurst tier="sm" trigger="receipt-2" />);
    expect(pieces(container)).toHaveLength(12);
  });

  it('is hidden from assistive technology', () => {
    mockMotionPreference('no-preference');
    const { container } = render(<CelebrationBurst />);

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
