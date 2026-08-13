import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';

import {
  hiddenStateClassesIn,
  mockMotionPreference,
  restoreMotionPreference,
} from '@/components/motion/motion-test-media';
import { marketingTranslator } from '@/features/marketing/i18n';

import { demoContent } from './content';
import { HeroDemo, type HeroDemoScene } from './hero-demo';
import { DEMO_CHECKS, DEMO_DIGEST_LINE_KEYS } from './sample';

afterEach(restoreMotionPreference);

/**
 * Nine scenes, standing in for the nine the server builds. The panels
 * themselves are exercised through `demoContent` below; what this file is
 * about is the tour: is the whole of it in the server HTML, does a
 * reduced-motion reader get the walkthrough rather than a stub, and are the
 * controls real controls.
 */
const SCENES: readonly HeroDemoScene[] = [
  'project',
  'connect',
  'compose',
  'variants',
  'validate',
  'schedule',
  'week',
  'publish',
  'digest',
].map((id, index) => ({
  id,
  label: `Step name ${id}`,
  jumpLabel: `Show step ${index + 1}: ${id}`,
  hold: 3,
  content: <p>Panel body for {id}</p>,
}));

/**
 * The tour reads the catalog through the design system, so the provider is
 * part of rendering it rather than test scaffolding.
 */
function withI18n(node: ReactNode): ReactNode {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="UTC">
      {node}
    </I18nProvider>
  );
}

const LABELS = {
  badge: 'Demonstration',
  caption: 'Sample content, not a live account.',
  pauseLabel: 'Pause the demonstration',
  playLabel: 'Play the demonstration',
  replayLabel: 'Replay the demonstration',
  stepsLabel: 'Tour steps',
};

describe('the hero tour in server HTML', () => {
  it('contains all nine panels with no hidden-state class', () => {
    const markup = renderToStaticMarkup(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    // The server HTML is the finished page for a crawler, a no-JS client and
    // the LCP measurement. Nothing here may be waiting on JavaScript.
    expect(hiddenStateClassesIn(markup)).toEqual([]);
    for (const scene of SCENES) {
      expect(markup).toContain(scene.label);
      expect(markup).toContain(`Panel body for ${scene.id}`);
    }
  });

  it('emits no absolute positioning, so the stack really is the server layout', () => {
    const markup = renderToStaticMarkup(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    expect(markup).not.toContain('position:absolute');
    expect(markup).not.toMatch(/class="[^"]*\babsolute\b/);
  });

  it('renders no indicator buttons, because nothing can seek without JavaScript', () => {
    const markup = renderToStaticMarkup(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    // Without JS the nine steps are still there — as the list of labels above,
    // which is a plain ordered list rather than nine dead buttons.
    expect(markup).not.toContain('<button');
  });
});

describe('the hero tour with reduced motion', () => {
  it('renders the finished stack of all nine scenes', () => {
    mockMotionPreference('reduce');
    render(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    for (const scene of SCENES) {
      expect(screen.getByText(scene.label)).toBeVisible();
      expect(screen.getByText(`Panel body for ${scene.id}`)).toBeVisible();
    }
  });

  it('renders no pause control and no step buttons, because nothing is moving', () => {
    mockMotionPreference('reduce');
    render(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('the hero tour with motion on', () => {
  it('keeps every scene in the document', () => {
    mockMotionPreference('no-preference');
    render(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    for (const scene of SCENES) {
      expect(screen.getByText(`Panel body for ${scene.id}`)).toBeInTheDocument();
    }
  });

  it('offers pause and replay controls with translated accessible names', () => {
    mockMotionPreference('no-preference');
    render(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    // WCAG 2.2.2: an auto-advancing sequence needs a pause mechanism.
    expect(screen.getByRole('button', { name: LABELS.pauseLabel })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: LABELS.replayLabel })).toBeInTheDocument();
  });

  it('gives every indicator step a real button with a 44px target', () => {
    mockMotionPreference('no-preference');
    render(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    const steps = SCENES.map((scene) => screen.getByRole('button', { name: scene.jumpLabel }));
    expect(steps).toHaveLength(9);
    for (const step of steps) {
      expect(step.className).toContain('min-h-11');
      expect(step.className).toContain('min-w-11');
    }
  });

  it('marks exactly one step as current', () => {
    mockMotionPreference('no-preference');
    render(withI18n(<HeroDemo {...LABELS} scenes={SCENES} />));

    const current = SCENES.map((scene) =>
      screen.getByRole('button', { name: scene.jumpLabel }).getAttribute('aria-current'),
    ).filter((value) => value === 'step');
    expect(current).toHaveLength(1);
  });
});

describe('the sample content the tour is filled with', () => {
  it('has no digit anywhere in the digest or the checks', async () => {
    const t = await marketingTranslator('en');
    const demo = demoContent(t, 'en');

    // This is the rule at the top of `sample.ts` made into a test. A digit in
    // a digest line or a check would be a measurement, and the only
    // measurements this product could put there are ones it cannot read yet.
    for (const line of demo.digest) {
      expect(line, `digest line carries a digit: ${line}`).not.toMatch(/\d/);
    }
    for (const check of demo.checks) {
      expect(check.label).not.toMatch(/\d/);
      expect(check.detail).not.toMatch(/\d/);
    }
  });

  it('keeps the digest to sentences, and the checks to ones the composer runs', async () => {
    const t = await marketingTranslator('en');
    const demo = demoContent(t, 'en');

    expect(demo.digest).toHaveLength(DEMO_DIGEST_LINE_KEYS.length);
    // Character limit, alt text, first comment: `validation.text_too_long`,
    // `validation.alt_text_missing` and the `firstComment` capability. Adding
    // a fourth row means adding a check the composer genuinely performs.
    expect(demo.checks.map((check) => check.id)).toEqual(DEMO_CHECKS.map((check) => check.id));
  });
});
