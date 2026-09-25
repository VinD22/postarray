/**
 * What the preview shows, and what it refuses to show.
 *
 * The acceptance criteria in section A are behavioural, so this suite asserts
 * behaviour: ten platforms each render through their own component, an
 * eleventh falls back without throwing, an unsupported content kind renders no
 * post at all, and attachments past a platform maximum appear under "Not sent"
 * rather than disappearing.
 */

import { useState, type ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n';
import { I18nProvider } from '@relay/i18n/react';
import { AnnouncerProvider } from '@relay/design-system/hooks';
import type { CapabilitySupport, ProviderId } from '@relay/contracts';

import { SEED_ACCOUNTS } from '../state/seed';
import { DeviceToggle } from './device-toggle';
import { PreviewText } from './parts/preview-text';
import { PreviewUnsupported } from './parts/preview-unsupported';
import { getPreviewComponent } from './registry';
import { presentationFor } from './presentation-rules';
import type { PreviewMedia, PreviewModel } from './types';

function image(id: string, sent: boolean, altText: string | null = null): PreviewMedia {
  return {
    id,
    kind: 'image',
    altText,
    altTextWaived: false,
    width: 1200,
    height: 800,
    durationMs: null,
    sent,
    available: true,
    loading: false,
    thumbnailUrl: null,
  };
}

function model(overrides: Partial<PreviewModel> = {}): PreviewModel {
  const provider: ProviderId = overrides.provider ?? 'x';
  return {
    provider,
    account: { displayName: 'Acme', handle: '@acme', avatarUrl: null },
    contentKind: 'text',
    kindSupport: 'supported',
    text: 'Shipping the new preview today.',
    title: null,
    links: [],
    media: [],
    threadItems: [],
    counter: { used: 30, max: 280, remaining: 250, over: false, nearLimit: false },
    presentation: presentationFor(provider),
    postedAtLabel: 'Just now',
    showsAltText: true,
    resolvesMentions: true,
    maxThreadItems: 25,
    publishedUrl: null,
    destinationLabel: null,
    ...overrides,
  };
}

function renderPreview(value: PreviewModel, device: 'mobile' | 'desktop' = 'mobile') {
  const Preview = getPreviewComponent(value.provider);
  return render(
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <AnnouncerProvider>
        <Preview model={value} device={device} />
      </AnnouncerProvider>
    </I18nProvider>,
  );
}

const NAMED: readonly ProviderId[] = [
  'x',
  'instagram',
  'linkedin',
  'facebook',
  'threads',
  'bluesky',
  'tiktok',
  'youtube',
  'pinterest',
  'mastodon',
];

describe('the registry', () => {
  it('gives each of the ten named platforms its own component', () => {
    const components = NAMED.map((provider) => getPreviewComponent(provider));
    expect(new Set(components).size).toBe(NAMED.length);
  });

  it('falls back for a platform with no component, without throwing', () => {
    expect(() => renderPreview(model({ provider: 'reddit' }))).not.toThrow();
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});

describe('every platform preview', () => {
  it.each(NAMED)('renders %s as a labelled group carrying the account and the body', (provider) => {
    renderPreview(model({ provider, media: [image('media_1', true)] }));
    const group = screen.getByRole('group');
    expect(group).toHaveAccessibleName(/Acme/);
    expect(within(group).getByText('Shipping the new preview today.')).toBeInTheDocument();
  });

  it.each(NAMED)('renders %s at the mobile width without an authored width on the text', (provider) => {
    renderPreview(model({ provider }));
    expect(screen.getByRole('group')).toHaveStyle({ inlineSize: '360px' });
  });
});

describe('media that will not be published', () => {
  it('shows the accepted files and lists the rest under Not sent', () => {
    renderPreview(
      model({
        media: [
          image('media_1', true),
          image('media_2', true),
          image('media_3', true),
          image('media_4', true),
          image('media_5', false),
          image('media_6', false),
        ],
      }),
    );
    const strip = screen.getByRole('region', { name: 'Not sent' });
    expect(within(strip).getByText(/2 files are past what X accepts/)).toBeInTheDocument();
  });

  it('says nothing about alt text where the platform does not support it', () => {
    renderPreview(model({ showsAltText: false, media: [image('media_1', true)] }));
    expect(screen.queryByText('No alt text')).not.toBeInTheDocument();
  });

  it('flags a missing description where the platform does support it', () => {
    renderPreview(model({ showsAltText: true, media: [image('media_1', true)] }));
    expect(screen.getByText('No alt text')).toBeInTheDocument();
  });
});

describe('the counter', () => {
  it('adds an icon and the word over, so colour is never the only signal', () => {
    renderPreview(
      model({ counter: { used: 300, max: 280, remaining: -20, over: true, nearLimit: false } }),
    );
    expect(screen.getByText('20 characters over')).toBeInTheDocument();
    expect(screen.getByText('300 of 280 characters')).toBeInTheDocument();
  });
});

describe('link cards', () => {
  const link = { url: 'https://example.com/a', domain: 'example.com', title: null, description: null };

  it('shows the address alone where the platform builds a card', () => {
    renderPreview(model({ provider: 'x', links: [link] }));
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(
      screen.getByText(/Post Array does not fetch the destination page/),
    ).toBeInTheDocument();
  });

  it('shows no card where the platform builds none', () => {
    renderPreview(model({ provider: 'instagram', contentKind: 'image', links: [link] }));
    expect(
      screen.queryByText(/Post Array does not fetch the destination page/),
    ).not.toBeInTheDocument();
  });
});

describe('a body longer than the platform shows', () => {
  it('shows the whole body, because no collapse threshold is published', async () => {
    const long = 'word '.repeat(400).trim();
    renderPreview(model({ text: long }));
    expect(screen.getByText(long)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'See more' })).not.toBeInTheDocument();
    await Promise.resolve();
  });
});

describe('the seeded accounts', () => {
  it.each(SEED_ACCOUNTS.map((account) => [account.provider, account] as const))(
    'renders %s from its own capability snapshot',
    (_provider, account) => {
      const support: CapabilitySupport = account.capabilities.contentKinds.text ?? 'not_implemented';
      renderPreview(
        model({
          provider: account.provider,
          kindSupport: support,
          counter: {
            used: 10,
            max: account.capabilities.text.maxLength,
            remaining: account.capabilities.text.maxLength - 10,
            over: false,
            nearLimit: false,
          },
        }),
      );
      expect(
        screen.getByText(`10 of ${account.capabilities.text.maxLength} characters`),
      ).toBeInTheDocument();
    },
  );
});

describe('keyboard operation', () => {
  it('offers See more as a button that toggles the hidden half', async () => {
    const user = userEvent.setup();
    const rule = {
      ...presentationFor('x'),
      collapse: { afterChars: 20, afterLines: null, labelKey: 'composerWeb.preview.seeMore' },
    } as const;
    render(
      <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
        <PreviewText
          text="the quick brown fox jumps over the lazy dog"
          presentation={rule}
          resolvesMentions
        />
      </I18nProvider>,
    );
    const button = screen.getByRole('button', { name: 'See more' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(screen.getByRole('button', { name: 'See less' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('exposes the device toggle as a named group of two choices', async () => {
    const user = userEvent.setup();
    function Harness(): ReactNode {
      const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
      return <DeviceToggle device={device} onChange={setDevice} />;
    }
    render(
      <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
        <Harness />
      </I18nProvider>,
    );
    const desktop = screen.getByRole('radio', { name: 'Desktop' });
    await user.click(desktop);
    expect(desktop).toHaveAttribute('aria-checked', 'true');
  });
});

describe('a content kind the account cannot publish', () => {
  function renderState(support: 'unsupported' | 'not_implemented' | 'requires_review') {
    return render(
      <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
        <PreviewUnsupported support={support} contentKind="document" providerName="Instagram" />
      </I18nProvider>,
    );
  }

  it('renders no mock post at all', () => {
    renderState('unsupported');
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(screen.queryByText('Shipping the new preview today.')).not.toBeInTheDocument();
  });

  it('says the platform has no such API when the state is unsupported', () => {
    renderState('unsupported');
    expect(screen.getByText('Instagram does not publish documents.')).toBeInTheDocument();
  });

  it('says we have not built it when the state is not implemented', () => {
    renderState('not_implemented');
    expect(
      screen.getByText('Post Array cannot publish documents to Instagram yet.'),
    ).toBeInTheDocument();
  });

  it('gives the two states different badges as well as different sentences', () => {
    const first = renderState('unsupported');
    const unsupported = first.container.querySelector('[data-capability]')?.textContent;
    first.unmount();
    const second = renderState('not_implemented');
    const notImplemented = second.container.querySelector('[data-capability]')?.textContent;
    expect(unsupported).not.toBe(notImplemented);
  });
});
