'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Settings, UserRound } from 'lucide-react';

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
import { useTranslations } from '@/lib/i18n';
import { initialsOf } from '@/lib/utils/initials';

/**
 * The account menu.
 *
 * It carries the identity, the settings entry, the three-way theme choice and
 * sign out. The theme choice is explicit rather than a toggle, because
 * "match system" is a real answer and a two-state switch cannot express it.
 */
export function AccountMenu() {
  const t = useTranslations();
  const router = useRouter();
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
        className="flex size-11 items-center justify-center rounded-md hover:bg-surface-hover md:size-9"
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
            <span className="truncate text-text-primary">{session.user.name}</span>
            <span className="truncate text-label font-normal text-text-tertiary">
              {t('shell.signedInAs', { email: session.user.email })}
            </span>
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            router.push('/settings/profile');
          }}
        >
          <UserRound aria-hidden="true" className="size-4" />
          {t('shell.account.profile')}
        </DropdownMenuItem>
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
            setPreference(next as 'light' | 'dark' | 'system');
          }}
        >
          <DropdownMenuRadioItem value="light">{t('nav.theme.light')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">{t('nav.theme.dark')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">{t('nav.theme.system')}</DropdownMenuRadioItem>
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
