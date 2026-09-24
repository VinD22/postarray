import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { en } from '@relay/i18n/messages';
import { I18nProvider } from '@relay/i18n/react';

import { LibraryScreen } from './library-screen';

/**
 * The page header carries its own inline gutter. The body under it must carry
 * the same one, or the upload panel and the grid sit flush against the frame
 * on a phone while the title above them is indented.
 */
describe('LibraryScreen layout', () => {
  it('gives the body the same inline gutter as the header', () => {
    render(
      <I18nProvider locale="en" catalog={en} timeZone="Europe/Berlin">
        <LibraryScreen
          status="ready"
          assets={[]}
          rules={[]}
          uploads={[]}
          online
          importEnabled={false}
          timeZone="Europe/Berlin"
          onFiles={vi.fn()}
          onImportUrl={vi.fn(async () => {})}
          onPauseUpload={vi.fn()}
          onResumeUpload={vi.fn()}
          onCancelUpload={vi.fn()}
          onRetryUpload={vi.fn()}
          onSaveAltText={vi.fn(async () => {})}
          onSaveRights={vi.fn(async () => {})}
        />
      </I18nProvider>,
    );
    const heading = screen.getByRole('heading', { level: 2, name: en['mediaLib.upload.heading'] });
    const gutter = heading.closest('.px-4');
    expect(gutter).not.toBeNull();
    expect(gutter?.className).toMatch(/\bmd:px-6\b/);
  });
});
