/**
 * The empty scene's two obligations.
 *
 * It is often the largest thing on an otherwise blank screen, so the finished
 * drawing has to be in the server HTML: no dash attributes, no `opacity-0`,
 * nothing that depends on GSAP having run. And its sentence comes from the
 * catalog, never from the component.
 */

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

import { EmptyScene, type EmptySceneName } from './empty-scene';

afterEach(restoreMotionPreference);

const SCENES: readonly EmptySceneName[] = [
  'analytics',
  'library',
  'actionCenter',
  'calendar',
  'receipts',
  'digest',
];

function wrap(node: React.ReactNode) {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="UTC">
      {node}
    </I18nProvider>
  );
}

describe('EmptyScene server HTML', () => {
  it.each(SCENES)('renders %s fully drawn, with no hidden initial state', (scene) => {
    const markup = renderToStaticMarkup(wrap(<EmptyScene scene={scene} />));

    expect(hiddenStateClassesIn(markup)).toEqual([]);
    // The draw-in is set up from inside `useGSAP`, so the dash attributes
    // must not exist in markup: if they did, a no-JS client would get an
    // invisible drawing.
    expect(markup).not.toContain('stroke-dasharray');
    expect(markup).not.toContain('stroke-dashoffset');
    expect(markup).toContain('<path');
  });

  it('takes its sentence from the catalog, per scene', () => {
    const markup = renderToStaticMarkup(wrap(<EmptyScene scene="analytics" />));
    expect(markup).toContain('Nothing to measure yet');
  });

  it('is deterministic: the same scene renders identically twice', () => {
    const first = renderToStaticMarkup(wrap(<EmptyScene scene="library" />));
    const second = renderToStaticMarkup(wrap(<EmptyScene scene="library" />));
    expect(first).toBe(second);
  });
});

describe('EmptyScene with motion off', () => {
  it('still shows the whole drawing and the sentence', () => {
    mockMotionPreference('reduce');
    const { container } = render(wrap(<EmptyScene scene="calendar" />));

    expect(screen.getByText('A clear week. Write something and give it a time.')).toBeVisible();

    const paths = [...container.querySelectorAll('path')];
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path.style.strokeDashoffset).toBe('');
      expect(path.style.strokeDasharray).toBe('');
    }
  });
});
