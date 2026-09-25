'use client';

import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { useRef, type ComponentProps, type MouseEvent, type ReactElement } from 'react';

import { useI18n } from '@/lib/i18n';
import { localizedHref } from '@/lib/i18n/routing';
import { confirmLeavingUnsaved, hasUnsavedChanges } from '@/lib/navigation/unsaved-changes';

export type LocalizedLinkProps = ComponentProps<typeof NextLink>;

/**
 * Link to an internal Post Array route in the current interface locale.
 *
 * External URLs, protocol-relative URLs, fragments and query-only references
 * are passed to Next unchanged. All app links should use this component rather
 * than importing `next/link` directly.
 *
 * It is also where the app asks before walking away from unsaved work. A screen
 * holding edits registers itself with `lib/navigation/unsaved-changes`; a click
 * here waits for that answer before navigating. Modified clicks (a new tab, a
 * download, the middle button) are left alone: they do not take the current
 * page anywhere, so there is nothing to lose.
 */
export function Link({ href, onClick, ...props }: LocalizedLinkProps): ReactElement {
  const { locale } = useI18n();
  /*
   * Set for exactly one click: the one this component replays after the person
   * has said they meant to leave. Replaying the click rather than pushing to
   * the router is what keeps every kind of href working, prefetch included,
   * and keeps this component free of a router dependency it would otherwise
   * need on every screen in the app.
   */
  const confirmed = useRef(false);

  return (
    <NextLink
      href={localizeInternalHref(href, locale)}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (confirmed.current) {
          confirmed.current = false;
          return;
        }
        if (event.defaultPrevented || isModifiedClick(event) || !hasUnsavedChanges()) {
          return;
        }
        const anchor = event.currentTarget;
        event.preventDefault();
        void confirmLeavingUnsaved().then((leave) => {
          if (!leave) {
            return;
          }
          confirmed.current = true;
          anchor.click();
        });
      }}
      {...props}
    />
  );
}

/** A click that opens somewhere else, or does not navigate at all. */
function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (event.currentTarget.target !== '' && event.currentTarget.target !== '_self')
  );
}

function localizeInternalHref(href: NextLinkProps['href'], locale: string): NextLinkProps['href'] {
  if (typeof href === 'string') {
    return isInternalPath(href) ? localizedHref(href, locale) : href;
  }

  if (
    typeof href.pathname === 'string' &&
    isInternalPath(href.pathname) &&
    href.protocol === undefined &&
    href.host === undefined
  ) {
    return { ...href, pathname: localizedHref(href.pathname, locale) };
  }

  return href;
}

function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}
