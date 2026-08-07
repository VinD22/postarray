'use client';

import { Link } from '@/components/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useAnnouncer } from '@relay/design-system/hooks';
import { EmptyState, LoadingState, Notice, SkeletonList } from '@relay/design-system/patterns';
import { Button, Field, Input, StatusDot, Textarea } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, api, newIdempotencyKey, type ValidationResult } from '@/lib/api';
import { useConnections } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';
import { useFormatters, useTranslations } from '@/lib/i18n';
import { providerDotKey } from '@/components/shell/action-center-catalog';

const VALIDATION_DEBOUNCE_MS = 300;

/**
 * Step 6: the first post.
 *
 * A deliberately small composer: one account, one body, a true preview and the
 * real validation. Everything else in the composer, per target overrides,
 * threads, links, media, is one click away and out of the way of the ten minute
 * goal.
 *
 * The character limit is read from the connection's capability snapshot. If the
 * snapshot has not loaded, no number is shown at all, because a hard coded
 * limit is how a post gets truncated by a provider the user trusted us about.
 */
export function ComposeStep() {
  const t = useTranslations();
  const format = useFormatters();
  const router = useRouter();
  const { workspace, brands } = useSession();
  const { announce } = useAnnouncer();

  const connectionsQuery = useConnections();
  const connections = connectionsQuery.data?.data ?? [];
  const connection = connections[0];

  const [body, setBody] = useState('');
  const [scheduledLocal, setScheduledLocal] = useState('');
  const [contentItemId, setContentItemId] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Read the real limit for this exact connection and account type.
  useEffect(() => {
    if (!connection) {
      return;
    }
    let canceled = false;
    void api.connections
      .getCapabilities(connection.id)
      .then((snapshot) => {
        if (!canceled && snapshot) {
          setLimit(snapshot.text.maxLength);
        }
      })
      .catch(() => {
        // A missing snapshot means no counter, never an invented one.
      });
    return () => {
      canceled = true;
    };
  }, [connection]);

  // Deterministic validation runs while typing, debounced, exactly as it does
  // in the full composer.
  useEffect(() => {
    if (contentItemId === null || body.trim().length === 0) {
      return;
    }
    const timer = setTimeout(() => {
      void api.validation
        .validate({ contentItemId })
        .then((result) => {
          setValidation(result);
          if (result) {
            announce(t('a11y.announce.validationCount', { count: result.issues.length }), 'polite');
          }
        })
        .catch(() => {
          setValidation(null);
        });
    }, VALIDATION_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [announce, body, contentItemId, t]);

  const overLimit = limit !== null && body.length > limit;
  const blockingIssues = useMemo(
    () => validation?.issues.filter((issue) => issue.severity === 'error') ?? [],
    [validation],
  );

  const schedule = async () => {
    const brand = brands[0];
    if (!connection || brand === undefined || scheduledLocal === '') {
      return;
    }
    setPending(true);
    setError(null);
    try {
      const draft =
        contentItemId === null
          ? await api.content.createDraft({ brandId: brand.id, body }, newIdempotencyKey('draft'))
          : { id: contentItemId };
      setContentItemId(draft.id);

      await api.content.setTargets(draft.id, { targets: [{ connectionId: connection.id }] });

      const scheduledAt = new Date(scheduledLocal).toISOString();
      await api.scheduling.schedule(
        { contentItemId: draft.id, scheduledAt, timeZone: workspace.timeZone },
        newIdempotencyKey('schedule'),
      );

      announce(
        t('a11y.announce.scheduled', {
          time: format.dateTime(scheduledAt),
          timeZone: workspace.timeZone,
        }),
        'polite',
      );
      router.push(`/onboarding/done?post=${draft.id}`);
    } catch (caught) {
      setPending(false);
      const message = ApiError.is(caught)
        ? t(caught.messageKey, caught.messageValues)
        : t('error.internal.message');
      setError(message);
      announce(message, 'assertive');
    }
  };

  if (connectionsQuery.isPending) {
    return (
      <LoadingState label={t('loading.default')}>
        <SkeletonList rows={3} />
      </LoadingState>
    );
  }

  if (!connection) {
    return (
      <EmptyState
        title={t('empty.connections.title')}
        description={t('empty.connections.body')}
        action={
          <Button variant="primary" asChild>
            <Link href="/onboarding/connect">{t('empty.connections.action')}</Link>
          </Button>
        }
      />
    );
  }

  const dot = providerDotKey(connection.provider);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('onboarding.content.title')}</h1>
        <p className="prose-measure text-body-md text-text-secondary">
          {t('onboarding.compose.help')}
        </p>
      </div>

      {error === null ? null : <Notice tone="destructive" liveness="alert" title={error} />}

      <p className="border-border-subtle text-body-md text-text-primary flex items-center gap-2 border-y py-2">
        {dot === undefined ? null : <StatusDot provider={dot} aria-hidden="true" />}
        {connection.displayName}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label={t('onboarding.content.useText')}
          description={
            limit === null
              ? undefined
              : t('a11y.label.characterCount', { used: body.length, limit })
          }
          error={
            overLimit && limit !== null
              ? t('validation.text_too_long.hint', {
                  provider: connection.provider,
                  limit,
                })
              : undefined
          }
          required
        >
          {(control) => (
            <Textarea
              {...control}
              rows={8}
              value={body}
              onChange={(event) => {
                setBody(event.target.value);
              }}
            />
          )}
        </Field>

        <section aria-label={t('a11y.region.preview')} className="flex flex-col gap-2">
          <h2 className="text-title-sm text-text-primary">{t('onboarding.preview.title')}</h2>
          <p className="text-body-sm text-text-tertiary">{t('onboarding.preview.help')}</p>
          <div className="border-border-default bg-surface-raised rounded-lg border p-3">
            <p className="text-body-sm text-text-tertiary">{connection.displayName}</p>
            <p className="text-body-md text-text-primary pt-1 whitespace-pre-wrap">
              {body.length === 0 ? ' ' : body}
            </p>
          </div>

          <div aria-label={t('a11y.region.validation')} className="flex flex-col gap-1 pt-2">
            {validation === null ? null : validation.issues.length === 0 ? (
              <p className="text-body-sm text-success-fg">{t('a11y.announce.validationCleared')}</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {validation.issues.map((issue) => (
                  <li
                    key={`${issue.code}-${issue.field ?? ''}-${issue.targetId ?? ''}`}
                    className={cn(
                      'text-body-sm',
                      issue.severity === 'error' ? 'text-destructive-fg' : 'text-warning-fg',
                    )}
                  >
                    {t(issue.messageKey, issue.params)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <Field
        label={t('onboarding.schedule.title')}
        description={t('onboarding.schedule.help')}
        required
      >
        {(control) => (
          <Input
            {...control}
            type="datetime-local"
            value={scheduledLocal}
            onChange={(event) => {
              setScheduledLocal(event.target.value);
            }}
          />
        )}
      </Field>

      <p className="text-body-sm text-text-tertiary">
        {t('shell.timeZone.label', { timeZone: workspace.timeZone })}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="lg"
          loading={pending}
          loadingLabel={t('loading.savingDraft')}
          disabled={
            body.trim().length === 0 ||
            scheduledLocal === '' ||
            overLimit ||
            blockingIssues.length > 0
          }
          onClick={() => {
            void schedule();
          }}
        >
          {t('action.schedule')}
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link href="/compose">{t('onboarding.compose.openComposer')}</Link>
        </Button>
      </div>
    </div>
  );
}
