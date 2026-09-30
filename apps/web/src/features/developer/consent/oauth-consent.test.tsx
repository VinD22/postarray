import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@relay/i18n/react';
import { en } from '@relay/i18n/messages';

import type { OAuthConsentView } from '@/lib/api/resources/oauth';

/**
 * The real consent screen, as a person sees it after adding Post Array to
 * Claude. What matters: it never calls itself a preview, a self-registered
 * app is named as such, and no unreviewed link is offered for it.
 */

let consent: OAuthConsentView;

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('request_id=req_0123456789abcdef'),
}));

vi.mock('@/lib/api', () => ({
  api: {
    oauth: {
      getConsent: () => Promise.resolve(consent),
      submitConsent: () => Promise.reject(new Error('not called')),
    },
  },
  newIdempotencyKey: () => 'key',
}));

const { OAuthConsentScreen } = await import('./oauth-consent');

function view(client: Partial<OAuthConsentView['client']>): OAuthConsentView {
  return {
    client: {
      name: 'Claude',
      clientId: 'rly_dc_claude',
      homepageUrl: '',
      privacyPolicyUrl: '',
      termsUrl: '',
      logoUrl: null,
      firstParty: false,
      ...client,
    },
    consentNonce: 'nonce-0123456789abcdef',
    workspaces: [
      {
        id: 'ws_1',
        name: 'Acme',
      } as OAuthConsentView['workspaces'][number],
    ],
    scopes: [{ scope: 'drafts:read', risk: 'read', descriptionKey: 'scopes.drafts_read' }],
    approvalLevelKey: 'developer.consent.approval_level.level_2_scheduled',
  };
}

function mount(node: ReactNode): ReactElement {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={client}>
      <I18nProvider locale="en" catalog={en} timeZone="UTC">
        {node}
      </I18nProvider>
    </QueryClientProvider>
  );
}

describe('oauth consent screen', () => {
  it('names a self-registered app as such and offers no link for it', async () => {
    consent = view({ selfAsserted: true });
    render(mount(<OAuthConsentScreen />));

    expect(await screen.findByText('This app named itself')).toBeInTheDocument();
    expect(screen.getByText(/Claude registered itself automatically/)).toBeInTheDocument();
    expect(screen.queryByText(/Published by/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    // The real screen grants access; it must never call itself a preview.
    expect(screen.queryByText(/Preview only/)).not.toBeInTheDocument();
  });

  it('shows the published identity and https links for a reviewed app', async () => {
    consent = view({
      name: 'Partner App',
      homepageUrl: 'https://partner.example',
      privacyPolicyUrl: 'https://partner.example/privacy',
      termsUrl: 'javascript:alert(1)',
    });
    render(mount(<OAuthConsentScreen />));

    expect(await screen.findByText('Published by Partner App')).toBeInTheDocument();
    expect(screen.queryByText('This app named itself')).not.toBeInTheDocument();
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['https://partner.example', 'https://partner.example/privacy']);
  });
});
