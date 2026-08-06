'use client';

import { Wrench } from 'lucide-react';

import { Button, Code } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { Link } from '@/components/link';
import { ApiError } from '@/lib/api';

/**
 * The `(app)` group's fallback error boundary (WP-11 — global boundaries).
 *
 * `AppShell` — including `IntlProvider` — is mounted by the layout above this
 * boundary and never unmounts for it, so `useTranslations()` here reads the
 * same catalog the rest of the signed-in product does; only `<main>`'s
 * content is replaced. A route with its own `error.tsx` (calendar, compose,
 * connections, library, receipts) keeps that instead — this is the fallback
 * for everything else under the shell.
 *
 * Same honesty rule as the root boundary (`apps/web/src/app/error.tsx`): a
 * typed `ApiError` renders its own sentence and its own remediation; nobody
 * sees "Something went wrong". Retry is offered only when the failed call
 * cannot have produced an external side effect. The one WP-11-specific
 * choice is presentation: a lucide `Wrench` mark instead of the shared
 * `ErrorState` pattern's tone, and the retry action as the loud system's
 * `cta` (yellow) slab — the shell's one moment of "we know, we're on it"
 * rather than a quiet secondary button.
 */
export default function AppRouteError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  const t = useTranslations();

  const apiError = ApiError.is(error) ? error : null;
  const messageKey = apiError?.messageKey ?? 'error.internal.message';
  const actionKey = apiError?.actionKey ?? 'error.internal.action';
  const values = apiError?.messageValues ?? {};
  const reference = apiError?.correlationId ?? error.digest ?? null;
  const canRetry = apiError === null || apiError.retryable;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-4 px-4 py-10 md:px-6">
      <span
        aria-hidden="true"
        className="border-border-bold bg-surface-sunken flex size-11 items-center justify-center rounded-full border-2"
      >
        <Wrench aria-hidden="true" className="text-text-secondary size-5" />
      </span>

      <div className="flex flex-col gap-1">
        <h1 className="text-title-md font-display text-text-primary font-bold">
          {t(messageKey, values)}
        </h1>
        <p className="text-body-md text-text-secondary max-w-[60ch]">{t(actionKey, values)}</p>
      </div>

      {reference === null ? null : (
        <p className="text-body-sm text-text-tertiary flex flex-wrap items-center gap-1.5">
          {t('shell.feedback.correlationId', { correlationId: reference })}
          <Code>{reference}</Code>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-2">
        {canRetry ? (
          <Button variant="cta" onClick={reset}>
            {t('action.retry')}
          </Button>
        ) : null}
        <Button variant="ghost" asChild>
          <Link href="/">{t('nav.home')}</Link>
        </Button>
      </div>
    </div>
  );
}
