'use client';

import { useRouter } from 'next/navigation';
import { CircleHelp, ExternalLink } from 'lucide-react';

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

const EXTERNAL_LINKS = [
  { id: 'docs', href: 'https://docs.relay.example', labelKey: 'shell.help.documentation' },
  { id: 'status', href: 'https://status.relay.example', labelKey: 'shell.help.platformStatus' },
  { id: 'changelog', href: 'https://relay.example/changelog', labelKey: 'shell.help.whatChanged' },
] as const;

/**
 * Help.
 *
 * WCAG 2.2 SC 3.2.6 requires the help entry point to sit in the same place on
 * every screen, which is why it lives in the shell and never inside a page.
 */
export function HelpMenu({ onOpenShortcuts }: { readonly onOpenShortcuts: () => void }) {
  const t = useTranslations();
  const router = useRouter();

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

        {EXTERNAL_LINKS.map((link) => (
          <DropdownMenuItem key={link.id} asChild>
            <a href={link.href} target="_blank" rel="noreferrer noopener">
              <span className="flex-1">{t(link.labelKey)}</span>
              <ExternalLink aria-hidden="true" className="text-text-tertiary size-3.5" />
              <span className="sr-only">{t('a11y.label.externalLink')}</span>
            </a>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            router.push('/support');
          }}
        >
          {t('shell.help.contactSupport')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
