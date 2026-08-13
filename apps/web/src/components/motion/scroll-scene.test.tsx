import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ScrollScene } from './scroll-scene';
import {
  hiddenStateClassesIn,
  inlineTransformsIn,
  mockMotionPreference,
  restoreMotionPreference,
} from './motion-test-media';

afterEach(restoreMotionPreference);

const SCENES = [
  <p key="a">Draft once</p>,
  <p key="b" data-scene-beat="publish">
    Publish everywhere
  </p>,
  <p key="c">Read the receipts</p>,
];

describe('ScrollScene with motion off', () => {
  it('renders every scene visibly, stacked and unmoved', () => {
    mockMotionPreference('reduce');
    const { container } = render(<ScrollScene scenes={SCENES} />);

    expect(screen.getByText('Draft once')).toBeVisible();
    expect(screen.getByText('Publish everywhere')).toBeVisible();
    expect(screen.getByText('Read the receipts')).toBeVisible();
    expect(inlineTransformsIn(container)).toEqual([]);
  });

  it('never fires progress or beat callbacks', () => {
    mockMotionPreference('reduce');
    const onProgress = vi.fn();
    const onBeat = vi.fn();
    render(<ScrollScene scenes={SCENES} onProgress={onProgress} onBeat={onBeat} />);

    expect(onProgress).not.toHaveBeenCalled();
    expect(onBeat).not.toHaveBeenCalled();
  });

  it('leaves the background alone, so the surrounding surface token still shows', () => {
    mockMotionPreference('reduce');
    const { container } = render(
      <ScrollScene
        scenes={SCENES}
        background={{ from: '--surface-canvas', to: '--accent-cool-subtle-bg' }}
      />,
    );

    const frame = container.firstElementChild;
    expect(frame).toBeInstanceOf(HTMLElement);
    expect((frame as HTMLElement).style.backgroundColor).toBe('');
  });
});

describe('ScrollScene server HTML', () => {
  it('contains every scene and no hidden-state class', () => {
    const markup = renderToStaticMarkup(<ScrollScene scenes={SCENES} />);

    expect(hiddenStateClassesIn(markup)).toEqual([]);
    expect(markup).toContain('Draft once');
    expect(markup).toContain('Publish everywhere');
    expect(markup).toContain('Read the receipts');
  });
});

describe('ScrollScene with motion on', () => {
  it('keeps every scene in the document', () => {
    mockMotionPreference('no-preference');
    render(<ScrollScene scenes={SCENES} />);

    expect(screen.getByText('Draft once')).toBeInTheDocument();
    expect(screen.getByText('Publish everywhere')).toBeInTheDocument();
    expect(screen.getByText('Read the receipts')).toBeInTheDocument();
  });
});
