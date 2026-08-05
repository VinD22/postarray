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

/** Only shortcuts that actually exist. A cheat sheet that lies is worse than none. */
const SHORTCUTS: readonly { keys: string; labelKey: string }[] = [
  { keys: 'mod+k', labelKey: 'nav.commandPalette' },
  { keys: 'mod+shift+c', labelKey: 'nav.compose' },
  { keys: 'shift+?', labelKey: 'a11y.keyboard.shortcutsTitle' },
];

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
                key={entry.keys}
                className="flex items-center justify-between gap-4 border-b border-border-subtle py-2 last:border-b-0"
              >
                <dt className="text-body-md text-text-primary">{t(entry.labelKey)}</dt>
                <dd>
                  <Kbd keys={entry.keys} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="pt-3 text-body-sm text-text-tertiary">{t('a11y.keyboard.hint.dialog')}</p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
