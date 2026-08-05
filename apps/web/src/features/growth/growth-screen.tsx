'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeader,
  SkeletonText,
} from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { SettingsStack } from '../settings/components/section.js';
import { AsyncBoundary } from '../settings/lib/async-boundary.js';
import { brandsGateway, growthGateway, securityGateway } from '../settings/lib/gateway.js';
import { useFormatters } from '../settings/lib/formatters.js';
import { settingsKey, useWorkspaceId } from '../settings/lib/keys.js';
import { useSettingsMutation } from '../settings/lib/use-settings-mutation.js';
import { ExportPanel } from './export-panel.js';
import { IntakeForm, type IntakeValue } from './intake-form.js';
import { ProfileConfirmation } from './profile-confirmation.js';
import { FourWeekTab } from './tabs/four-week-tab.js';
import { OpportunitiesTab } from './tabs/opportunities-tab.js';
import { StrategyTab } from './tabs/strategy-tab.js';
import { ToolRadarTab } from './tabs/tool-radar-tab.js';
import { UgcTab } from './tabs/ugc-tab.js';


/**
 * The Growth Advisor.
 *
 * Three steps, in order, with no way to skip the confirmation: intake, read
 * back what we understood, then a plan whose every item can be accepted, added
 * as a calendar proposal, edited, dismissed with a reason or explained.
 * Refreshing produces a new version and never rewrites an approved one.
 */
export function GrowthScreen(): ReactNode {
  const t = useTranslations();
  const section = t('growth.title');
  const formatters = useFormatters();
  const { announce } = useAnnouncer();
  const workspaceId = useWorkspaceId();
  const PROFILE_KEY = settingsKey(workspaceId, 'growth', 'profile');
  const PLAN_KEY = settingsKey(workspaceId, 'growth', 'plan');
  const BRANDS_KEY = settingsKey(workspaceId, 'brands');
  const CONNECTIONS_KEY = settingsKey(workspaceId, 'security', 'connections');

  const profile = useQuery({ queryKey: PROFILE_KEY, queryFn: () => growthGateway.profile() });
  const plan = useQuery({ queryKey: PLAN_KEY, queryFn: () => growthGateway.plan() });
  const brands = useQuery({ queryKey: BRANDS_KEY, queryFn: () => brandsGateway.list() });
  const connections = useQuery({
    queryKey: CONNECTIONS_KEY,
    queryFn: () => securityGateway.connections(),
  });

  const currentPlan = plan.data ?? null;

  const opportunities = useQuery({
    queryKey: settingsKey(workspaceId, 'growth', 'opportunities', currentPlan?.id ?? 'none'),
    queryFn: () => growthGateway.opportunities(),
    enabled: currentPlan !== null,
  });

  const tools = useQuery({
    queryKey: settingsKey(workspaceId, 'growth', 'tools', currentPlan?.id ?? 'none'),
    queryFn: () => growthGateway.tools(null),
    enabled: currentPlan !== null,
  });

  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Record<string, string>>({});

  const saveProfile = useSettingsMutation({
    section,
    mutationFn: growthGateway.saveProfile,
    invalidate: [PROFILE_KEY],
    successMessage: t('growth.ui.intake.savedAnnouncement'),
  });

  const confirmProfile = useSettingsMutation({
    section,
    mutationFn: growthGateway.confirmProfile,
    invalidate: [PROFILE_KEY],
    successMessage: t('growth.ui.confirm.announcement'),
    onSuccess: () => void generate.run(undefined),
  });

  const generate = useSettingsMutation({
    section,
    mutationFn: growthGateway.generate,
    invalidate: [PLAN_KEY],
  });

  const createDraft = useSettingsMutation({
    section,
    mutationFn: growthGateway.createDraftFromItem,
    successMessage: t('growth.ui.fourWeek.acceptAnnouncement'),
    onSuccess: () => setBusyItemId(null),
  });

  const proposeSlot = useSettingsMutation({
    section,
    mutationFn: growthGateway.proposeSlot,
    onSuccess: () => setBusyItemId(null),
  });

  const availableLocales = useMemo(
    () =>
      Array.from(new Set((brands.data ?? []).flatMap((brand) => brand.contentLocales))).sort(),
    [brands.data],
  );

  const availableChannels = useMemo(
    () =>
      (connections.data ?? []).map((connection) => ({
        id: connection.id,
        label: connection.accountLabel,
      })),
    [connections.data],
  );

  function submitIntake(value: IntakeValue): void {
    void saveProfile.run({ ...value });
  }

  const step: 'intake' | 'confirm' | 'plan' =
    profile.data == null
      ? 'intake'
      : currentPlan === null || profile.data.confirmedAt === null
        ? 'confirm'
        : 'plan';

  const stepNumber = step === 'intake' ? 1 : step === 'confirm' ? 2 : 3;

  return (
    <>
      <PageHeader
        title={section}
        description={t('growth.ui.entryHelp')}
        actions={
          currentPlan === null ? null : (
            <Button
              variant="secondary"
              loading={generate.isSaving}
              onClick={() => void generate.run(undefined)}
            >
              {t('growth.plan.refresh')}
            </Button>
          )
        }
        toolbar={
          <p className="text-body-sm text-text-tertiary">
            {t('growth.ui.stepIndicator', {
              current: stepNumber,
              total: 3,
              name: t(
                step === 'intake'
                  ? 'growth.ui.step.intake'
                  : step === 'confirm'
                    ? 'growth.ui.step.confirm'
                    : 'growth.ui.step.plan',
              ),
            })}
          </p>
        }
      />

      <SettingsStack>
        <AsyncBoundary
          section={section}
          isPending={profile.isPending || plan.isPending}
          error={profile.error ?? plan.error}
          onRetry={() => {
            void profile.refetch();
            void plan.refetch();
          }}
          skeletonRows={6}
        >
          {step === 'intake' ? (
            <IntakeForm
              availableLocales={availableLocales}
              availableChannels={availableChannels}
              saving={saveProfile.isSaving}
              onSubmit={submitIntake}
            />
          ) : null}

          {step === 'confirm' && profile.data != null ? (
            <>
              {generate.isSaving ? (
                <LoadingState label={t('growth.plan.generating')}>
                  <div className="flex flex-col gap-2">
                    <p className="text-body-md text-text-secondary">
                      {t('growth.ui.plan.generatingBody')}
                    </p>
                    <SkeletonText lines={4} />
                  </div>
                </LoadingState>
              ) : (
                <ProfileConfirmation
                  profile={profile.data}
                  saving={confirmProfile.isSaving}
                  onConfirm={(input) => void confirmProfile.run(input)}
                />
              )}
            </>
          ) : null}

          {step === 'plan' && currentPlan !== null ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={currentPlan.state === 'approved' ? 'success' : 'neutral'}>
                  {t(
                    currentPlan.state === 'approved'
                      ? 'growth.ui.plan.stateApproved'
                      : currentPlan.state === 'superseded'
                        ? 'growth.ui.plan.stateSuperseded'
                        : 'growth.ui.plan.stateDraft',
                  )}
                </Badge>
                <span className="text-body-sm text-text-tertiary">
                  {t('growth.plan.version', {
                    version: currentPlan.revision,
                    date: formatters.date(currentPlan.generatedAt),
                  })}
                </span>
              </div>

              {currentPlan.state === 'approved' ? (
                <Notice
                  tone="neutral"
                  title={t('growth.plan.approved', {
                    date: formatters.date(currentPlan.generatedAt),
                  })}
                  description={t('growth.ui.plan.newVersionNotice', {
                    version: currentPlan.revision + 1,
                  })}
                />
              ) : null}

              <Tabs defaultValue="strategy">
                <TabsList aria-label={t('growth.ui.plan.tabsLabel')}>
                  <TabsTrigger value="strategy">{t('growth.plan.tab.strategy')}</TabsTrigger>
                  <TabsTrigger value="four-week">{t('growth.plan.tab.fourWeek')}</TabsTrigger>
                  <TabsTrigger value="ugc">{t('growth.plan.tab.ugc')}</TabsTrigger>
                  <TabsTrigger value="opportunities">
                    {t('growth.plan.tab.opportunities')}
                  </TabsTrigger>
                  <TabsTrigger value="tools">{t('growth.plan.tab.tools')}</TabsTrigger>
                </TabsList>

                <TabsContent value="strategy">
                  <StrategyTab plan={currentPlan} profile={profile.data ?? null} />
                </TabsContent>

                <TabsContent value="four-week">
                  <FourWeekTab
                    plan={currentPlan}
                    busyItemId={busyItemId}
                    onAccept={(itemId) => {
                      setBusyItemId(itemId);
                      void createDraft.run({ planId: currentPlan.id, itemId });
                    }}
                    onPropose={(itemId, date) => {
                      setBusyItemId(itemId);
                      announce(t('growth.ui.fourWeek.proposeAnnouncement', { date }));
                      void proposeSlot.run({ planId: currentPlan.id, itemId });
                    }}
                    onDismiss={() => undefined}
                  />
                </TabsContent>

                <TabsContent value="ugc">
                  <UgcTab plan={currentPlan} />
                </TabsContent>

                <TabsContent value="opportunities">
                  <AsyncBoundary
                    section={t('growth.opportunities.title')}
                    isPending={opportunities.isPending}
                    error={opportunities.error}
                    onRetry={() => void opportunities.refetch()}
                  >
                    <OpportunitiesTab
                      plan={currentPlan}
                      records={opportunities.data ?? []}
                      submitted={submitted}
                      busyItemId={busyItemId}
                      onCreatePitchDraft={(opportunityId) => {
                        setBusyItemId(opportunityId);
                        void createDraft.run({
                          planId: currentPlan.id,
                          itemId: opportunityId,
                        });
                      }}
                      onMarkSubmitted={(opportunityId) =>
                        setSubmitted((current) => ({
                          ...current,
                          [opportunityId]: currentPlan.generatedAt,
                        }))
                      }
                      onDismiss={() => undefined}
                    />
                  </AsyncBoundary>
                </TabsContent>

                <TabsContent value="tools">
                  <AsyncBoundary
                    section={t('growth.tools.title')}
                    isPending={tools.isPending}
                    error={tools.error}
                    onRetry={() => void tools.refetch()}
                  >
                    <ToolRadarTab plan={currentPlan} records={tools.data ?? []} />
                  </AsyncBoundary>
                </TabsContent>
              </Tabs>

              <ExportPanel plan={currentPlan} />

              <p className="text-body-sm text-text-tertiary">
                {t('growth.ui.plan.modelNote', {
                  model: currentPlan.model,
                  promptVersion: currentPlan.promptVersion,
                  date: formatters.date(currentPlan.generatedAt),
                })}
              </p>
            </>
          ) : null}

          {step === 'plan' && currentPlan === null ? (
            <EmptyState
              title={t('growth.ui.plan.emptyTitle')}
              description={t('growth.ui.plan.emptyBody')}
              example={t('growth.ui.plan.emptyExample')}
              action={
                <Button
                  variant="primary"
                  loading={generate.isSaving}
                  onClick={() => void generate.run(undefined)}
                >
                  {t('growth.ui.confirm.generate')}
                </Button>
              }
            />
          ) : null}
        </AsyncBoundary>
      </SettingsStack>
    </>
  );
}
