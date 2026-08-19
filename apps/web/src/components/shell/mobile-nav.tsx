'use client';

import { Link } from '@/components/link';
import { usePathname } from 'next/navigation';
import { Menu, PenSquare } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';

import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { useSession } from '@/lib/auth/session-context';
import { useTranslations } from '@/lib/i18n';

import { isNavItemActive, NAV_ITEMS } from './nav-items';

const SETTINGS_LINKS = [
  { href: '/settings/members', labelKey: 'settings.nav.members' },
  { href: '/settings/projects', labelKey: 'settings.nav.projects' },
  { href: '/settings/billing', labelKey: 'settings.nav.billing' },
  { href: '/settings/webhooks', labelKey: 'settings.nav.webhooks' },
  { href: '/settings/security', labelKey: 'settings.nav.security' },
] as const;

/**
 * The compact bottom bar, below 768px.
 *
 * Four destinations plus a menu, with Compose raised in the middle as the
 * primary action — a 56px circular yellow slab, physically above the rest of
 * the bar, so it reads as the one thing this bar most wants a thumb to find.
 *
 * The active tab carries a small dot that slides between destinations with
 * GSAP Flip (same technique as `primary-nav.tsx`'s indicator): no animation
 * on first mount, and an instant jump with no tween under reduced motion.
 *
 * Every target is at least 44px. The bar sits above the safe area inset so it
 * is not covered by a home indicator.
 */
export function MobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const { canPublish } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const motionOk = useMotionOk();

  const navRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const hasPositioned = useRef(false);

  const barItems = NAV_ITEMS.filter((item) => item.inBottomBar);
  const menuItems = NAV_ITEMS.filter((item) => !item.inBottomBar);
  const activeItem = barItems.find((item) => isNavItemActive(item, pathname));

  useGSAP(
    () => {
      const nav = navRef.current;
      const dot = dotRef.current;
      const activeEl = activeItem ? itemRefs.current.get(activeItem.id) : undefined;
      if (!nav || !dot || !activeEl) {
        return;
      }

      const shouldAnimate = hasPositioned.current && motionOk;
      const state = shouldAnimate ? Flip.getState(dot) : null;

      const isRtl = nav.ownerDocument.documentElement.getAttribute('dir') === 'rtl';
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      const inlineStart = isRtl ? navRect.right - itemRect.right : itemRect.left - navRect.left;
      dot.style.insetInlineStart = `${inlineStart + itemRect.width / 2 - 2}px`;

      if (state) {
        Flip.from(state, { duration: DURATION_FAST, ease: EASE_STANDARD });
      }
      hasPositioned.current = true;
    },
    { scope: navRef, dependencies: [pathname, motionOk, activeItem?.id] },
  );

  return (
    <>
      <nav
        ref={navRef}
        aria-label={t('nav.primaryLandmark')}
        className={cn(
          'fixed inset-x-0 bottom-0 z-(--z-index-sticky) md:hidden',
          'border-border-default relative grid grid-cols-5 items-end gap-1 border-t',
          'bg-surface-raised px-2 pt-1',
          'pb-[max(0.25rem,env(safe-area-inset-bottom))]',
        )}
      >
        <span
          ref={dotRef}
          aria-hidden="true"
          className={cn(
            'bg-accent pointer-events-none absolute top-0.5 size-1 rounded-full',
            'transition-opacity duration-(--duration-fast)',
            activeItem ? 'opacity-100' : 'opacity-0',
          )}
        />

        {barItems.slice(0, 2).map((item) => (
          <BottomLink
            key={item.id}
            href={item.href}
            active={isNavItemActive(item, pathname)}
            registerRef={(element) => {
              if (element) {
                itemRefs.current.set(item.id, element);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
          >
            <item.icon aria-hidden="true" className="size-5" />
            {t(item.labelKey)}
          </BottomLink>
        ))}

        <div className="flex justify-center">
          <Link
            href={canPublish ? '/compose' : '/settings/members'}
            aria-disabled={canPublish ? undefined : true}
            className={cn(
              'relay-pressable flex size-14 -translate-y-3 flex-col items-center justify-center rounded-full',
              // The commit fill, same recipe as `Button variant="primary"`:
              // ink in light, paper in dark, with a hairline border and a soft
              // lift rather than the poster palette's yellow slab behind a 2px
              // outline and an offset block.
              'bg-surface-inverted text-text-inverted border-border-strong border shadow-raised',
              canPublish ? 'hover:bg-text-secondary' : 'pointer-events-none opacity-60',
            )}
          >
            <PenSquare aria-hidden="true" className="size-5" />
            <span className="sr-only">{t('nav.compose')}</span>
          </Link>
        </div>

        {barItems.slice(2).map((item) => (
          <BottomLink
            key={item.id}
            href={item.href}
            active={isNavItemActive(item, pathname)}
            registerRef={(element) => {
              if (element) {
                itemRefs.current.set(item.id, element);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
          >
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
  registerRef,
  children,
}: {
  readonly href: string;
  readonly active: boolean;
  readonly registerRef: (element: HTMLAnchorElement | null) => void;
  readonly children: ReactNode;
}) {
  return (
    <Link
      ref={registerRef}
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
