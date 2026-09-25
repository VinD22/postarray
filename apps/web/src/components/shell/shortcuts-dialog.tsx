'use client';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Kbd,
} from '@relay/design-system/primitives';

import { useTranslations } from '@/lib/i18n';

import { SHORTCUT_CATALOG } from './shortcut-catalog';

/**
 * Only shortcuts that actually exist. A cheat sheet that lies is worse than
 * none, which is why this list is no longer written here: it comes from
 * `shortcut-catalog.ts`, and a test reads the shell's source to prove every
 * entry in it is bound.
 */
const SHORTCUTS = SHORTCUT_CATALOG.filter((entry) => entry.scope === 'global');

export function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="sm">
        <DialogHeader>
          <DialogTitle>{t('a11y.keyboard.shortcutsTitle')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <dl className="flex flex-col">
            {SHORTCUTS.map((entry) => (
              <div
                key={entry.id}
                className="border-border-subtle flex items-center justify-between gap-4 border-b py-2 last:border-b-0"
              >
                <dt className="text-body-md text-text-primary">{t(entry.labelKey)}</dt>
                <dd>
                  <Kbd keys={entry.keys} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-body-sm text-text-tertiary pt-3">{t('a11y.keyboard.hint.dialog')}</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
