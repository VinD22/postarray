import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { SceneSequencer, type SequencerScene } from './scene-sequencer';
import {
  hiddenStateClassesIn,
  inlineTransformsIn,
  mockMotionPreference,
  restoreMotionPreference,
} from './motion-test-media';

afterEach(restoreMotionPreference);

const SCENES: readonly SequencerScene[] = [
  { id: 'draft', label: 'Write it once', content: <p>One brief, every platform.</p> },
  { id: 'approve', label: 'Get it approved', content: <p>Reviewers sign off in place.</p> },
  { id: 'publish', label: 'Publish it', content: <p>Six accounts, one receipt each.</p> },
];

const CONTROLS = { pause: 'Pause the tour', play: 'Play the tour' };

describe('SceneSequencer with motion off', () => {
  it('renders every scene visibly, in order, with its step label', () => {
    mockMotionPreference('reduce');
    render(<SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />);

    for (const scene of SCENES) {
      expect(screen.getByText(scene.label as string)).toBeVisible();
    }
    expect(screen.getByText('One brief, every platform.')).toBeVisible();
    expect(screen.getByText('Reviewers sign off in place.')).toBeVisible();
    expect(screen.getByText('Six accounts, one receipt each.')).toBeVisible();
  });

  it('reads as a complete written walkthrough on its own', () => {
    mockMotionPreference('reduce');
    render(<SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />);

    // The fallback is the design: a no-JS visitor gets the whole tour as an
    // ordered list, not a teaser. Every step label and every body of content
    // is present, in DOM order.
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(SCENES.length);
    expect(items.map((item) => item.textContent)).toEqual([
      'Write it onceOne brief, every platform.',
      'Get it approvedReviewers sign off in place.',
      'Publish itSix accounts, one receipt each.',
    ]);
  });

  it('adds no inline transform and no stage collapse', () => {
    mockMotionPreference('reduce');
    const { container } = render(<SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />);

    expect(inlineTransformsIn(container)).toEqual([]);
    const list = container.querySelector('ol');
    expect(list?.style.position).toBe('');
    expect(list?.style.height).toBe('');
  });

  it('renders no pause control, because nothing is moving', () => {
    mockMotionPreference('reduce');
    render(<SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />);

    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('SceneSequencer server HTML', () => {
  it('contains every scene and no hidden-state class', () => {
    const markup = renderToStaticMarkup(
      <SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />,
    );

    expect(hiddenStateClassesIn(markup)).toEqual([]);
    for (const scene of SCENES) {
      expect(markup).toContain(scene.label as string);
    }
    expect(markup).toContain('One brief, every platform.');
    expect(markup).toContain('Six accounts, one receipt each.');
  });

  it('emits no absolute positioning, so the stack really is the server layout', () => {
    const markup = renderToStaticMarkup(
      <SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />,
    );

    // Collapsing the stack is a client-side effect. If it ever leaks into
    // server CSS, a no-JS visitor sees three scenes piled on top of each other.
    expect(markup).not.toContain('position:absolute');
    expect(markup).not.toMatch(/class="[^"]*\babsolute\b/);
  });
});

describe('SceneSequencer with motion on', () => {
  it('keeps every scene in the document', () => {
    mockMotionPreference('no-preference');
    render(<SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />);

    expect(screen.getByText('One brief, every platform.')).toBeInTheDocument();
    expect(screen.getByText('Six accounts, one receipt each.')).toBeInTheDocument();
  });

  it('offers a pause control with a caller-supplied, translated name', () => {
    mockMotionPreference('no-preference');
    render(<SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />);

    // WCAG 2.2.2: an auto-advancing sequence needs a pause mechanism, and the
    // control labels are a required prop precisely so it cannot be omitted.
    expect(screen.getByRole('button', { name: CONTROLS.pause })).toBeInTheDocument();
  });

  it('gives the control a 44px touch target', () => {
    mockMotionPreference('no-preference');
    render(<SceneSequencer scenes={SCENES} controlLabels={CONTROLS} />);

    const control = screen.getByRole('button', { name: CONTROLS.pause });
    expect(control.className).toContain('min-h-11');
    expect(control.className).toContain('min-w-11');
  });
});
