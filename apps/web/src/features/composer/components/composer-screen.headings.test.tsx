import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';
import { AnnouncerProvider } from '@relay/design-system/hooks';

import { demoSession } from '@/lib/api/fixtures';
import { SessionProvider } from '@/lib/auth/session-context';

import { ComposerProvider } from '../composer-context';
import { SEED_BOOTSTRAP } from '../state/seed';
import type { ComposerSaveOutcome } from '../types';
import { ComposerScreen } from './composer-screen';

vi.mock('../previews/use-preview-media', () => ({ usePreviewMedia: () => () => null }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn() }),
  usePathname: () => '/en/compose',
  useSearchParams: () => new URLSearchParams(),
}));

const OUTCOME: ComposerSaveOutcome = {
  contentItemId: 'content_seed_launch_thread',
  savedAt: '2026-09-02T10:00:00.000Z',
  savedConnectionIds: [],
  failedConnectionIds: [],
};

function mount(): ReactElement {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <SessionProvider session={demoSession}>
        <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
          <AnnouncerProvider>
            <ComposerProvider
              bootstrap={SEED_BOOTSTRAP}
              media={{ get: () => null }}
              approvalRequired={false}
              onSave={() => Promise.resolve(OUTCOME)}
            >
              <ComposerScreen
                assets={[]}
                contentLocales={['en']}
                onClose={() => undefined}
                onPickMedia={() => undefined}
                onEditMedia={() => undefined}
                onCommit={() => Promise.resolve()}
                searchDestinations={() => Promise.resolve([])}
                searchMentions={() => Promise.resolve([])}
              />
            </ComposerProvider>
          </AnnouncerProvider>
        </I18nProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

describe('ComposerScreen heading order', () => {
  it('never skips a level between the page title and a panel heading', () => {
    const { container } = render(mount());
    const levels = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((node) =>
      Number(node.tagName.slice(1)),
    );
    expect(levels[0]).toBe(1);
    levels.reduce((previous, level) => {
      expect(level - previous).toBeLessThanOrEqual(1);
      return level;
    });
  });
});
