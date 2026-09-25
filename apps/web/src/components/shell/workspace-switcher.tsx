'use client';

import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Dialog, DialogTrigger } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';
import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';
import { ContextPicker } from './context-picker';

/** Search stays one interaction away, whether the agency has three clients or hundreds. */
export function WorkspaceSwitcher({ className }: { readonly className?: string }) {
  const t = useTranslations();
  const { workspace, project } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          'border-border-default flex min-h-11 max-w-56 items-center gap-3 rounded-md border',
          'bg-surface-raised text-body-md text-text-primary px-3 py-1.5 md:min-h-9',
          'hover:bg-surface-hover transition-colors duration-(--duration-fast)',
          className,
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col items-start">
          <span className="w-full truncate text-start font-medium">
            {project?.name ?? t('shell.project.none')}
          </span>
          <span className="text-label text-text-tertiary w-full truncate text-start">
            {workspace.name}
          </span>
        </span>
        {/* After the visible names, so the accessible name starts with what is shown (WCAG 2.5.3). */}
        <span className="sr-only">{t('nav.projectSwitcher')}</span>
        <ChevronsUpDown aria-hidden="true" className="text-text-tertiary size-4 shrink-0" />
      </DialogTrigger>
      {open ? <ContextPicker onClose={() => setOpen(false)} /> : null}
    </Dialog>
  );
}
