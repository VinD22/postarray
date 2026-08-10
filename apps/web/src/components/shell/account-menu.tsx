'use client';

import { LogOut, Settings } from 'lucide-react';

import { useTheme } from '@relay/design-system/hooks';
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@relay/design-system/primitives';

import { api, newIdempotencyKey } from '@/lib/api';
import { useSession } from '@/lib/auth/session-context';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';
import { initialsOf } from '@/lib/utils/initials';

/**
 * The account menu.
 *
 * It carries the identity, the settings entry, the three-way theme choice and
 * sign out. The theme choice is explicit rather than a toggle, because
 * The choice is explicit light or dark. A first visit seeds from the operating
 * system once, and after that the stored choice is what wins.
 */
export function AccountMenu() {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const { session } = useSession();
  const { preference, setPreference } = useTheme();

  const signOut = async () => {
    await api.session.signOut(newIdempotencyKey('signout'));
    router.push('/sign-in');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('nav.account')}
        className="hover:bg-surface-hover flex size-11 items-center justify-center rounded-md md:size-9"
      >
        <Avatar
          alt={session.user.name}
          src={session.user.avatarUrl ?? undefined}
          fallback={initialsOf(session.user.name)}
          size="sm"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <span className="flex flex-col">
            <span className="text-text-primary truncate">{session.user.name}</span>
            <span className="text-label text-text-tertiary truncate font-normal">
              {t('shell.signedInAs', { email: session.user.email })}
            </span>
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            router.push('/settings');
          }}
        >
          <Settings aria-hidden="true" className="size-4" />
          {t('shell.account.settings')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>{t('nav.theme.label')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(next) => {
            setPreference(next as 'light' | 'dark');
          }}
        >
          <DropdownMenuRadioItem value="light">{t('nav.theme.light')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">{t('nav.theme.dark')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            void signOut();
          }}
        >
          <LogOut aria-hidden="true" className="size-4" />
          {t('action.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
