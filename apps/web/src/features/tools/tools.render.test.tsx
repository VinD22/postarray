import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { en } from '@relay/i18n/messages';
import type { PartialCatalog } from '@relay/i18n/messages';

import { EngagementRatePanel } from './engagement-rate-panel';
import { PreflightChecker } from './preflight-checker';
import { ToolsProvider } from './tools-provider';
import { UtmBuilder } from './utm-builder';
import { YouTubeTitleChecker } from './youtube-title-checker';
import { ZonePlannerPanel } from './zone-planner-panel';

/**
 * Markup contract for the interactive panels.
 *
 * The end to end suite runs axe over the finished pages. These tests hold the
 * parts axe cannot judge on its own: that every control has a programmatic
 * name, that a status is stated in words rather than in colour, and that the
 * result region announces politely rather than shouting on every keystroke.
 */

const CATALOG: PartialCatalog = en;

function mount(node: ReactNode): ReactElement {
  return (
    <ToolsProvider locale="en" catalog={CATALOG}>
      {node}
    </ToolsProvider>
  );
}

describe('preflight checker markup', () => {
  it('gives every control an accessible name', () => {
    render(mount(<PreflightChecker />));

    expect(screen.getByLabelText('Your draft')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Platforms to check' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Bluesky' })).toBeInTheDocument();
  });

  it('names the result region and announces it politely', () => {
    const { container } = render(mount(<PreflightChecker />));

    expect(screen.getByRole('region', { name: 'Result by platform' })).toBeInTheDocument();
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('states each platform result in words, never by colour alone', async () => {
    const user = userEvent.setup();
    render(mount(<PreflightChecker />));

    // The test needs the field to hold 320 characters, not 320 keystrokes:
    // paste the value in one gesture, then wait for the result region to
    // settle instead of asserting on the same tick.
    await user.click(screen.getByLabelText('Your draft'));
    await user.paste('a'.repeat(320));

    const region = screen.getByRole('region', { name: 'Result by platform' });
    expect((await within(region).findAllByText('Would fail')).length).toBeGreaterThan(0);
    expect(await within(region).findByText(/320 of 280/u)).toBeInTheDocument();
  });

  it('cites the source and the date beside every platform it has a limit for', () => {
    render(mount(<PreflightChecker />));

    const region = screen.getByRole('region', { name: 'Result by platform' });
    const links = within(region).getAllByRole('link', { name: 'Platform documentation' });
    expect(links.length).toBe(3);
    expect(within(region).getAllByText(/Read on 2026-08-04/u).length).toBe(3);
  });
});

describe('utm builder markup', () => {
  it('composes a URL and offers it as a labelled output', async () => {
    const user = userEvent.setup();
    render(mount(<UtmBuilder />));

    await user.type(screen.getByLabelText('Destination URL'), 'https://example.test/a');
    await user.type(screen.getByLabelText('Campaign source'), 'bluesky');

    expect(screen.getByLabelText('Composed URL')).toHaveTextContent(
      'https://example.test/a?utm_source=bluesky',
    );
  });

  it('reports an unparseable destination on the field rather than silently', async () => {
    const user = userEvent.setup();
    render(mount(<UtmBuilder />));

    await user.type(screen.getByLabelText('Destination URL'), 'not a url');

    expect(screen.getByLabelText('Destination URL')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('That does not parse as an http or https URL.')).toBeInTheDocument();
  });
});

describe('youtube title checker markup', () => {
  it('counts a title by grapheme and states the ceiling it came from', async () => {
    const user = userEvent.setup();
    render(mount(<YouTubeTitleChecker />));

    await user.type(screen.getByLabelText('Video title'), 'a\u{1F1EF}\u{1F1F5}');

    expect(screen.getByText('2 of 100 characters')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Platform documentation' })).toHaveAttribute(
      'href',
      'https://developers.google.com/youtube/v3/docs/videos/insert',
    );
  });
});

describe('time zone planner markup', () => {
  it('asks for a date before it shows a comparison', () => {
    render(mount(<ZonePlannerPanel sourceZone="UTC" />));

    expect(screen.getByText('Enter a date and a time to see the comparison.')).toBeInTheDocument();
  });

  it('names every zone control', () => {
    render(mount(<ZonePlannerPanel sourceZone="UTC" />));

    expect(screen.getByRole('group', { name: 'Audience zones' })).toBeInTheDocument();
    expect(screen.getByLabelText('Your zone')).toBeInTheDocument();
  });
});

describe('engagement rate calculator markup', () => {
  it('shows unavailable rather than a number or a zero before any input', () => {
    render(mount(<EngagementRatePanel />));

    expect(screen.getAllByText('unavailable').length).toBe(3);
  });

  it('divides interactions by each denominator independently', async () => {
    const user = userEvent.setup();
    render(mount(<EngagementRatePanel />));

    await user.type(screen.getByLabelText('Interactions'), '50');
    await user.type(screen.getByLabelText('Reach'), '1000');
    await user.type(screen.getByLabelText('Followers'), '2000');
    await user.type(screen.getByLabelText('Impressions'), '4000');

    expect(screen.getByText('5.00%')).toBeInTheDocument();
    expect(screen.getByText('2.50%')).toBeInTheDocument();
    expect(screen.getByText('1.25%')).toBeInTheDocument();
  });

  it('states plainly that there is no universal benchmark to compare against', () => {
    render(mount(<EngagementRatePanel />));

    expect(screen.getByText(/no universal good rate to compare against/iu)).toBeInTheDocument();
  });
});
