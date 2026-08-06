'use client';

import { Link } from '@/components/link';
import { usePathname } from 'next/navigation';
import { useRef, type ReactNode } from 'react';

import { useMediaQuery } from '@relay/design-system/hooks';
import { Tooltip } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { useTranslations } from '@/lib/i18n';

import { isNavItemActive, NAV_ITEMS } from './nav-items';

/**
 * The navigation rail.
 *
 * At 768px it is icons only, so each item carries a tooltip and a visually
 * hidden name. At 1024px and above the labels are visible and the tooltip is
 * removed, because a tooltip repeating a visible label is noise.
 *
 * Selection is a tonal surface plus `aria-current` plus a brand-tinted icon,
 * never colour alone, and never a filled pill: this rail is read fifty times
 * a day. The 2px inline-start marker is one shared element that slides
 * between items with GSAP Flip when the route changes, instead of a static
 * bar redrawn per item — see `lib/motion/gsap.ts` for the two rules every
 * motion component here follows. The indicator never animates on first
 * mount (no flash of movement on load) and jumps straight to position with
 * no tween at all when `usePrefersReducedMotion()` is true.
 */
export function PrimaryNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const labelsVisible = useMediaQuery('(min-width: 64rem)');
  const motionOk = useMotionOk();

  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const hasPositioned = useRef(false);

  const activeItem = NAV_ITEMS.find((item) => isNavItemActive(item, pathname));

  useGSAP(
    () => {
      const nav = navRef.current;
      const indicator = indicatorRef.current;
      const activeEl = activeItem ? itemRefs.current.get(activeItem.id) : undefined;
      if (!nav || !indicator || !activeEl) {
        return;
      }

      const shouldAnimate = hasPositioned.current && motionOk;
      const state = shouldAnimate ? Flip.getState(indicator) : null;

      const navRect = nav.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      indicator.style.top = `${itemRect.top - navRect.top + itemRect.height * 0.2}px`;
      indicator.style.height = `${itemRect.height * 0.6}px`;

      if (state) {
        Flip.from(state, { duration: DURATION_FAST, ease: EASE_STANDARD });
      }
      hasPositioned.current = true;
    },
    { scope: navRef, dependencies: [pathname, motionOk, labelsVisible, activeItem?.id] },
  );

  return (
    <nav
      ref={navRef}
      aria-label={t('nav.primaryLandmark')}
      className={cn(
        'hidden md:relative md:flex md:flex-col md:gap-0.5',
        'border-border-subtle bg-surface-sunken border-e',
        'px-2 py-3 lg:px-3',
      )}
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className={cn(
          'bg-accent pointer-events-none absolute start-0 w-0.5 rounded-full',
          'transition-opacity duration-(--duration-fast)',
          activeItem ? 'opacity-100' : 'opacity-0',
        )}
      />

      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(item, pathname);
        const label = t(item.labelKey);
        const Icon = item.icon;

        const link: ReactNode = (
          <Link
            ref={(element: HTMLAnchorElement | null) => {
              if (element) {
                itemRefs.current.set(item.id, element);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex min-h-11 items-center gap-3 rounded-md px-2.5 py-2 lg:min-h-9',
              'text-body-md transition-[background-color,color,translate] duration-(--duration-fast)',
              'hover:-translate-x-0.5 rtl:hover:translate-x-0.5',
              active
                ? 'bg-surface-raised text-text-primary font-medium'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn('size-4 shrink-0', active ? 'text-accent' : undefined)}
            />
            {labelsVisible ? (
              <span className="truncate">{label}</span>
            ) : (
              <span className="sr-only">{label}</span>
            )}
          </Link>
        );

        return labelsVisible ? (
          <div key={item.id}>{link}</div>
        ) : (
          <Tooltip key={item.id} content={label} side="right">
            {link}
          </Tooltip>
        );
      })}
    </nav>
  );
}
