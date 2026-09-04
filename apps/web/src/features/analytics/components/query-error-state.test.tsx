import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import { QueryErrorState } from './query-error-state';

function renderUnknownError(): void {
  render(
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <QueryErrorState
        error={new Error('Network response was malformed')}
        title="Analytics could not load"
        description="Your published posts and receipts are unaffected."
        permission={{ title: 'Permission needed', description: 'Ask an owner for access.' }}
        rateLimit={{
          title: 'Analytics is taking a break',
          cause: 'The provider limited this read.',
          alternative: 'Review your receipts while it resets.',
        }}
      />
    </I18nProvider>,
  );
}

describe('QueryErrorState', () => {
  it('does not repeat a generic error description as labelled details', () => {
    renderUnknownError();

    expect(screen.getAllByText('Your published posts and receipts are unaffected.')).toHaveLength(
      1,
    );
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
  });
});
