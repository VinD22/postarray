'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { ErrorState } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import {
  CATALOGS,
  createTranslator,
  DEFAULT_LOCALE,
  en,
  PUBLIC_LOCALE_CODES,
  type Translator,
} from '@relay/i18n';

import { ApiError } from '@/lib/api';

// Next renders this boundary outside the route layout that mounts I18nProvider.
// It therefore resolves the locale from the URL and loads the matching static
// catalog itself. English is the first-paint fallback while that split chunk
// loads, never a reason to hide a localized error behind a provider failure.
export function localeFromPathname(pathname: string | null): string {
  const firstSegment = pathname?.split('/')[1] ?? '';
  return PUBLIC_LOCALE_CODES.some((locale) => locale === firstSegment)
    ? firstSegment
    : DEFAULT_LOCALE;
}

/**
 * The route error boundary.
 *
 * A typed `ApiError` renders its own sentence and its own remediation from the
 * catalog. Anything else renders the internal-error pair, which still says what
 * happened to the user's work. Nobody ever sees "Something went wrong".
 */
export default function RouteError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const [translator, setTranslator] = useState<Translator>(() =>
    createTranslator(locale, en),
  );

  useEffect(() => {
    let mounted = true;
    const loader = CATALOGS[locale] ?? CATALOGS[DEFAULT_LOCALE];
    if (loader === undefined) {
      return () => {
        mounted = false;
      };
    }
    void loader()
      .then((catalog) => {
        if (mounted) {
          setTranslator(createTranslator(locale, catalog));
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, [locale]);

  const t = useMemo(() => translator.format, [translator]);

  useEffect(() => {
    // The server already logged this with its correlation id. Re-logging the
    // stack in the browser would only leak internals into a user's console.
  }, [error]);

  const apiError = ApiError.is(error) ? error : null;
  const messageKey = apiError?.messageKey ?? 'error.internal.message';
  const actionKey = apiError?.actionKey ?? 'error.internal.action';
  const values = apiError?.messageValues ?? {};
  const reference = apiError?.correlationId ?? error.digest ?? null;

  return (
    <main id="main" className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 md:p-8">
      <ErrorState
        title={t(messageKey, values)}
        description={t(actionKey, values)}
        {...(reference === null
          ? {}
          : {
              reference: {
                label: t('shell.feedback.correlationId', { correlationId: reference }),
                value: reference,
              },
            })}
        // Retry is offered only when the failed call cannot have produced an
        // external side effect. A publish that may already have reached a
        // provider is never retried from here.
        {...(apiError === null || apiError.retryable ? { onRetry: reset } : {})}
        retryLabel={t('action.retry')}
        secondaryAction={
          <Button variant="ghost" asChild>
            <a href="/">{t('nav.home')}</a>
          </Button>
        }
      />
    </main>
  );
}
