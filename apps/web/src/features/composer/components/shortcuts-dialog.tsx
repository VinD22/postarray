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
  const rows: readonly [string, readonly string[]][] = [
    [t.full('composerWeb.shortcuts.nextTarget'), ['Ctrl', ']']],
    [t.full('composerWeb.shortcuts.previousTarget'), ['Ctrl', '[']],
    [t.full('composerWeb.shortcuts.nextIssue'), ['Ctrl', 'I']],
    [t.full('composerWeb.shortcuts.previousIssue'), ['Ctrl', 'Shift', 'I']],
    [t.full('composerWeb.shortcuts.save'), ['Mod', 'S']],
    [t.full('composerWeb.shortcuts.openSchedule'), ['Mod', 'Enter']],
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
                className="flex items-center justify-between gap-4 border-b border-border-subtle py-2 last:border-b-0"
              >
                <dt className="text-body-sm text-text-secondary">{label}</dt>
                <dd className="flex shrink-0 items-center gap-1">
                  {keys.map((key) => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-body-sm text-text-tertiary">
            {t.full('a11y.keyboard.hint.composer')}
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
