'use client';

import { Link } from '@/components/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

import { useHotkeys } from '@relay/design-system/hooks';
import { Kbd } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { PageTransitionProvider } from '@/components/motion';
import { useTranslations } from '@/lib/i18n';

import { AccountMenu } from './account-menu';
import { ActionCenterPanel } from './action-center-panel';
import { CommandPalette } from './command-palette';
import { ComposeButton } from './compose-button';
import { ConnectivityBanner } from './connectivity-banner';
import { DemoNotice } from './demo-notice';
import { HelpMenu } from './help-menu';
import { MobileNav } from './mobile-nav';
import { PrimaryNav } from './primary-nav';
import { ShortcutsDialog } from './shortcuts-dialog';
import { WorkspaceSwitcher } from './workspace-switcher';

/**
 * The application frame.
 *
 * A stable top bar, a stable rail, and a main region that is the only thing
 * that changes between screens. The shell is deliberately quiet: it is
 * furniture, and the queue, the calendar and the composer are the product.
 *
 * Landmarks: one banner, one navigation, one main. The skip link is the first
 * thing in the tab order on every screen.
 */
export function AppShell({ children }: { readonly children: ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useHotkeys(
    {
      'mod+k': () => {
        setPaletteOpen(true);
      },
    },
    { enableInFormFields: true },
  );

  useHotkeys({
    'shift+?': () => {
      setShortcutsOpen(true);
    },
  });

  // Closing on navigation keeps the palette from surviving a route change and
  // covering the page the user just asked for.
  useEffect(() => {
    setPaletteOpen(false);
  }, [pathname]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="bg-surface-canvas flex min-h-dvh flex-col">
      <a
        className="relay-skip-link"
        href="#main"
        onClick={(event) => {
          const main = document.getElementById('main');
          if (!main) return;

          event.preventDefault();
          main.focus({ preventScroll: true });
          main.scrollIntoView({ block: 'start' });
          window.history.replaceState(null, '', '#main');
        }}
      >
        {t('nav.skipToContent')}
      </a>

      <header className="border-border-default bg-surface-canvas sticky top-0 z-(--z-index-sticky) border-b">
        <div className="flex items-center gap-2 px-(--layout-gutter) py-2">
          <Link
            href="/home"
            className="text-title-sm text-text-primary font-display hidden shrink-0 items-center px-1 font-bold md:flex"
          >
            {t('shell.appName')}
          </Link>

          <WorkspaceSwitcher className="min-w-0 flex-1 md:flex-none" />

          <button
            type="button"
            onClick={() => {
              setPaletteOpen(true);
            }}
            className={cn(
              'border-border-default ms-auto hidden min-h-9 items-center gap-2 rounded-md border',
              'bg-surface-sunken text-body-sm text-text-tertiary px-2.5 lg:flex lg:w-72',
              'hover:bg-surface-hover hover:text-text-secondary',
              'focus-visible:border-border-bold lg:focus-visible:w-80',
              'transition-[background-color,color,border-color,width] duration-(--duration-fast)',
            )}
          >
            <Search aria-hidden="true" className="size-4" />
            <span className="flex-1 text-start">{t('nav.search')}</span>
            <Kbd keys="mod+k" />
          </button>

          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            <button
              type="button"
              aria-label={t('palette.open')}
              onClick={() => {
                setPaletteOpen(true);
              }}
              className="text-text-secondary hover:bg-surface-hover hover:text-text-primary flex size-11 items-center justify-center rounded-md md:size-9 lg:hidden"
            >
              <Search aria-hidden="true" className="size-4" />
            </button>

            <ComposeButton className="hidden md:inline-flex" />
            <ActionCenterPanel />
            <HelpMenu
              onOpenShortcuts={() => {
                setShortcutsOpen(true);
              }}
            />
            <AccountMenu />
          </div>
        </div>

        <DemoNotice />
        <ConnectivityBanner />
      </header>

      <div className="grid flex-1 grid-cols-1 md:grid-cols-[3.5rem_1fr] lg:grid-cols-[13.5rem_1fr]">
        <PrimaryNav />

        <main
          id="main"
          aria-label={t('a11y.region.main')}
          data-relay-hydrated={hydrated ? 'true' : 'false'}
          tabIndex={-1}
          className="min-w-0 pb-20 md:pb-0"
        >
          <PageTransitionProvider tier="app">{children}</PageTransitionProvider>
        </main>
      </div>

      <MobileNav />

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
