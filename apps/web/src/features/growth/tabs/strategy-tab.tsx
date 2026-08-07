'use client';

import type { ReactNode } from 'react';
import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { GrowthPlan } from '@relay/contracts';

import type { BusinessProfileView } from '@/lib/api/types';

import { SettingsPanel } from '../../settings/components/section';
import { useFormatters } from '../../settings/lib/formatters';

export interface StrategyTabProps {
  plan: GrowthPlan;
  profile: BusinessProfileView | null;
}

export function StrategyTab({ plan, profile }: StrategyTabProps): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();

  const totalPerWeek = plan.content_system.weeklyCadence.reduce(
    (total, entry) => total + entry.postsPerWeek,
    0,
  );
  const capacity = profile?.weeklyCapacityHours ?? null;
  const overCapacity = capacity !== null && capacity > 0 && totalPerWeek > capacity;

  return (
    <div className="flex flex-col gap-6">
      <SettingsPanel title={t('growth.ui.strategy.snapshotTitle')}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-label text-text-tertiary">{t('growth.ui.confirm.factsTitle')}</h3>
            <ul className="text-body-md text-text-primary flex list-disc flex-col gap-1 ps-5">
              {plan.business_snapshot.facts.map((fact) => (
                <li key={fact.id}>{fact.statement}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-label text-text-tertiary">
              {t('growth.ui.confirm.assumptionsTitle')}
            </h3>
            <ul className="flex flex-col gap-1">
              {plan.business_snapshot.assumptions.map((assumption) => (
                <li
                  key={assumption.id}
                  className="text-body-md text-text-primary flex flex-wrap items-center gap-2"
                >
                  <Badge tone="warning">{t('growth.profile.assumption')}</Badge>
                  {assumption.statement}
                </li>
              ))}
            </ul>
          </div>

          {plan.business_snapshot.missingInformation.length === 0 ? null : (
            <div className="flex flex-col gap-1">
              <h3 className="text-label text-text-tertiary">
                {t('growth.ui.confirm.missingTitle')}
              </h3>
              <ul className="text-body-md text-text-secondary flex list-disc flex-col gap-1 ps-5">
                {plan.business_snapshot.missingInformation.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.objective')}>
        <p className="text-body-lg text-text-primary max-w-[68ch]">
          {plan.goals_and_metrics.objective}
        </p>
        <p className="text-body-sm text-text-tertiary">
          {plan.goals_and_metrics.windowStart} to {plan.goals_and_metrics.windowEnd}
        </p>
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.audiences')}>
        <ol className="flex flex-col">
          {plan.audiences_and_channels.audiences.map((audience) => (
            <li
              key={audience.name}
              className="border-border-subtle flex flex-col gap-0.5 border-b py-2.5 last:border-b-0"
            >
              <span className="text-body-md text-text-primary font-medium">{audience.name}</span>
              <span className="text-body-md text-text-secondary">{audience.description}</span>
            </li>
          ))}
        </ol>
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.channels')}>
        <ol className="flex flex-col">
          {plan.audiences_and_channels.channels.map((channel) => (
            <li
              key={channel.provider}
              className="border-border-subtle flex flex-col gap-1 border-b py-3 last:border-b-0"
            >
              <span className="flex flex-wrap items-center gap-2">
                <Badge tone="outline">
                  {t('growth.ui.strategy.channelPriority', { rank: channel.priority })}
                </Badge>
                <span className="text-body-md text-text-primary font-medium">
                  {channel.provider}
                </span>
              </span>
              <span className="text-body-md text-text-secondary max-w-[68ch]">
                <span className="text-text-tertiary">
                  {t('growth.strategy.channelRationale')}:{' '}
                </span>
                {channel.rationale}
              </span>
              {channel.limitations.length === 0 ? null : (
                <span className="text-body-sm text-text-secondary max-w-[68ch]">
                  <span className="text-text-tertiary">
                    {t('growth.strategy.channelLimitation')}:{' '}
                  </span>
                  {formatters.list([...channel.limitations])}
                </span>
              )}
              <span className="text-body-sm text-text-tertiary">
                {t('growth.ui.strategy.channelFormats')}:{' '}
                {formatters.list([...channel.nativeFormats])}
              </span>
            </li>
          ))}
        </ol>
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.pillars')}>
        <ol className="flex flex-col">
          {plan.content_system.pillars.map((pillar) => (
            <li
              key={pillar.name}
              className="border-border-subtle flex flex-col gap-0.5 border-b py-3 last:border-b-0"
            >
              <span className="text-body-md text-text-primary font-medium">{pillar.name}</span>
              <span className="text-body-md text-text-secondary max-w-[68ch]">
                {pillar.description}
              </span>
              <span className="text-body-sm text-text-tertiary">
                {pillar.proofAssetIds.length === 0
                  ? t('growth.ui.strategy.pillarProofNone')
                  : `${t('growth.ui.strategy.pillarProof')}: ${formatters.list([
                      ...pillar.proofAssetIds,
                    ])}`}
              </span>
            </li>
          ))}
        </ol>
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.cadence')}>
        <TableContainer>
          <Table>
            <TableCaption className="sr-only">
              {t('growth.ui.strategy.cadenceCaption')}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{t('growth.ui.strategy.cadenceColumn.channel')}</TableHead>
                <TableHead scope="col" numeric>
                  {t('growth.ui.strategy.cadenceColumn.perWeek')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.content_system.weeklyCadence.map((entry) => (
                <TableRow key={entry.provider}>
                  <TableRowHeader>{entry.provider}</TableRowHeader>
                  <TableCell numeric>{formatters.number(entry.postsPerWeek)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowHeader>{t('growth.ui.strategy.cadenceTotal')}</TableRowHeader>
                <TableCell numeric>{formatters.number(totalPerWeek)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {overCapacity && capacity !== null ? (
          <Notice
            tone="warning"
            title={t('growth.ui.strategy.capacityWarning', {
              planned: totalPerWeek,
              capacity,
            })}
          />
        ) : null}

        {plan.content_system.series.length === 0 ? null : (
          <p className="text-body-md text-text-secondary">
            <span className="text-text-tertiary">{t('growth.strategy.series')}: </span>
            {formatters.list(
              plan.content_system.series.map((entry) => `${entry.name} (${entry.cadence})`),
            )}
          </p>
        )}
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.ctaLibrary')}>
        <ul className="text-body-md text-text-primary flex list-disc flex-col gap-1 ps-5">
          {plan.content_system.ctaLibrary.map((cta) => (
            <li key={cta}>{cta}</li>
          ))}
        </ul>
        {plan.content_system.localeAdaptations.length === 0 ? null : (
          <div className="flex flex-col gap-1 pt-2">
            <h3 className="text-label text-text-tertiary">
              {t('growth.ui.strategy.localeAdaptations')}
            </h3>
            <ul className="text-body-md text-text-secondary flex flex-col gap-1">
              {plan.content_system.localeAdaptations.map((entry) => (
                <li key={entry.locale}>
                  <span className="text-text-primary font-medium">{entry.locale}</span>{' '}
                  {entry.notes}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.measurement')}>
        <p className="text-body-md text-text-secondary max-w-[68ch]">
          {t('growth.ui.strategy.measurementBody')}
        </p>
        <ul className="text-body-md text-text-primary flex list-disc flex-col gap-1 ps-5">
          {plan.goals_and_metrics.supportingMetrics.map((metric) => (
            <li key={metric}>{metric}</li>
          ))}
        </ul>
      </SettingsPanel>

      <SettingsPanel title={t('growth.strategy.risks')}>
        <ul className="text-body-md text-text-secondary flex list-disc flex-col gap-1 ps-5">
          {plan.risks_and_unknowns.unsupportedClaims.map((claim) => (
            <li key={claim}>{claim}</li>
          ))}
          {plan.risks_and_unknowns.missingPermissions.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </SettingsPanel>
    </div>
  );
}
