'use client';

import { useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusDot,
  Switch,
  Textarea,
} from '@relay/design-system/primitives';
import { formatDuration } from '@relay/i18n';
import { useI18n, useTranslations } from '@relay/i18n/react';

import { api } from '@/lib/api';
import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { providerLabelKey } from '@/features/analytics/labels';

import { FeedPreview } from './components/feed-preview';
import { useCreateFeed, useValidateFeed } from './rss-queries';
import type { FeedDraft, FeedPublishPolicy } from './rss-types';

/**
 * Adding an RSS or Atom feed.
 *
 * Six sections in the order the decision is actually made, and each one is
 * disabled until the one before it can answer its question. That is not
 * ceremony: the template cannot offer fields until the server has parsed the
 * feed, and the publishing policy cannot be evaluated until the targets are
 * known.
 *
 * The two decisions people get wrong are given the most room. "Treat everything
 * currently in the feed as seen" is the default, because the alternative
 * publishes a backlog. And immediate publishing is described as what it is: a
 * post reaching a platform without a person reading it first.
 *
 * There is no image generation anywhere in this flow. An item without an image
 * publishes without one, and the copy says so.
 */

const POLICY_KEY: Readonly<Record<FeedPublishPolicy, string>> = {
  draft: 'automation.rss.policy.draft',
  approval: 'automation.rss.policy.approval',
  next_slot: 'automation.rss.policy.nextSlot',
  fixed_cadence: 'automation.rss.policy.cadence',
  immediate: 'automation.rss.policy.immediate',
};

const CADENCE_OPTIONS: readonly number[] = [3_600, 10_800, 21_600, 43_200, 86_400];

interface ConnectionLike {
  readonly id: string;
  readonly provider: 'x' | 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'threads' | 'bluesky' | 'fake';
  readonly displayName?: string;
  readonly accountName?: string;
}

const EMPTY_DRAFT: FeedDraft = {
  url: '',
  title: '',
  markExistingAsSeen: true,
  connectionIds: [],
  targetGroupId: null,
  template: '',
  adaptText: false,
  useFeedImage: true,
  policy: 'approval',
  cadenceSeconds: null,
};

export function FeedWizardScreen(): ReactElement {
  const t = useTranslations();
  const { locale } = useI18n();
  const router = useRouter();
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
  const canChooseTargets = validation !== undefined;
  const canSave =
    validation !== undefined &&
    draft.connectionIds.length > 0 &&
    draft.template.trim().length > 0;

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 className="text-title-md text-text-primary">{t('automation.rss.add')}</h2>
        <p className="text-body-md text-text-secondary">{t('automation.rss.subtitle')}</p>
      </div>

      <Step index={1} total={6} title={t('automation.rss.step.url')}>
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
                    template:
                      current.template.trim().length > 0
                        ? current.template
                        : '{title}\n\n{link}',
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

      <Step index={2} total={6} title={t('automation.rss.step.preview')}>
        {validation ? (
          <FeedPreview validation={validation} />
        ) : (
          <p className="text-body-md text-text-secondary">{t('automation.rss.urlHelp')}</p>
        )}
      </Step>

      <Step index={3} total={6} title={t('automation.rss.step.seen')}>
        <div className="flex flex-col gap-3">
          <RadioGroup
            value={draft.markExistingAsSeen ? 'seen' : 'new'}
            onValueChange={(value) =>
              setDraft((current) => ({ ...current, markExistingAsSeen: value === 'seen' }))
            }
            className="flex flex-col gap-2"
          >
            <span className="flex items-start gap-2">
              <RadioGroupItem value="seen" id="feed-seen" className="mt-1" />
              <Label htmlFor="feed-seen" className="max-w-[70ch] text-body-md">
                {t('automation.rss.seenLatest')}
              </Label>
            </span>
            <span className="flex items-start gap-2">
              <RadioGroupItem value="new" id="feed-new" className="mt-1" />
              <Label htmlFor="feed-new" className="max-w-[70ch] text-body-md">
                {t('automation.rss.seenAll')}
              </Label>
            </span>
          </RadioGroup>
          <p className="max-w-[70ch] text-body-sm text-text-tertiary">
            {t('automation.rss.seenHelp')}
          </p>
          <Notice tone="neutral" title={t('automation.rss.dedupe')} />
        </div>
      </Step>

      <Step index={4} total={6} title={t('automation.rss.step.targets')} disabled={!canChooseTargets}>
        <fieldset className="flex flex-col gap-2">
          <legend className="pb-1 text-body-md text-text-secondary">
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
                        ? current.connectionIds.filter(
                            (value) => value !== account.connectionId,
                          )
                        : [...current.connectionIds, account.connectionId],
                    }))
                  }
                />
                <Label htmlFor={id} className="flex items-center gap-2 text-body-md">
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
      </Step>

      <Step index={5} total={6} title={t('automation.rss.step.template')} disabled={!canChooseTargets}>
        <div className="flex flex-col gap-3">
          <Field
            label={t('automation.rss.template')}
            description={t('automation.rss.templateHelp')}
            required
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={4}
                value={draft.template}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, template: event.target.value }))
                }
              />
            )}
          </Field>

          {validation ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-label text-text-tertiary">
                {t('automation.rss.templateFields')}
              </span>
              {validation.availableFields.map((field) => (
                <Button
                  key={field}
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      template: `${current.template}{${field}}`,
                    }))
                  }
                >
                  {t('automation.rss.templateInsert', { field })}
                </Button>
              ))}
            </div>
          ) : null}

          <span className="flex items-center gap-2">
            <Switch
              id="feed-adapt"
              checked={draft.adaptText}
              onCheckedChange={(checked) =>
                setDraft((current) => ({ ...current, adaptText: checked === true }))
              }
            />
            <Label htmlFor="feed-adapt">{t('automation.rss.adaptWithAi')}</Label>
          </span>
          <p className="max-w-[70ch] text-body-sm text-text-tertiary">
            {t('automation.rss.adaptHelp')}
          </p>

          <span className="flex items-center gap-2">
            <Switch
              id="feed-image"
              checked={draft.useFeedImage}
              onCheckedChange={(checked) =>
                setDraft((current) => ({ ...current, useFeedImage: checked === true }))
              }
            />
            <Label htmlFor="feed-image">{t('automation.rss.imageFromFeed')}</Label>
          </span>
          <p className="max-w-[70ch] text-body-sm text-text-tertiary">
            {t('automation.rss.noImageGeneration')}
          </p>
        </div>
      </Step>

      <Step index={6} total={6} title={t('automation.rss.step.policy')} disabled={!canChooseTargets}>
        <div className="flex flex-col gap-3">
          <Field label={t('automation.rss.step.policy')} description={t('automation.rss.policyHelp')}>
            {(control) => (
              <Select
                value={draft.policy}
                onValueChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    policy: value as FeedPublishPolicy,
                    cadenceSeconds:
                      value === 'fixed_cadence' ? (current.cadenceSeconds ?? 21_600) : null,
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

          {draft.policy === 'fixed_cadence' ? (
            <Field
              label={t('automation.rss.cadenceInterval')}
              description={t('automation.rss.cadenceHelp')}
            >
              {(control) => (
                <Select
                  value={String(draft.cadenceSeconds ?? 21_600)}
                  onValueChange={(value) =>
                    setDraft((current) => ({ ...current, cadenceSeconds: Number(value) }))
                  }
                >
                  <SelectTrigger id={control.id} className="min-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CADENCE_OPTIONS.map((seconds) => (
                      <SelectItem key={seconds} value={String(seconds)}>
                        {formatDuration(locale, seconds * 1000, { maxUnits: 1 })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          ) : null}

          {draft.policy === 'immediate' ? (
            <Notice
              tone="warning"
              liveness="status"
              title={t('automation.rss.immediateWarning')}
            />
          ) : null}
        </div>
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
      <div className="flex flex-col gap-1 border-t border-border-default pt-4">
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
