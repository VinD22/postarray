'use client';

import { useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusDot,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { api, type ProviderId } from '@/lib/api';
import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { providerLabelKey } from '@/features/analytics/labels';
import { useLocalizedRouter } from '@/lib/i18n';

import { FeedPreview } from './components/feed-preview';
import { RssStepReveal } from './components/rss-step-reveal';
import { useCreateFeed, useValidateFeed } from './rss-queries';
import type { FeedDraft, FeedPublishPolicy } from './rss-types';

/**
 * Adding an RSS or Atom feed.
 *
 * Four sections in the order the decision is actually made, and each one is
 * disabled until the one before it can answer its question. That is not
 * ceremony: the template cannot offer fields until the server has parsed the
 * feed, and the publishing policy cannot be evaluated until the targets are
 * known.
 *
 * Existing items are always treated as seen, which prevents a new feed from
 * flooding the calendar with its backlog. The only V1 outcomes create a draft
 * or create a draft and request approval.
 *
 * There is no image generation anywhere in this flow. An item without an image
 * publishes without one, and the copy says so.
 */

const POLICY_KEY: Readonly<Record<FeedPublishPolicy, string>> = {
  draft: 'automation.rss.policy.draft',
  approval: 'automation.rss.policy.approval',
};

interface ConnectionLike {
  readonly id: string;
  readonly provider: ProviderId;
  readonly displayName?: string;
  readonly accountName?: string;
}

const EMPTY_DRAFT: FeedDraft = {
  url: '',
  title: '',
  connectionIds: [],
  policy: 'approval',
};

export function FeedWizardScreen(): ReactElement {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const [draft, setDraft] = useState<FeedDraft>(EMPTY_DRAFT);
  const [url, setUrl] = useState('');

  const validate = useValidateFeed();
  const create = useCreateFeed();

  const connections = useQuery({
    queryKey: ['connections', 'list', 'rss'],
    queryFn: async () => api.connections.list({ limit: 100 }),
  });

  const accounts = useMemo(() => {
    const data = (connections.data?.data ?? []) as readonly ConnectionLike[];
    return data.map((connection) => ({
      connectionId: connection.id,
      provider: connection.provider,
      displayName: connection.displayName ?? connection.accountName ?? connection.id,
    }));
  }, [connections.data]);

  const validation = validate.data;
  const canChooseTargets = validation?.reachable === true && validation.items.length > 0;
  const canSave = canChooseTargets && draft.connectionIds.length > 0;

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 className="text-title-md text-text-primary">{t('automation.rss.add')}</h2>
        <p className="text-body-md text-text-secondary">{t('automation.rss.subtitle')}</p>
      </div>

      <Step index={1} total={4} title={t('automation.rss.step.url')}>
        <div className="flex flex-col gap-3">
          <Field
            label={t('automation.rss.urlLabel')}
            description={t('automation.rss.urlHelp')}
            required
          >
            {(control) => (
              <Input
                {...control}
                type="url"
                inputMode="url"
                autoComplete="off"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            )}
          </Field>

          <Button
            variant="secondary"
            className="self-start"
            loading={validate.isPending}
            loadingLabel={t('automation.rss.validating')}
            disabled={url.trim().length === 0}
            onClick={() =>
              validate.mutate(url.trim(), {
                onSuccess: (result) =>
                  setDraft((current) => ({
                    ...current,
                    url: result.resolvedUrl,
                    title: result.title,
                  })),
              })
            }
          >
            {t('automation.rss.validateAction')}
          </Button>

          {validate.isError ? (
            <QueryErrorState
              error={validate.error}
              title={t('automation.rss.validateFailed')}
              description={t('automation.rss.errorBody')}
              permission={{
                title: t('automation.state.permissionTitle'),
                description: t('automation.state.permissionBody'),
              }}
              rateLimit={{
                title: t('automation.state.rateLimitTitle'),
                cause: t('automation.state.rateLimitCause'),
                alternative: t('automation.state.rateLimitAlternative'),
              }}
            />
          ) : null}
        </div>
      </Step>

      <Step index={2} total={4} title={t('automation.rss.step.preview')}>
        {validation ? (
          <div className="flex flex-col gap-3">
            <FeedPreview validation={validation} />
            {!validation.reachable || validation.issueKeys.length > 0 ? (
              <Notice
                tone="warning"
                liveness="status"
                title={t('automation.rss.errorTitle')}
                description={t('automation.rss.errorBody')}
              />
            ) : (
              <Notice tone="neutral" title={t('automation.rss.seenLatest')} />
            )}
          </div>
        ) : (
          <p className="text-body-md text-text-secondary">{t('automation.rss.urlHelp')}</p>
        )}
      </Step>

      <Step
        index={3}
        total={4}
        title={t('automation.rss.step.targets')}
        disabled={!canChooseTargets}
      >
        <RssStepReveal active={canChooseTargets}>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-body-md text-text-secondary pb-1">
              {t('automation.rss.targetsHelp')}
            </legend>
            {accounts.map((account) => {
              const id = `feed-account-${account.connectionId}`;
              return (
                <span key={account.connectionId} className="flex min-h-11 items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={draft.connectionIds.includes(account.connectionId)}
                    onCheckedChange={() =>
                      setDraft((current) => ({
                        ...current,
                        connectionIds: current.connectionIds.includes(account.connectionId)
                          ? current.connectionIds.filter((value) => value !== account.connectionId)
                          : [...current.connectionIds, account.connectionId],
                      }))
                    }
                  />
                  <Label htmlFor={id} className="text-body-md flex items-center gap-2">
                    <StatusDot provider={account.provider} />
                    {account.displayName}
                    <span className="text-text-tertiary">
                      {t(providerLabelKey(account.provider))}
                    </span>
                  </Label>
                </span>
              );
            })}
          </fieldset>
        </RssStepReveal>
      </Step>

      <Step
        index={4}
        total={4}
        title={t('automation.rss.step.policy')}
        disabled={!canChooseTargets}
      >
        <RssStepReveal active={canChooseTargets}>
          <div className="flex flex-col gap-3">
            <Field
              label={t('automation.rss.step.policy')}
              description={t('automation.rss.policyHelp')}
            >
              {(control) => (
                <Select
                  value={draft.policy}
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      policy: value as FeedPublishPolicy,
                    }))
                  }
                >
                  <SelectTrigger id={control.id} className="min-w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(POLICY_KEY) as FeedPublishPolicy[]).map((policy) => (
                      <SelectItem key={policy} value={policy}>
                        {t(POLICY_KEY[policy])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>

            <Notice tone="neutral" title={t('automation.rss.dedupe')} />
          </div>
        </RssStepReveal>
      </Step>

      {create.isError ? (
        <QueryErrorState
          error={create.error}
          title={t('automation.rss.errorTitle')}
          description={t('automation.rss.errorBody')}
          permission={{
            title: t('automation.state.permissionTitle'),
            description: t('automation.state.permissionBody'),
          }}
          rateLimit={{
            title: t('automation.state.rateLimitTitle'),
            cause: t('automation.state.rateLimitCause'),
            alternative: t('automation.state.rateLimitAlternative'),
          }}
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => router.push('/automation/rss')}>
          {t('action.cancel')}
        </Button>
        <Button
          variant="primary"
          loading={create.isPending}
          disabled={!canSave}
          onClick={() =>
            create.mutate(draft, {
              onSuccess: (feed) => router.push(`/automation/rss/${feed.id}`),
            })
          }
        >
          {t('action.create')}
        </Button>
      </div>
    </div>
  );
}

function Step({
  index,
  total,
  title,
  disabled = false,
  children,
}: {
  readonly index: number;
  readonly total: number;
  readonly title: string;
  readonly disabled?: boolean;
  readonly children: ReactNode;
}): ReactElement {
  const t = useTranslations();
  return (
    <section
      aria-labelledby={`feed-step-${index}`}
      aria-disabled={disabled || undefined}
      className={disabled ? 'opacity-60' : undefined}
    >
      <div className="border-border-default flex flex-col gap-1 border-t pt-4">
        <p className="text-label text-text-tertiary">
          {t('automation.rss.stepOf', { current: index, total })}
        </p>
        <h3 id={`feed-step-${index}`} className="text-title-sm text-text-primary">
          {title}
        </h3>
      </div>
      <div className="pt-3">{children}</div>
    </section>
  );
}
