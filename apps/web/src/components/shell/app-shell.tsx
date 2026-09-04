'use client';

import { Link } from '@/components/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

import { useHotkeys } from '@relay/design-system/hooks';
import { Kbd } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { PageTransitionProvider } from '@/components/motion';
import { ProductMark } from '@/components/brand/product-mark';
import { useLocalizedRouter, useTranslations } from '@/lib/i18n';
import { RealtimeStatusProvider } from '@/lib/realtime';

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
  const router = useLocalizedRouter();

  // The locale prefix is part of the path for every locale but the default,
  // so the suffix is what identifies the screen rather than an equality check.
  const onCompose = pathname === '/compose' || pathname.endsWith('/compose');

  // Every binding below is advertised in `shortcut-catalog.ts`, and
  // `shortcut-catalog.test.ts` reads this file to prove the two agree. Add a
  // binding here and the catalog, or the cheat sheet starts lying again.
  //
  // Both of these stay live inside a field: the palette and Compose are how
  // you leave whatever you are typing, and a chord with a modifier cannot eat
  // a character out of a draft the way a bare letter would.
  useHotkeys(
    {
      'mod+k': () => {
        setPaletteOpen(true);
      },
      'mod+shift+c': () => {
        // Already composing. Navigating to the screen you are on would throw
        // away the draft on it, which is the opposite of what the key means.
        if (onCompose) return;
        router.push('/compose');
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
    // Mounted once, here, so the whole application shares one stream. A hook
    // per screen would open a connection per screen, which is exactly what the
    // per-person cap on the endpoint exists to prevent.
    <RealtimeStatusProvider>
      <div className="bg-surface-sunken flex min-h-dvh flex-col">
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

        <header className="bg-surface-sunken sticky top-0 z-(--z-index-sticky) px-2 pt-2 md:px-3 md:pt-3">
          <div
            className={cn(
              'border-border-default bg-surface-raised shadow-raised flex items-center gap-2 border',
              'rounded-lg px-2 py-2 md:px-3',
            )}
          >
            <Link
              href="/home"
              className={cn(
                'text-title-sm text-text-primary hidden shrink-0 items-center gap-2.5 pe-1 font-semibold md:flex',
                'focus-visible:outline-border-focus rounded-md focus-visible:outline-2 focus-visible:outline-offset-2',
              )}
            >
              <ProductMark className="size-7 p-[6px]" />
              <span>{t('shell.appName')}</span>
            </Link>

            <span aria-hidden="true" className="bg-border-default hidden h-7 w-px md:block" />

            <WorkspaceSwitcher className="min-w-0 flex-1 border-transparent md:flex-none" />

            <button
              type="button"
              onClick={() => {
                setPaletteOpen(true);
              }}
              className={cn(
                'border-border-subtle ms-auto hidden min-h-9 items-center gap-2 rounded-md border',
                'bg-surface-sunken text-body-sm text-text-tertiary px-3 lg:flex lg:w-72',
                'hover:bg-surface-hover hover:text-text-secondary',
                'focus-visible:border-border-bold lg:focus-visible:w-80',
                'transition-[background-color,color,border-color,width] duration-(--duration-fast)',
              )}
            >
              <Search aria-hidden="true" className="size-4" />
              <span className="flex-1 text-start">{t('nav.search')}</span>
              <Kbd keys="mod+k" />
            </button>

            <div className="ms-auto flex items-center gap-0.5 lg:ms-0">
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

          <div className="overflow-hidden rounded-b-lg">
            <DemoNotice />
            <ConnectivityBanner />
          </div>
        </header>

        <div
          className={cn(
            'grid flex-1 grid-cols-1 gap-2 px-2 pt-2 pb-2 md:px-3 md:pb-3',
            'md:grid-cols-[3.75rem_minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1fr)]',
          )}
        >
          <PrimaryNav />

          <main
            id="main"
            aria-label={t('a11y.region.main')}
            data-relay-hydrated={hydrated ? 'true' : 'false'}
            tabIndex={-1}
            className={cn(
              'border-border-default bg-surface-canvas min-w-0 overflow-clip border pb-20 md:pb-0',
              'shadow-raised rounded-lg',
            )}
          >
            <PageTransitionProvider tier="app">{children}</PageTransitionProvider>
          </main>
        </div>

        <MobileNav />

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
        <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      </div>
    </RealtimeStatusProvider>
  );
}
