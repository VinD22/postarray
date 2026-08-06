'use client';

import { useEffect } from 'react';

import { ErrorState } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import { createTranslator, en } from '@relay/i18n';

import { ApiError } from '@/lib/api';

// Next renders this boundary outside the route layout that mounts I18nProvider.
// It must therefore use the controlling catalog directly, otherwise a real
// route failure is hidden by a second “provider missing” failure.
const fallbackTranslator = createTranslator('en', en);

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
  const t = fallbackTranslator.format;

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
