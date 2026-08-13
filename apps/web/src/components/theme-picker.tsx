'use client';

import { useState, type ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

import { useTheme, type ThemePreference } from '@relay/design-system/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

const PREFERENCES = ['light', 'dark'] as const;

const LABEL_KEYS = {
  light: 'nav.theme.light',
  dark: 'nav.theme.dark',
} as const;

function PreferenceIcon({ preference }: { readonly preference: ThemePreference }): ReactNode {
  if (preference === 'dark') return <Moon aria-hidden="true" className="size-4 shrink-0" />;
  return <Sun aria-hidden="true" className="size-4 shrink-0" />;
}

/**
 * The public light / dark control.
 *
 * It is the same mechanism as the signed-in account menu: one `useTheme` hook,
 * one storage key, one pre-paint bootstrap script in the root layout. Nothing
 * here writes storage directly, so there is no second source of truth and no
 * flash of the wrong theme, because the bootstrap has already stamped
 * `data-theme` on the document before this component exists.
 *
 * There are two options, not three. A "match my system" option was removed
 * deliberately: both themes are designed rather than inverted, so the choice a
 * reader makes here is between two finished designs, and an option that
 * silently changes which one they are looking at is a worse answer than
 * either. This comment used to describe a three-way control, which the menu it
 * documents has not been for some time.
 *
 * It is still a menu rather than a toggle so the current value is named in
 * words for a screen reader rather than implied by an icon.
 */
export function ThemePicker(): ReactNode {
  const t = useTranslations();
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label={t('nav.theme.label')}
        aria-haspopup="menu"
        aria-expanded={open}
        data-theme-preference={preference}
        className={cn(
          'text-text-secondary flex size-11 shrink-0 items-center justify-center rounded-md',
          'hover:text-text-primary hover:bg-surface-hover',
          'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        )}
      >
        <PreferenceIcon preference={preference} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('nav.theme.label')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(next) => {
            setPreference(next as ThemePreference);
          }}
        >
          {PREFERENCES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option} className="min-h-11">
              <PreferenceIcon preference={option} />
              {t(LABEL_KEYS[option])}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
