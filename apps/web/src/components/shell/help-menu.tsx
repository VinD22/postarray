'use client';

import { CircleHelp } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Kbd,
} from '@relay/design-system/primitives';

import { useTranslations } from '@/lib/i18n';
import { Link } from '@/components/link';

const HELP_LINKS = [
  { id: 'docs', href: '/docs', labelKey: 'shell.help.documentation' },
  { id: 'status', href: '/status', labelKey: 'shell.help.platformStatus' },
  { id: 'changelog', href: '/changelog', labelKey: 'shell.help.whatChanged' },
] as const;

/**
 * Help.
 *
 * WCAG 2.2 SC 3.2.6 requires the help entry point to sit in the same place on
 * every screen, which is why it lives in the shell and never inside a page.
 */
export function HelpMenu({ onOpenShortcuts }: { readonly onOpenShortcuts: () => void }) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('nav.help')}
        className="text-text-secondary hover:bg-surface-hover hover:text-text-primary flex size-11 items-center justify-center rounded-md md:size-9"
      >
        <CircleHelp aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{t('shell.help.title')}</DropdownMenuLabel>

        <DropdownMenuItem onSelect={onOpenShortcuts} shortcut={<Kbd keys="shift+?" />}>
          {t('shell.help.keyboardShortcuts')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {HELP_LINKS.map((link) => (
          <DropdownMenuItem key={link.id} asChild>
            <Link href={link.href}>{t(link.labelKey)}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
