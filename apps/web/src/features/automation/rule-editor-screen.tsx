'use client';

import { useMemo, useState, type ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAnnouncer } from '@relay/design-system/hooks';
import {
  ConfirmDialog,
  LoadingState,
  Notice,
  OfflineBanner,
  SkeletonText,
} from '@relay/design-system/patterns';
import {
  Badge,
  Button,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import { useI18n, useTranslations } from '@relay/i18n/react';

import { api } from '@/lib/api';
import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { useOnlineStatus } from '@/features/analytics/use-online-status';
import { useLocalizedRouter } from '@/lib/i18n';

import {
  hiddenReasonKey,
  resolveActionAvailability,
  type ConnectionCapabilities,
} from './action-availability';
import { AccountSelector } from './components/account-selector';
import { CrossAccountPanel } from './components/cross-account-panel';
import { PreflightPanel } from './components/preflight-panel';
import { RuleRuns } from './components/rule-runs';
import { SentenceBuilder } from './components/sentence-builder';
import { StructuredEditor } from './components/structured-editor';
import { TestRunPanel } from './components/test-run-panel';
import { ThresholdControls } from './components/threshold-controls';
import { triggerSpec } from './catalog';
import {
  useAutomationRule,
  useRulePreflight,
  useRuleRuns,
  useSaveRule,
  useSetRuleEnabled,
  useTestRule,
} from './queries';
import { ruleSentence } from './rule-sentence';
import type { RuleDraft } from './types';
import { DEFAULT_MEASUREMENT, activationBlockers, saveIssues } from './validation';

/**
 * The rule editor.
 *
 * One screen, in the order a person makes the decision: build the sentence,
 * choose the accounts it may touch, read what it can do at most, test it
 * against a real event, and only then turn it on. The activation control lives
 * inside the preflight block and nowhere else.
 *
 * The state of the rule is always visible in the header, including the two that
 * matter most: test mode, which is a rule that evaluates but never acts, and
 * stopped, which is a rule somebody killed and which does not restart on its
 * own.
 */

interface ConnectionLike {
  readonly id: string;
  readonly provider: ConnectionCapabilities['provider'];
  readonly displayName?: string;
  readonly accountName?: string;
  readonly capabilities?: Readonly<Record<string, ConnectionCapabilities['capabilities'][string]>>;
}

function emptyDraft(): RuleDraft {
  return {
    id: null,
    name: '',
    state: 'draft',
    trigger: null,
    conditions: [],
    actions: [],
    delaySeconds: 0,
    end: { kind: 'manual' },
    connectionIds: [],
    crossAccount: {
      enabled: false,
      sourceConnectionId: null,
      followUpConnectionId: null,
      preauthorized: false,
    },
  };
}

export interface RuleEditorScreenProps {
  /** Null starts a new rule. */
  readonly ruleId: string | null;
}

export function RuleEditorScreen({ ruleId }: RuleEditorScreenProps): ReactElement {
  const t = useTranslations();
  const { locale } = useI18n();
  const router = useLocalizedRouter();
  const { announce } = useAnnouncer();
  const online = useOnlineStatus();

  const [local, setLocal] = useState<RuleDraft | null>(ruleId === null ? emptyDraft() : null);
  const [killOpen, setKillOpen] = useState(false);

  const loaded = useAutomationRule(ruleId ?? '', ruleId !== null);
  const runs = useRuleRuns(ruleId ?? '', ruleId !== null);
  const preflight = useRulePreflight(ruleId ?? '', ruleId !== null);
  const save = useSaveRule();
  const setEnabled = useSetRuleEnabled();
  const test = useTestRule();

  const connections = useQuery({
    queryKey: ['connections', 'list', 'automation'],
    queryFn: async () => api.connections.list({ limit: 100 }),
  });

  const accounts = useMemo<readonly ConnectionCapabilities[]>(() => {
    const data = (connections.data?.data ?? []) as readonly ConnectionLike[];
    return data.map((connection) => ({
      connectionId: connection.id,
      provider: connection.provider,
      displayName: connection.displayName ?? connection.accountName ?? connection.id,
      capabilities: connection.capabilities ?? {},
    }));
  }, [connections.data]);

  const draft = local ?? loaded.data ?? null;

  const selectedAccounts = useMemo(
    () => accounts.filter((account) => draft?.connectionIds.includes(account.connectionId)),
    [accounts, draft],
  );

  const availability = useMemo(
    () => resolveActionAvailability(selectedAccounts),
    [selectedAccounts],
  );

  const resolveLabel = useMemo(
    () =>
      (name: string, value: unknown): string => {
        if (Array.isArray(value)) {
          return value.map((entry) => resolveLabel(name, entry)).join(', ');
        }
        if (typeof value === 'string') {
          const account = accounts.find((entry) => entry.connectionId === value);
          return account ? account.displayName : value;
        }
        return String(value);
      },
    [accounts],
  );

  if (ruleId !== null && loaded.isPending) {
    return (
      <div className="px-4 py-6 md:px-6">
        <LoadingState label={t('automation.state.loadingRule')}>
          <SkeletonText lines={8} />
        </LoadingState>
      </div>
    );
  }

  if (ruleId !== null && loaded.isError) {
    return (
      <div className="px-4 py-6 md:px-6">
        <QueryErrorState
          error={loaded.error}
          title={t('automation.state.errorTitle')}
          description={t('automation.state.errorBody')}
          permission={{
            title: t('automation.state.permissionTitle'),
            description: t('automation.state.permissionBody'),
          }}
          rateLimit={{
            title: t('automation.state.rateLimitTitle'),
            cause: t('automation.state.rateLimitCause'),
            alternative: t('automation.state.rateLimitAlternative'),
          }}
          onRetry={() => {
            void loaded.refetch();
          }}
        />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="px-4 py-6 md:px-6">
        <LoadingState label={t('automation.state.loadingRule')}>
          <SkeletonText lines={8} />
        </LoadingState>
      </div>
    );
  }

  /**
   * Seed the measurement bounds the moment a threshold trigger is chosen.
   *
   * The defaults are the safe ones (run once per source post, do not act on a
   * stale metric), and seeding them here means the user edits real values
   * rather than starting from an empty form that the validator immediately
   * complains about.
   */
  const update = (next: RuleDraft): void => {
    if (
      next.trigger !== null &&
      triggerSpec(next.trigger.kind).requiresMeasurement &&
      next.trigger.measurement === undefined
    ) {
      setLocal({
        ...next,
        trigger: { ...next.trigger, measurement: DEFAULT_MEASUREMENT },
      });
      return;
    }
    setLocal(next);
  };

  const issues = saveIssues(draft);
  const blockers = activationBlockers(draft).map((issue) => t(issue.key, issue.values));

  const sentence = ruleSentence({
    draft,
    t,
    labels: { locale, resolve: resolveLabel },
  });

  const unavailableNote =
    availability.hidden.length === 0
      ? undefined
      : `${t('automation.picker.hiddenForProvider', {
          count: availability.hidden.length,
        })} ${availability.hidden
          .map((hidden) =>
            t('automation.picker.hiddenDetail', {
              action: t(hidden.spec.sentenceKey, {}),
              provider: hidden.displayName,
              reason: t(hiddenReasonKey(hidden.support)),
            }),
          )
          .join(' ')}`;

  const requiresCross = draft.actions.some((action) => action.kind === 'cross_account_follow_up');

  const thresholdTrigger =
    draft.trigger !== null && triggerSpec(draft.trigger.kind).requiresMeasurement;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      {online ? null : (
        <OfflineBanner
          title={t('automation.state.offlineTitle')}
          description={t('automation.state.offlineBody')}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-title-md text-text-primary">
            {draft.name.trim() === '' ? t('automation.rules.create') : draft.name}
          </h2>
          <Badge tone={draft.state === 'active' ? 'accent' : 'neutral'}>
            {t(`automation.rules.state.${draft.state}`)}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            loading={save.isPending}
            disabled={!online || issues.length > 0}
            onClick={() =>
              save.mutate(draft, {
                onSuccess: (saved) => {
                  announce(t('automation.editor.savedAt', { time: '' }), 'polite');
                  if (saved.id && ruleId === null) {
                    router.replace(`/automation/rules/${saved.id}`);
                  }
                },
              })
            }
          >
            {t('automation.editor.saveDraft')}
          </Button>

          {draft.state === 'active' ? (
            <Button
              variant="secondary"
              loading={setEnabled.isPending}
              onClick={() => ruleId && setEnabled.mutate({ ruleId, enabled: false })}
            >
              {t('action.pause')}
            </Button>
          ) : null}

          {ruleId && draft.state !== 'stopped' ? (
            <Button variant="destructive" onClick={() => setKillOpen(true)}>
              {t('automation.rules.killSwitch')}
            </Button>
          ) : null}
        </div>
      </div>

      {draft.state === 'stopped' ? (
        <Notice
          tone="destructive"
          liveness="status"
          title={t('automation.rules.state.stopped')}
          description={t('automation.kill.stopped', {
            actor: t('common.unknown'),
            date: t('common.unknown'),
          })}
        />
      ) : null}

      <p className="text-body-lg text-text-primary max-w-[80ch]">{sentence}</p>

      {issues.length > 0 ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t('automation.editor.error.summary', { count: issues.length })}
          description={
            <ul className="marker:text-text-tertiary flex list-disc flex-col gap-1 ps-5">
              {issues.map((issue) => (
                <li key={`${issue.key}-${issue.field ?? ''}`}>{t(issue.key, issue.values)}</li>
              ))}
            </ul>
          }
        />
      ) : null}

      <Tabs defaultValue="sentence">
        <TabsList aria-label={t('automation.editor.view.label')}>
          <TabsTrigger value="sentence">{t('automation.editor.view.sentence')}</TabsTrigger>
          <TabsTrigger value="structured">{t('automation.editor.view.structured')}</TabsTrigger>
          <TabsTrigger value="api">{t('automation.editor.view.api')}</TabsTrigger>
        </TabsList>

        <TabsContent value="sentence">
          <SentenceBuilder
            draft={draft}
            onChange={update}
            availableActions={availability.available}
            unavailableNote={unavailableNote}
            resolveLabel={resolveLabel}
            options={(name) =>
              name === 'account'
                ? accounts.map((account) => ({
                    value: account.connectionId,
                    label: account.displayName,
                  }))
                : []
            }
          />
        </TabsContent>

        <TabsContent value="structured">
          <div className="flex flex-col gap-3">
            <p className="text-body-md text-text-secondary max-w-[70ch]">
              {t('automation.editor.structuredHelp')}
            </p>
            <SentenceBuilder
              draft={draft}
              onChange={update}
              availableActions={availability.available}
              unavailableNote={unavailableNote}
              resolveLabel={resolveLabel}
              options={(name) =>
                name === 'account'
                  ? accounts.map((account) => ({
                      value: account.connectionId,
                      label: account.displayName,
                    }))
                  : []
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="api">
          <StructuredEditor draft={draft} onApply={update} />
        </TabsContent>
      </Tabs>

      {thresholdTrigger && draft.trigger ? (
        <ThresholdControls
          measurement={draft.trigger.measurement}
          onChange={(measurement) =>
            update({
              ...draft,
              trigger: draft.trigger ? { ...draft.trigger, measurement } : null,
            })
          }
        />
      ) : null}

      <AccountSelector
        accounts={accounts}
        selected={draft.connectionIds}
        onChange={(connectionIds) => update({ ...draft, connectionIds })}
      />

      <CrossAccountPanel
        settings={draft.crossAccount}
        required={requiresCross}
        accounts={accounts.map((account) => ({
          connectionId: account.connectionId,
          displayName: account.displayName,
        }))}
        onChange={(crossAccount) => update({ ...draft, crossAccount })}
      />

      <Separator />

      <PreflightPanel
        preflight={preflight.data}
        loading={ruleId !== null && preflight.isPending}
        activating={setEnabled.isPending}
        blockers={blockers}
        onTest={() => ruleId && test.mutate({ ruleId })}
        onActivate={() => {
          if (!ruleId) return;
          setEnabled.mutate(
            { ruleId, enabled: true },
            { onSuccess: () => announce(t('automation.rules.state.active'), 'polite') },
          );
        }}
      />

      <Separator />

      <TestRunPanel
        result={test.data}
        running={test.isPending}
        error={test.error}
        onRun={(payload) =>
          ruleId && test.mutate(payload === undefined ? { ruleId } : { ruleId, payload })
        }
      />

      <Separator />

      <RuleRuns
        runs={runs.data}
        loading={ruleId !== null && runs.isPending}
        error={runs.error}
        onRetry={() => {
          void runs.refetch();
        }}
      />

      <Separator />

      <Notice
        tone="neutral"
        title={t('error.capability_not_implemented.message')}
        description={t('error.capability_not_implemented.action')}
      />

      <ConfirmDialog
        open={killOpen}
        onOpenChange={setKillOpen}
        tone="destructive"
        title={t('automation.kill.title', { name: draft.name })}
        description={t('automation.kill.body')}
        confirmationPhrase={t('automation.kill.confirmPhrase')}
        confirmationLabel={t('automation.kill.confirmLabel')}
        confirmLabel={t('automation.rules.killSwitch')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={async () => {
          if (ruleId) {
            await setEnabled.mutateAsync({ ruleId, enabled: false });
          }
          setKillOpen(false);
        }}
      />
    </div>
  );
}
