import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { ParallaxLayer } from './parallax-layer';
import {
  hiddenStateClassesIn,
  inlineTransformsIn,
  mockMotionPreference,
  restoreMotionPreference,
} from './motion-test-media';

afterEach(restoreMotionPreference);

describe('ParallaxLayer with motion off', () => {
  it('renders its children visibly and unmoved', () => {
    mockMotionPreference('reduce');
    const { container } = render(
      <ParallaxLayer depth={0.3}>
        <p>Publish once, arrive everywhere</p>
      </ParallaxLayer>,
    );

    expect(screen.getByText('Publish once, arrive everywhere')).toBeVisible();
    expect(inlineTransformsIn(container)).toEqual([]);
  });

  it('adds no wrapper element of its own', () => {
    mockMotionPreference('reduce');
    const { container } = render(
      <ParallaxLayer className="should-not-appear">
        <p data-testid="child">Copy</p>
      </ParallaxLayer>,
    );

    // The child is the container's only element: no wrapper, so no stray box
    // in the layout and nothing that could carry a transform later.
    expect(container.firstElementChild).toBe(screen.getByTestId('child'));
    expect(container.querySelector('.should-not-appear')).toBeNull();
  });
});

describe('ParallaxLayer server HTML', () => {
  it('contains no hidden-state class', () => {
    const markup = renderToStaticMarkup(
      <ParallaxLayer>
        <p>Copy</p>
      </ParallaxLayer>,
    );

    expect(hiddenStateClassesIn(markup)).toEqual([]);
    expect(markup).toContain('Copy');
  });
});

describe('ParallaxLayer with motion on', () => {
  it('still renders every child', () => {
    mockMotionPreference('no-preference');
    render(
      <ParallaxLayer>
        <p>Copy</p>
      </ParallaxLayer>,
    );

    expect(screen.getByText('Copy')).toBeInTheDocument();
  });
});
