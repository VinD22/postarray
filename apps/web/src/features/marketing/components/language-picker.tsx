'use client';

import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Globe2 } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  ACTIVE_LOCALE_CODES,
  ACTIVE_LOCALES,
  DEFAULT_LOCALE,
  type LocaleDescriptor,
} from '@relay/i18n';
import { useAnnouncer } from '@relay/design-system/hooks';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
} from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';
import { useI18n, useTranslations } from '@relay/i18n/react';

import { LOCALE_COOKIE, localizedHref } from '@/lib/i18n/routing';

const LOCALE_COOKIE_MAX_AGE = 31_536_000;

/** Make labels searchable regardless of diacritics or display locale. */
export function normalizeLanguagePickerSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('en');
}

/** Remove an active locale prefix before building a link for another locale. */
export function unprefixedLocalePath(pathname: string): string {
  const firstSegment = pathname.split('/')[1] ?? '';
  if (!ACTIVE_LOCALE_CODES.includes(firstSegment)) {
    return pathname || '/';
  }

  const remainder = pathname.split('/').slice(2).join('/');
  return remainder.length === 0 ? '/' : `/${remainder}`;
}

/** Preserve the current query string when switching the interface locale. */
export function appendSearchParams(path: string, search: string): string {
  const params = new URLSearchParams(search);
  const serialized = params.toString();
  return serialized.length === 0 ? path : `${path}?${serialized}`;
}

interface LanguagePickerViewProps {
  readonly search: string;
}

function localeMatchesQuery(locale: LocaleDescriptor, query: string): boolean {
  const needle = normalizeLanguagePickerSearch(query.trim());
  if (needle.length === 0) {
    return true;
  }

  return [locale.endonym, locale.name].some((name) =>
    normalizeLanguagePickerSearch(name).includes(needle),
  );
}

function persistLocale(locale: string): void {
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; SameSite=Lax; max-age=${LOCALE_COOKIE_MAX_AGE}`;
}

/**
 * A crawlable interface-language navigation menu.
 *
 * Locale metadata is a build-time registry import. The current route comes
 * only from usePathname, so this client enhancement does not make marketing
 * pages depend on cookies, headers or request data.
 */
function LanguagePickerView({ search }: LanguagePickerViewProps): ReactNode {
  const pathname = usePathname();
  const t = useTranslations();
  const { locale: currentLocale } = useI18n();
  const { announce } = useAnnouncer();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const optionRefs = useRef(new Map<string, HTMLAnchorElement>());
  const triggerDescriptionId = useId();
  const triggerCurrentId = useId();

  const currentPath = unprefixedLocalePath(pathname);
  const current =
    ACTIVE_LOCALES.find((locale) => locale.bcp47 === currentLocale) ??
    ACTIVE_LOCALES.find((locale) => locale.bcp47 === DEFAULT_LOCALE) ??
    ACTIVE_LOCALES[0];
  const filteredLocales = useMemo(
    () => ACTIVE_LOCALES.filter((locale) => localeMatchesQuery(locale, query)),
    [query],
  );
  const showFilter = ACTIVE_LOCALES.length > 12;

  function setMenuOpen(next: boolean): void {
    setOpen(next);
    if (!next) {
      setQuery('');
    }
  }

  function focusOption(position: 'first' | 'last'): void {
    const candidate =
      position === 'first' ? filteredLocales[0] : filteredLocales[filteredLocales.length - 1];
    if (candidate !== undefined) {
      optionRefs.current.get(candidate.bcp47)?.focus();
    }
  }

  function onFilterKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption('first');
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption('last');
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger
        aria-labelledby={`${triggerDescriptionId} ${triggerCurrentId}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'text-body-md text-text-secondary flex min-h-11 items-center gap-2 rounded-md px-3',
          'hover:text-text-primary transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        )}
      >
        <Globe2 aria-hidden="true" className="size-4 shrink-0" />
        {/*
          The accessible name is built from this hidden description plus the
          visible endonym below (`aria-labelledby`, not `aria-label`) so the
          visible text is always a substring of the accessible name — WCAG
          2.5.3 Label in Name. An `aria-label` here previously replaced the
          name outright, so "English" on screen announced only as "Choose
          interface language" (WP-12 axe finding).
        */}
        <span id={triggerDescriptionId} className="sr-only">
          {t('a11y.languagePicker.label')}
        </span>
        <span id={triggerCurrentId} className="max-w-32 truncate">
          {current?.endonym ?? currentLocale}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[min(24rem,calc(100vw-2rem))]">
        {showFilter ? (
          <div className="p-1 pb-2">
            <Input
              type="search"
              value={query}
              aria-label={t('a11y.languagePicker.filterLabel')}
              placeholder={t('a11y.languagePicker.filterLabel')}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onFilterKeyDown}
            />
          </div>
        ) : null}

        {filteredLocales.length === 0 ? (
          <p className="text-body-md text-text-secondary px-2 py-3">
            {t('common.results', { count: 0 })}
          </p>
        ) : (
          filteredLocales.map((locale) => {
            const isCurrent = locale.bcp47 === currentLocale;
            return (
              <DropdownMenuItem key={locale.bcp47} asChild>
                <a
                  ref={(node) => {
                    if (node === null) {
                      optionRefs.current.delete(locale.bcp47);
                    } else {
                      optionRefs.current.set(locale.bcp47, node);
                    }
                  }}
                  href={appendSearchParams(localizedHref(currentPath, locale.bcp47), search)}
                  lang={locale.bcp47}
                  dir={locale.direction}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => {
                    persistLocale(locale.bcp47);
                    announce(
                      t('a11y.languagePicker.announceChanged', { language: locale.endonym }),
                    );
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <span className="flex min-w-0 flex-1 flex-col text-start">
                    <span className="truncate">{locale.endonym}</span>
                    <span className="text-body-sm text-text-tertiary truncate">{locale.name}</span>
                  </span>
                  {locale.reviewStatus === 'beta' ? (
                    <Badge className="shrink-0" tone="neutral">
                      {t('common.beta')}
                    </Badge>
                  ) : null}
                </a>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The hydrated picker includes the current query string in locale links. */
export function LanguagePicker(): ReactNode {
  const searchParams = useSearchParams();
  return <LanguagePickerView search={searchParams?.toString() ?? ''} />;
}

/** Static fallback used while the query-aware picker hydrates. */
export function LanguagePickerFallback(): ReactNode {
  return <LanguagePickerView search="" />;
}
