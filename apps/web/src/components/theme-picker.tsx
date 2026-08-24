'use client';

import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@relay/design-system/hooks';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

/**
 * The public light / dark control.
 *
 * It is the same mechanism as the signed-in account menu: one `useTheme` hook,
 * one storage key, one pre-paint bootstrap script in the root layout. Nothing
 * here writes storage directly, so there is no second source of truth and no
 * flash of the wrong theme, because the bootstrap has already stamped
 * `data-theme` on the document before this component exists.
 *
 * There are two themes, not three. A "match my system" option was removed
 * deliberately: both themes are designed rather than inverted, so the choice a
 * reader makes here is between two finished designs, and an option that
 * silently changes which one they are looking at is a worse answer than
 * either.
 *
 * With exactly two values, a menu made the reader take two clicks and a
 * pointer trip to express one bit, so this is a button that flips it. The
 * value that a menu used to name in words is carried instead by the accessible
 * name, which reads as the action ("Theme: Dark") and updates on every press,
 * so nothing is lost to a screen reader by the icon standing alone.
 */
export function ThemePicker(): ReactNode {
  const t = useTranslations();
  const { preference, setPreference } = useTheme();

  const isDark = preference === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      aria-label={`${t('nav.theme.label')}: ${t(isDark ? 'nav.theme.dark' : 'nav.theme.light')}`}
      aria-pressed={isDark}
      data-theme-preference={preference}
      onClick={() => {
        setPreference(next);
      }}
      className={cn(
        'text-text-secondary flex size-11 shrink-0 items-center justify-center rounded-md',
        'hover:text-text-primary hover:bg-surface-hover',
        'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
      )}
    >
      {isDark ? (
        <Moon aria-hidden="true" className="size-4 shrink-0" />
      ) : (
        <Sun aria-hidden="true" className="size-4 shrink-0" />
      )}
    </button>
  );
}
