'use client';

/**
 * The shortcut list. Every shortcut here has a visible control elsewhere on the
 * screen, so nothing in the composer is keyboard only or pointer only.
 */

import { type ReactNode } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Kbd,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

export interface ShortcutsDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps): ReactNode {
  const t = useTranslations();
  // Bindings in hotkey syntax. `Kbd` renders each part with the symbols of the
  // platform the reader is on, so one row covers macOS and Windows.
  const rows: readonly [string, string][] = [
    [t.full('composerWeb.shortcuts.nextTarget'), 'ctrl+]'],
    [t.full('composerWeb.shortcuts.previousTarget'), 'ctrl+['],
    [t.full('composerWeb.shortcuts.nextIssue'), 'ctrl+i'],
    [t.full('composerWeb.shortcuts.previousIssue'), 'ctrl+shift+i'],
    [t.full('composerWeb.shortcuts.save'), 'mod+s'],
    [t.full('composerWeb.shortcuts.openSchedule'), 'mod+enter'],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" closeLabel={t.full('action.close')}>
        <DialogHeader>
          <DialogTitle>{t.full('composerWeb.shortcuts.title')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <dl className="flex flex-col">
            {rows.map(([label, keys]) => (
              <div
                key={label}
                className="border-border-subtle flex items-center justify-between gap-4 border-b py-2 last:border-b-0"
              >
                <dt className="text-body-sm text-text-secondary">{label}</dt>
                <dd className="flex shrink-0 items-center gap-1">
                  <Kbd keys={keys} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-body-sm text-text-tertiary mt-3">
            {t.full('a11y.keyboard.hint.composer')}
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
