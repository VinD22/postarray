'use client';

import type { ReactElement } from 'react';
import { Download } from 'lucide-react';
import { useAnnouncer } from '@relay/design-system/hooks';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { downloadCsv } from '@/lib/export/csv';

/**
 * Download what is on the screen as a CSV.
 *
 * The rows are built by the caller, at the moment of the click, from the data
 * it is already rendering. There is no second request: a download that fetched
 * again could hand the reader a different set of numbers from the one they are
 * looking at, and a spreadsheet that disagrees with the screen is worse than
 * no spreadsheet.
 *
 * A browser download produces no visible change on the page, so the click is
 * announced. Without it a screen reader user presses the button and hears
 * nothing, which is indistinguishable from a button that does not work.
 *
 * Secondary, never primary. One vermilion button per screen, and an export is
 * not the thing a reader came here to do.
 */

export interface ExportButtonProps {
  /** Built on click. Returning null means there is nothing to export. */
  readonly build: () => { readonly filename: string; readonly content: string } | null;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function ExportButton({ build, disabled, className }: ExportButtonProps): ReactElement {
  const t = useTranslations();
  const { announce } = useAnnouncer();

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={disabled}
      className={className}
      iconStart={<Download aria-hidden="true" className="size-4" />}
      onClick={() => {
        const file = build();
        if (file === null) {
          announce(t('analytics.export.nothing'), 'polite');
          return;
        }
        downloadCsv(file.filename, file.content);
        announce(t('analytics.export.started', { filename: file.filename }), 'polite');
      }}
    >
      {t('analytics.export.csv')}
    </Button>
  );
}
