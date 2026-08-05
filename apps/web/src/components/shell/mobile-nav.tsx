'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PenLine } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';

import { isNavItemActive, NAV_ITEMS } from './nav-items';

const SETTINGS_LINKS = [
  { href: '/settings/members', labelKey: 'settings.nav.members' },
  { href: '/settings/brands', labelKey: 'settings.nav.brands' },
  { href: '/settings/billing', labelKey: 'settings.nav.billing' },
  { href: '/settings/webhooks', labelKey: 'settings.nav.webhooks' },
  { href: '/settings/security', labelKey: 'settings.nav.security' },
] as const;

/**
 * The compact bottom bar, below 768px.
 *
 * Four destinations plus a menu, with Compose raised in the middle as the
 * primary action. This is not a squeezed desktop rail: the items are the ones
 * a person uses on a phone, and everything else lives behind the menu.
 *
 * Every target is at least 44px. The bar sits above the safe area inset so it
 * is not covered by a home indicator.
 */
export function MobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const { canPublish } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const barItems = NAV_ITEMS.filter((item) => item.inBottomBar);
  const menuItems = NAV_ITEMS.filter((item) => !item.inBottomBar);

  return (
    <>
      <nav
        aria-label={t('nav.primaryLandmark')}
        className={cn(
          'fixed inset-x-0 bottom-0 z-(--z-index-sticky) md:hidden',
          'border-border-default grid grid-cols-5 items-end gap-1 border-t',
          'bg-surface-raised px-2 pt-1',
          'pb-[max(0.25rem,env(safe-area-inset-bottom))]',
        )}
      >
        {barItems.slice(0, 2).map((item) => (
          <BottomLink key={item.id} href={item.href} active={isNavItemActive(item, pathname)}>
            <item.icon aria-hidden="true" className="size-5" />
            {t(item.labelKey)}
          </BottomLink>
        ))}

        <div className="flex justify-center">
          <Link
            href={canPublish ? '/compose' : '/settings/members'}
            aria-disabled={canPublish ? undefined : true}
            className={cn(
              'flex size-12 flex-col items-center justify-center rounded-xl',
              'bg-accent text-accent-on shadow-raised',
              'transition-colors duration-(--duration-fast)',
              canPublish ? 'hover:bg-accent-hover' : 'pointer-events-none opacity-60',
            )}
          >
            <PenLine aria-hidden="true" className="size-5" />
            <span className="sr-only">{t('nav.compose')}</span>
          </Link>
        </div>

        {barItems.slice(2).map((item) => (
          <BottomLink key={item.id} href={item.href} active={isNavItemActive(item, pathname)}>
            <item.icon aria-hidden="true" className="size-5" />
            {t(item.labelKey)}
          </BottomLink>
        ))}

        <button
          type="button"
          onClick={() => {
            setMenuOpen(true);
          }}
          className={cn(
            'flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md',
            'text-label text-text-secondary hover:text-text-primary',
          )}
        >
          <Menu aria-hidden="true" className="size-5" />
          {t('shell.nav.more')}
        </button>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="block-end" closeLabel={t('a11y.label.closeDialog')}>
          <SheetHeader>
            <SheetTitle>{t('shell.menu.title')}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <ul className="flex flex-col">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    aria-current={isNavItemActive(item, pathname) ? 'page' : undefined}
                    className="border-border-subtle text-body-md text-text-primary flex min-h-11 items-center gap-3 border-b px-1"
                  >
                    <item.icon aria-hidden="true" className="text-text-tertiary size-4" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
              {SETTINGS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="text-body-md text-text-secondary flex min-h-11 items-center px-1"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  );
}

function BottomLink({
  href,
  active,
  children,
}: {
  readonly href: string;
  readonly active: boolean;
  readonly children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'text-label flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md',
        active ? 'text-text-primary font-medium' : 'text-text-secondary',
      )}
    >
      {children}
    </Link>
  );
}
