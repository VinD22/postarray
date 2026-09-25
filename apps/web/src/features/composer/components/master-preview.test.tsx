import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';
import { AnnouncerProvider } from '@relay/design-system/hooks';

import { ComposerProvider } from '../composer-context';
import { SEED_BOOTSTRAP } from '../state/seed';
import type { ComposerSaveOutcome } from '../types';
import { MasterPreview } from './master-preview';

// Signed URLs come from the API; the preview draws text without them.
vi.mock('../previews/use-preview-media', () => ({ usePreviewMedia: () => () => null }));

const OUTCOME: ComposerSaveOutcome = {
  contentItemId: 'content_seed_launch_thread',
  savedAt: '2026-09-02T10:00:00.000Z',
  savedConnectionIds: [],
  failedConnectionIds: [],
};

function mount(node: ReactNode, bootstrap = SEED_BOOTSTRAP): ReactElement {
  return (
    <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
      <AnnouncerProvider>
        <ComposerProvider
          bootstrap={bootstrap}
          media={{ get: () => null }}
          approvalRequired={false}
          onSave={() => Promise.resolve(OUTCOME)}
        >
          {node}
        </ComposerProvider>
      </AnnouncerProvider>
    </I18nProvider>
  );
}

describe('MasterPreview', () => {
  it('draws a platform preview while the master draft is open', () => {
    render(mount(<MasterPreview />));
    expect(screen.getByRole('heading', { name: 'Preview' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Preview for' })).toBeInTheDocument();
  });

  it('asks for an account instead of drawing an empty column', () => {
    render(
      mount(<MasterPreview />, {
        ...SEED_BOOTSTRAP,
        selectedConnectionIds: [],
      }),
    );
    expect(
      screen.getByText('Choose an account to see how this post will look there.'),
    ).toBeInTheDocument();
  });
});
