import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DigestPanel } from './digest';
import { LiveReceiptPanel } from './receipt';
import { ValidationPanel } from './validate';

/**
 * The three new panels, tested for the thing that makes them shippable rather
 * than for their markup: none of them may claim something the product cannot
 * do today, and the labels that say so may not depend on JavaScript.
 */

describe('DigestPanel', () => {
  const digest = (
    <DigestPanel
      label="Your week, in sentences"
      sampleChip="Sample"
      lines={['Three platform-native versions went out from one draft this week.']}
      footer="Live analytics appear here as your posts publish."
    />
  );

  it('puts the sample chip in the server HTML and never animates it in', () => {
    const markup = renderToStaticMarkup(digest);

    expect(markup).toContain('Sample');
    // An honesty label that fades into existence a second after the content is
    // a label somebody can miss. `data-demo-enter` is what the tour staggers,
    // so the chip must not carry it — the digest lines may.
    const chip = markup.slice(markup.indexOf('Sample') - 200, markup.indexOf('Sample'));
    expect(chip).not.toContain('data-demo-enter');
  });

  it('says where live analytics will come from instead of showing figures', () => {
    const markup = renderToStaticMarkup(digest);

    expect(markup).toContain('Live analytics appear here as your posts publish.');
  });
});

describe('ValidationPanel', () => {
  it('names every check in words beside its tick', () => {
    const markup = renderToStaticMarkup(
      <ValidationPanel
        label="Checks before scheduling"
        checks={[{ id: 'length', label: 'Character limit, per account', detail: 'Measured.' }]}
        note="These run in the composer."
      />,
    );

    // Never a green mark on its own: the name and the sentence carry it.
    expect(markup).toContain('Character limit, per account');
    expect(markup).toContain('Measured.');
  });
});

describe('LiveReceiptPanel', () => {
  const steps = [
    { id: 'queued', title: 'Queued for its slot', done: true },
    { id: 'sent', title: 'Sent to the platform', done: false },
  ];
  const fields = [{ id: 'externalId', term: 'External post ID', value: 'Unavailable' }];

  it('renders the publish half as pending, with unavailable fields, while nothing publishes', () => {
    const markup = renderToStaticMarkup(
      <LiveReceiptPanel
        label="Publishing and the record of it"
        published={false}
        liveLabel="Live"
        pendingLabel="Not published"
        steps={steps}
        fields={fields}
        pending="Written by the publish run."
      />,
    );

    expect(markup).toContain('Not published');
    expect(markup).toContain('Unavailable');
    expect(markup).not.toContain('>Live<');
  });

  it('flips to live the day a real publish run writes the other half', () => {
    const markup = renderToStaticMarkup(
      <LiveReceiptPanel
        label="Publishing and the record of it"
        published
        liveLabel="Live"
        pendingLabel="Not published"
        steps={steps.map((step) => ({ ...step, done: true }))}
        fields={fields}
        pending="Written by the publish run."
      />,
    );

    // The panel is built for the future state so that reaching it is a data
    // change rather than a redesign. Nothing renders it with `published` today.
    expect(markup).toContain('Live');
    expect(markup).not.toContain('Not published');
  });
});
